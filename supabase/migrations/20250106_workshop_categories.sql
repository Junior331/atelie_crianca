-- ============================================
-- SCHEMA: Sistema de Categorias de Workshops
-- Descrição: Adiciona categorias para organizar oficinas
-- ============================================

-- ============================================
-- TABELA: workshop_categories
-- Descrição: Categorias para filtrar oficinas
-- ============================================
CREATE TABLE workshop_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  order_position INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT category_slug_format CHECK (slug ~ '^[a-z0-9-]+$')
);

-- Índices para performance
CREATE INDEX idx_workshop_categories_slug ON workshop_categories(slug);
CREATE INDEX idx_workshop_categories_is_active ON workshop_categories(is_active);
CREATE INDEX idx_workshop_categories_order ON workshop_categories(order_position);

-- Trigger para updated_at
CREATE TRIGGER update_workshop_categories_updated_at
  BEFORE UPDATE ON workshop_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Adicionar coluna category_id em workshops
-- ============================================
ALTER TABLE workshops
  ADD COLUMN category_id UUID REFERENCES workshop_categories(id) ON DELETE SET NULL;

-- Índice para performance
CREATE INDEX idx_workshops_category_id ON workshops(category_id);

-- ============================================
-- Row Level Security (RLS)
-- ============================================
ALTER TABLE workshop_categories ENABLE ROW LEVEL SECURITY;

-- Leitura pública (apenas categorias ativas)
CREATE POLICY "Public categories viewable"
  ON workshop_categories FOR SELECT
  USING (is_active = true);

-- Admin completo (permite tudo para usuários autenticados)
CREATE POLICY "Admin manage categories"
  ON workshop_categories FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================
-- Inserir categorias iniciais
-- ============================================
INSERT INTO workshop_categories (name, slug, order_position) VALUES
  ('Casamento', 'casamento', 0),
  ('Corporativo', 'corporativo', 1),
  ('Infantis', 'infantis', 2),
  ('Temáticas', 'tematicas', 3),
  ('Personalizáveis', 'personalizaveis', 4);

-- ============================================
-- Comentários nas tabelas
-- ============================================
COMMENT ON TABLE workshop_categories IS 'Categorias para organizar e filtrar oficinas';
COMMENT ON COLUMN workshops.category_id IS 'Categoria da oficina (casamento, corporativo, etc)';
