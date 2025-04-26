import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Pencil, Plane as Plant, Sun, CloudRain, Cloud } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface GardenCardProps {
  garden: {
    id: string;
    name: string;
    size: string;
    location: string;
    sunlight: string;
    goals: string[];
    soil_type: string;
  };
  plantCount?: number;
}

export default function GardenCard({ garden, plantCount = 0 }: GardenCardProps) {
  const getSunlightIcon = (sunlight: string) => {
    switch (sunlight) {
      case 'full-sun':
        return <Sun className="h-5 w-5 text-amber-500" />;
      case 'partial-shade':
        return <Cloud className="h-5 w-5 text-gray-500" />;
      case 'shade':
        return <CloudRain className="h-5 w-5 text-blue-500" />;
      default:
        return <Sun className="h-5 w-5 text-amber-500" />;
    }
  };

  const getSunlightText = (sunlight: string) => {
    switch (sunlight) {
      case 'full-sun':
        return 'Full Sun';
      case 'partial-shade':
        return 'Partial Shade';
      case 'shade':
        return 'Shade';
      default:
        return sunlight;
    }
  };

  return (
    <Card className="w-full h-full overflow-hidden transition-all duration-200 hover:shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold">{garden.name}</CardTitle>
          <Link href={`/garden_setup/${garden.id}/edit`}>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
          </Link>
        </div>
        <CardDescription>{garden.size}</CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex gap-1 items-center">
              {getSunlightIcon(garden.sunlight)}
              <span>{getSunlightText(garden.sunlight)}</span>
            </Badge>
            <Badge variant="outline" className="flex gap-1 items-center">
              <Plant className="h-3.5 w-3.5" />
              <span>{plantCount} Plants</span>
            </Badge>
          </div>
          <div className="flex flex-wrap gap-1">
            {garden.goals.slice(0, 3).map((goal) => (
              <Badge key={goal} variant="secondary" className="capitalize">
                {goal}
              </Badge>
            ))}
            {garden.goals.length > 3 && (
              <Badge variant="secondary">+{garden.goals.length - 3}</Badge>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-4">
        <Button asChild className="w-full bg-[#007BFF] hover:bg-blue-700 text-white font-bold">
          <Link href={`/plant_management?garden=${garden.id}`}>
            Manage Plants
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}