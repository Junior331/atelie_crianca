# 🎯 Guia Completo - Implementação Admin de Oficinas

## ✅ O que foi criado

1. **Schema SQL** - `supabase/migrations/20250104_workshops_schema.sql`
2. **Tipos TypeScript** - Adicionados em `src/types/database.ts`
3. **Página Admin** - `src/app/admin/workshops/page.tsx`
4. **Hook useWorkshops** - `src/hooks/use-workshops.ts`
5. **Componente atualizado** - `src/components/modules/RentalCollection/index-database.tsx`
6. **Script de migração** - `scripts/migrate-workshops-to-db.ts`

---

## 📋 Passo a Passo para Ativação

### **Passo 1: Aplicar Migration no Supabase**

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **SQL Editor**
4. Clique em **New Query**
5. Copie TODO o conteúdo de: `supabase/migrations/20250104_workshops_schema.sql`
6. Cole no editor e clique em **Run**

✅ Verifique se as tabelas foram criadas:
- Vá em **Table Editor**
- Deve ver: `workshops` e `workshop_images`

### **Passo 2: Configurar Storage**

1. Vá em **Storage**
2. Se o bucket `images` não existir, crie:
   - Clique em **New Bucket**
   - Nome: `images`
   - Public: **Sim**
   - Clique em **Create**
3. Dentro do bucket `images`, crie a pasta `workshops`:
   - Clique em **Upload** > **Create folder**
   - Nome: `workshops`

### **Passo 3: Migrar Dados (Opcional)**

Se quiser popular o banco com as oficinas existentes:

```bash
npm install -D tsx
npx tsx scripts/migrate-workshops-to-db.ts
```

Isso vai criar 45+ oficinas no banco com os nomes e descrições atuais.

### **Passo 4: Ativar Novo Componente**

Para usar o banco de dados ao invés do código hardcoded:

```bash
# Renomear arquivo antigo (backup)
mv src/components/modules/RentalCollection/index.tsx src/components/modules/RentalCollection/index-old.tsx

# Ativar novo arquivo
mv src/components/modules/RentalCollection/index-database.tsx src/components/modules/RentalCollection/index.tsx
```

Ou manualmente:
1. Renomeie `index.tsx` para `index-old.tsx`
2. Renomeie `index-database.tsx` para `index.tsx`

---

## 🎨 Como Usar o Admin

### **Acessar o Painel**

1. Faça login: `/admin/login`
2. No dashboard: `/admin`
3. Clique no card **"Oficinas"**
4. Você será redirecionado para: `/admin/workshops`

### **Criar Nova Oficina**

1. Clique em **"Nova Oficina"**
2. Preencha:
   - **Título**: Nome da oficina
   - **Slug**: URL amigável (auto-gerado)
   - **Descrição**: Texto descritivo
   - **Status**: Ativo/Inativo
3. Clique em **"Criar Oficina"**
4. Depois, faça upload das imagens

### **Upload de Imagens**

1. Na lista de oficinas, localize a oficina
2. Na seção **"Imagens"**, clique em **"Upload Nova Imagem"**
3. Selecione a imagem
4. Repita para adicionar mais imagens
5. As imagens aparecem em ordem (primeira = capa)

### **Editar Oficina**

1. Clique no botão **"Editar"**
2. Altere os campos desejados
3. Clique em **"Salvar Alterações"**

### **Reordenar Oficinas**

Use os botões **↑** e **↓** ao lado do nome da oficina.

### **Ativar/Desativar**

Clique no badge **"Ativo"** ou **"Inativo"** para alternar.

### **Excluir Oficina**

1. Clique em **"Excluir"**
2. Confirme a ação
3. Todas as imagens serão removidas do storage automaticamente

### **Remover Imagem**

Passe o mouse sobre a imagem e clique no **X** vermelho.

---

## 🌐 Fluxo no Site

### **Frontend (Site Público)**

Quando ativo, a página `/workshops` vai:

1. Buscar oficinas do banco de dados (apenas ativas)
2. Exibir cards com a primeira imagem como capa
3. Ao passar o mouse, alternar entre as imagens
4. Ao clicar, redirecionar para `/workshop/[slug]`

### **Página de Detalhes**

A página `/workshop/[slug]` precisa ser atualizada para usar o banco.
Atualmente ela ainda usa o sistema antigo.

---

## 🔧 Próximas Melhorias (Opcional)

1. **Drag-and-drop para reordenar imagens**
2. **Edição de imagem individual** (alt text, ordem)
3. **Busca avançada no admin** (por status, data)
4. **Duplicar oficina**
5. **Import/Export em massa**
6. **Atualizar página de detalhes** `/workshop/[slug]` para usar banco

---

## 🐛 Troubleshooting

### Erro "Table not found"
- Certifique-se de ter executado a migration SQL no Supabase

### Erro "Storage object not found"
- Verifique se o bucket `images` existe e é público
- Verifique se a pasta `workshops` foi criada

### Imagens não aparecem
- Verifique se o bucket é público
- Veja no console do navegador se há erros de CORS
- Confirme que as URLs das imagens estão corretas

### Oficinas não aparecem no site
- Verifique se `is_active = true` no banco
- Confirme que o novo componente está ativo (index.tsx)
- Veja o console do navegador para erros

---

## 📊 Estrutura de Dados

### Tabela: workshops

```sql
id                UUID
slug              TEXT (único)
title             TEXT
description       TEXT
is_active         BOOLEAN
order_position    INTEGER
created_at        TIMESTAMP
updated_at        TIMESTAMP
```

### Tabela: workshop_images

```sql
id                UUID
workshop_id       UUID (FK)
image_url         TEXT
order_position    INTEGER
is_active         BOOLEAN
created_at        TIMESTAMP
```

---

## ✨ Features Implementadas

✅ **Admin Completo**
- Criar, editar, remover oficinas
- Upload de múltiplas imagens
- Reordenar oficinas
- Ativar/desativar
- Busca e filtros

✅ **Frontend Dinâmico**
- Carrega dados do banco
- Fallback para hardcoded (se não ativar)
- Cache e performance otimizados

✅ **Storage Integrado**
- Upload automático para Supabase Storage
- URLs públicas automáticas
- Remoção em cascata

✅ **TypeScript Completo**
- Tipagem forte em todo o código
- Autocomplete no IDE
- Menos bugs

---

## 📞 Suporte

Se tiver dúvidas ou problemas:
1. Verifique o console do navegador
2. Verifique os logs do Supabase
3. Revise este guia passo a passo

---

**🎉 Pronto! Agora você tem um sistema completo de gerenciamento de oficinas!**
