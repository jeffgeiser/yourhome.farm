"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSupabase } from '@/components/supabase-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert } from '@/components/ui/alert'
import { createGardenProfile } from '@/lib/supabase'
import { Loader2, Sun, CloudRain, Cloud } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

const GARDEN_GOALS = [
  { id: 'vegetables', label: 'Vegetables' },
  { id: 'fruits', label: 'Fruits' },
  { id: 'herbs', label: 'Herbs' },
  { id: 'flowers', label: 'Flowers' },
  { id: 'low-maintenance', label: 'Low Maintenance' },
  { id: 'sustainable', label: 'Sustainable' },
  { id: 'wildlife-friendly', label: 'Wildlife-friendly' },
]

export default function GardenSetupPage() {
  const [name, setName] = useState('')
  const [size, setSize] = useState('')
  const [location, setLocation] = useState('')
  const [sunlight, setSunlight] = useState('')
  const [goals, setGoals] = useState<string[]>([])
  const [soilType, setSoilType] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useSupabase()
  const router = useRouter()
  const { toast } = useToast()

  if (!user) {
    router.push('/login')
    return null
  }

  const handleGoalToggle = (goalId: string) => {
    setGoals(prev => 
      prev.includes(goalId)
        ? prev.filter(g => g !== goalId)
        : [...prev, goalId]
    )
  }

  const validateForm = () => {
    if (!name.trim()) return 'Garden name is required'
    if (!size.trim()) return 'Garden size is required'
    if (!location.trim()) return 'Location is required'
    if (!sunlight) return 'Sunlight exposure is required'
    if (goals.length === 0) return 'Please select at least one goal'
    if (!soilType.trim()) return 'Soil type is required'
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }
    
    setLoading(true)
    
    try {
      await createGardenProfile(user.id, {
        name: name.trim(),
        size: size.trim(),
        location: location.trim(),
        sunlight,
        goals,
        soil_type: soilType.trim(),
      })
      
      toast({
        title: 'Garden profile created!',
        description: 'Your garden has been set up successfully.',
      })
      
      router.push('/dashboard')
    } catch (err: any) {
      console.error('Error creating garden profile:', err)
      setError(err.message || 'Error creating garden profile. Please try again.')
      toast({
        variant: 'destructive',
        title: 'Error creating garden profile',
        description: err.message || 'Please try again.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-[#F0F2F5] p-4">
      <Card className="w-full max-w-[600px] shadow-md rounded-[10px]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Set Up Your Garden</CardTitle>
          <CardDescription className="text-center">
            Tell us about your garden so we can provide personalized suggestions
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive" className="text-sm">
                {error}
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="name">Garden Name</Label>
              <Input
                id="name"
                placeholder="e.g., Backyard Paradise, Patio Garden"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="size">Garden Size</Label>
                <Input
                  id="size"
                  placeholder="e.g., 20x40 feet, 4 pots"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="e.g., Seattle, WA or ZIP code"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sunlight">Sunlight Exposure</Label>
              <Select 
                value={sunlight} 
                onValueChange={setSunlight}
                required
              >
                <SelectTrigger id="sunlight">
                  <SelectValue placeholder="Select sunlight exposure" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-sun">
                    <div className="flex items-center">
                      <Sun className="h-4 w-4 mr-2 text-amber-500" />
                      Full Sun (6+ hours)
                    </div>
                  </SelectItem>
                  <SelectItem value="partial-shade">
                    <div className="flex items-center">
                      <Cloud className="h-4 w-4 mr-2 text-gray-500" />
                      Partial Shade (3-6 hours)
                    </div>
                  </SelectItem>
                  <SelectItem value="shade">
                    <div className="flex items-center">
                      <CloudRain className="h-4 w-4 mr-2 text-blue-500" />
                      Shade (less than 3 hours)
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Garden Goals (Select all that apply)</Label>
              <div className="grid grid-cols-2 gap-2">
                {GARDEN_GOALS.map((goal) => (
                  <div key={goal.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`goal-${goal.id}`}
                      checked={goals.includes(goal.id)}
                      onCheckedChange={() => handleGoalToggle(goal.id)}
                    />
                    <Label
                      htmlFor={`goal-${goal.id}`}
                      className="text-sm font-normal"
                    >
                      {goal.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="soil-type">Soil Type</Label>
              <Textarea
                id="soil-type"
                placeholder="Describe your soil (e.g., sandy, clay, potting mix)"
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                className="min-h-[80px]"
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full bg-[#4CAF50] hover:bg-green-700 text-white font-bold"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating garden...
                </>
              ) : (
                'Create Garden'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}