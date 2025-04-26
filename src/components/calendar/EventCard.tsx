import React from 'react';
import { CalendarEvent } from '../../types';
import { format, parseISO } from 'date-fns';
import { Bed as Seed, Droplets, Shovel, Scissors, Apple } from 'lucide-react';

interface EventCardProps {
  event: CalendarEvent;
  onToggle: (id: string) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onToggle }) => {
  const getEventTypeIcon = () => {
    switch (event.type) {
      case 'planting':
        return <Seed className="h-5 w-5 text-primary-600" />;
      case 'watering':
        return <Droplets className="h-5 w-5 text-blue-500" />;
      case 'fertilizing':
        return <Shovel className="h-5 w-5 text-brown-600" />;
      case 'pruning':
        return <Scissors className="h-5 w-5 text-gray-600" />;
      case 'harvesting':
        return <Apple className="h-5 w-5 text-red-500" />;
      default:
        return <Seed className="h-5 w-5 text-primary-600" />;
    }
  };

  const getEventTypeColor = () => {
    switch (event.type) {
      case 'planting':
        return 'bg-primary-100 text-primary-800';
      case 'watering':
        return 'bg-blue-100 text-blue-800';
      case 'fertilizing':
        return 'bg-secondary-100 text-secondary-800';
      case 'pruning':
        return 'bg-gray-100 text-gray-800';
      case 'harvesting':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatEventDate = (dateString: string) => {
    return format(parseISO(dateString), 'EEE, MMM d');
  };

  return (
    <div className={`card transition-all duration-200 ${event.completed ? 'opacity-70' : ''}`}>
      <div className="p-4">
        <div className="flex items-start">
          <input 
            type="checkbox" 
            checked={event.completed} 
            onChange={() => onToggle(event.id)} 
            className="h-5 w-5 text-primary-600 rounded border-gray-300 focus:ring-primary-500 mt-1"
          />
          
          <div className="ml-3 flex-grow">
            <div className="flex items-center justify-between">
              <h3 className={`text-lg font-medium ${event.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                {event.title}
              </h3>
              <span className={`text-xs px-2 py-1 rounded-full flex items-center ${getEventTypeColor()}`}>
                <span className="mr-1">{getEventTypeIcon()}</span>
                {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
              </span>
            </div>
            
            <div className="mt-1">
              <p className="text-sm text-gray-600">{formatEventDate(event.date)}</p>
            </div>
            
            {event.description && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">{event.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;