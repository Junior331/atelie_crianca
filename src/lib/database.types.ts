export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          created_at?: string
          updated_at?: string
        }
      }
      images: {
        Row: {
          id: string
          category_id: string
          title: string
          description: string | null
          image_url: string
          storage_path: string
          is_active: boolean
          order_position: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category_id: string
          title: string
          description?: string | null
          image_url: string
          storage_path: string
          is_active?: boolean
          order_position?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category_id?: string
          title?: string
          description?: string | null
          image_url?: string
          storage_path?: string
          is_active?: boolean
          order_position?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
