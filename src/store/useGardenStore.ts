import { create } from 'zustand';
import { Garden, Plant, CalendarEvent, WeatherAlert, WeatherForecast } from '../types';
import { plants, gardens, calendarEvents, weatherAlerts, weatherForecast } from '../data/mockData';

interface GardenStore {
  // Garden data
  plants: Plant[];
  gardens: Garden[];
  calendarEvents: CalendarEvent[];
  weatherAlerts: WeatherAlert[];
  weatherForecast: WeatherForecast[];
  
  // Garden actions
  addPlant: (plant: Plant) => void;
  updatePlant: (id: string, updates: Partial<Plant>) => void;
  deletePlant: (id: string) => void;
  
  addGarden: (garden: Garden) => void;
  updateGarden: (id: string, updates: Partial<Garden>) => void;
  deleteGarden: (id: string) => void;
  
  addCalendarEvent: (event: CalendarEvent) => void;
  updateCalendarEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  deleteCalendarEvent: (id: string) => void;
  toggleEventCompleted: (id: string) => void;
  
  markAlertAsRead: (id: string) => void;
  clearAllAlerts: () => void;
  
  // UI state
  selectedGardenId: string | null;
  selectGarden: (id: string | null) => void;
}

const useGardenStore = create<GardenStore>((set) => ({
  // Initialize with mock data
  plants,
  gardens,
  calendarEvents,
  weatherAlerts,
  weatherForecast,
  
  // Garden actions
  addPlant: (plant) => set((state) => ({ 
    plants: [...state.plants, plant] 
  })),
  
  updatePlant: (id, updates) => set((state) => ({ 
    plants: state.plants.map(plant => 
      plant.id === id ? { ...plant, ...updates } : plant
    )
  })),
  
  deletePlant: (id) => set((state) => ({ 
    plants: state.plants.filter(plant => plant.id !== id) 
  })),
  
  addGarden: (garden) => set((state) => ({ 
    gardens: [...state.gardens, garden] 
  })),
  
  updateGarden: (id, updates) => set((state) => ({ 
    gardens: state.gardens.map(garden => 
      garden.id === id ? { ...garden, ...updates } : garden
    )
  })),
  
  deleteGarden: (id) => set((state) => ({ 
    gardens: state.gardens.filter(garden => garden.id !== id) 
  })),
  
  addCalendarEvent: (event) => set((state) => ({ 
    calendarEvents: [...state.calendarEvents, event] 
  })),
  
  updateCalendarEvent: (id, updates) => set((state) => ({ 
    calendarEvents: state.calendarEvents.map(event => 
      event.id === id ? { ...event, ...updates } : event
    )
  })),
  
  deleteCalendarEvent: (id) => set((state) => ({ 
    calendarEvents: state.calendarEvents.filter(event => event.id !== id) 
  })),
  
  toggleEventCompleted: (id) => set((state) => ({ 
    calendarEvents: state.calendarEvents.map(event => 
      event.id === id ? { ...event, completed: !event.completed } : event
    )
  })),
  
  markAlertAsRead: (id) => set((state) => ({ 
    weatherAlerts: state.weatherAlerts.map(alert => 
      alert.id === id ? { ...alert, read: true } : alert
    )
  })),
  
  clearAllAlerts: () => set((state) => ({ 
    weatherAlerts: state.weatherAlerts.map(alert => ({ ...alert, read: true }))
  })),
  
  // UI state
  selectedGardenId: gardens.length > 0 ? gardens[0].id : null,
  selectGarden: (id) => set({ selectedGardenId: id }),
}));

export default useGardenStore;