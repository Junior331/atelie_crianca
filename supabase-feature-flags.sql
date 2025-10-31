-- Create feature_flags table
CREATE TABLE IF NOT EXISTS feature_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  is_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for feature flags
CREATE INDEX IF NOT EXISTS idx_feature_flags_slug ON feature_flags(slug);
CREATE INDEX IF NOT EXISTS idx_feature_flags_enabled ON feature_flags(is_enabled);

-- Enable Row Level Security for feature flags
ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY;

-- Policies for feature flags (public read, admin write)
CREATE POLICY "Public can view feature flags" ON feature_flags
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert feature flags" ON feature_flags
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update feature flags" ON feature_flags
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete feature flags" ON feature_flags
  FOR DELETE TO authenticated USING (true);

-- Insert default feature flags for all pages/services
INSERT INTO feature_flags (slug, name, description, is_enabled) VALUES
  ('about', 'Quem Somos', 'Página e rota de Quem Somos', true),
  ('workshops', 'Oficinas', 'Página e rota de Oficinas', true),
  ('playroom', 'Brinquedoteca', 'Página e rota de Brinquedoteca', true),
  ('wedding', 'Casamentos', 'Página e rota de Casamentos', true),
  ('products', 'Produtos', 'Página e rota de Produtos', true),
  ('souvenirstable', 'Mesa de Lanchinho', 'Página e rota de Mesa de Lanchinho', true),
  ('corporate', 'Corporativo', 'Página e rota de Corporativo', true),
  ('furniture', 'Mobiliário', 'Página e rota de Mobiliário', true),
  ('ateliegroup', 'Grupo Ateliê', 'Página e rota de Grupo Ateliê', true)
ON CONFLICT (slug) DO NOTHING;
