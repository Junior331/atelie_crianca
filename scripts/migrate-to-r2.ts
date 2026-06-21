/**
 * Script de migração de imagens do Supabase Storage para Cloudflare R2
 *
 * Este script:
 * 1. Lista todas as imagens no Supabase Storage
 * 2. Faz download e upload para R2
 * 3. Atualiza as URLs no banco de dados
 *
 * Uso: npx tsx scripts/migrate-to-r2.ts
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Para ESM compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carregar variáveis de ambiente
config({ path: path.join(__dirname, '..', '.env.local') });

// Criar cliente Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Criar cliente R2
const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME!;
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL!;

// Helper functions
function getPublicUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${R2_PUBLIC_URL}/${cleanPath}`;
}

async function copyFromSupabaseToR2(supabaseUrl: string, r2Path: string): Promise<string> {
  const response = await fetch(supabaseUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch from Supabase: ${response.statusText}`);
  }

  const buffer = await response.arrayBuffer();
  const contentType = response.headers.get('content-type') || 'application/octet-stream';

  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: r2Path,
    Body: Buffer.from(buffer),
    ContentType: contentType,
  });

  await r2Client.send(command);
  return getPublicUrl(r2Path);
}

interface ImageRecord {
  id: string;
  table_name: string;
  column_name: string;
  old_url: string;
  new_url?: string;
}

async function getAllImageUrls(): Promise<ImageRecord[]> {
  const images: ImageRecord[] = [];

  console.log('📊 Buscando imagens no banco de dados...\n');

  // 1. page_images
  const { data: pageImages } = await supabase
    .from('page_images')
    .select('id, image_url');

  if (pageImages) {
    pageImages.forEach(img => {
      if (img.image_url && img.image_url.includes('supabase.co')) {
        images.push({
          id: img.id,
          table_name: 'page_images',
          column_name: 'image_url',
          old_url: img.image_url,
        });
      }
    });
  }

  // 2. product_images
  const { data: productImages } = await supabase
    .from('product_images')
    .select('id, image_url');

  if (productImages) {
    productImages.forEach(img => {
      if (img.image_url && img.image_url.includes('supabase.co')) {
        images.push({
          id: img.id,
          table_name: 'product_images',
          column_name: 'image_url',
          old_url: img.image_url,
        });
      }
    });
  }

  // 3. workshops (se tiver)
  const { data: workshops } = await supabase
    .from('workshops')
    .select('id, image');

  if (workshops) {
    workshops.forEach(workshop => {
      if (workshop.image && workshop.image.includes('supabase.co')) {
        images.push({
          id: workshop.id,
          table_name: 'workshops',
          column_name: 'image',
          old_url: workshop.image,
        });
      }
    });
  }

  // 4. workshop_images
  const { data: workshopImages } = await supabase
    .from('workshop_images')
    .select('id, image_url');

  if (workshopImages) {
    workshopImages.forEach(img => {
      if (img.image_url && img.image_url.includes('supabase.co')) {
        images.push({
          id: img.id,
          table_name: 'workshop_images',
          column_name: 'image_url',
          old_url: img.image_url,
        });
      }
    });
  }

  console.log(`✅ Encontradas ${images.length} imagens para migrar\n`);
  return images;
}

function extractPathFromSupabaseUrl(url: string): string {
  // Extrai o path da URL do Supabase
  // Formato: https://xxx.supabase.co/storage/v1/object/public/BUCKET/PATH
  const match = url.match(/\/storage\/v1\/object\/public\/([^/]+)\/(.+)$/);
  if (!match) {
    throw new Error(`URL inválida: ${url}`);
  }

  const bucket = match[1];
  const path = match[2];

  // Mantém a estrutura bucket/path no R2
  return `${bucket}/${path}`;
}

async function migrateImages(images: ImageRecord[], dryRun = false) {
  console.log(`${dryRun ? '🔍 DRY RUN - ' : '🚀 '}Iniciando migração de ${images.length} imagens...\n`);

  let success = 0;
  let failed = 0;

  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    const progress = `[${i + 1}/${images.length}]`;

    try {
      console.log(`${progress} Migrando: ${image.old_url.split('/').pop()}`);

      // Extrai o path da URL do Supabase
      const r2Path = extractPathFromSupabaseUrl(image.old_url);

      if (dryRun) {
        console.log(`  → Seria copiado para R2: ${r2Path}`);
        image.new_url = getPublicUrl(r2Path);
        console.log(`  → Nova URL: ${image.new_url}\n`);
        success++;
        continue;
      }

      // Copia arquivo para R2
      const newUrl = await copyFromSupabaseToR2(image.old_url, r2Path);
      image.new_url = newUrl;

      console.log(`  ✅ Copiado para R2: ${newUrl}`);

      // Atualiza URL no banco de dados
      const { error } = await supabase
        .from(image.table_name)
        .update({ [image.column_name]: newUrl })
        .eq('id', image.id);

      if (error) {
        throw error;
      }

      console.log(`  ✅ URL atualizada no banco de dados\n`);
      success++;

      // Delay para não sobrecarregar
      await new Promise(resolve => setTimeout(resolve, 100));

    } catch (error) {
      console.error(`  ❌ Erro ao migrar imagem:`, error);
      console.error(`     Tabela: ${image.table_name}, ID: ${image.id}\n`);
      failed++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`📊 Resumo da Migração:`);
  console.log(`   ✅ Sucesso: ${success}`);
  console.log(`   ❌ Falhas: ${failed}`);
  console.log(`   📦 Total: ${images.length}`);
  console.log('='.repeat(50) + '\n');

  return { success, failed, total: images.length };
}

async function verifyR2Configuration() {
  console.log('🔧 Verificando configuração do R2...\n');

  const requiredVars = [
    'R2_ENDPOINT',
    'R2_ACCESS_KEY_ID',
    'R2_SECRET_ACCESS_KEY',
    'R2_BUCKET_NAME',
    'R2_PUBLIC_URL',
  ];

  const missing = requiredVars.filter(v => !process.env[v]);

  if (missing.length > 0) {
    console.error('❌ Variáveis de ambiente faltando:');
    missing.forEach(v => console.error(`   - ${v}`));
    console.error('\nAdicione essas variáveis no arquivo .env.local\n');
    return false;
  }

  console.log('✅ Todas as variáveis de ambiente estão configuradas\n');
  return true;
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run') || args.includes('-d');

  console.log('\n' + '='.repeat(50));
  console.log('🔄 MIGRAÇÃO SUPABASE STORAGE → CLOUDFLARE R2');
  console.log('='.repeat(50) + '\n');

  // Verificar configuração
  const isConfigured = await verifyR2Configuration();
  if (!isConfigured) {
    process.exit(1);
  }

  // Buscar todas as imagens
  const images = await getAllImageUrls();

  if (images.length === 0) {
    console.log('ℹ️  Nenhuma imagem encontrada para migrar\n');
    return;
  }

  // Confirmar migração
  if (!dryRun) {
    console.log('⚠️  ATENÇÃO: Esta operação irá:');
    console.log('   1. Copiar todas as imagens para o R2');
    console.log('   2. Atualizar URLs no banco de dados');
    console.log('\nPara testar sem fazer alterações, use: --dry-run\n');

    // Em produção, você pode adicionar confirmação interativa aqui
    console.log('▶️  Iniciando migração em 3 segundos...\n');
    await new Promise(resolve => setTimeout(resolve, 3000));
  }

  // Executar migração
  await migrateImages(images, dryRun);

  if (dryRun) {
    console.log('ℹ️  Dry run concluído. Nenhuma alteração foi feita.');
    console.log('   Para executar a migração real, rode sem --dry-run\n');
  } else {
    console.log('✅ Migração concluída!');
    console.log('\n📝 Próximos passos:');
    console.log('   1. Adicione NEXT_PUBLIC_USE_R2_STORAGE=true no .env.local');
    console.log('   2. Reinicie o servidor de desenvolvimento');
    console.log('   3. Teste se as imagens estão carregando corretamente');
    console.log('   4. Após confirmar, você pode deletar as imagens do Supabase Storage\n');
  }
}

main().catch(console.error);
