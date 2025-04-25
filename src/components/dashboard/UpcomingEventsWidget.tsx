import React from 'react';
import { CalendarEvent } from '../../types';
import { Calendar, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import EventCard from '../calendar/EventCard';
import useGardenStore from '../../store/useGardenStore';

interface UpcomingEventsWidgetProps {
  events: CalendarEvent[];
}

const UpcomingEventsWidget: React.FC<UpcomingEventsWidgetProps> = ({ events }) => {
  const toggleEventCompleted = useGardenStore(state => state.toggleEventCompleted);
  
  // Just show the next 3 events
  const displayEvents = events
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);
  
  return (
    <div className="card">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center">
          <Calendar className="h-5 w-5 text-primary-600" />
          <h3 className="ml-2 text-lg font-medium text-gray-900">Upcoming Tasks</h3>
        </div>
        <Link to="/calendar" className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center">
          View All
          <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      </div>
      
      <div className="p-4 space-y-4">
        {displayEvents.length > 0 ? (
          displayEvents.map((event) => (
            <EventCard 
              key={event.id} 
              event={event} 
              onToggle={toggleEventCompleted}
            />
          ))
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500">No upcoming events</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingEventsWidget;