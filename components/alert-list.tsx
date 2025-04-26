"use client"

import { formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BellRing, Thermometer, Droplets, Wind, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/components/ui/use-toast'

interface Alert {
  id: string;
  garden_profile_id: string;
  event_type: string;
  event_date: string;
  created_date: string;
  status: string;
  garden_name?: string;
}

interface AlertListProps {
  alerts: Alert[];
  gardenNames?: Record<string, string>;
  onAlertUpdate?: () => void;
}

export default function AlertList({ alerts, gardenNames = {}, onAlertUpdate }: AlertListProps) {
  const { toast } = useToast()

  const getAlertIcon = (eventType: string) => {
    switch (eventType.toLowerCase()) {
      case 'frost':
        return <Thermometer className="h-4 w-4 text-blue-500" />;
      case 'heat wave':
        return <Thermometer className="h-4 w-4 text-red-500" />;
      case 'drought':
        return <Droplets className="h-4 w-4 text-orange-500" />;
      case 'high winds':
        return <Wind className="h-4 w-4 text-purple-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getAlertColor = (eventType: string) => {
    switch (eventType.toLowerCase()) {
      case 'frost':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'heat wave':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'drought':
        return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
      case 'high winds':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
      default:
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
    }
  };

  const dismissAlert = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('alerts')
        .update({ status: 'dismissed' })
        .eq('id', alertId);

      if (error) throw error;

      toast({
        title: "Alert dismissed",
        description: "The alert has been dismissed"
      });

      if (onAlertUpdate) onAlertUpdate();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error dismissing alert",
        description: error.message
      });
    }
  };

  const getGardenName = (gardenId: string) => {
    return gardenNames[gardenId] || 'Unknown garden';
  };

  // Only show active alerts
  const activeAlerts = alerts.filter(alert => alert.status !== 'dismissed');

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center gap-2">
          <BellRing className="h-5 w-5" /> 
          Weather Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activeAlerts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <BellRing className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No active alerts</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeAlerts.map((alert) => (
              <div 
                key={alert.id} 
                className="border rounded-md p-3 bg-white shadow-sm"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge className={getAlertColor(alert.event_type)}>
                        <span className="flex items-center gap-1">
                          {getAlertIcon(alert.event_type)}
                          {alert.event_type}
                        </span>
                      </Badge>
                      <Badge variant="outline" className="capitalize">
                        {alert.garden_name || getGardenName(alert.garden_profile_id)}
                      </Badge>
                    </div>
                    <p className="text-gray-800">
                      Protect your plants from {alert.event_type.toLowerCase()} on {formatDate(alert.event_date, 'MMM d, yyyy')}
                    </p>
                    <p className="text-xs text-gray-500">
                      Alert created on {formatDate(alert.created_date, 'MMM d, yyyy')}
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => dismissAlert(alert.id)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Dismiss
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}