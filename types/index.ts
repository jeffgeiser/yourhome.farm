export interface Plant {
  id: string;
  name: string;
}

export interface GardenProfile {
  username: string;
  avatar_url: string | null;
  location?: string;
}

export interface CommunityPost {
  id: string;
  content: string;
  image_url?: string;
  created_at: string;
  likes_count: number;
  garden_profiles: GardenProfile;
  plants: Plant;
}

export interface CommunityComment {
  id: string;
  content: string;
  created_at: string;
  garden_profiles: GardenProfile;
}

export interface UserPlant {
  id: string;
  plant_name: string;
} 