'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProfileDropdown } from '@/app/components/profile-dropdown';
import { Database } from '@/types/supabase';
import { useToast } from '@/components/ui/use-toast';

type GardenFormData = Database['public']['Tables']['gardens']['Insert'];

export default function GardenSetup() {
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<GardenFormData>({
    name: '',
    description: '',
    location: '',
    size: 0,
    soil_type: '',
    sunlight_exposure: '',
    water_source: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate form data
      if (!formData.name.trim()) {
        throw new Error('Garden name is required');
      }
      if (!formData.location.trim()) {
        throw new Error('Location is required');
      }
      if (formData.size <= 0) {
        throw new Error('Size must be greater than 0');
      }
      if (!formData.soil_type.trim()) {
        throw new Error('Soil type is required');
      }
      if (!formData.sunlight_exposure.trim()) {
        throw new Error('Sunlight exposure is required');
      }
      if (!formData.water_source.trim()) {
        throw new Error('Water source is required');
      }

      const { data, error } = await supabase
        .from('gardens')
        .insert([formData])
        .select();

      if (error) {
        throw error;
      }

      toast({
        title: 'Success!',
        description: 'Your garden has been created successfully.',
      });

      router.push('/garden');
    } catch (error: any) {
      console.error('Error creating garden:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create garden. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <header className="border-b bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-2xl font-bold text-green-800">YourHome.Farm</h1>
          <ProfileDropdown />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-green-800">
              Set Up Your Garden
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Garden Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="size">Size (square feet)</Label>
                <Input
                  id="size"
                  type="number"
                  min="1"
                  value={formData.size}
                  onChange={(e) =>
                    setFormData({ ...formData, size: Number(e.target.value) })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="soil_type">Soil Type</Label>
                <Input
                  id="soil_type"
                  value={formData.soil_type}
                  onChange={(e) =>
                    setFormData({ ...formData, soil_type: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sunlight_exposure">Sunlight Exposure</Label>
                <Input
                  id="sunlight_exposure"
                  value={formData.sunlight_exposure}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sunlight_exposure: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="water_source">Water Source</Label>
                <Input
                  id="water_source"
                  value={formData.water_source}
                  onChange={(e) =>
                    setFormData({ ...formData, water_source: e.target.value })
                  }
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Creating...' : 'Create Garden'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
} 