import { config } from 'dotenv';
import { S3Client, ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
config({ path: path.join(__dirname, '..', '.env.local') });

const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = process.env.R2_BUCKET_NAME!;
const PUBLIC_URL = process.env.R2_PUBLIC_URL!;

async function checkBucketContents() {
  console.log('\n📦 Verificando conteúdo do bucket R2...\n');

  try {
    // Primeiro verificar com prefixo images/
    console.log('🔍 Buscando objetos com prefixo "images/"...');
    const command = new ListObjectsV2Command({
      Bucket: BUCKET,
      Prefix: 'images/',
      MaxKeys: 5,
    });

    const response = await r2Client.send(command);

    if (!response.Contents || response.Contents.length === 0) {
      console.log('❌ Nenhum objeto encontrado com prefixo "images/"\n');

      // Tentar listar raiz
      console.log('🔍 Buscando objetos na raiz do bucket...');
      const rootCommand = new ListObjectsV2Command({
        Bucket: BUCKET,
        MaxKeys: 5,
      });

      const rootResponse = await r2Client.send(rootCommand);

      if (rootResponse.Contents && rootResponse.Contents.length > 0) {
        console.log(`\n✅ Encontrados ${rootResponse.Contents.length} objetos na raiz:\n`);
        rootResponse.Contents.forEach(obj => {
          const url = `${PUBLIC_URL}/${obj.Key}`;
          console.log(`   📄 ${obj.Key}`);
          console.log(`      URL: ${url}\n`);
        });
      } else {
        console.log('❌ Bucket vazio');
      }

      return;
    }

    console.log(`✅ Encontrados ${response.Contents.length} objetos em "images/"\n`);

    response.Contents.forEach(obj => {
      const url = `${PUBLIC_URL}/${obj.Key}`;
      console.log(`📄 ${obj.Key}`);
      console.log(`   URL: ${url}\n`);
    });

  } catch (error) {
    console.error('❌ Erro ao verificar bucket:', error);
  }
}

checkBucketContents().catch(console.error);
