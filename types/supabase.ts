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
      gardens: {
        Row: {
          id: string
          created_at: string
          name: string
          description: string
          location: string
          size: number
          soil_type: string
          sunlight_exposure: string
          water_source: string
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          description: string
          location: string
          size: number
          soil_type: string
          sunlight_exposure: string
          water_source: string
          user_id?: string
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          description?: string
          location?: string
          size?: number
          soil_type?: string
          sunlight_exposure?: string
          water_source?: string
          user_id?: string
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