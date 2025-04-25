import React from 'react';
import useGardenStore from '../store/useGardenStore';
import WeatherAlertWidget from '../components/dashboard/WeatherAlertWidget';
import WeatherWidget from '../components/dashboard/WeatherWidget';
import UpcomingEventsWidget from '../components/dashboard/UpcomingEventsWidget';
import GardensWidget from '../components/dashboard/GardensWidget';
import RecommendationsWidget from '../components/dashboard/RecommendationsWidget';

const Dashboard: React.FC = () => {
  const weatherAlerts = useGardenStore(state => state.weatherAlerts);
  const weatherForecast = useGardenStore(state => state.weatherForecast);
  const calendarEvents = useGardenStore(state => state.calendarEvents);
  const gardens = useGardenStore(state => state.gardens);
  const plants = useGardenStore(state => state.plants);
  
  // Get upcoming events (not completed and sorted by date)
  const upcomingEvents = calendarEvents
    .filter(event => !event.completed)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-primary-900">Welcome to Your Garden</h1>
        <p className="text-gray-600 mt-2">
          Track your garden progress, get personalized recommendations, and never miss a planting date.
        </p>
      </div>
      
      {/* Weather Alerts */}
      <WeatherAlertWidget alerts={weatherAlerts} />
      
      {/* Main Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Gardens */}
        <div className="lg:col-span-1 space-y-6">
          <GardensWidget gardens={gardens} />
        </div>
        
        {/* Right Column - Weather, Events, Recommendations */}
        <div className="lg:col-span-2 space-y-6">
          <WeatherWidget forecasts={weatherForecast} />
          <UpcomingEventsWidget events={upcomingEvents} />
          <RecommendationsWidget />
        </div>
      </div>
      
      {/* Summary Stats */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <p className="text-sm text-gray-600">Total Gardens</p>
          <p className="text-2xl font-bold text-primary-700">{gardens.length}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-gray-600">Plants Growing</p>
          <p className="text-2xl font-bold text-primary-700">{plants.length}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-gray-600">Upcoming Tasks</p>
          <p className="text-2xl font-bold text-primary-700">{upcomingEvents.length}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-gray-600">Weather Alerts</p>
          <p className="text-2xl font-bold text-primary-700">{weatherAlerts.filter(a => !a.read).length}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;