import React from 'react';
import { WeatherAlert } from '../../types';
import { AlertTriangle, X } from 'lucide-react';
import useGardenStore from '../../store/useGardenStore';

interface WeatherAlertWidgetProps {
  alerts: WeatherAlert[];
}

const WeatherAlertWidget: React.FC<WeatherAlertWidgetProps> = ({ alerts }) => {
  const markAlertAsRead = useGardenStore(state => state.markAlertAsRead);
  const clearAllAlerts = useGardenStore(state => state.clearAllAlerts);
  
  if (alerts.filter(alert => !alert.read).length === 0) {
    return null;
  }
  
  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-warning-50 border-warning-300 text-warning-800';
      case 'medium': return 'bg-accent-50 border-accent-300 text-accent-800';
      case 'high': return 'bg-error-50 border-error-300 text-error-800';
      default: return 'bg-warning-50 border-warning-300 text-warning-800';
    }
  };
  
  const getAlertIconColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-warning-500';
      case 'medium': return 'text-accent-500';
      case 'high': return 'text-error-500';
      default: return 'text-warning-500';
    }
  };
  
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-medium text-gray-900">Weather Alerts</h3>
        <button
          onClick={clearAllAlerts}
          className="text-sm text-primary-600 hover:text-primary-700"
        >
          Dismiss All
        </button>
      </div>
      
      <div className="space-y-3">
        {alerts.filter(alert => !alert.read).map((alert) => (
          <div 
            key={alert.id} 
            className={`p-3 rounded-lg border ${getAlertColor(alert.severity)} flex items-start animate-fade-in`}
          >
            <AlertTriangle className={`h-5 w-5 ${getAlertIconColor(alert.severity)} mt-0.5`} />
            <div className="ml-3 flex-grow">
              <div className="flex justify-between">
                <p className="font-medium">
                  {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)} Alert
                </p>
                <button 
                  onClick={() => markAlertAsRead(alert.id)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="text-sm mt-1">{alert.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherAlertWidget;