import { config } from 'dotenv';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import * as path from 'path';
import { fileURLToPath } from 'url';
import * as fs from 'fs/promises';
import { createReadStream } from 'fs';
import { stat } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
config({ path: path.join(__dirname, '..', '.env.local') });

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
const LOCAL_IMAGES_PATH = path.join(__dirname, '..', 'public', 'images');

function getContentType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  const types: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.heic': 'image/heic',
  };
  return types[ext] || 'application/octet-stream';
}

async function uploadFile(localPath: string, r2Key: string): Promise<string> {
  const fileBuffer = await fs.readFile(localPath);
  const contentType = getContentType(localPath);

  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: r2Key,
    Body: fileBuffer,
    ContentType: contentType,
  });

  await r2Client.send(command);
  return `${R2_PUBLIC_URL}/${r2Key}`;
}

async function listLocalImages(): Promise<string[]> {
  try {
    const files = await fs.readdir(LOCAL_IMAGES_PATH);
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.heic'].includes(ext);
    });
    return imageFiles;
  } catch (error) {
    console.error('Erro ao listar imagens locais:', error);
    return [];
  }
}

async function main() {
  console.log('\n' + '='.repeat(50));
  console.log('📤 UPLOAD DE IMAGENS LOCAIS PARA CLOUDFLARE R2');
  console.log('='.repeat(50) + '\n');

  console.log(`📁 Diretório local: ${LOCAL_IMAGES_PATH}`);
  console.log(`📦 Bucket R2: ${R2_BUCKET_NAME}`);
  console.log(`🌐 URL pública: ${R2_PUBLIC_URL}\n`);

  // Listar imagens locais
  const images = await listLocalImages();

  if (images.length === 0) {
    console.log('❌ Nenhuma imagem encontrada');
    return;
  }

  console.log(`✅ Encontradas ${images.length} imagens\n`);

  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run') || args.includes('-d');

  if (dryRun) {
    console.log('🔍 DRY RUN - Nenhum upload será feito\n');
    console.log('Imagens que seriam enviadas:');
    images.forEach((img, i) => {
      console.log(`  ${i + 1}. ${img} → images/${img}`);
    });
    console.log(`\n✅ Total: ${images.length} imagens`);
    console.log('\nPara executar o upload real, rode sem --dry-run');
    return;
  }

  console.log('📤 Iniciando upload...\n');

  let success = 0;
  let failed = 0;

  for (let i = 0; i < images.length; i++) {
    const filename = images[i];
    const localPath = path.join(LOCAL_IMAGES_PATH, filename);
    const r2Key = `images/${filename}`;

    try {
      const stats = await stat(localPath);
      const sizeMB = (stats.size / 1024 / 1024).toFixed(2);

      process.stdout.write(`[${i + 1}/${images.length}] ${filename} (${sizeMB}MB)...`);

      const url = await uploadFile(localPath, r2Key);

      console.log(` ✅`);
      success++;

      // Delay para não sobrecarregar
      if (i < images.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }

    } catch (error) {
      console.log(` ❌`);
      console.error(`     Erro: ${error}`);
      failed++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 Resumo:');
  console.log(`   ✅ Sucesso: ${success}`);
  console.log(`   ❌ Falhas: ${failed}`);
  console.log(`   📦 Total: ${images.length}`);
  console.log('='.repeat(50) + '\n');

  if (success > 0) {
    console.log('✅ Upload concluído!');
    console.log('\n📝 Próximos passos:');
    console.log('   1. Verifique as imagens no Cloudflare R2 Dashboard');
    console.log('   2. Atualize as URLs no banco de dados (se necessário)');
    console.log('   3. Ative o R2 no .env.local (NEXT_PUBLIC_USE_R2_STORAGE=true)');
    console.log('   4. Reinicie o servidor e teste o site\n');
  }
}

main().catch(console.error);
