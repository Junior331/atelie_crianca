/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Script para verificar URLs de imagens no Supabase
 * Execute: npx tsx scripts/check-image-urls.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Erro: Variáveis de ambiente não encontradas!');
  console.error('Certifique-se de que NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY estão definidas em .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkImageUrls() {
  console.log('🔍 Verificando URLs de imagens no Supabase...\n');
  console.log(`📍 Supabase URL: ${supabaseUrl}\n`);

  const pages = ['wedding', 'playroom', 'products', 'souvenirstable', 'corporate', 'furniture', 'ateliegroup'];

  for (const page of pages) {
    console.log(`\n📄 Página: ${page}`);
    console.log('─'.repeat(80));

    try {
      const { data, error } = await supabase
        .from('page_images')
        .select('*')
        .eq('page', page)
        .order('position');

      if (error) {
        console.error(`❌ Erro ao buscar imagens:`, error.message);
        continue;
      }

      if (!data || data.length === 0) {
        console.log(`⚠️  Nenhuma imagem encontrada para esta página`);
        continue;
      }

      console.log(`✅ ${data.length} imagens encontradas\n`);

      for (const img of data) {
        const url = img.image_url;
        const isValid = /^https:\/\/[a-z]+\.supabase\.co\/storage\/v1\/object\/public\//i.test(url);

        console.log(`${isValid ? '✅' : '❌'} ${img.key}`);
        console.log(`   URL: ${url}`);

        if (!isValid) {
          console.log(`   ⚠️  URL inválida! Formato esperado:`);
          console.log(`   https://[PROJECT].supabase.co/storage/v1/object/public/images/[PATH]`);
        }

        // Testar se a URL é acessível
        try {
          const response = await fetch(url, { method: 'HEAD' });
          if (response.ok) {
            console.log(`   🌐 URL acessível (${response.status})`);
          } else {
            console.log(`   ⚠️  URL não acessível (${response.status})`);
          }
        } catch (fetchError: any) {
          console.log(`   ❌ Erro ao acessar URL: ${fetchError.message}`);
        }

        console.log('');
      }
    } catch (error: any) {
      console.error(`❌ Erro ao processar página:`, error.message);
    }
  }

  console.log('\n' + '═'.repeat(80));
  console.log('🏁 Verificação concluída!');
}

checkImageUrls().catch(console.error);
