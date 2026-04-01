/**
 * Migração Supabase: copia dados (tabelas + storage) do projeto ANTIGO para o NOVO.
 *
 * Variáveis de ambiente:
 *   OLD_SUPABASE_URL, OLD_SUPABASE_SERVICE_ROLE_KEY  = projeto de origem
 *   NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY = projeto de destino
 *
 * Uso: npx tsx scripts/migrate-supabase-project.ts
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";

const OLD_URL = process.env.OLD_SUPABASE_URL;
const OLD_SERVICE_KEY = process.env.OLD_SUPABASE_SERVICE_ROLE_KEY;
const NEW_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const NEW_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!OLD_URL || !OLD_SERVICE_KEY) {
  console.error(
    "Defina OLD_SUPABASE_URL e OLD_SUPABASE_SERVICE_ROLE_KEY (projeto de origem)."
  );
  process.exit(1);
}
if (!NEW_URL || !NEW_SERVICE_KEY) {
  console.error(
    "Defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY (projeto de destino)."
  );
  process.exit(1);
}

const oldSupabase = createClient(OLD_URL, OLD_SERVICE_KEY, {
  auth: { persistSession: false },
});
const newSupabase = createClient(NEW_URL, NEW_SERVICE_KEY, {
  auth: { persistSession: false },
});

const TABLE_ORDER = [
  "categories",
  "feature_flags",
  "workshop_categories",
  "product_categories",
  "workshops",
  "workshop_images",
  "workshop_category_relations",
  "products",
  "product_images",
  "images",
  "page_images",
];

async function copyTable(
  from: SupabaseClient,
  to: SupabaseClient,
  table: string
) {
  const { data, error } = await from.from(table).select("*");
  if (error) {
    console.warn(`  [${table}] origem: ${error.message} (tabela pode não existir)`);
    return 0;
  }
  if (!data || data.length === 0) {
    console.log(`  [${table}] 0 linhas`);
    return 0;
  }
  const { error: insertError } = await to.from(table).upsert(data, {
    onConflict: "id",
    ignoreDuplicates: false,
  });
  if (insertError) {
    console.error(`  [${table}] erro ao inserir:`, insertError.message);
    throw insertError;
  }
  console.log(`  [${table}] ${data.length} linhas`);
  return data.length;
}

async function copyAllTables() {
  console.log("\n--- Copiando tabelas ---\n");
  let total = 0;
  for (const table of TABLE_ORDER) {
    total += await copyTable(oldSupabase, newSupabase, table);
  }
  console.log(`\nTotal: ${total} linhas.\n`);
}

type FileItem = { name: string; id: string | null };

async function listAllPaths(
  client: SupabaseClient,
  bucket: string,
  prefix: string
): Promise<string[]> {
  const paths: string[] = [];
  const limit = 1000;
  let offset = 0;
  let hasMore = true;
  while (hasMore) {
    const { data, error } = await client.storage
      .from(bucket)
      .list(prefix || "", { limit, offset });
    if (error) {
      console.warn(`  list ${prefix}: ${error.message}`);
      break;
    }
    if (!data || data.length === 0) break;
    for (const item of data as FileItem[]) {
      const name = item.name;
      if (!name) continue;
      const fullPath = prefix ? `${prefix}/${name}` : name;
      if (item.id == null) {
        const nested = await listAllPaths(client, bucket, fullPath);
        paths.push(...nested);
      } else {
        paths.push(fullPath);
      }
    }
    offset += data.length;
    hasMore = data.length === limit;
  }
  return paths;
}

async function copyStorage() {
  const bucket = "images";
  console.log("\n--- Copiando Storage (bucket: images) ---\n");

  const paths = await listAllPaths(oldSupabase, bucket, "");
  console.log(`  Arquivos/pastas encontrados: ${paths.length}`);

  let done = 0;
  let failed = 0;
  for (const path of paths) {
    const { data: fileData } = await oldSupabase.storage
      .from(bucket)
      .download(path);
    if (!fileData) {
      failed++;
      continue;
    }
    const { error } = await newSupabase.storage
      .from(bucket)
      .upload(path, fileData, { upsert: true });
    if (error) {
      console.warn(`  upload ${path}: ${error.message}`);
      failed++;
    } else {
      done++;
    }
    if ((done + failed) % 50 === 0) {
      console.log(`  progresso: ${done + failed}/${paths.length}`);
    }
  }
  console.log(`  Concluído: ${done} ok, ${failed} falhas.\n`);
}

async function main() {
  console.log("Migração Supabase");
  console.log("  Origem:", OLD_URL);
  console.log("  Destino:", NEW_URL);

  await copyAllTables();
  await copyStorage();

  console.log("Migração concluída.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
