export interface Plant {
  id: string;
  name: string;
  type: PlantType;
  growthStage: GrowthStage;
  wateringSchedule: number; // days between watering
  sunlight: SunlightRequirement;
  soilType: SoilType;
  plantedDate: string;
  harvestDate?: string;
  notes?: string;
  imageUrl?: string;
}

export interface Garden {
  id: string;
  name: string;
  description?: string;
  location: string;
  size: {
    width: number;
    length: number;
    unit: 'ft' | 'm';
  };
  plants: PlantInGarden[];
  createdAt: string;
  updatedAt: string;
}

export interface PlantInGarden {
  plantId: string;
  position: {
    x: number;
    y: number;
  };
  status: PlantStatus;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  type: EventType;
  completed: boolean;
  gardenId: string;
  plantId?: string;
}

export interface WeatherAlert {
  id: string;
  type: WeatherAlertType;
  severity: 'low' | 'medium' | 'high';
  message: string;
  date: string;
  read: boolean;
}

export interface WeatherForecast {
  date: string;
  temperature: {
    min: number;
    max: number;
    unit: 'C' | 'F';
  };
  condition: WeatherCondition;
  precipitation: number; // percentage
  humidity: number; // percentage
  wind: {
    speed: number;
    unit: 'mph' | 'kph';
  };
}

export interface PlantRecommendation {
  plantId: string;
  score: number;
  reason: string;
}

export type PlantType = 'vegetable' | 'fruit' | 'herb' | 'flower' | 'shrub' | 'tree';
export type GrowthStage = 'seed' | 'seedling' | 'vegetative' | 'flowering' | 'fruiting' | 'harvesting';
export type SunlightRequirement = 'full-sun' | 'partial-sun' | 'partial-shade' | 'full-shade';
export type SoilType = 'clay' | 'sandy' | 'loamy' | 'chalky' | 'peaty';
export type PlantStatus = 'healthy' | 'stressed' | 'diseased' | 'dormant' | 'dead';
export type EventType = 'planting' | 'watering' | 'fertilizing' | 'pruning' | 'harvesting' | 'other';
export type WeatherAlertType = 'frost' | 'heat' | 'drought' | 'rain' | 'wind' | 'storm';
export type WeatherCondition = 'sunny' | 'partly-cloudy' | 'cloudy' | 'rainy' | 'stormy' | 'snowy';