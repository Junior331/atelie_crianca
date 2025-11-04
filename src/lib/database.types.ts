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
      workshops: {
        Row: {
          id: string
          slug: string
          title: string
          description: string | null
          is_active: boolean
          order_position: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          description?: string | null
          is_active?: boolean
          order_position?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          description?: string | null
          is_active?: boolean
          order_position?: number
          created_at?: string
          updated_at?: string
        }
      }
      workshop_images: {
        Row: {
          id: string
          workshop_id: string
          image_url: string
          order_position: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          workshop_id: string
          image_url: string
          order_position?: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          workshop_id?: string
          image_url?: string
          order_position?: number
          is_active?: boolean
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
