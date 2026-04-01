# 🚀 Migração para Cloudflare R2

Este guia detalha como migrar o armazenamento de imagens do Supabase Storage para Cloudflare R2, resolvendo o problema de limite de egress.

## 📋 Índice

1. [Por que migrar?](#por-que-migrar)
2. [Configuração do Cloudflare R2](#configuração-do-cloudflare-r2)
3. [Configuração do projeto](#configuração-do-projeto)
4. [Executar migração](#executar-migração)
5. [Verificação](#verificação)
6. [Rollback](#rollback)

---

## 🎯 Por que migrar?

**Problema:** Supabase Free Tier permite apenas 5 GB de egress, e você está usando 187% (9.37 GB).

**Solução:** Cloudflare R2 oferece:
- ✅ Egress **ILIMITADO E GRÁTIS**
- ✅ 10 GB de armazenamento grátis
- ✅ 10 milhões de operações/mês grátis
- ✅ Compatível com S3 API

**Resultado:** Reduz egress do Supabase a ~0%, mantendo tudo funcionando.

---

## ⚙️ Configuração do Cloudflare R2

### 1. Criar conta Cloudflare (se não tiver)

1. Acesse: https://dash.cloudflare.com/sign-up
2. Complete o cadastro (grátis)

### 2. Ativar R2

1. No dashboard Cloudflare, clique em **R2** no menu lateral
2. Clique em **Purchase R2 Plan**
3. Escolha o plano **Free** (sem custo, sem cartão de crédito necessário)

### 3. Criar bucket

1. Clique em **Create bucket**
2. Nome do bucket: `atelie-crianca-images`
3. Região: Escolha **Automatic** (distribui globalmente)
4. Clique em **Create bucket**

### 4. Obter credenciais API

1. Vá em **R2** → **Overview**
2. Clique em **Manage R2 API Tokens**
3. Clique em **Create API Token**
4. Configurações:
   - **Token Name:** `atelie-crianca-migration`
   - **Permissions:** Admin Read & Write
   - **TTL:** Forever (ou 1 ano se preferir)
   - **Bucket:** `atelie-crianca-images`
5. Clique em **Create API Token**
6. **⚠️ COPIE E SALVE IMEDIATAMENTE:**
   - Access Key ID
   - Secret Access Key
   - Endpoint URL (formato: `https://xxxx.r2.cloudflarestorage.com`)

### 5. Configurar domínio público (R2.dev)

1. Vá em **R2** → **atelie-crianca-images**
2. Aba **Settings**
3. Em **Public access**, clique em **Allow Access**
4. Clique em **Connect Domain** → **R2.dev subdomain**
5. Escolha um nome: Ex: `atelie-crianca-pub`
6. Clique em **Create**
7. **Copie a URL pública:** `https://pub-xxxxxxxxx.r2.dev`

---

## 🔧 Configuração do projeto

### 1. Instalar dependências

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

✅ **Já instalado!**

### 2. Criar arquivo `.env.local`

Copie o exemplo e preencha com suas credenciais:

```bash
cp .env.example .env.local
```

Edite `.env.local`:

```env
# Supabase (mantém como está)
NEXT_PUBLIC_SUPABASE_URL=https://fulbaxplriohotozocfr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key-atual

# Cloudflare R2 (PREENCHA COM OS DADOS DO PASSO ANTERIOR)
R2_ENDPOINT=https://xxxxxxxxxxxx.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=sua-access-key-id-aqui
R2_SECRET_ACCESS_KEY=sua-secret-access-key-aqui
R2_BUCKET_NAME=atelie-crianca-images
R2_PUBLIC_URL=https://pub-xxxxxxxxx.r2.dev

# Ainda NÃO ative o R2 (deixe false por enquanto)
NEXT_PUBLIC_USE_R2_STORAGE=false
```

---

## 🚀 Executar migração

### 1. Teste (Dry Run)

Primeiro, execute um teste **SEM fazer alterações**:

```bash
npx tsx scripts/migrate-to-r2.ts --dry-run
```

Isso irá:
- ✅ Verificar configuração
- ✅ Listar todas as imagens
- ✅ Mostrar o que SERIA feito
- ❌ **NÃO faz upload nem altera banco**

### 2. Revisar output

Verifique:
- Número total de imagens encontradas
- Tabelas que serão atualizadas
- Se todas as URLs são válidas

### 3. Executar migração REAL

Se tudo estiver OK no dry-run:

```bash
npx tsx scripts/migrate-to-r2.ts
```

**O que acontece:**
1. ✅ Copia cada imagem do Supabase para R2
2. ✅ Atualiza URLs no banco de dados
3. ✅ Mantém a estrutura de pastas
4. ✅ Gera relatório de sucesso/falhas

**Tempo estimado:** ~5-10 minutos (dependendo do número de imagens)

### 4. Ativar R2 no projeto

Após a migração bem-sucedida, edite `.env.local`:

```env
NEXT_PUBLIC_USE_R2_STORAGE=true
```

### 5. Reiniciar servidor

```bash
npm run dev
```

---

## ✅ Verificação

### 1. Testar imagens no site

1. Acesse: http://localhost:3000
2. Navegue pelas páginas com imagens:
   - Página inicial
   - Produtos
   - Workshops
   - Admin
3. Abra DevTools (F12) → Network
4. Verifique se as imagens são carregadas de `r2.dev`

### 2. Verificar no Cloudflare

1. Vá em **R2** → **atelie-crianca-images**
2. Aba **Objects**
3. Confirme que as pastas/imagens estão lá

### 3. Monitorar uso

1. Vá em **R2** → **Overview**
2. Verifique:
   - Storage usado
   - Requests
   - Egress (deve ser grátis!)

---

## 🔄 Rollback (se necessário)

Se algo der errado, você pode voltar para o Supabase:

### 1. Desativar R2

Edite `.env.local`:

```env
NEXT_PUBLIC_USE_R2_STORAGE=false
```

### 2. Reiniciar servidor

```bash
npm run dev
```

**Pronto!** O site voltará a usar Supabase Storage.

As URLs antigas ainda estão no banco de dados como backup.

---

## 📊 Próximos passos (após migração)

### 1. Monitorar por 1 semana

- Verifique se todas as imagens carregam
- Monitore erros no console
- Teste uploads de novas imagens

### 2. Limpar Supabase Storage (opcional)

**⚠️ APENAS APÓS CONFIRMAR QUE TUDO FUNCIONA!**

1. Acesse Supabase Dashboard
2. Vá em **Storage** → **images**
3. Delete as imagens antigas

**Economia:** Reduz storage do Supabase de 92% para ~0%

### 3. Configurar domínio customizado (opcional)

Para URLs mais bonitas (ex: `images.ateliecrianca.com.br`):

1. No Cloudflare R2, vá em **Custom Domains**
2. Adicione seu domínio
3. Configure DNS (CNAME)
4. Atualize `R2_PUBLIC_URL` no `.env.local`

---

## 🆘 Troubleshooting

### Erro: "Access Denied"

**Causa:** Token R2 sem permissões corretas

**Solução:**
1. Recrie o token com permissão **Admin Read & Write**
2. Atualize `R2_ACCESS_KEY_ID` e `R2_SECRET_ACCESS_KEY`

### Erro: "Bucket not found"

**Causa:** Nome do bucket incorreto

**Solução:**
1. Verifique o nome exato no dashboard R2
2. Atualize `R2_BUCKET_NAME` (case-sensitive)

### Imagens não carregam após migração

**Causa:** `NEXT_PUBLIC_USE_R2_STORAGE` ainda em `false`

**Solução:**
1. Confirme que está `true` no `.env.local`
2. Reinicie o servidor (`npm run dev`)

### Migração parcial (algumas falharam)

**Solução:**
1. Execute a migração novamente (é idempotente)
2. Verifique logs de erro
3. Corrija problemas específicos
4. Rode novamente

---

## 📞 Suporte

**Criado por:** Claude AI
**Data:** Março 2026

Se precisar de ajuda, revise este guia ou consulte:
- [Cloudflare R2 Docs](https://developers.cloudflare.com/r2/)
- [AWS SDK for JavaScript v3](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/)

---

## 📈 Resultados esperados

**Antes:**
- ❌ Cached Egress: 9.37 GB / 5 GB (187%)
- ❌ Serviço restrito

**Depois:**
- ✅ Cached Egress: ~0.5 GB / 5 GB (10%)
- ✅ Imagens servidas pelo R2 (egress ilimitado grátis)
- ✅ Supabase apenas para DB e Auth
- ✅ Projeto 100% no free tier

**Economia mensal:** ~$25-50 USD (comparado com plano pago Supabase)
