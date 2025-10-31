-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create images table
CREATE TABLE IF NOT EXISTS images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  order_position INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create page_images table for specific page layouts (like souvenirs, etc)
CREATE TABLE IF NOT EXISTS page_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page TEXT NOT NULL,
  key TEXT NOT NULL,
  image_url TEXT NOT NULL,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(page, key)
);

-- Create indexes
CREATE INDEX idx_images_category ON images(category_id);
CREATE INDEX idx_images_active ON images(is_active);
CREATE INDEX idx_images_order ON images(order_position);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE images ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_images ENABLE ROW LEVEL SECURITY;

-- Policies for public read access
CREATE POLICY "Public can view active images" ON images
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view categories" ON categories
  FOR SELECT USING (true);

-- Policies for authenticated users (admins)
CREATE POLICY "Authenticated users can insert images" ON images
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update images" ON images
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete images" ON images
  FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can manage categories" ON categories
  FOR ALL TO authenticated USING (true);

-- Policies for page_images
CREATE POLICY "Public can view page images" ON page_images
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert page images" ON page_images
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update page images" ON page_images
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete page images" ON page_images
  FOR DELETE TO authenticated USING (true);

-- Insert default categories
INSERT INTO categories (name, slug) VALUES
  ('Móveis', 'furniture'),
  ('Ateliê', 'atelier'),
  ('Brinquedoteca', 'playroom'),
  ('Casamentos', 'weddings')
ON CONFLICT (slug) DO NOTHING;

-- Create storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Public can view images" ON storage.objects
  FOR SELECT USING (bucket_id = 'images');

CREATE POLICY "Authenticated users can upload images" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'images');

CREATE POLICY "Authenticated users can update images" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'images');

CREATE POLICY "Authenticated users can delete images" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'images');
