import { Plant, Garden, CalendarEvent, WeatherAlert, WeatherForecast, PlantRecommendation, WeatherCondition } from '../types';
import { addDays, format } from 'date-fns';

// Mock Plants Data
export const plants: Plant[] = [
  {
    id: '1',
    name: 'Tomato - Roma',
    type: 'vegetable',
    growthStage: 'vegetative',
    wateringSchedule: 3,
    sunlight: 'full-sun',
    soilType: 'loamy',
    plantedDate: '2025-03-15',
    harvestDate: '2025-07-15',
    notes: 'Doing well, but watch for signs of blight during rainy periods.',
    imageUrl: 'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg',
  },
  {
    id: '2',
    name: 'Basil - Sweet',
    type: 'herb',
    growthStage: 'vegetative',
    wateringSchedule: 2,
    sunlight: 'partial-sun',
    soilType: 'loamy',
    plantedDate: '2025-03-20',
    notes: 'Pinch off flower buds to encourage leaf growth.',
    imageUrl: 'https://images.pexels.com/photos/1526202/pexels-photo-1526202.jpeg',
  },
  {
    id: '3',
    name: 'Carrot - Nantes',
    type: 'vegetable',
    growthStage: 'vegetative',
    wateringSchedule: 4,
    sunlight: 'full-sun',
    soilType: 'sandy',
    plantedDate: '2025-03-10',
    harvestDate: '2025-06-10',
    notes: 'Thin seedlings to 2 inches apart when they reach 2 inches tall.',
    imageUrl: 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg',
  },
  {
    id: '4',
    name: 'Sunflower - Mammoth',
    type: 'flower',
    growthStage: 'seedling',
    wateringSchedule: 5,
    sunlight: 'full-sun',
    soilType: 'loamy',
    plantedDate: '2025-04-01',
    notes: 'Stake as they grow taller to prevent wind damage.',
    imageUrl: 'https://images.pexels.com/photos/33044/sunflower-sun-summer-yellow.jpg',
  },
];

// Mock Gardens Data
export const gardens: Garden[] = [
  {
    id: '1',
    name: 'Backyard Veggie Patch',
    description: 'My main vegetable garden with raised beds.',
    location: 'Backyard - South Side',
    size: {
      width: 10,
      length: 15,
      unit: 'ft',
    },
    plants: [
      { plantId: '1', position: { x: 2, y: 3 }, status: 'healthy' },
      { plantId: '2', position: { x: 4, y: 3 }, status: 'healthy' },
      { plantId: '3', position: { x: 6, y: 3 }, status: 'healthy' },
    ],
    createdAt: '2025-02-15',
    updatedAt: '2025-04-01',
  },
  {
    id: '2',
    name: 'Front Yard Flower Bed',
    description: 'Ornamental garden visible from the street.',
    location: 'Front Yard',
    size: {
      width: 4,
      length: 12,
      unit: 'ft',
    },
    plants: [
      { plantId: '4', position: { x: 2, y: 2 }, status: 'healthy' },
    ],
    createdAt: '2025-03-01',
    updatedAt: '2025-04-01',
  },
];

// Generate Calendar Events for the next 30 days
export const calendarEvents: CalendarEvent[] = [];

// Add some seeded events
const baseEvents = [
  {
    id: '1',
    title: 'Plant Summer Squash',
    description: 'Plant summer squash seeds in the back corner of the garden.',
    date: format(addDays(new Date(), 3), 'yyyy-MM-dd'),
    type: 'planting' as const,
    completed: false,
    gardenId: '1',
  },
  {
    id: '2',
    title: 'Water Tomatoes',
    description: 'Water tomato plants deeply.',
    date: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
    type: 'watering' as const,
    completed: false,
    gardenId: '1',
    plantId: '1',
  },
  {
    id: '3',
    title: 'Fertilize Herbs',
    description: 'Apply organic fertilizer to herb garden.',
    date: format(addDays(new Date(), 5), 'yyyy-MM-dd'),
    type: 'fertilizing' as const,
    completed: false,
    gardenId: '1',
    plantId: '2',
  },
  {
    id: '4',
    title: 'Harvest Early Carrots',
    description: 'Check and harvest any carrots that are ready.',
    date: format(addDays(new Date(), 14), 'yyyy-MM-dd'),
    type: 'harvesting' as const,
    completed: false,
    gardenId: '1',
    plantId: '3',
  },
];

calendarEvents.push(...baseEvents);

// Add water reminders for the next 3 weeks
plants.forEach(plant => {
  let currentDate = new Date();
  
  for (let i = 0; i < 3; i++) {
    currentDate = addDays(currentDate, plant.wateringSchedule);
    
    calendarEvents.push({
      id: `water-${plant.id}-${i}`,
      title: `Water ${plant.name}`,
      description: `Regular watering schedule for ${plant.name}`,
      date: format(currentDate, 'yyyy-MM-dd'),
      type: 'watering',
      completed: false,
      gardenId: gardens.find(g => g.plants.some(p => p.plantId === plant.id))?.id || '1',
      plantId: plant.id,
    });
  }
});

// Mock Weather Alerts
export const weatherAlerts: WeatherAlert[] = [
  {
    id: '1',
    type: 'frost',
    severity: 'medium',
    message: 'Overnight frost expected. Protect sensitive plants.',
    date: format(addDays(new Date(), 5), 'yyyy-MM-dd'),
    read: false,
  },
  {
    id: '2',
    type: 'rain',
    severity: 'low',
    message: 'Heavy rain expected. Check drainage in garden beds.',
    date: format(addDays(new Date(), 2), 'yyyy-MM-dd'),
    read: false,
  },
];

// Mock Weather Forecast
export const weatherForecast: WeatherForecast[] = Array.from({ length: 7 }, (_, i) => {
  const date = addDays(new Date(), i);
  
  // Create different weather patterns
  let condition: WeatherCondition = 'sunny';
  let precipProbability = 0;
  
  if (i === 1 || i === 2) {
    condition = 'rainy';
    precipProbability = 70;
  } else if (i === 4) {
    condition = 'partly-cloudy';
    precipProbability = 20;
  } else if (i === 6) {
    condition = 'cloudy';
    precipProbability = 30;
  }
  
  return {
    date: format(date, 'yyyy-MM-dd'),
    temperature: {
      min: Math.floor(60 + Math.random() * 5),
      max: Math.floor(75 + Math.random() * 10),
      unit: 'F',
    },
    condition,
    precipitation: precipProbability,
    humidity: Math.floor(50 + Math.random() * 40),
    wind: {
      speed: Math.floor(5 + Math.random() * 15),
      unit: 'mph',
    },
  };
});

// Mock Plant Recommendations
export const plantRecommendations: PlantRecommendation[] = [
  {
    plantId: 'rec1',
    score: 95,
    reason: 'Based on your soil type and sun exposure, lettuce varieties would thrive in your garden.',
  },
  {
    plantId: 'rec2',
    score: 90,
    reason: 'Your climate is perfect for growing peppers during this season.',
  },
  {
    plantId: 'rec3',
    score: 85,
    reason: 'Companion planting suggestion: marigolds near your tomatoes will help repel pests.',
  },
];