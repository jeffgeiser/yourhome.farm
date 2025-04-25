import React from 'react';
import { Bell, MapPin } from 'lucide-react';
import useGardenStore from '../store/useGardenStore';
import WeatherCard from '../components/weather/WeatherCard';

const Weather: React.FC = () => {
  const weatherForecast = useGardenStore(state => state.weatherForecast);
  const weatherAlerts = useGardenStore(state => state.weatherAlerts);
  const markAlertAsRead = useGardenStore(state => state.markAlertAsRead);
  const clearAllAlerts = useGardenStore(state => state.clearAllAlerts);
  
  // Display all alerts, but give unread alerts priority
  const sortedAlerts = [...weatherAlerts].sort((a, b) => {
    if (a.read === b.read) return 0;
    return a.read ? 1 : -1;
  });
  
  const getAlertSeverityClass = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-warning-50 border-warning-300';
      case 'medium': return 'bg-accent-50 border-accent-300';
      case 'high': return 'bg-error-50 border-error-300';
      default: return 'bg-warning-50 border-warning-300';
    }
  };
  
  const getAlertTextClass = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-warning-800';
      case 'medium': return 'text-accent-800';
      case 'high': return 'text-error-800';
      default: return 'text-warning-800';
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-primary-900">Weather Forecast</h1>
        <div className="flex items-center text-gray-600 mt-2">
          <MapPin className="h-4 w-4 mr-1" />
          <p>Garden City, CA</p>
        </div>
      </div>
      
      {/* Alerts Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Bell className="h-5 w-5 text-primary-600 mr-2" />
            <h2 className="text-xl font-medium text-gray-900">Weather Alerts</h2>
          </div>
          {weatherAlerts.some(alert => !alert.read) && (
            <button
              onClick={clearAllAlerts}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              Mark All as Read
            </button>
          )}
        </div>
        
        {sortedAlerts.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {sortedAlerts.map(alert => (
              <div 
                key={alert.id}
                className={`p-4 rounded-lg border ${getAlertSeverityClass(alert.severity)} ${
                  alert.read ? 'opacity-60' : 'animate-pulse-slow'
                }`}
              >
                <div className="flex justify-between">
                  <h3 className={`font-medium ${getAlertTextClass(alert.severity)}`}>
                    {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)} Warning
                  </h3>
                  {!alert.read && (
                    <button
                      onClick={() => markAlertAsRead(alert.id)}
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      Dismiss
                    </button>
                  )}
                </div>
                <p className={`mt-1 ${getAlertTextClass(alert.severity)}`}>{alert.message}</p>
                <p className="mt-2 text-sm text-gray-600">Effective: {alert.date}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No weather alerts at this time</p>
          </div>
        )}
      </div>
      
      {/* 7-Day Forecast */}
      <div>
        <h2 className="text-xl font-medium text-gray-900 mb-4">7-Day Forecast</h2>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {weatherForecast.map((forecast, index) => (
            <WeatherCard 
              key={forecast.date} 
              forecast={forecast} 
              isToday={index === 0}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Weather;