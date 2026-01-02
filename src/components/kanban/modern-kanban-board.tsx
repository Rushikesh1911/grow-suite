import { useState, useMemo } from 'react';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';
import { Plus, MoreVertical, MessageSquare, Paperclip, User, Clock, CheckCircle, Circle, AlertCircle, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type Task = {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  labels?: string[];
  assignee?: {
    name: string;
    avatar?: string;
  };
  comments?: number;
  attachments?: number;
  completed?: boolean;
};

type Column = {
  id: string;
  title: string;
  color: string;
  icon: React.ReactNode;
};

const COLUMNS: Column[] = [
  { 
    id: 'todo', 
    title: 'To Do', 
    color: 'bg-blue-500',
    icon: <Circle className="h-3 w-3 text-blue-500" />
  },
  { 
    id: 'in-progress', 
    title: 'In Progress', 
    color: 'bg-yellow-500',
    icon: <div className="h-3 w-3 rounded-full bg-yellow-500 animate-pulse" />
  },
  { 
    id: 'in-review', 
    title: 'In Review', 
    color: 'bg-purple-500',
    icon: <AlertCircle className="h-3 w-3 text-purple-500" />
  },
  { 
    id: 'done', 
    title: 'Done', 
    color: 'bg-green-500',
    icon: <CheckCircle className="h-3 w-3 text-green-500" />
  },
];

const LABEL_COLORS = {
  design: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
  development: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  bug: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  feature: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  enhancement: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
};

const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Redesign dashboard layout',
    description: 'Update the dashboard with new components and improved UX',
    status: 'in-progress',
    priority: 'high',
    dueDate: '2024-01-10',
    labels: ['design', 'enhancement'],
    assignee: { name: 'Alex', avatar: '' },
    comments: 3,
    attachments: 2,
  },
  {
    id: '2',
    title: 'Implement user authentication',
    description: 'Set up secure login with email/password and social providers',
    status: 'todo',
    priority: 'high',
    dueDate: '2024-01-12',
    labels: ['development', 'feature'],
    assignee: { name: 'Jordan', avatar: '' },
  },
  {
    id: '3',
    title: 'Fix responsive issues',
    description: 'Address mobile layout problems on dashboard',
    status: 'in-review',
    priority: 'medium',
    dueDate: '2024-01-08',
    labels: ['bug', 'development'],
    assignee: { name: 'Taylor', avatar: '' },
    comments: 5,
  },
  {
    id: '4',
    title: 'Add dark mode toggle',
    description: 'Implement theme switching functionality',
    status: 'done',
    priority: 'medium',
    dueDate: '2024-01-05',
    labels: ['feature', 'enhancement'],
    completed: true,
  },
  {
    id: '5',
    title: 'Update documentation',
    description: 'Document new API endpoints and components',
    status: 'todo',
    priority: 'low',
    dueDate: '2024-01-15',
    labels: ['documentation'],
  },
];

