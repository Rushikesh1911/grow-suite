import { useState, useMemo } from 'react';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';
import { Plus, MoreHorizontal, MessageSquare, Paperclip, User, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';

type Task = {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  assignee?: {
    name: string;
    avatar?: string;
  };
  comments?: number;
  attachments?: number;
};

type Column = {
  id: string;
  title: string;
  color: string;
};

const COLUMNS: Column[] = [
  { id: 'todo', title: 'To Do', color: 'bg-blue-500' },
  { id: 'in-progress', title: 'In Progress', color: 'bg-yellow-500' },
  { id: 'in-review', title: 'In Review', color: 'bg-purple-500' },
  { id: 'done', title: 'Done', color: 'bg-green-500' },
];

const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Implement authentication',
    description: 'Set up user authentication with Firebase',
    status: 'in-progress',
    priority: 'high',
    dueDate: '2024-01-10',
    assignee: { name: 'JD', avatar: '' },
    comments: 3,
    attachments: 2,
  },
  {
    id: '2',
    title: 'Design dashboard layout',
    description: 'Create responsive dashboard UI components',
    status: 'todo',
    priority: 'medium',
    dueDate: '2024-01-12',
    assignee: { name: 'AK', avatar: '' },
  },
  {
    id: '3',
    title: 'API integration',
    description: 'Connect frontend with backend services',
    status: 'in-review',
    priority: 'high',
    dueDate: '2024-01-08',
    assignee: { name: 'RK', avatar: '' },
    comments: 5,
  },
  {
    id: '4',
    title: 'Write unit tests',
    description: 'Add test coverage for critical components',
    status: 'todo',
    priority: 'low',
    dueDate: '2024-01-15',
  },
];

export function KanbanBoard() {
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
        distance: 10,
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

    const isOverAColumn = COLUMNS.some((col) => col.id === over.id);
    if (isOverAColumn) {
      setActiveColumn(over.id as string);
    } else {
      setActiveColumn(null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    setActiveTask(null);
    setActiveColumn(null);

    const activeTask = tasks.find((t) => t.id === active.id);
    if (!activeTask) return;

    // If dropped on a column
    const isOverAColumn = COLUMNS.some((col) => col.id === over.id);
    if (isOverAColumn) {
      setTasks((tasks) =>
        tasks.map((task) =>
          task.id === active.id ? { ...task, status: over.id as string } : task
        )
      );
      return;
    }

    // If reordering within the same column
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300';
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
        <div className="flex h-full overflow-x-auto pb-6">
          <div className="flex space-x-4 px-4">
            {COLUMNS.map((column) => {
              const columnTasks = tasksByStatus[column.id] || [];
              return (
                <div key={column.id} className="w-80 flex-shrink-0">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full ${column.color} mr-2`} />
                      <h3 className="font-medium text-sm text-gray-700 dark:text-gray-300">
                        {column.title}
                      </h3>
                      <span className="ml-2 text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 rounded-full px-2 py-0.5">
                        {columnTasks.length}
                      </span>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex space-x-2">
                        <Input
                          placeholder="+ Add task"
                          className="h-8 text-sm"
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
                          className="h-8"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>

                    <SortableContext items={columnTasks.map((t) => t.id)}>
                      <div className="space-y-3">
                        {columnTasks.map((task) => (
                          <TaskCard key={task.id} task={task} />
                        ))}
                      </div>
                    </SortableContext>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {createPortal(
          <DragOverlay>
            {activeTask && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4 w-72">
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
                      <span>{activeTask.assignee.name}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
}

function TaskCard({ task }: { task: Task }) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800';
    }
  };

  return (
    <Card className="group hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-sm font-medium">{task.title}</CardTitle>
          <button className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {task.description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-2">
            {task.dueDate && (
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                <span>{new Date(task.dueDate).toLocaleDateString()}</span>
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

          <div className="flex items-center">
            {task.assignee && (
              <Avatar className="h-5 w-5 border border-white dark:border-gray-800">
                <AvatarImage src={task.assignee.avatar} />
                <AvatarFallback>
                  {task.assignee.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
