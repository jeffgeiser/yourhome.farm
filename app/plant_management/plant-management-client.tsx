"use client"

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useSupabase } from '@/components/supabase-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/components/ui/use-toast'
import { Loader2, PlusCircle, Calendar, Leaf, Droplets, Sun } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import CalendarView from '@/components/calendar-view'

interface GardenProfile {
  id: string;
  name: string;
}

interface Plant {
  id: string;
  name: string;
  type: string;
  care_instructions: string;
  planting_seasons: string[];
  water_needs: string;
  sun_needs: string;
}

interface UserPlant {
  id: string;
  garden_profile_id: string;
  plant_id: string;
  planting_date: string;
  status: string;
  notes: string;
  photos: string[];
  plants: Plant;
}

interface Task {
  id: string;
  user_plant_id: string;
  description: string;
  due_date: string;
  status: string;
  generated_by: string;
}

export default function PlantManagementClient() {
  const [gardens, setGardens] = useState<GardenProfile[]>([])
  const [plants, setPlants] = useState<Plant[]>([])
  const [userPlants, setUserPlants] = useState<UserPlant[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  
  const [selectedGarden, setSelectedGarden] = useState<string>('')
  const [selectedPlant, setSelectedPlant] = useState<string>('')
  const [plantingDate, setPlantingDate] = useState<string>('')
  const [plantStatus, setPlantStatus] = useState<string>('healthy')
  const [plantNotes, setPlantNotes] = useState<string>('')
  
  const { user } = useSupabase()
  const { toast } = useToast()
  const searchParams = useSearchParams()
  
  useEffect(() => {
    const gardenId = searchParams?.get('garden')
    if (gardenId) {
      setSelectedGarden(gardenId)
    }
  }, [searchParams])

  const fetchData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Get garden profiles
      const { data: gardenData, error: gardenError } = await supabase
        .from('garden_profiles')
        .select('id, name')
        .eq('user_id', user.id);
        
      if (gardenError) throw gardenError;
      setGardens(gardenData || []);
      
      // Get all available plants
      const { data: plantData, error: plantError } = await supabase
        .from('plants')
        .select('*')
        .order('name');
        
      if (plantError) throw plantError;
      setPlants(plantData || []);
      
      // If no garden is selected yet, select the first one
      if (!selectedGarden && gardenData && gardenData.length > 0) {
        setSelectedGarden(gardenData[0].id);
      }
      
      // If a garden is selected, get user plants for that garden
      if (selectedGarden) {
        await fetchUserPlants(selectedGarden);
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error loading data',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPlants = async (gardenId: string) => {
    try {
      const { data: userPlantData, error: userPlantError } = await supabase
        .from('user_plants')
        .select(`
          *,
          plants (*)
        `)
        .eq('garden_profile_id', gardenId);
        
      if (userPlantError) throw userPlantError;
      setUserPlants(userPlantData || []);
      
      // Get tasks for these plants
      const userPlantIds = userPlantData?.map(plant => plant.id) || [];
      
      if (userPlantIds.length > 0) {
        const { data: taskData, error: taskError } = await supabase
          .from('tasks')
          .select('*')
          .in('user_plant_id', userPlantIds)
          .order('due_date', { ascending: true });
          
        if (taskError) throw taskError;
        setTasks(taskData || []);
      } else {
        setTasks([]);
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error loading plants',
        description: error.message,
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, [user, toast]);
  
  useEffect(() => {
    if (selectedGarden) {
      fetchUserPlants(selectedGarden);
    }
  }, [selectedGarden]);

  const handleGardenChange = (value: string) => {
    setSelectedGarden(value);
  };

  const handleAddPlant = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedGarden || !selectedPlant || !plantingDate) {
      toast({
        variant: 'destructive',
        title: 'Missing information',
        description: 'Please select a garden, plant, and planting date.',
      });
      return;
    }
    
    setSubmitting(true);
    
    try {
      const { data, error } = await supabase
        .from('user_plants')
        .insert({
          garden_profile_id: selectedGarden,
          plant_id: selectedPlant,
          planting_date: plantingDate,
          status: plantStatus,
          notes: plantNotes,
          photos: [],
        })
        .select();
        
      if (error) throw error;
      
      toast({
        title: 'Plant added successfully',
        description: 'Your plant has been added to your garden.',
      });
      
      // Reset form
      setSelectedPlant('');
      setPlantingDate('');
      setPlantStatus('healthy');
      setPlantNotes('');
      
      // Refresh user plants
      await fetchUserPlants(selectedGarden);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error adding plant',
        description: error.message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Get plantings data for calendar
  const plantings = userPlants.map(plant => ({
    id: plant.id,
    plant_name: plant.plants?.name || 'Unknown plant',
    planting_date: plant.planting_date,
  }));

  if (!user) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center">
        <p className="text-center">
          <Link href="/login" className="text-[#4CAF50] hover:underline">Log in</Link> to manage your plants
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#333333]">Plant Management</h1>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-[#4CAF50]" />
        </div>
      ) : (
        <>
          {gardens.length === 0 ? (
            <Card className="mb-8">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="rounded-full bg-green-100 p-3 mb-4">
                  <PlusCircle className="h-8 w-8 text-[#4CAF50]" />
                </div>
                <h2 className="text-xl font-semibold mb-2">Create a Garden First</h2>
                <p className="text-gray-600 text-center max-w-md mb-6">
                  You need to create a garden profile before you can add plants.
                </p>
                <Button asChild className="bg-[#4CAF50] hover:bg-green-700">
                  <Link href="/garden_setup">Create Garden</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="md:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Add a Plant</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleAddPlant} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="garden">Garden</Label>
                        <Select 
                          value={selectedGarden} 
                          onValueChange={handleGardenChange}
                          required
                        >
                          <SelectTrigger id="garden">
                            <SelectValue placeholder="Select a garden" />
                          </SelectTrigger>
                          <SelectContent>
                            {gardens.map((garden) => (
                              <SelectItem key={garden.id} value={garden.id}>
                                {garden.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="plant">Plant</Label>
                        <Select 
                          value={selectedPlant} 
                          onValueChange={setSelectedPlant}
                          required
                        >
                          <SelectTrigger id="plant">
                            <SelectValue placeholder="Select a plant" />
                          </SelectTrigger>
                          <SelectContent>
                            {plants.map((plant) => (
                              <SelectItem key={plant.id} value={plant.id}>
                                {plant.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="planting-date">Planting Date</Label>
                        <Input
                          id="planting-date"
                          type="date"
                          value={plantingDate}
                          onChange={(e) => setPlantingDate(e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="status">Initial Status</Label>
                        <Select 
                          value={plantStatus} 
                          onValueChange={setPlantStatus}
                          required
                        >
                          <SelectTrigger id="status">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="healthy">Healthy</SelectItem>
                            <SelectItem value="seedling">Seedling</SelectItem>
                            <SelectItem value="growing">Growing</SelectItem>
                            <SelectItem value="flowering">Flowering</SelectItem>
                            <SelectItem value="fruiting">Fruiting</SelectItem>
                            <SelectItem value="dormant">Dormant</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="notes">Notes (Optional)</Label>
                        <Textarea
                          id="notes"
                          placeholder="Add any notes about this plant"
                          value={plantNotes}
                          onChange={(e) => setPlantNotes(e.target.value)}
                          className="min-h-[80px]"
                        />
                      </div>
                      
                      <Button
                        type="submit"
                        className="w-full bg-[#4CAF50] hover:bg-green-700"
                        disabled={submitting}
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Adding Plant...
                          </>
                        ) : (
                          <>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Plant
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
              
              <div className="md:col-span-2">
                <Tabs defaultValue="plants" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="plants">My Plants</TabsTrigger>
                    <TabsTrigger value="calendar">Calendar</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="plants" className="mt-4">
                    {userPlants.length === 0 ? (
                      <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                          <Leaf className="h-12 w-12 text-gray-300 mb-4" />
                          <p className="text-gray-600 text-center">
                            {selectedGarden 
                              ? "You haven't added any plants to this garden yet." 
                              : "Select a garden to see your plants."}
                          </p>
                        </CardContent>
                      </Card>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {userPlants.map((userPlant) => (
                          <Card key={userPlant.id} className="overflow-hidden">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg">{userPlant.plants?.name}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="flex gap-1 items-center">
                                  <Calendar className="h-3.5 w-3.5" />
                                  <span>Planted: {formatDate(userPlant.planting_date, 'MMM d, yyyy')}</span>
                                </Badge>
                                <Badge className="bg-green-100 text-green-800 hover:bg-green-200 capitalize">
                                  {userPlant.status}
                                </Badge>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className="flex items-center gap-1">
                                  <Droplets className="h-4 w-4 text-blue-500" />
                                  <span>{userPlant.plants?.water_needs}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Sun className="h-4 w-4 text-amber-500" />
                                  <span>{userPlant.plants?.sun_needs}</span>
                                </div>
                              </div>
                              
                              {userPlant.notes && (
                                <div className="text-sm bg-gray-50 p-2 rounded-md">
                                  <p className="font-medium text-xs text-gray-600 mb-1">Notes:</p>
                                  <p className="text-gray-700">{userPlant.notes}</p>
                                </div>
                              )}
                              
                              <div className="flex justify-end">
                                <Button asChild variant="ghost" size="sm" className="text-[#007BFF]">
                                  <Link href={`/plant_management/${userPlant.id}`}>
                                    Manage
                                  </Link>
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="calendar" className="mt-4">
                    <CalendarView
                      tasks={tasks}
                      plantings={plantings}
                    />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
} 