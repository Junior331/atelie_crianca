# Painel Admin - Ateliê da Criança

Sistema de gerenciamento de imagens com Supabase + Next.js

## 🚀 Setup Inicial

### 1. Criar projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Crie uma nova conta ou faça login
3. Clique em "New Project"
4. Preencha os dados:
   - **Name**: atelie-crianca
   - **Database Password**: escolha uma senha forte
   - **Region**: escolha a mais próxima (South America - São Paulo)

### 2. Configurar o banco de dados

1. No dashboard do Supabase, vá em **SQL Editor**
2. Clique em **New Query**
3. Cole todo o conteúdo do arquivo `supabase-schema.sql`
4. Clique em **Run** para executar o script

### 3. Obter as chaves da API

1. No dashboard do Supabase, vá em **Settings** → **API**
2. Copie as seguintes informações:
   - **Project URL**
   - **anon/public key**
   - **service_role key** (em "Service role")

### 4. Configurar variáveis de ambiente

1. Abra o arquivo `.env.local` na raiz do projeto
2. Substitua os valores pelas suas chaves:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_aqui
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role_aqui
```

### 5. Criar usuário admin

1. No dashboard do Supabase, vá em **Authentication** → **Users**
2. Clique em **Add user** → **Create new user**
3. Preencha:
   - **Email**: seu@email.com
   - **Password**: sua_senha_segura
   - Marque **Auto Confirm User**
4. Clique em **Create user**

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── admin/
│   │   ├── page.tsx          # Dashboard principal
│   │   ├── login/
│   │   │   └── page.tsx      # Página de login
│   │   └── upload/
│   │       └── page.tsx      # Upload de imagens
│   └── furniture/
│       └── page.tsx          # Página pública (atualizada)
├── lib/
│   ├── supabase.ts           # Cliente Supabase
│   └── database.types.ts     # Types do banco
└── middleware.ts             # Proteção de rotas admin
```

## 🎯 Como Usar

### Acessar o painel admin

1. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

2. Acesse: `http://localhost:3000/admin/login`

3. Faça login com as credenciais criadas no Supabase

### Upload de imagens

1. No dashboard, clique em **Upload Nova Imagem**
2. Preencha:
   - **Categoria**: escolha a categoria (Móveis, Ateliê, etc)
   - **Título**: nome da imagem
   - **Descrição**: descrição opcional
   - **Posição de Ordenação**: número (menor aparece primeiro)
   - **Imagem**: selecione o arquivo
3. Clique em **Enviar Imagem**

### Gerenciar imagens

- **Filtrar**: use o dropdown para filtrar por categoria
- **Ativar/Desativar**: controla se a imagem aparece no site público
- **Excluir**: remove a imagem permanentemente

## 🗂️ Categorias Padrão

As seguintes categorias são criadas automaticamente:

1. **Móveis** (furniture)
2. **Ateliê** (atelier)
3. **Brinquedoteca** (playroom)
4. **Casamentos** (weddings)

## 🔒 Segurança

- Rotas `/admin/*` protegidas por middleware
- Row Level Security (RLS) ativo no Supabase
- Apenas usuários autenticados podem fazer upload/editar
- Público pode ver apenas imagens ativas

## 📊 Banco de Dados

### Tabela `categories`
- `id`: UUID
- `name`: Nome da categoria
- `slug`: Slug único (ex: furniture)

### Tabela `images`
- `id`: UUID
- `category_id`: Referência à categoria
- `title`: Título da imagem
- `description`: Descrição (opcional)
- `image_url`: URL pública da imagem
- `storage_path`: Caminho no Storage
- `is_active`: Se está ativa/visível
- `order_position`: Ordem de exibição

## 🎨 Integração com o Site

A página `/furniture` foi atualizada para buscar imagens do Supabase automaticamente. As imagens ativas da categoria "Móveis" aparecerão na seção "NOSSA ESTRUTURA".

## 🆘 Troubleshooting

### Erro de autenticação
- Verifique se as chaves no `.env.local` estão corretas
- Reinicie o servidor após alterar `.env.local`

### Imagens não aparecem
- Verifique se o bucket "images" está público
- Confirme que as políticas de Storage foram criadas
- Verifique se `is_active` está marcado como `true`

### Erro de CORS
- Adicione seu domínio local nas configurações de CORS do Supabase
- Settings → API → CORS → Adicione `http://localhost:3000`

## 📝 Próximos Passos

- [ ] Adicionar drag-and-drop para reordenar imagens
- [ ] Implementar edição de imagens existentes
- [ ] Criar páginas admin para outras categorias (Ateliê, Brinquedoteca, etc)
- [ ] Adicionar filtros e busca avançada
- [ ] Implementar upload múltiplo de imagens
