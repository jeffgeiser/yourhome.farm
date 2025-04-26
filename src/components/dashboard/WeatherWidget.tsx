import React from 'react';
import { WeatherForecast } from '../../types';
import { Cloud, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import WeatherCard from '../weather/WeatherCard';

interface WeatherWidgetProps {
  forecasts: WeatherForecast[];
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ forecasts }) => {
  // Just show the first 3 days of weather
  const displayForecasts = forecasts.slice(0, 3);
  
  return (
    <div className="card">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center">
          <Cloud className="h-5 w-5 text-primary-600" />
          <h3 className="ml-2 text-lg font-medium text-gray-900">Weather Forecast</h3>
        </div>
        <Link to="/weather" className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center">
          View All
          <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      </div>
      
      <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {displayForecasts.map((forecast, index) => (
          <WeatherCard 
            key={forecast.date} 
            forecast={forecast} 
            isToday={index === 0}
          />
        ))}
      </div>
    </div>
  );
};

export default WeatherWidget;