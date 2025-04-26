"use client"

import { useState } from 'react'
import { formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, Circle, Filter } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/components/ui/use-toast'

interface Task {
  id: string;
  description: string;
  due_date: string;
  status: string;
  generated_by: string;
  user_plant_id: string;
  plant_name?: string;
}

interface TaskListProps {
  tasks: Task[];
  plantNames?: Record<string, string>;
  onTaskUpdate?: () => void;
}

export default function TaskList({ tasks, plantNames = {}, onTaskUpdate }: TaskListProps) {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all')
  const { toast } = useToast()

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'pending') return task.status !== 'completed';
    if (filter === 'completed') return task.status === 'completed';
    return true;
  });

  const updateTaskStatus = async (taskId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status })
        .eq('id', taskId);

      if (error) throw error;

      toast({
        title: "Task updated",
        description: status === 'completed' 
          ? "Task marked as completed" 
          : "Task marked as pending"
      });

      if (onTaskUpdate) onTaskUpdate();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating task",
        description: error.message
      });
    }
  };

  const getPlantName = (plantId: string) => {
    return plantNames[plantId] || 'Unknown plant';
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">Tasks</CardTitle>
          <Tabs defaultValue="all" className="w-auto" onValueChange={(value) => setFilter(value as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        {filteredTasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <CheckCircle2 className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No tasks found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <div 
                key={task.id} 
                className={`flex items-start gap-3 p-3 rounded-md ${
                  task.status === 'completed' ? 'bg-gray-50' : 'bg-white'
                }`}
              >
                <Checkbox
                  checked={task.status === 'completed'}
                  onCheckedChange={(checked) => {
                    updateTaskStatus(task.id, checked ? 'completed' : 'pending');
                  }}
                  className="mt-1"
                />
                <div className="flex-1 space-y-1">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                    <p className={`${task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                      {task.description}
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="outline" className="whitespace-nowrap text-xs">
                        Due: {formatDate(task.due_date, 'MMM d, yyyy')}
                      </Badge>
                      {task.plant_name || plantNames[task.user_plant_id] ? (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-200 text-xs">
                          {task.plant_name || getPlantName(task.user_plant_id)}
                        </Badge>
                      ) : null}
                    </div>
                  </div>
                  {task.generated_by && (
                    <p className="text-xs text-gray-500">
                      {task.generated_by === 'ai' ? 'AI-Generated' : task.generated_by}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}