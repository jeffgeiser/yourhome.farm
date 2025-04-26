// This file contains API utility functions for external service integrations

interface WeatherData {
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
}

export async function fetchWeatherData(location: string): Promise<WeatherData | null> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY;
    if (!apiKey) {
      console.error('OpenWeatherMap API key not found');
      return null;
    }

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        location
      )}&units=imperial&appid=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
}

export async function generateAITasks(gardenId: string, plantId: string): Promise<string[]> {
  // In a real implementation, this would call an edge function that uses OpenAI
  // For now, return sample tasks based on plant type
  const sampleTasks = [
    'Water your plant twice a week',
    'Check for pests on the leaves',
    'Add fertilizer monthly',
    'Prune any dead leaves or branches',
    'Check soil moisture level'
  ];
  
  return sampleTasks;
}

export async function checkForWeatherAlerts(location: string): Promise<{
  hasAlert: boolean;
  alertType?: string;
  temperature?: number;
}> {
  try {
    const weatherData = await fetchWeatherData(location);
    
    if (!weatherData) {
      return { hasAlert: false };
    }
    
    const tempF = weatherData.main.temp;
    
    // Check for extreme weather conditions
    if (tempF <= 32) {
      return { 
        hasAlert: true, 
        alertType: 'Frost',
        temperature: tempF
      };
    } else if (tempF >= 90) {
      return { 
        hasAlert: true, 
        alertType: 'Heat Wave',
        temperature: tempF
      };
    } else if (weatherData.wind.speed > 20) {
      return { 
        hasAlert: true, 
        alertType: 'High Winds' 
      };
    }
    
    return { hasAlert: false };
  } catch (error) {
    console.error('Error checking for weather alerts:', error);
    return { hasAlert: false };
  }
}