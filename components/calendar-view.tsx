"use client"

import { useEffect, useState } from 'react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn, formatDate } from '@/lib/utils'
import { CircleAlert, CalendarDays, CheckCircle2 } from 'lucide-react'

interface CalendarEvent {
  date: Date;
  type: 'task' | 'alert' | 'planting';
  title: string;
  status?: string;
}

interface CalendarViewProps {
  tasks?: Array<{
    id: string;
    description: string;
    due_date: string;
    status: string;
  }>;
  alerts?: Array<{
    id: string;
    event_type: string;
    event_date: string;
  }>;
  plantings?: Array<{
    id: string;
    plant_name: string;
    planting_date: string;
  }>;
}

export default function CalendarView({ tasks = [], alerts = [], plantings = [] }: CalendarViewProps) {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(new Date())
  const [selectedDayEvents, setSelectedDayEvents] = useState<CalendarEvent[]>([])

  useEffect(() => {
    const allEvents: CalendarEvent[] = [
      ...tasks.map(task => ({
        date: new Date(task.due_date),
        type: 'task' as const,
        title: task.description,
        status: task.status
      })),
      ...alerts.map(alert => ({
        date: new Date(alert.event_date),
        type: 'alert' as const,
        title: alert.event_type
      })),
      ...plantings.map(planting => ({
        date: new Date(planting.planting_date),
        type: 'planting' as const,
        title: planting.plant_name
      }))
    ]
    
    setEvents(allEvents)
    
    if (selectedDay) {
      const filteredEvents = allEvents.filter(event => 
        event.date.toDateString() === selectedDay.toDateString()
      )
      setSelectedDayEvents(filteredEvents)
    }
  }, [tasks, alerts, plantings, selectedDay])

  const handleDayClick = (day: Date) => {
    setSelectedDay(day)
    const filteredEvents = events.filter(event => 
      event.date.toDateString() === day.toDateString()
    )
    setSelectedDayEvents(filteredEvents)
  }

  // Create a function to highlight days with events
  const getEventCounts = (date: Date) => {
    const dayEvents = events.filter(event => 
      event.date.toDateString() === date.toDateString()
    )
    
    return {
      tasks: dayEvents.filter(e => e.type === 'task').length,
      alerts: dayEvents.filter(e => e.type === 'alert').length,
      plantings: dayEvents.filter(e => e.type === 'planting').length,
    }
  }
  
  // Custom CSS for the day cells
  const dayClassName = (date: Date): string => {
    const dateStr = date.toISOString().split('T')[0];
    const hasEvents = tasks.some(task => task.due_date === dateStr) || 
                     plantings.some(plant => plant.planting_date === dateStr);
    return hasEvents ? 'has-events' : '';
  }

  // Custom day content to show indicators
  const dayContent = (date: Date) => {
    const counts = getEventCounts(date)
    
    return (
      <div className="relative w-full h-full">
        <div>{date.getDate()}</div>
        <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-1 pb-1">
          {counts.tasks > 0 && (
            <div className="h-1.5 w-1.5 bg-green-500 rounded-full" />
          )}
          {counts.alerts > 0 && (
            <div className="h-1.5 w-1.5 bg-red-500 rounded-full" />
          )}
          {counts.plantings > 0 && (
            <div className="h-1.5 w-1.5 bg-blue-500 rounded-full" />
          )}
        </div>
      </div>
    )
  }

  // Get event icon based on type
  const getEventIcon = (type: string, status?: string) => {
    if (type === 'task') {
      return status === 'completed' 
        ? <CheckCircle2 className="h-4 w-4 text-green-500" />
        : <CheckCircle2 className="h-4 w-4 text-gray-400" />
    }
    if (type === 'alert') {
      return <CircleAlert className="h-4 w-4 text-red-500" />
    }
    return <CalendarDays className="h-4 w-4 text-blue-500" />
  }

  // Get event color based on type
  const getEventColor = (type: string) => {
    if (type === 'task') return 'bg-green-100 text-green-800'
    if (type === 'alert') return 'bg-red-100 text-red-800'
    return 'bg-blue-100 text-blue-800'
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">Garden Calendar</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-7 divide-y md:divide-y-0 md:divide-x">
          <div className="col-span-1 md:col-span-4 p-4">
            <style jsx global>{`
              .rdp {
                --rdp-cell-size: 40px;
                --rdp-accent-color: #4CAF50;
                --rdp-background-color: #e6f7e6;
                --rdp-accent-color-dark: #388E3C;
                --rdp-background-color-dark: #1b4332;
                margin: 0;
              }
              .rdp-day_selected, .rdp-day_selected:focus-visible, .rdp-day_selected:hover {
                background-color: var(--rdp-accent-color);
                color: white;
              }
              .rdp-day.has-events:not(.rdp-day_selected) {
                border-bottom: 2px solid var(--rdp-accent-color);
              }
            `}</style>
            <DayPicker
              mode="single"
              selected={selectedDay}
              onSelect={(date) => date && handleDayClick(date)}
              modifiersClassNames={{
                selected: 'rdp-day_selected',
              }}
              modifiers={{
                hasEvents: (date) => {
                  const counts = getEventCounts(date)
                  return counts.tasks > 0 || counts.alerts > 0 || counts.plantings > 0
                }
              }}
              classNames={{
                day: dayClassName as unknown as string
              }}
              components={{
                DayContent: ({ date }) => dayContent(date)
              }}
              className="w-full"
            />
            <div className="flex justify-center gap-4 mt-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 bg-green-500 rounded-full" />
                <span>Tasks</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 bg-red-500 rounded-full" />
                <span>Alerts</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 bg-blue-500 rounded-full" />
                <span>Plantings</span>
              </div>
            </div>
          </div>
          <div className="col-span-1 md:col-span-3 p-4 bg-gray-50">
            <h3 className="font-medium mb-2">
              {selectedDay ? formatDate(selectedDay, 'MMMM d, yyyy') : 'Select a day'}
            </h3>
            <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
              {selectedDayEvents.length === 0 ? (
                <p className="text-gray-500 text-sm py-6 text-center">
                  No events scheduled for this day
                </p>
              ) : (
                selectedDayEvents.map((event, index) => (
                  <div key={index} className="flex items-start gap-2 bg-white p-2 rounded border">
                    {getEventIcon(event.type, event.status)}
                    <div>
                      <Badge className={cn("mb-1", getEventColor(event.type))}>
                        {event.type === 'task' ? 'Task' : event.type === 'alert' ? 'Alert' : 'Planting'}
                      </Badge>
                      <p className={cn("text-sm", event.status === 'completed' && 'line-through text-gray-500')}>
                        {event.title}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}