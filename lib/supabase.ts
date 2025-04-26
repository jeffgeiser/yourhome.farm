import { createClient } from '@supabase/supabase-js';
import { Database } from '@/lib/database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
  db: {
    schema: 'public'
  }
});

// Handle auth state change
let isRedirecting = false;
supabase.auth.onAuthStateChange((event, session) => {
  if (!isRedirecting && session && (event === 'SIGNED_IN' || event === 'USER_UPDATED')) {
    isRedirecting = true;
    // Only redirect if we're not already on the dashboard
    if (!window.location.pathname.includes('/dashboard')) {
      window.location.href = '/dashboard';
    }
  }
});

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function createGardenProfile(userId: string, gardenData: {
  name: string;
  size: string;
  location: string;
  sunlight: string;
  goals: string[];
  soil_type: string;
}) {
  const { data, error } = await supabase
    .from('garden_profiles')
    .insert({
      user_id: userId,
      ...gardenData
    })
    .select()
    .single();

  if (error) {
    console.error('Database error:', error);
    throw new Error(error.message);
  }

  return data;
}

export async function getUserGardens(userId: string) {
  const { data, error } = await supabase
    .from('garden_profiles')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    throw error;
  }

  return data;
}

export async function getUserPlants(gardenProfileId: string) {
  const { data, error } = await supabase
    .from('user_plants')
    .select(`
      *,
      plants (*)
    `)
    .eq('garden_profile_id', gardenProfileId);

  if (error) {
    throw error;
  }

  return data;
}

export async function getUserTasks(userPlantsIds: string[]) {
  if (userPlantsIds.length === 0) return [];
  
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .in('user_plant_id', userPlantsIds)
    .order('due_date', { ascending: true });

  if (error) {
    throw error;
  }

  return data;
}

export async function getUserAlerts(gardenProfileIds: string[]) {
  if (gardenProfileIds.length === 0) return [];
  
  const { data, error } = await supabase
    .from('alerts')
    .select('*')
    .in('garden_profile_id', gardenProfileIds)
    .order('event_date', { ascending: true });

  if (error) {
    throw error;
  }

  return data;
}

export async function getPublicPlants() {
  const { data, error } = await supabase
    .from('plants')
    .select('*')
    .order('name');

  if (error) {
    throw error;
  }

  return data;
}

export async function getCommunityFeedback() {
  const { data, error } = await supabase
    .from('feedback')
    .select(`
      *,
      users (email),
      user_plants (
        *,
        plants (name)
      )
    `)
    .order('date', { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}