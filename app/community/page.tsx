"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useSupabase } from '@/components/supabase-provider'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/components/ui/use-toast'
import { Loader2, SendHorizonal, MessageSquare, Upload, Plane as Plant } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface FeedbackItem {
  id: string;
  user_id: string;
  user_plant_id: string;
  comment: string;
  date: string;
  photo: string | null;
  users: {
    email: string;
  };
  user_plants: {
    plants: {
      name: string;
    };
  };
}

export default function CommunityPage() {
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([])
  const [userPlants, setUserPlants] = useState<{id: string, plant_name: string}[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [comment, setComment] = useState('')
  const [photoUrl, setPhotoUrl] = useState('')
  const [selectedPlant, setSelectedPlant] = useState('')
  const { user } = useSupabase()
  const { toast } = useToast()
  const router = useRouter()

  const fetchData = async () => {
    setLoading(true);
    try {
      // Get community feedback
      const { data: feedbackData, error: feedbackError } = await supabase
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
        
      if (feedbackError) throw feedbackError;
      setFeedbackItems(feedbackData || []);
      
      // If user is logged in, get their plants for the dropdown
      if (user) {
        const { data: plantData, error: plantError } = await supabase
          .from('user_plants')
          .select(`
            id,
            plants (name)
          `)
          .eq('garden_profile_id', 'garden_profile_id.user_id', user.id);
          
        if (plantError) throw plantError;
        
        const formattedPlants = (plantData || []).map(item => ({
          id: item.id,
          plant_name: item.plants?.name || 'Unknown plant'
        }));
        
        setUserPlants(formattedPlants);
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error loading community data',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user, toast]);

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication required',
        description: 'Please log in to post feedback.',
      });
      router.push('/login');
      return;
    }
    
    if (!comment.trim()) {
      toast({
        variant: 'destructive',
        title: 'Comment required',
        description: 'Please enter a comment.',
      });
      return;
    }
    
    if (!selectedPlant) {
      toast({
        variant: 'destructive',
        title: 'Plant selection required',
        description: 'Please select a plant.',
      });
      return;
    }
    
    setSubmitting(true);
    
    try {
      const { data, error } = await supabase
        .from('feedback')
        .insert({
          user_id: user.id,
          user_plant_id: selectedPlant,
          comment: comment.trim(),
          date: new Date().toISOString(),
          photo: photoUrl.trim() || null,
        })
        .select();
        
      if (error) throw error;
      
      toast({
        title: 'Feedback posted',
        description: 'Your feedback has been shared with the community.',
      });
      
      // Reset form
      setComment('');
      setPhotoUrl('');
      setSelectedPlant('');
      
      // Refresh data
      await fetchData();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error posting feedback',
        description: error.message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#333333]">Community Garden</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Community Posts</CardTitle>
              <CardDescription>
                Share and learn from other gardeners in the community
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-[#4CAF50]" />
                </div>
              ) : feedbackItems.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <MessageSquare className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No community posts yet. Be the first to share!</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {feedbackItems.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4 bg-white">
                      <div className="flex items-start gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-[#4CAF50] text-white">
                            {item.users?.email.charAt(0).toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-2 flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-gray-900">
                                {item.users?.email.split('@')[0] || 'Anonymous'}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatDate(item.date, 'PPp')}
                              </p>
                            </div>
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Plant className="h-3 w-3" />
                              {item.user_plants?.plants?.name || 'Plant'}
                            </Badge>
                          </div>
                          <p className="text-gray-700">{item.comment}</p>
                          {item.photo && (
                            <div className="mt-3 rounded-md overflow-hidden">
                              <img
                                src={item.photo}
                                alt="Feedback photo"
                                className="w-full h-auto max-h-[300px] object-cover"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Share Your Experience</CardTitle>
              <CardDescription>
                Post your gardening tips, questions, or success stories
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!user ? (
                <div className="text-center py-6">
                  <p className="text-gray-600 mb-4">
                    Please log in to share your experiences
                  </p>
                  <Button asChild className="bg-[#4CAF50] hover:bg-green-700">
                    <Link href="/login">Log In</Link>
                  </Button>
                </div>
              ) : userPlants.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-600 mb-4">
                    Add a plant to your garden before posting
                  </p>
                  <Button asChild className="bg-[#4CAF50] hover:bg-green-700">
                    <Link href="/plant_management">Add Plants</Link>
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmitFeedback} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Select Plant</label>
                    <select
                      className="w-full rounded-md border border-gray-300 p-2"
                      value={selectedPlant}
                      onChange={(e) => setSelectedPlant(e.target.value)}
                      required
                    >
                      <option value="">Select a plant</option>
                      {userPlants.map((plant) => (
                        <option key={plant.id} value={plant.id}>
                          {plant.plant_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Your Comment</label>
                    <Textarea
                      placeholder="Share your gardening experience, tips, or ask questions..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="min-h-[120px]"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Photo URL (Optional)
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="url"
                        placeholder="https://example.com/your-plant-image.jpg"
                        value={photoUrl}
                        onChange={(e) => setPhotoUrl(e.target.value)}
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="icon"
                        className="flex-shrink-0"
                      >
                        <Upload className="h-4 w-4" />
                        <span className="sr-only">Upload</span>
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">
                      Link to a photo of your garden or plant
                    </p>
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full bg-[#4CAF50] hover:bg-green-700"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Posting...
                      </>
                    ) : (
                      <>
                        <SendHorizonal className="mr-2 h-4 w-4" />
                        Post to Community
                      </>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}