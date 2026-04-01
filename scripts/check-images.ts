import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
config({ path: path.join(__dirname, '..', '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function checkImages() {
  console.log('🔍 Verificando imagens no banco de dados...\n');

  const { data: pageImages } = await supabase
    .from('page_images')
    .select('id, image_url')
    .limit(5);

  console.log(`📄 page_images: ${pageImages?.length || 0} registros`);
  if (pageImages && pageImages.length > 0) {
    console.log('   Exemplos:');
    pageImages.forEach((img, i) => {
      console.log(`   ${i + 1}. ${img.image_url?.substring(0, 80)}...`);
    });
  }
  console.log('');

  const { data: productImages } = await supabase
    .from('product_images')
    .select('id, image_url')
    .limit(5);

  console.log(`🛍️  product_images: ${productImages?.length || 0} registros`);
  if (productImages && productImages.length > 0) {
    console.log('   Exemplos:');
    productImages.forEach((img, i) => {
      console.log(`   ${i + 1}. ${img.image_url?.substring(0, 80)}...`);
    });
  }
  console.log('');

  const { data: workshops } = await supabase
    .from('workshops')
    .select('id, image')
    .limit(5);

  console.log(`🎨 workshops: ${workshops?.length || 0} registros`);
  if (workshops && workshops.length > 0) {
    console.log('   Exemplos:');
    workshops.forEach((w, i) => {
      console.log(`   ${i + 1}. ${w.image?.substring(0, 80)}...`);
    });
  }
}

checkImages().then(() => process.exit(0)).catch((err) => {
  console.error('Erro:', err);
  process.exit(1);
});
