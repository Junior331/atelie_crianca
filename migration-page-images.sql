-- Migration: Add page_images table for specific page layouts
-- Run this in your Supabase SQL Editor

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

-- Enable Row Level Security
ALTER TABLE page_images ENABLE ROW LEVEL SECURITY;

-- Policies for page_images
CREATE POLICY "Public can view page images" ON page_images
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert page images" ON page_images
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update page images" ON page_images
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete page images" ON page_images
  FOR DELETE TO authenticated USING (true);
