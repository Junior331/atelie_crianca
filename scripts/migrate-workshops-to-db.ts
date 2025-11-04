/**
 * Script para migrar oficinas hardcoded para o banco Supabase
 *
 * IMPORTANTE: Execute este script DEPOIS de aplicar a migration SQL
 *
 * Como executar:
 * 1. No terminal: npx tsx scripts/migrate-workshops-to-db.ts
 * 2. Ou adicione no package.json: "migrate:workshops": "tsx scripts/migrate-workshops-to-db.ts"
 */

import { createClient } from "@supabase/supabase-js";

// Configure suas credenciais do Supabase aqui
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Dados das oficinas existentes
const workshopsData = [
  { title: "Aquário", description: "Montagem e decoração de aquários temáticos" },
  { title: "Oficina de Arco Disney", description: "Montagem e customização de arcos temáticos" },
  { title: "Oficina de Asa de Borboleta", description: "Customização de asas de borboletas" },
  { title: "Oficina de Beleza", description: "Maquiagem e penteados" },
  { title: "Oficina de Biju", description: "Criação de biju e chaveiros" },
  { title: "Oficina de Biscoitos Decorados", description: "Decoração de biscoitos" },
  { title: "Biscuit", description: "Modelagem e decoração em biscuit" },
  { title: "Oficina de Bodys de Bebê", description: "Personalização de bodys" },
  { title: "Oficina de Bolhas de Sabão", description: "Brincadeira e experiência lúdica com bolhas" },
  { title: "Oficina de Bolsas de Palha", description: "Customização de bolsas" },
  { title: "Oficina de Boné", description: "Personalização criativa de bonés" },
  { title: "Brincadeiras Raiz", description: "Resgate de jogos e brincadeiras tradicionais" },
  { title: "Brinquedoteca", description: "Espaço lúdico com jogos e brincadeiras" },
  { title: "Oficina de Bucket", description: "Pintura e customização de chapéus bucket" },
  { title: "Oficina de Caderninhos", description: "Personalização de caderninhos" },
  { title: "Caixa de Fada", description: "Pintura e decoração de caixas artesanais" },
  { title: "Oficina de Camisas", description: "Customização de camisas" },
  { title: "Capa Harry Potter", description: "Customização de capas do Harry Potter" },
  { title: "Oficina de Capa de Super-Herói", description: "Customização de capas" },
  { title: "Carmed", description: "Atividades especiais Carmed" },
  { title: "Oficina de Cartinhas", description: "Produção e decoração de cartinhas criativas" },
  { title: "Oficina de Cartola", description: "Customização de cartolas" },
  { title: "Chapéu de Palha", description: "Customização de chapéus de palha" },
  { title: "Cientista", description: "Experiências e atividades de cientista" },
  { title: "Oficina de Colagem e Criatividade", description: "Customização de totem" },
  { title: "Oficina de Cupcake", description: "Decoração de cupcakes" },
  { title: "Oficina de Esmaltação", description: "Pintura de unhas" },
  { title: "Espaço Soninho", description: "Espaço relaxante e atividades calmas" },
  { title: "Oficina de Estojo", description: "Customização de estojos" },
  { title: "Oficina de Fantoches", description: "Montagem de personagens em fantoche" },
  { title: "Oficina de Jardinagem", description: "Plantio e cuidado com mudinhas" },
  { title: "Maquiagem Artística", description: "Pintura livre no rosto e maquiagem artística" },
  { title: "Oficina de Máscara", description: "Decoração de máscaras temáticas" },
  { title: "Pintura em Bobbie Goods", description: "Pintura em produtos Bobbie Goods" },
  { title: "Oficina de Pintura na Tela", description: "Arte em mini telas de pintura" },
  { title: "Oficina de Pintura no Cavalete", description: "Pintura em cavalete" },
  { title: "Oficina de Reciclagem", description: "Arte e materiais a partir de reciclados" },
  { title: "Recreações", description: "Dinâmicas e brincadeiras" },
  { title: "Oficina de Slime", description: "Confecção de slimes coloridos" },
  { title: "Slime Neon", description: "Confecção de slimes neon" },
  { title: "Spa", description: "Cuidados e brincadeiras de spa infantil" },
  { title: "Totem MDF", description: "Customização de totens decorativos" },
  { title: "Oficina de Varinha de Condão", description: "Customização de varinhas mágicas" },
  { title: "Oficina de Varinha Harry Potter", description: "Personalização de varinhas do Harry Potter" },
  { title: "Oficina de Viseira", description: "Pintura e customização de viseiras" },
];

const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
};

async function migrateWorkshops() {
  console.log("🚀 Iniciando migração de oficinas...\n");

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < workshopsData.length; i++) {
    const workshop = workshopsData[i];
    const slug = generateSlug(workshop.title);

    try {
      console.log(`[${i + 1}/${workshopsData.length}] Inserindo: ${workshop.title}`);

      const { data, error } = await supabase
        .from("workshops")
        .insert({
          title: workshop.title,
          slug: slug,
          description: workshop.description,
          is_active: true,
          order_position: i,
        })
        .select()
        .single();

      if (error) throw error;

      console.log(`✅ Sucesso! ID: ${data.id}, Slug: /${slug}\n`);
      successCount++;
    } catch (error: any) {
      console.error(`❌ Erro ao inserir "${workshop.title}":`, error.message);
      if (error.code === "23505") {
        console.error("   → Oficina com esse slug já existe\n");
      }
      errorCount++;
    }
  }

  console.log("\n📊 Resumo da Migração:");
  console.log(`✅ Sucesso: ${successCount}`);
  console.log(`❌ Erros: ${errorCount}`);
  console.log(`📝 Total: ${workshopsData.length}`);

  console.log("\n⚠️  PRÓXIMOS PASSOS:");
  console.log("1. Acesse /admin/workshops");
  console.log("2. Para cada oficina, faça upload das imagens");
  console.log("3. As imagens devem ser enviadas através da interface admin");
  console.log("4. Depois, substitua o componente RentalCollection para usar o banco\n");
}

// Executar migração
migrateWorkshops()
  .then(() => {
    console.log("✨ Migração concluída!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Erro fatal na migração:", error);
    process.exit(1);
  });
