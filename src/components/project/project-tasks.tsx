import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, CheckCircle, Clock, AlertCircle, Check, MoreVertical } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Task {
  id: string;
  title: string;
  status: 'todo' | 'in-progress' | 'done' | 'blocked';
  priority: 'low' | 'medium' | 'high';
  assignee?: {
    name: string;
    avatar?: string;
  };
  dueDate?: string;
}

// Mock data - replace with actual data fetching
const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Design new homepage layout',
    status: 'in-progress',
    priority: 'high',
    assignee: { name: 'Sam Wilson' },
    dueDate: '2024-03-15',
  },
  {
    id: '2',
    title: 'Implement user authentication',
    status: 'done',
    priority: 'high',
    assignee: { name: 'Jordan Lee' },
  },
  {
    id: '3',
    title: 'Create API endpoints for dashboard',
    status: 'in-progress',
    priority: 'medium',
    assignee: { name: 'Taylor Smith' },
    dueDate: '2024-03-20',
  },
  {
    id: '4',
    title: 'Write unit tests',
    status: 'todo',
    priority: 'medium',
  },
  {
    id: '5',
    title: 'Update documentation',
    status: 'todo',
    priority: 'low',
  },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'done':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'in-progress':
      return <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />;
    case 'blocked':
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    default:
      return <Clock className="h-4 w-4 text-muted-foreground" />;
  }
};

const getPriorityVariant = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'destructive';
    case 'medium':
      return 'secondary';
    default:
      return 'outline';
  }
};

export function ProjectTasks({ projectId }: { projectId: string }) {
  const tasksByStatus = {
    todo: mockTasks.filter((task) => task.status === 'todo'),
    'in-progress': mockTasks.filter((task) => task.status === 'in-progress'),
    done: mockTasks.filter((task) => task.status === 'done'),
  };

  const totalTasks = mockTasks.length;
  const completedTasks = tasksByStatus.done.length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Tasks</CardTitle>
        <Button variant="outline" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium">
              {completedTasks} of {totalTasks} tasks completed
            </span>
            <span className="text-sm text-muted-foreground">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="space-y-4">
          {mockTasks.slice(0, 5).map((task) => (
            <div key={task.id} className="flex items-start rounded-lg border p-3 hover:bg-accent/50 transition-colors">
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  checked={task.status === 'done'}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
              </div>
              <div className="ml-3 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{task.title}</p>
                  <div className="flex items-center space-x-2">
                    {task.dueDate && (
                      <span className="text-xs text-muted-foreground">
                        Due {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                    <Badge variant={getPriorityVariant(task.priority)} className="text-xs">
                      {task.priority}
                    </Badge>
                  </div>
                </div>
                <div className="mt-1 flex items-center text-xs text-muted-foreground">
                  {getStatusIcon(task.status)}
                  <span className="ml-1 capitalize">{task.status.replace('-', ' ')}</span>
                  {task.assignee && (
                    <span className="ml-3">
                      Assigned to <span className="font-medium">{task.assignee.name}</span>
                    </span>
                  )}
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">More options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Edit task</DropdownMenuItem>
                  <DropdownMenuItem>Change status</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>

        {mockTasks.length > 5 && (
          <Button variant="ghost" className="mt-4 w-full text-sm" size="sm">
            View all tasks ({mockTasks.length})
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
