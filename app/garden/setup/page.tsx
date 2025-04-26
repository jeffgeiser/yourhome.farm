'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { Database } from '@/types/supabase';

type GardenFormData = Database['public']['Tables']['gardens']['Insert'];

export default function GardenSetup() {
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();
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
      const { data, error } = await supabase
        .from('gardens')
        .insert([formData])
        .select();

      if (error) throw error;

      router.push('/garden');
    } catch (error) {
      console.error('Error creating garden:', error);
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