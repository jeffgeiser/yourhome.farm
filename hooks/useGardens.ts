"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useSupabase } from '@/components/supabase-provider'
import { useToast } from '@/components/ui/use-toast'

interface GardenProfile {
  id: string;
  user_id: string;
  name: string;
  size: string;
  location: string;
  sunlight: string;
  goals: string[];
  soil_type: string;
}

export function useGardens() {
  const [gardens, setGardens] = useState<GardenProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useSupabase()
  const { toast } = useToast()

  const fetchGardens = async () => {
    if (!user) {
      setGardens([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { data, error: fetchError } = await supabase
        .from('garden_profiles')
        .select('*')
        .eq('user_id', user.id)

      if (fetchError) {
        throw fetchError
      }

      setGardens(data || [])
    } catch (err: any) {
      setError(err.message)
      toast({
        variant: 'destructive',
        title: 'Error fetching gardens',
        description: err.message,
      })
    } finally {
      setLoading(false)
    }
  }

  const createGarden = async (gardenData: Omit<GardenProfile, 'id' | 'user_id'>) => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication required',
        description: 'You must be logged in to create a garden.',
      })
      return { error: new Error('Authentication required'), data: null }
    }

    try {
      const { data, error: insertError } = await supabase
        .from('garden_profiles')
        .insert({
          user_id: user.id,
          ...gardenData,
        })
        .select()

      if (insertError) {
        throw insertError
      }

      toast({
        title: 'Garden created',
        description: 'Your garden has been created successfully.',
      })

      // Refresh the gardens list
      fetchGardens()

      return { data, error: null }
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Error creating garden',
        description: err.message,
      })
      return { error: err, data: null }
    }
  }

  const updateGarden = async (id: string, gardenData: Partial<Omit<GardenProfile, 'id' | 'user_id'>>) => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication required',
        description: 'You must be logged in to update a garden.',
      })
      return { error: new Error('Authentication required'), data: null }
    }

    try {
      const { data, error: updateError } = await supabase
        .from('garden_profiles')
        .update(gardenData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()

      if (updateError) {
        throw updateError
      }

      toast({
        title: 'Garden updated',
        description: 'Your garden has been updated successfully.',
      })

      // Refresh the gardens list
      fetchGardens()

      return { data, error: null }
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Error updating garden',
        description: err.message,
      })
      return { error: err, data: null }
    }
  }

  const deleteGarden = async (id: string) => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication required',
        description: 'You must be logged in to delete a garden.',
      })
      return { error: new Error('Authentication required') }
    }

    try {
      const { error: deleteError } = await supabase
        .from('garden_profiles')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (deleteError) {
        throw deleteError
      }

      toast({
        title: 'Garden deleted',
        description: 'Your garden has been deleted successfully.',
      })

      // Refresh the gardens list
      fetchGardens()

      return { error: null }
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Error deleting garden',
        description: err.message,
      })
      return { error: err }
    }
  }

  useEffect(() => {
    fetchGardens()
  }, [user])

  return {
    gardens,
    loading,
    error,
    fetchGardens,
    createGarden,
    updateGarden,
    deleteGarden,
  }
}