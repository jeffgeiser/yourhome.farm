"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSupabase } from '@/components/supabase-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import GardenCard from '@/components/garden-card'
import TaskList from '@/components/task-list'
import AlertList from '@/components/alert-list'
import CalendarView from '@/components/calendar-view'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/components/ui/use-toast'
import { PlusCircle, Loader2, Lightbulb } from 'lucide-react'

interface GardenProfile {
  id: string;
  name: string;
  size: string;
  location: string;
  sunlight: string;
  goals: string[];
  soil_type: string;
}

interface Plant {
  id: string;
  name: string;
}

interface UserPlant {
  id: string;
  garden_profile_id: string;
  plant_id: string;
  planting_date: string;
  status: string;
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

interface Alert {
  id: string;
  garden_profile_id: string;
  event_type: string;
  event_date: string;
  created_date: string;
  status: string;
}

export default function DashboardPage() {
  const [gardens, setGardens] = useState<GardenProfile[]>([])
  const [userPlants, setUserPlants] = useState<UserPlant[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [plantCounts, setPlantCounts] = useState<Record<string, number>>({})
  const [gardenNames, setGardenNames] = useState<Record<string, string>>({})
  const [plantNames, setPlantNames] = useState<Record<string, string>>({})
  const { user } = useSupabase()
  const { toast } = useToast()

  const fetchDashboardData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Get garden profiles
      const { data: gardenData, error: gardenError } = await supabase
        .from('garden_profiles')
        .select('*')
        .eq('user_id', user.id);
        
      if (gardenError) throw gardenError;
      setGardens(gardenData || []);
      
      // Create garden name lookup
      const gardenNameMap: Record<string, string> = {};
      gardenData?.forEach(garden => {
        gardenNameMap[garden.id] = garden.name;
      });
      setGardenNames(gardenNameMap);
      
      const gardenIds = gardenData?.map(garden => garden.id) || [];
      
      if (gardenIds.length > 0) {
        // Get user plants
        const { data: plantData, error: plantError } = await supabase
          .from('user_plants')
          .select(`
            *,
            plants (id, name)
          `)
          .in('garden_profile_id', gardenIds);
          
        if (plantError) throw plantError;
        setUserPlants(plantData || []);
        
        // Count plants per garden
        const counts: Record<string, number> = {};
        const nameMap: Record<string, string> = {};
        
        plantData?.forEach(userPlant => {
          const gardenId = userPlant.garden_profile_id;
          counts[gardenId] = (counts[gardenId] || 0) + 1;
          nameMap[userPlant.id] = userPlant.plants?.name || 'Unknown plant';
        });
        
        setPlantCounts(counts);
        setPlantNames(nameMap);
        
        const userPlantIds = plantData?.map(plant => plant.id) || [];
        
        if (userPlantIds.length > 0) {
          // Get tasks
          const { data: taskData, error: taskError } = await supabase
            .from('tasks')
            .select('*')
            .in('user_plant_id', userPlantIds)
            .order('due_date', { ascending: true });
            
          if (taskError) throw taskError;
          setTasks(taskData || []);
        }
        
        // Get alerts
        const { data: alertData, error: alertError } = await supabase
          .from('alerts')
          .select('*')
          .in('garden_profile_id', gardenIds)
          .order('event_date', { ascending: true });
          
        if (alertError) throw alertError;
        setAlerts(alertData || []);
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error loading dashboard',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user, toast]);
  
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
          <Link href="/login" className="text-[#4CAF50] hover:underline">Log in</Link> to view your dashboard
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {loading ? (
        <div className="flex justify-center items-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-[#4CAF50]" />
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-[#333333]">Dashboard</h1>
            <Button asChild className="bg-[#4CAF50] hover:bg-green-700">
              <Link href="/garden_setup">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Garden
              </Link>
            </Button>
          </div>

          {gardens.length === 0 ? (
            <Card className="mb-8">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="rounded-full bg-green-100 p-3 mb-4">
                  <PlusCircle className="h-8 w-8 text-[#4CAF50]" />
                </div>
                <h2 className="text-xl font-semibold mb-2">Create Your First Garden</h2>
                <p className="text-gray-600 text-center max-w-md mb-6">
                  Start by creating a garden profile to track your plants, receive care instructions, and get weather alerts.
                </p>
                <Button asChild className="bg-[#4CAF50] hover:bg-green-700">
                  <Link href="/garden_setup">Get Started</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {gardens.map((garden) => (
                  <GardenCard 
                    key={garden.id} 
                    garden={garden} 
                    plantCount={plantCounts[garden.id] || 0} 
                  />
                ))}
                <Card className="flex flex-col items-center justify-center p-6 h-full border-dashed border-2 bg-transparent hover:bg-gray-50 transition-colors duration-200">
                  <PlusCircle className="h-8 w-8 text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-4 text-center">Add another garden space</p>
                  <Button asChild variant="outline">
                    <Link href="/garden_setup">Add Garden</Link>
                  </Button>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <TaskList 
                  tasks={tasks} 
                  plantNames={plantNames} 
                  onTaskUpdate={fetchDashboardData} 
                />
                <AlertList 
                  alerts={alerts} 
                  gardenNames={gardenNames} 
                  onAlertUpdate={fetchDashboardData} 
                />
              </div>

              <div className="mb-8">
                <CalendarView
                  tasks={tasks}
                  alerts={alerts}
                  plantings={plantings}
                />
              </div>

              <Card className="bg-amber-50 border-amber-200">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-amber-500" />
                    <CardTitle className="text-xl">Sustainability Tip</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-amber-800">
                    Create a compost bin for kitchen scraps and garden waste to reduce landfill waste and create nutrient-rich soil for your garden.
                  </p>
                </CardContent>
              </Card>
            </>
          )}
        </>
      )}
    </div>
  );
}