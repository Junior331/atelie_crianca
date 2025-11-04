# 🚀 Instruções para Aplicar Migration de Workshops

## Passo 1: Acessar Supabase Dashboard

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **SQL Editor** (no menu lateral esquerdo)

## Passo 2: Executar o SQL

1. Clique em **New Query**
2. Copie TODO o conteúdo do arquivo:
   ```
   supabase/migrations/20250104_workshops_schema.sql
   ```
3. Cole no editor SQL
4. Clique em **Run** (ou pressione Ctrl+Enter)

## Passo 3: Verificar

Após executar, verifique se as tabelas foram criadas:

1. Vá em **Table Editor**
2. Você deve ver:
   - ✅ `workshops`
   - ✅ `workshop_images`

## Passo 4: Configurar Storage (se ainda não existir)

1. Vá em **Storage** no menu lateral
2. Se o bucket `images` não existir:
   - Clique em **New Bucket**
   - Nome: `images`
   - Public bucket: **Yes** (marque como público)
   - Clique em **Create bucket**

3. Dentro do bucket `images`, crie a pasta `workshops`:
   - Clique no bucket `images`
   - Clique em **Upload** > **Create folder**
   - Nome: `workshops`

## ✅ Pronto!

Depois de executar esses passos, volte aqui e me avise que está pronto para continuar com o código!
