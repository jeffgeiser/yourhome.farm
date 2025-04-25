import React from 'react';
import { WeatherForecast, WeatherCondition } from '../../types';
import { Sun, Cloud, CloudRain, CloudLightning, CloudSnow, CloudDrizzle } from 'lucide-react';
import { format } from 'date-fns';

interface WeatherCardProps {
  forecast: WeatherForecast;
  isToday?: boolean;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ forecast, isToday = false }) => {
  const getWeatherIcon = (condition: WeatherCondition) => {
    switch (condition) {
      case 'sunny':
        return <Sun className="h-8 w-8 text-yellow-500" />;
      case 'partly-cloudy':
        return <Cloud className="h-8 w-8 text-gray-400" />;
      case 'cloudy':
        return <Cloud className="h-8 w-8 text-gray-500" />;
      case 'rainy':
        return <CloudRain className="h-8 w-8 text-blue-500" />;
      case 'stormy':
        return <CloudLightning className="h-8 w-8 text-purple-500" />;
      case 'snowy':
        return <CloudSnow className="h-8 w-8 text-blue-200" />;
      default:
        return <CloudDrizzle className="h-8 w-8 text-blue-400" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isToday) return 'Today';
    return format(date, 'EEE, MMM d');
  };

  const getWeatherDescription = (condition: WeatherCondition) => {
    switch (condition) {
      case 'sunny': return 'Sunny';
      case 'partly-cloudy': return 'Partly Cloudy';
      case 'cloudy': return 'Cloudy';
      case 'rainy': return 'Rainy';
      case 'stormy': return 'Stormy';
      case 'snowy': return 'Snowy';
      default: return 'Unknown';
    }
  };

  const getGardeningTip = (forecast: WeatherForecast) => {
    const { condition, precipitation, temperature } = forecast;
    
    if (condition === 'rainy' && precipitation > 50) {
      return "Heavy rain expected. Check drainage in garden beds.";
    } else if (condition === 'sunny' && temperature.max > 85) {
      return "Hot day ahead. Water plants early in the morning.";
    } else if (condition === 'partly-cloudy' && precipitation < 20) {
      return "Good day for garden maintenance.";
    } else if (condition === 'cloudy') {
      return "Ideal conditions for transplanting seedlings.";
    } else {
      return "Monitor soil moisture levels.";
    }
  };

  return (
    <div className={`card transition-all duration-300 hover:shadow-lg ${isToday ? 'border-2 border-primary-400' : ''}`}>
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className={`font-medium ${isToday ? 'text-primary-700' : 'text-gray-700'}`}>
            {formatDate(forecast.date)}
          </h3>
          <div className="flex items-center">
            {getWeatherIcon(forecast.condition)}
          </div>
        </div>
        
        <div className="mt-2">
          <p className="text-sm text-gray-600 mb-1">{getWeatherDescription(forecast.condition)}</p>
          <p className="text-lg font-semibold">
            {forecast.temperature.max}° <span className="text-sm text-gray-500">/ {forecast.temperature.min}°</span>
          </p>
          
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-600">
            <div>
              <p>Precipitation</p>
              <p className="font-medium">{forecast.precipitation}%</p>
            </div>
            <div>
              <p>Humidity</p>
              <p className="font-medium">{forecast.humidity}%</p>
            </div>
            <div>
              <p>Wind</p>
              <p className="font-medium">{forecast.wind.speed} {forecast.wind.unit}</p>
            </div>
          </div>
        </div>
        
        {isToday && (
          <div className="mt-4 p-2 bg-primary-50 rounded-md border border-primary-100">
            <p className="text-xs text-primary-800">
              <span className="font-semibold">Garden Tip: </span>
              {getGardeningTip(forecast)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherCard;