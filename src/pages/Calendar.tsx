import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, parseISO } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import useGardenStore from '../store/useGardenStore';
import EventCard from '../components/calendar/EventCard';

const Calendar: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const calendarEvents = useGardenStore(state => state.calendarEvents);
  const toggleEventCompleted = useGardenStore(state => state.toggleEventCompleted);
  
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };
  
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };
  
  const onDateClick = (day: Date) => {
    setSelectedDate(day);
  };
  
  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="p-2 rounded-full text-gray-600 hover:bg-gray-100"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h2 className="text-xl font-bold text-gray-900">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <button
          onClick={nextMonth}
          className="p-2 rounded-full text-gray-600 hover:bg-gray-100"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    );
  };
  
  const renderDays = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <div className="grid grid-cols-7 mb-2">
        {days.map(day => (
          <div key={day} className="text-sm font-medium text-gray-500 text-center py-2">
            {day}
          </div>
        ))}
      </div>
    );
  };
  
  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    
    const dateFormat = 'd';
    const rows: React.ReactNode[] = [];
    
    let days = eachDayOfInterval({ start: startDate, end: endDate });
    let formattedDays: React.ReactNode[] = [];
    
    days.forEach(day => {
      const formattedDate = format(day, dateFormat);
      
      // Check if there are events for this day
      const dayEvents = calendarEvents.filter(event => 
        isSameDay(parseISO(event.date), day)
      );
      
      const hasEvents = dayEvents.length > 0;
      const hasUncompletedEvents = dayEvents.some(event => !event.completed);
      
      formattedDays.push(
        <div
          key={day.toString()}
          onClick={() => onDateClick(day)}
          className={`h-14 sm:h-20 p-1 border border-gray-200 relative hover:bg-gray-50 cursor-pointer transition-colors ${
            !isSameMonth(day, monthStart) ? 'text-gray-400 bg-gray-50' : ''
          } ${isSameDay(day, selectedDate) ? 'bg-primary-50 hover:bg-primary-100 border-primary-300' : ''}`}
        >
          <div className="text-right">{formattedDate}</div>
          {hasEvents && (
            <div className="absolute bottom-1 left-1 flex flex-wrap gap-1">
              {hasUncompletedEvents && (
                <div className="h-2 w-2 rounded-full bg-primary-500"></div>
              )}
            </div>
          )}
        </div>
      );
    });
    
    // Group days into rows
    const daysInWeek = 7;
    for (let i = 0; i < formattedDays.length; i += daysInWeek) {
      rows.push(
        <div key={i} className="grid grid-cols-7">
          {formattedDays.slice(i, i + daysInWeek)}
        </div>
      );
    }
    
    return <div className="bg-white rounded-lg shadow">{rows}</div>;
  };
  
  // Get events for the selected date
  const selectedDateEvents = calendarEvents.filter(event => 
    isSameDay(parseISO(event.date), selectedDate)
  ).sort((a, b) => a.completed === b.completed ? 0 : a.completed ? 1 : -1);
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-primary-900">Garden Calendar</h1>
          <p className="text-gray-600 mt-2">
            Schedule and track all your gardening activities
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button className="btn btn-primary flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            New Task
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {renderHeader()}
          {renderDays()}
          {renderCells()}
        </div>
        
        <div>
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-medium mb-4">
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </h2>
            
            {selectedDateEvents.length > 0 ? (
              <div className="space-y-4">
                {selectedDateEvents.map(event => (
                  <EventCard 
                    key={event.id} 
                    event={event}
                    onToggle={toggleEventCompleted}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No events scheduled for this day</p>
                <button className="mt-4 btn btn-outline flex items-center mx-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;