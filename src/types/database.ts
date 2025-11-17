export interface PageImage {
  id?: string;
  page: string;
  key: string;
  image_url: string;
  position: number;
  created_at?: string;
  updated_at?: string;
}

export interface WorkshopCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
  order_position: number;
  created_at: string;
  updated_at: string;
}

export interface Workshop {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  category_id: string | null;
  is_active: boolean;
  order_position: number;
  created_at: string;
  updated_at: string;
}

export interface WorkshopImage {
  id: string;
  workshop_id: string;
  image_url: string;
  order_position: number;
  is_active: boolean;
  created_at: string;
}

export interface WorkshopCategoryRelation {
  id: string;
  workshop_id: string;
  category_id: string;
  created_at: string;
}

export interface WorkshopWithImages extends Workshop {
  workshop_images: WorkshopImage[];
  workshop_category?: WorkshopCategory;
  workshop_categories?: WorkshopCategory[]; // Múltiplas categorias
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
  order_position: number;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category_id: string | null;
  is_active: boolean;
  order_position: number;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  name: string | null;
  description: string | null;
  order_position: number;
  is_active: boolean;
  created_at: string;
}

export interface ProductWithImages extends Product {
  product_images: ProductImage[];
  product_category?: ProductCategory;
}
