# Migração do projeto Supabase (conta antiga → conta nova)

Este guia descreve como migrar **todos os dados** do seu projeto Supabase antigo para o novo (nova org/projeto) de forma **rápida e segura**, sem perder nada.

---

## O que o seu projeto usa no Supabase

### Tabelas (PostgreSQL)
| Tabela | Descrição |
|--------|-----------|
| `categories` | Categorias de galeria (Móveis, Ateliê, etc.) |
| `images` | Imagens por categoria |
| `page_images` | Imagens por página (home, about, wedding, playroom, etc.) |
| `feature_flags` | Flags de funcionalidades (rotas ativas/inativas) |
| `workshops` | Oficinas |
| `workshop_images` | Imagens das oficinas |
| `workshop_categories` | Categorias de oficinas |
| `workshop_category_relations` | Relação N:N oficina ↔ categoria |
| `product_categories` | Categorias de produtos |
| `products` | Produtos |
| `product_images` | Imagens dos produtos |

### Storage
- **Bucket:** `images` (público)
- **Pastas usadas:** `products/`, `workshops/`, `wedding/`, `playroom/`, `home/`, `corporate/`, `about/`, `ateliegroup/`, `furniture/`, etc.

### Variáveis de ambiente (app)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (API e scripts admin)

---

## Visão geral da migração

1. **Novo projeto:** schema + RLS + storage bucket já criados (via SQL e Dashboard).
2. **Dados:** copiar todas as tabelas do projeto antigo para o novo (ordem respeitando FKs).
3. **Storage:** copiar todos os arquivos do bucket `images` do projeto antigo para o novo.
4. **App:** apontar `.env` / `.env.local` para o novo projeto.

---

## Passo 1: Preparar o novo projeto (schema)

No **novo** projeto no Supabase Dashboard:

1. Acesse **SQL Editor** e execute os SQLs **nesta ordem** (cada um em uma query):

   - Conteúdo de `supabase-schema.sql` (categorias, images, page_images, storage bucket, RLS).
   - Conteúdo de `supabase-feature-flags.sql`.
   - Conteúdo de `supabase/migrations/20250104_workshops_schema.sql`.
   - Conteúdo de `supabase/migrations/20250106_workshop_categories.sql`.
   - Conteúdo de `supabase/migrations/20250106_products_and_categories.sql`.
   - Conteúdo de `supabase/migrations/20250106_add_product_image_fields.sql`.
   - Conteúdo de `supabase/migrations/20250117_workshop_categories_many_to_many.sql`.

2. **Storage:** Se o bucket `images` não foi criado pelo primeiro SQL, em **Storage** crie um bucket chamado `images` e marque como **público**.

Assim o novo projeto fica com a mesma estrutura do antigo, ainda vazio.

---

## Passo 2: Copiar dados (tabelas + storage)

Use o script de migração que lê do projeto **antigo** e grava no **novo**.

### 2.1 Variáveis de ambiente para o script

Crie ou edite `.env.local` (ou `.env`) e deixe **as duas** configurações:

**Projeto antigo (origem):**
```env
OLD_SUPABASE_URL=https://SEU-PROJETO-ANTIGO.supabase.co
OLD_SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_do_projeto_antigo
```

**Projeto novo (destino):**  
Use as variáveis que você já usa no app (serão o destino da cópia):

```env
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO-NOVO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=anon_key_do_novo_projeto
SUPABASE_SERVICE_ROLE_KEY=service_role_key_do_novo_projeto
```

- **Service Role** do projeto antigo: Dashboard do projeto antigo → **Settings** → **API** → `service_role` (secret).
- **Service Role** do projeto novo: mesmo caminho no projeto novo.

Não commite `.env` / `.env.local` no Git.

### 2.2 Executar o script

No terminal, na raiz do projeto:

```bash
npx tsx scripts/migrate-supabase-project.ts
```

O script:

- Conecta nos dois projetos (antigo e novo).
- Copia as tabelas na ordem correta (respeitando chaves estrangeiras).
- Copia todo o conteúdo do bucket `images` do projeto antigo para o novo.

Se alguma tabela não existir no antigo (ex.: ainda não tinha workshops), o script ignora e segue. Pode rodar de novo se precisar.

---

## Passo 3: Conferir no novo projeto

1. **Table Editor:** confira linha count das tabelas e alguns registros.
2. **Storage:** bucket `images` com as mesmas pastas/arquivos.
3. **Auth (se usar):** usuários não são migrados por este script; se precisar, use export/import de usuários pelo Dashboard (Authentication) ou pela API.

---

## Passo 4: Apontar o app para o novo projeto

No `.env.local` (e em qualquer ambiente que você use):

- Remova ou comente `OLD_SUPABASE_*` depois que a migração estiver ok.
- Deixe apenas as variáveis do **novo** projeto:
  - `NEXT_PUBLIC_SUPABASE_URL` = URL do novo projeto
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = anon key do novo projeto
  - `SUPABASE_SERVICE_ROLE_KEY` = service role do novo projeto

Rode o app e teste: páginas, admin, uploads, imagens públicas.

---

## Resumo rápido

| Etapa | Onde | Ação |
|-------|------|------|
| 1 | Novo projeto (Dashboard) | Rodar todos os SQLs na ordem; criar bucket `images` se precisar |
| 2 | Sua máquina | Configurar `OLD_*` e `NEXT_PUBLIC_*` / `SUPABASE_SERVICE_ROLE_KEY` e rodar `npx tsx scripts/migrate-supabase-project.ts` |
| 3 | Novo projeto (Dashboard) | Conferir tabelas e Storage |
| 4 | `.env.local` | Deixar só variáveis do novo projeto e testar o app |

---

## Se algo der errado

- **Projeto antigo continua intacto:** o script só lê de lá; não altera nem apaga nada.
- Se precisar refazer: pode dropar as tabelas no novo projeto, rodar de novo os SQLs do Passo 1 e rodar o script outra vez (ou restaurar backup do novo projeto, se tiver).
- **Storage:** URLs das imagens mudam (domínio do Supabase). O app já usa `NEXT_PUBLIC_SUPABASE_URL` para montar URLs; após trocar para o novo projeto, as URLs passam a apontar para o novo bucket. Os caminhos (`storage_path`, `image_url`) continuam iguais.

Se quiser, na próxima etapa podemos adicionar um script que só copia Storage ou só uma tabela, para testes parciais.
