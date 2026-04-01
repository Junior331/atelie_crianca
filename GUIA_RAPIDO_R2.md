# ⚡ Guia Rápido: Migração R2

## 🎯 Objetivo
Migrar imagens do Supabase Storage para Cloudflare R2 e resolver o problema de egress (187% usado).

---

## 📋 Checklist Rápido

### ☐ 1. Criar conta Cloudflare R2 (5 min)
1. https://dash.cloudflare.com/sign-up
2. R2 → Purchase R2 Plan → **Free**
3. Create bucket: `atelie-crianca-images`

### ☐ 2. Obter credenciais (3 min)
1. R2 → Manage R2 API Tokens
2. Create API Token:
   - Nome: `atelie-crianca-migration`
   - Permissões: **Admin Read & Write**
   - Bucket: `atelie-crianca-images`
3. **COPIE E SALVE:**
   - Access Key ID
   - Secret Access Key
   - Endpoint URL

### ☐ 3. Configurar domínio público (2 min)
1. R2 → atelie-crianca-images → Settings
2. Public access → Allow Access
3. Connect Domain → R2.dev subdomain
4. Nome: `atelie-crianca-pub`
5. **COPIE a URL:** `https://pub-xxxxxxx.r2.dev`

### ☐ 4. Configurar projeto (2 min)
```bash
# Copiar exemplo de .env
cp .env.example .env.local

# Editar .env.local e adicionar:
# R2_ENDPOINT=https://xxxxx.r2.cloudflarestorage.com
# R2_ACCESS_KEY_ID=xxxxxxxxx
# R2_SECRET_ACCESS_KEY=xxxxxxxxx
# R2_BUCKET_NAME=atelie-crianca-images
# R2_PUBLIC_URL=https://pub-xxxxxxx.r2.dev
# NEXT_PUBLIC_USE_R2_STORAGE=false (deixe false por enquanto)
```

### ☐ 5. Testar migração (1 min)
```bash
npm run migrate:r2:dry-run
```

Verifique o output e confirme que encontrou todas as imagens.

### ☐ 6. Executar migração (5-10 min)
```bash
npm run migrate:r2
```

Aguarde a conclusão. O script mostrará o progresso.

### ☐ 7. Ativar R2 (1 min)
Edite `.env.local`:
```env
NEXT_PUBLIC_USE_R2_STORAGE=true
```

Reinicie o servidor:
```bash
npm run dev
```

### ☐ 8. Testar site (3 min)
1. Acesse http://localhost:3000
2. Navegue pelas páginas
3. Abra DevTools (F12) → Network
4. Confirme imagens vindo de `r2.dev`

---

## ✅ Sucesso!

**Resultado esperado:**
- ✅ Cached Egress: ~10% (ao invés de 187%)
- ✅ Todas imagens carregando do R2
- ✅ 100% grátis (sem custo adicional)

---

## 🆘 Problemas?

Consulte [MIGRACAO_R2.md](MIGRACAO_R2.md) para troubleshooting detalhado.

**Rollback rápido:** Mude `NEXT_PUBLIC_USE_R2_STORAGE=false` e reinicie o servidor.
