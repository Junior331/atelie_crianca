-- ============================================
-- SCHEMA: Múltiplas Categorias para Workshops (Many-to-Many)
-- Descrição: Permite que uma oficina pertença a múltiplas categorias
-- ============================================

-- ============================================
-- TABELA: workshop_category_relations
-- Descrição: Tabela de relacionamento many-to-many entre workshops e categorias
-- ============================================
CREATE TABLE workshop_category_relations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES workshop_categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Garantir que não haja duplicatas
  UNIQUE(workshop_id, category_id)
);

-- Índices para performance
CREATE INDEX idx_workshop_category_relations_workshop ON workshop_category_relations(workshop_id);
CREATE INDEX idx_workshop_category_relations_category ON workshop_category_relations(category_id);

-- ============================================
-- Migração de dados existentes
-- Descrição: Mover dados da coluna category_id para a nova tabela de relacionamento
-- ============================================
INSERT INTO workshop_category_relations (workshop_id, category_id)
SELECT id, category_id
FROM workshops
WHERE category_id IS NOT NULL;

-- ============================================
-- Row Level Security (RLS)
-- ============================================
ALTER TABLE workshop_category_relations ENABLE ROW LEVEL SECURITY;

-- Leitura pública
CREATE POLICY "Public workshop category relations viewable"
  ON workshop_category_relations FOR SELECT
  USING (true);

-- Admin completo (permite tudo para usuários autenticados)
CREATE POLICY "Admin manage workshop category relations"
  ON workshop_category_relations FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================
-- Comentários nas tabelas
-- ============================================
COMMENT ON TABLE workshop_category_relations IS 'Relacionamento many-to-many entre workshops e categorias';
COMMENT ON COLUMN workshop_category_relations.workshop_id IS 'ID da oficina';
COMMENT ON COLUMN workshop_category_relations.category_id IS 'ID da categoria';

-- ============================================
-- NOTA: Manter a coluna category_id por enquanto para compatibilidade
-- Ela pode ser removida posteriormente após testes
-- Para remover no futuro: ALTER TABLE workshops DROP COLUMN category_id;
-- ============================================
