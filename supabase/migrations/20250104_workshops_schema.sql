-- ============================================
-- SCHEMA: Sistema de Workshops (Oficinas)
-- Descrição: Gerenciamento completo de oficinas com múltiplas imagens
-- ============================================

-- Habilita extensões necessárias (se ainda não estiver habilitada)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABELA: workshops
-- Descrição: Oficinas disponíveis no site
-- ============================================
CREATE TABLE workshops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  order_position INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT slug_format CHECK (slug ~ '^[a-z0-9-]+$')
);

-- Índices para performance
CREATE INDEX idx_workshops_slug ON workshops(slug);
CREATE INDEX idx_workshops_is_active ON workshops(is_active);
CREATE INDEX idx_workshops_order ON workshops(order_position);

-- ============================================
-- TABELA: workshop_images
-- Descrição: Imagens associadas a cada oficina
-- ============================================
CREATE TABLE workshop_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  order_position INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_workshop_images_workshop_id ON workshop_images(workshop_id);
CREATE INDEX idx_workshop_images_order ON workshop_images(order_position);

-- ============================================
-- Trigger para updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_workshops_updated_at
  BEFORE UPDATE ON workshops
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Row Level Security (RLS)
-- ============================================
ALTER TABLE workshops ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshop_images ENABLE ROW LEVEL SECURITY;

-- Leitura pública (apenas oficinas e imagens ativas)
CREATE POLICY "Public workshops viewable"
  ON workshops FOR SELECT
  USING (is_active = true);

CREATE POLICY "Public workshop_images viewable"
  ON workshop_images FOR SELECT
  USING (is_active = true);

-- Admin completo (permite tudo para usuários autenticados)
CREATE POLICY "Admin manage workshops"
  ON workshops FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin manage workshop_images"
  ON workshop_images FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================
-- Comentários nas tabelas
-- ============================================
COMMENT ON TABLE workshops IS 'Oficinas disponíveis no site (Aquário, Cupcake, etc)';
COMMENT ON TABLE workshop_images IS 'Imagens de cada oficina (múltiplas imagens por oficina)';

COMMENT ON COLUMN workshops.slug IS 'URL-friendly identifier (ex: aquario, oficina-de-cupcake)';
COMMENT ON COLUMN workshops.order_position IS 'Ordem de exibição no site (menor = primeiro)';
COMMENT ON COLUMN workshop_images.order_position IS 'Ordem das imagens na galeria';
