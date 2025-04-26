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
import { Loader2, Sun, CloudRain, Cloud, Sprout, Droplets, Thermometer } from 'lucide-react'
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

export default function GardenSetup() {
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
      const formattedGoals = goals.length > 0 ? goals : ['general']
      
      const { data, error } = await createGardenProfile(user.id, {
        name: name.trim(),
        size: size.trim(),
        location: location.trim(),
        sunlight,
        goals: formattedGoals,
        soil_type: soilType.trim(),
      })

      if (error) {
        throw error
      }
      
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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-4">
            Set Up Your Garden
          </h1>
          <p className="text-lg text-gray-600">
            Tell us about your garden space and preferences to get personalized recommendations.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <Alert variant="destructive" className="mb-6">
              {error}
            </Alert>
          )}

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sprout className="h-5 w-5 text-primary-600" />
                Garden Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="garden-name">Garden Name</Label>
                    <Input
                      id="garden-name"
                      placeholder="e.g., Backyard Garden"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="e.g., Aldie, VA"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="garden-size">Garden Size</Label>
                  <Input
                    id="garden-size"
                    placeholder="e.g., 20x40 feet"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sun className="h-5 w-5 text-primary-600" />
                Sunlight Conditions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="sun-exposure">Sun Exposure</Label>
                  <Select value={sunlight} onValueChange={setSunlight} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sun exposure" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-sun">Full Sun (6+ hours)</SelectItem>
                      <SelectItem value="partial-sun">Partial Sun (4-6 hours)</SelectItem>
                      <SelectItem value="partial-shade">Partial Shade (2-4 hours)</SelectItem>
                      <SelectItem value="full-shade">Full Shade (less than 2 hours)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sprout className="h-5 w-5 text-primary-600" />
                Garden Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
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
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Thermometer className="h-5 w-5 text-primary-600" />
                Soil Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="soil-type">Soil Type</Label>
                  <Input
                    id="soil-type"
                    placeholder="e.g., sandy, clay, loamy"
                    value={soilType}
                    onChange={(e) => setSoilType(e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 flex justify-end">
            <Button type="submit" className="px-8" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating garden...
                </>
              ) : (
                'Save Garden Setup'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}