-- Add name and description fields to product_images table
ALTER TABLE product_images
ADD COLUMN name TEXT,
ADD COLUMN description TEXT;

-- Update existing images to have a default name based on order
UPDATE product_images
SET name = CONCAT(
  (SELECT name FROM products WHERE id = product_images.product_id),
  ' - Imagem ',
  product_images.order_position + 1
)
WHERE name IS NULL;

-- Add comment to document the new fields
COMMENT ON COLUMN product_images.name IS 'Nome específico desta imagem/variação do produto';
COMMENT ON COLUMN product_images.description IS 'Descrição específica desta imagem/variação do produto';
