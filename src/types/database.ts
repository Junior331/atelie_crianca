export interface PageImage {
  id?: string;
  page: string;
  key: string;
  image_url: string;
  position: number;
  created_at?: string;
  updated_at?: string;
}

export interface Workshop {
  id: string;
  slug: string;
  title: string;
  description: string | null;
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

export interface WorkshopWithImages extends Workshop {
  workshop_images: WorkshopImage[];
}
