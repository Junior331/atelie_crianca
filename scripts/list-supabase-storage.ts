import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
config({ path: path.join(__dirname, '..', '.env.local') });

// Usar SERVICE_ROLE_KEY para acesso administrativo (bypass do rate limit)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // Chave admin
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function listStorage() {
  console.log('🗂️  Listando arquivos no Supabase Storage...\n');

  try {
    // Listar buckets
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();

    if (bucketsError) {
      console.error('❌ Erro ao listar buckets:', bucketsError);
      return;
    }

    console.log(`📦 Buckets encontrados: ${buckets?.length || 0}\n`);

    for (const bucket of buckets || []) {
      console.log(`\n📁 Bucket: ${bucket.name}`);
      console.log(`   ID: ${bucket.id}`);
      console.log(`   Público: ${bucket.public ? 'Sim' : 'Não'}`);

      // Listar arquivos no bucket
      const { data: files, error: filesError } = await supabase.storage
        .from(bucket.name)
        .list('', {
          limit: 100,
          sortBy: { column: 'name', order: 'asc' },
        });

      if (filesError) {
        console.error(`   ❌ Erro ao listar arquivos:`, filesError);
        continue;
      }

      console.log(`   📊 Total de arquivos/pastas: ${files?.length || 0}`);

      if (files && files.length > 0) {
        console.log('\n   Primeiros arquivos/pastas:');
        files.slice(0, 10).forEach((file, i) => {
          const type = file.id ? '📄' : '📂';
          console.log(`   ${i + 1}. ${type} ${file.name} ${file.id ? `(${(file.metadata?.size || 0) / 1024}KB)` : ''}`);
        });

        // Se houver pastas, listar conteúdo da primeira
        const folder = files.find(f => !f.id);
        if (folder) {
          console.log(`\n   📂 Conteúdo da pasta "${folder.name}":`);
          const { data: folderFiles } = await supabase.storage
            .from(bucket.name)
            .list(folder.name, { limit: 10 });

          if (folderFiles) {
            folderFiles.forEach((file, i) => {
              console.log(`      ${i + 1}. 📄 ${file.name} (${(file.metadata?.size || 0) / 1024}KB)`);
            });
          }
        }
      }

      console.log('');
    }
  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

listStorage().then(() => process.exit(0)).catch((err) => {
  console.error('Erro:', err);
  process.exit(1);
});
