"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useSupabase } from '@/components/supabase-provider'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/components/ui/use-toast'
import { Loader2, SendHorizonal, MessageSquare, Upload, Plane as Plant } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Search, MapPin, Users, Share2, Heart, MessageCircle } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CommunityPost, CommunityComment, UserPlant } from '@/types'

interface Plant {
  id: string;
  name: string;
}

interface GardenProfile {
  username: string;
  avatar_url: string | null;
  location?: string;
}

interface CommunityPost {
  id: string;
  content: string;
  image_url?: string;
  created_at: string;
  likes_count: number;
  garden_profiles: GardenProfile;
  plants: Plant;
}

interface CommunityComment {
  id: string;
  content: string;
  created_at: string;
  garden_profiles: GardenProfile;
}

export default async function CommunityPage() {
  const supabase = createServerComponentClient({ cookies })
  
  // Check if user is logged in
  const { data: { user } } = await supabase.auth.getUser()
  
  // If not logged in, redirect to login
  if (!user) {
    redirect('/login')
  }

  // Get user's profile
  const { data: profile, error: profileError } = await supabase
    .from('garden_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (profileError) throw profileError

  // Get user's plants for the dropdown
  const { data: plants, error: plantError } = await supabase
    .from('plants')
    .select(`
      id,
      name
    `)
    .eq('garden_profile_id', user.id)

  if (plantError) throw plantError

  const formattedPlants = (plants || []).map((plant: Plant) => ({
    id: plant.id,
    plant_name: plant.name || 'Unknown plant'
  }))

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
    .order('created_at', { ascending: false })

  if (postsError) throw postsError

  // Get comments for each post
  const postsWithComments = await Promise.all(
    (posts || []).map(async (post: CommunityPost) => {
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
        .order('created_at', { ascending: true })

      if (commentsError) throw commentsError
      return { ...post, comments: comments || [] }
    })
  )

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Community Garden</h1>
        <Button asChild>
          <Link href="/community/new-post">New Post</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column - Search and Filters */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Search & Filter</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search posts..."
                    className="pl-10"
                  />
                </div>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by plant" />
                  </SelectTrigger>
                  <SelectContent>
                    {formattedPlants.map((plant: { id: string; plant_name: string }) => (
                      <SelectItem key={plant.id} value={plant.id.toString()}>
                        {plant.plant_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* User Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={profile?.avatar_url || undefined} />
                  <AvatarFallback>{profile?.username?.[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{profile?.username}</h3>
                  <p className="text-sm text-muted-foreground">
                    {profile?.location ? (
                      <span className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {profile.location}
                      </span>
                    ) : 'No location set'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Middle Column - Posts */}
        <div className="md:col-span-2 space-y-6">
          <Tabs defaultValue="all">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All Posts</TabsTrigger>
              <TabsTrigger value="following">Following</TabsTrigger>
              <TabsTrigger value="popular">Popular</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-6">
              {postsWithComments.map((post: CommunityPost & { comments: CommunityComment[] }) => (
                <Card key={post.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={post.garden_profiles?.avatar_url || undefined} />
                          <AvatarFallback>{post.garden_profiles?.username?.[0]?.toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{post.garden_profiles?.username}</h3>
                          <p className="text-sm text-muted-foreground">
                            {post.plants?.name && (
                              <Badge variant="outline" className="mr-2">
                                {post.plants.name}
                              </Badge>
                            )}
                            {new Date(post.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">{post.content}</p>
                    {post.image_url && (
                      <img
                        src={post.image_url}
                        alt="Post image"
                        className="rounded-lg w-full h-64 object-cover mb-4"
                      />
                    )}
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <Button variant="ghost" size="sm">
                        <Heart className="w-4 h-4 mr-2" />
                        {post.likes_count || 0}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        {post.comments?.length || 0}
                      </Button>
                    </div>
                    
                    {/* Comments Section */}
                    <div className="mt-4 space-y-4">
                      <Separator />
                      <ScrollArea className="h-[200px]">
                        {post.comments?.map((comment: CommunityComment) => (
                          <div key={comment.id} className="flex items-start space-x-4 py-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={comment.garden_profiles?.avatar_url || undefined} />
                              <AvatarFallback>{comment.garden_profiles?.username?.[0]?.toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium">{comment.garden_profiles?.username}</h4>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(comment.created_at).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-sm">{comment.content}</p>
                            </div>
                          </div>
                        ))}
                      </ScrollArea>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}