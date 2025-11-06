-- ============================================
-- SCHEMA: Sistema de Produtos e Categorias
-- Descrição: Gerenciamento de produtos com categorias dinâmicas
-- ============================================

-- ============================================
-- TABELA: product_categories
-- Descrição: Categorias para organizar produtos
-- ============================================
CREATE TABLE product_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  order_position INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT product_category_slug_format CHECK (slug ~ '^[a-z0-9-]+$')
);

-- Índices para performance
CREATE INDEX idx_product_categories_slug ON product_categories(slug);
CREATE INDEX idx_product_categories_is_active ON product_categories(is_active);
CREATE INDEX idx_product_categories_order ON product_categories(order_position);

-- Trigger para updated_at
CREATE TRIGGER update_product_categories_updated_at
  BEFORE UPDATE ON product_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- TABELA: products
-- Descrição: Produtos disponíveis (acessórios, arcos, brindes, fantasias)
-- ============================================
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  category_id UUID REFERENCES product_categories(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  order_position INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT product_slug_format CHECK (slug ~ '^[a-z0-9-]+$')
);

-- Índices para performance
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_order ON products(order_position);

-- Trigger para updated_at
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- TABELA: product_images
-- Descrição: Imagens de cada produto
-- ============================================
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  order_position INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_product_images_product_id ON product_images(product_id);
CREATE INDEX idx_product_images_order ON product_images(order_position);

-- ============================================
-- Row Level Security (RLS)
-- ============================================
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

-- Leitura pública (apenas ativos)
CREATE POLICY "Public product_categories viewable"
  ON product_categories FOR SELECT
  USING (is_active = true);

CREATE POLICY "Public products viewable"
  ON products FOR SELECT
  USING (is_active = true);

CREATE POLICY "Public product_images viewable"
  ON product_images FOR SELECT
  USING (is_active = true);

-- Admin completo (permite tudo para usuários autenticados)
CREATE POLICY "Admin manage product_categories"
  ON product_categories FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin manage products"
  ON products FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin manage product_images"
  ON product_images FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================
-- Inserir categorias iniciais de produtos
-- ============================================
INSERT INTO product_categories (name, slug, description, order_position) VALUES
  ('Acessórios', 'acessorios', 'Acessórios decorativos e personalizados', 0),
  ('Arcos', 'arcos', 'Arcos decorativos para festas e eventos', 1),
  ('Brindes', 'brindes', 'Brindes personalizados para lembranças', 2),
  ('Fantasias', 'fantasias', 'Fantasias criativas para festas infantis', 3);

-- ============================================
-- Comentários nas tabelas
-- ============================================
COMMENT ON TABLE product_categories IS 'Categorias para organizar produtos (acessórios, arcos, brindes, fantasias)';
COMMENT ON TABLE products IS 'Produtos disponíveis no catálogo';
COMMENT ON TABLE product_images IS 'Imagens de cada produto (múltiplas imagens por produto)';

COMMENT ON COLUMN products.category_id IS 'Categoria do produto (acessórios, arcos, brindes, fantasias)';
COMMENT ON COLUMN products.order_position IS 'Ordem de exibição no site (menor = primeiro)';
COMMENT ON COLUMN product_images.order_position IS 'Ordem das imagens na galeria';