export function ModernKanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [activeColumn, setActiveColumn] = useState<string | null>(null);

  const tasksByStatus = useMemo(() => {
    return tasks.reduce((acc, task) => {
      if (!acc[task.status]) {
        acc[task.status] = [];
      }
      acc[task.status].push(task);
      return acc;
    }, {} as Record<string, Task[]>);
  }, [tasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;
    setActiveColumn(over.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    setActiveTask(null);
    setActiveColumn(null);

    const activeTask = tasks.find((t) => t.id === active.id);
    if (!activeTask) return;

    if (active.id !== over.id) {
      setTasks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleAddTask = (status: string) => {
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: newTaskTitle,
      status,
      priority: 'medium',
    };

    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
  };

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed } 
        : task
    ));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800';
    }
  };

  return (
    <div className="h-full w-full overflow-hidden">
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex h-full overflow-x-auto pb-6 scrollbar-hide">
          <div className="flex space-x-4 px-4">
            {COLUMNS.map((column) => {
              const columnTasks = tasksByStatus[column.id] || [];
              return (
                <div key={column.id} className="w-80 flex-shrink-0">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      {column.icon}
                      <h3 className="font-medium text-sm text-gray-700 dark:text-gray-300">
                        {column.title}
                      </h3>
                      <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 rounded-full px-2 py-0.5">
                        {columnTasks.length}
                      </span>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <motion.div 
                      className="space-y-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Add a task..."
                          className="h-9 text-sm border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                          value={newTaskTitle}
                          onChange={(e) => setNewTaskTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleAddTask(column.id);
                            }
                          }}
                        />
                        <Button
                          size="sm"
                          onClick={() => handleAddTask(column.id)}
                          className="h-9 w-9 p-0"
                          variant="outline"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>

                    <AnimatePresence>
                      <SortableContext items={columnTasks.map((t) => t.id)}>
                        <div className="space-y-3">
                          {columnTasks.map((task) => (
                            <TaskCard 
                              key={task.id} 
                              task={task} 
                              onToggleComplete={toggleTaskCompletion}
                            />
                          ))}
                        </div>
                      </SortableContext>
                    </AnimatePresence>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {createPortal(
          <DragOverlay>
            {activeTask && (
              <motion.div 
                className="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 w-72"
                initial={{ scale: 0.95, opacity: 0.8 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.1 }}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-sm">{activeTask.title}</h4>
                  <Badge className={getPriorityColor(activeTask.priority)}>
                    {activeTask.priority}
                  </Badge>
                </div>
                {activeTask.description && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                    {activeTask.description}
                  </p>
                )}
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  {activeTask.dueDate && (
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{new Date(activeTask.dueDate).toLocaleDateString()}</span>
                    </div>
                  )}
                  {activeTask.assignee && (
                    <div className="flex items-center">
                      <Avatar className="h-5 w-5 mr-1">
                        <AvatarImage src={activeTask.assignee.avatar} />
                        <AvatarFallback>
                          {activeTask.assignee.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
}

function TaskCard({ 
  task, 
  onToggleComplete 
}: { 
  task: Task; 
  onToggleComplete: (id: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.15 }}
    >
      <Card className="group hover:shadow-md transition-all duration-200 border border-gray-100 dark:border-gray-700/50 hover:border-gray-200 dark:hover:border-gray-600 overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <button 
              onClick={() => onToggleComplete(task.id)}
              className={cn(
                "mt-0.5 flex-shrink-0 h-4 w-4 rounded border flex items-center justify-center transition-colors",
                task.completed 
                  ? "bg-blue-500 border-blue-500 text-white" 
                  : "border-gray-300 dark:border-gray-600 hover:border-blue-500"
              )}
            >
              {task.completed && <Check className="h-3 w-3" />}
            </button>
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <h4 className={cn(
                  "text-sm font-medium leading-snug",
                  task.completed && "line-through text-gray-400 dark:text-gray-500"
                )}>
                  {task.title}
                </h4>
                <button className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-opacity">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>

              {task.description && (
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                  {task.description}
                </p>
              )}

              {task.labels && task.labels.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {task.labels.map((label) => (
                    <span 
                      key={label} 
                      className={cn(
                        "text-xs px-2 py-0.5 rounded-full",
                        LABEL_COLORS[label as keyof typeof LABEL_COLORS] || 'bg-gray-100 text-gray-700 dark:bg-gray-800'
                      )}
                    >
                      {label}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100 dark:border-gray-700/50">
                <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-300">
                  {task.dueDate && (
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    </div>
                  )}
                  {task.comments > 0 && (
                    <div className="flex items-center">
                      <MessageSquare className="h-3 w-3 mr-1" />
                      <span>{task.comments}</span>
                    </div>
                  )}
                  {task.attachments > 0 && (
                    <div className="flex items-center">
                      <Paperclip className="h-3 w-3 mr-1" />
                      <span>{task.attachments}</span>
                    </div>
                  )}
                </div>

                {task.assignee && (
                  <Avatar className="h-6 w-6 border-2 border-white dark:border-gray-800">
                    <AvatarImage src={task.assignee.avatar} />
                    <AvatarFallback className="text-xs">
                      {task.assignee.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
