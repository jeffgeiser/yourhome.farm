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
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="indoor">Indoor</SelectItem>
                      <SelectItem value="outdoor">Outdoor</SelectItem>
                      <SelectItem value="greenhouse">Greenhouse</SelectItem>
                      <SelectItem value="balcony">Balcony</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="garden-size">Garden Size</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select garden size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small (under 100 sq ft)</SelectItem>
                    <SelectItem value="medium">Medium (100-500 sq ft)</SelectItem>
                    <SelectItem value="large">Large (500+ sq ft)</SelectItem>
                  </SelectContent>
                </Select>
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
                <Select>
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

              <div className="space-y-2">
                <Label htmlFor="sun-direction">Primary Sun Direction</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sun direction" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="north">North</SelectItem>
                    <SelectItem value="south">South</SelectItem>
                    <SelectItem value="east">East</SelectItem>
                    <SelectItem value="west">West</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplets className="h-5 w-5 text-primary-600" />
              Watering System
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="watering-method">Watering Method</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select watering method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">Manual Watering</SelectItem>
                    <SelectItem value="drip">Drip Irrigation</SelectItem>
                    <SelectItem value="sprinkler">Sprinkler System</SelectItem>
                    <SelectItem value="self-watering">Self-Watering Containers</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="water-source">Water Source</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select water source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tap">Tap Water</SelectItem>
                    <SelectItem value="rain">Rain Water Collection</SelectItem>
                    <SelectItem value="well">Well Water</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Thermometer className="h-5 w-5 text-primary-600" />
              Climate Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="climate-zone">USDA Hardiness Zone</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your zone" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 13 }, (_, i) => (
                      <SelectItem key={i} value={`zone-${i + 1}`}>
                        Zone {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="soil-type">Soil Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select soil type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="clay">Clay</SelectItem>
                    <SelectItem value="sandy">Sandy</SelectItem>
                    <SelectItem value="loamy">Loamy</SelectItem>
                    <SelectItem value="silty">Silty</SelectItem>
                    <SelectItem value="peaty">Peaty</SelectItem>
                    <SelectItem value="chalky">Chalky</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-2">
          <Label htmlFor="notes">Additional Notes</Label>
          <Textarea
            id="notes"
            placeholder="Any additional information about your garden setup..."
            className="min-h-[100px]"
          />
        </div>

        <div className="mt-8 flex justify-end">
          <Button className="px-8">
            Save Garden Setup
          </Button>
        </div>
      </div>
    </div>
  )
}