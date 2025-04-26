import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import CommunityClient from './community-client';

export default async function CommunityPage() {
  const supabase = createServerComponentClient({ cookies });
  
  // Check if user is logged in
  const { data: { user } } = await supabase.auth.getUser();
  
  // If not logged in, redirect to login
  if (!user) {
    redirect('/login');
  }

  // Get user's profile
  const { data: profile, error: profileError } = await supabase
    .from('garden_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (profileError) throw profileError;

  // Get user's plants for the dropdown
  const { data: plants, error: plantError } = await supabase
    .from('plants')
    .select(`
      id,
      name
    `)
    .eq('garden_profile_id', user.id);

  if (plantError) throw plantError;

  const formattedPlants = (plants || []).map((plant) => ({
    id: plant.id,
    plant_name: plant.name || 'Unknown plant'
  }));

  // Get community posts
  const { data: posts, error: postsError } = await supabase
    .from('community_posts')
    .select(`
      *,
      garden_profiles (
        username,
        avatar_url
      ),
      plants (
        name
      )
    `)
    .order('created_at', { ascending: false });

  if (postsError) throw postsError;

  // Get comments for each post
  const postsWithComments = await Promise.all(
    (posts || []).map(async (post) => {
      const { data: comments, error: commentsError } = await supabase
        .from('community_comments')
        .select(`
          *,
          garden_profiles (
            username,
            avatar_url
          )
        `)
        .eq('post_id', post.id)
        .order('created_at', { ascending: true });

      if (commentsError) throw commentsError;
      return { ...post, comments: comments || [] };
    })
  );

  return <CommunityClient profile={profile} plants={formattedPlants} posts={postsWithComments} />;
}