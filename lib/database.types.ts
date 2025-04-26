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
      alerts: {
        Row: {
          id: string
          garden_profile_id: string
          event_type: string
          event_date: string
          created_date: string
          status: string
        }
        Insert: {
          id?: string
          garden_profile_id: string
          event_type: string
          event_date: string
          created_date?: string
          status: string
        }
        Update: {
          id?: string
          garden_profile_id?: string
          event_type?: string
          event_date?: string
          created_date?: string
          status?: string
        }
      }
      feedback: {
        Row: {
          id: string
          user_id: string
          user_plant_id: string
          comment: string
          date: string
          photo: string | null
        }
        Insert: {
          id?: string
          user_id: string
          user_plant_id: string
          comment: string
          date?: string
          photo?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          user_plant_id?: string
          comment?: string
          date?: string
          photo?: string | null
        }
      }
      garden_profiles: {
        Row: {
          id: string
          user_id: string
          name: string
          size: string
          location: string
          sunlight: string
          goals: string[]
          soil_type: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          size: string
          location: string
          sunlight: string
          goals: string[]
          soil_type: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          size?: string
          location?: string
          sunlight?: string
          goals?: string[]
          soil_type?: string
        }
      }
      plants: {
        Row: {
          id: string
          name: string
          type: string
          care_instructions: string
          planting_seasons: string[]
          water_needs: string
          sun_needs: string
          common_issues: string[]
        }
        Insert: {
          id?: string
          name: string
          type: string
          care_instructions: string
          planting_seasons: string[]
          water_needs: string
          sun_needs: string
          common_issues: string[]
        }
        Update: {
          id?: string
          name?: string
          type?: string
          care_instructions?: string
          planting_seasons?: string[]
          water_needs?: string
          sun_needs?: string
          common_issues?: string[]
        }
      }
      tasks: {
        Row: {
          id: string
          user_plant_id: string
          description: string
          due_date: string
          status: string
          generated_by: string
        }
        Insert: {
          id?: string
          user_plant_id: string
          description: string
          due_date: string
          status: string
          generated_by: string
        }
        Update: {
          id?: string
          user_plant_id?: string
          description?: string
          due_date?: string
          status?: string
          generated_by?: string
        }
      }
      user_plants: {
        Row: {
          id: string
          garden_profile_id: string
          plant_id: string
          planting_date: string
          status: string
          notes: string
          photos: string[]
        }
        Insert: {
          id?: string
          garden_profile_id: string
          plant_id: string
          planting_date: string
          status: string
          notes: string
          photos: string[]
        }
        Update: {
          id?: string
          garden_profile_id?: string
          plant_id?: string
          planting_date?: string
          status?: string
          notes?: string
          photos?: string[]
        }
      }
      users: {
        Row: {
          id: string
          email: string
          subscription_status: string
          role: string
        }
        Insert: {
          id: string
          email: string
          subscription_status?: string
          role?: string
        }
        Update: {
          id?: string
          email?: string
          subscription_status?: string
          role?: string
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