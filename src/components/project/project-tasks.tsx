import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, CheckCircle, Clock, AlertCircle, Check, MoreVertical, ListTodo, Target, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState, useEffect } from 'react';
import type { Task } from '@/lib/task';
import { getProjectTasks } from '@/lib/task';
import { CreateTaskModal } from '@/components/project/create-task-modal';
import type { Project } from '@/lib/project';


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

export function ProjectTasks({ projectId, project }: { projectId: string; project?: Project }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Debug logging
  console.log('ProjectTasks render:', { projectId, isCreateModalOpen, project: project?.name });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const projectTasks = await getProjectTasks(projectId);
        setTasks(projectTasks);
      } catch (err) {
        console.error('Error fetching tasks:', err);
        // Only set error if it's a real error, not just empty data
        if (err instanceof Error && !err.message.includes('No documents to fetch')) {
          setError('Failed to load tasks. Please try again.');
        } else {
          // Empty data is not an error
          setTasks([]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (projectId) {
      fetchTasks();
    }
  }, [projectId]);

  const handleTaskCreated = (newTask: Task) => {
    console.log('Task created:', newTask);
    setTasks(prev => [newTask, ...prev]);
  };

  const handleOpenModal = () => {
    console.log('Opening modal...');
    setIsCreateModalOpen(true);
  };

  const tasksByStatus = {
    todo: tasks.filter((task) => task.status === 'todo'),
    'in-progress': tasks.filter((task) => task.status === 'in-progress'),
    done: tasks.filter((task) => task.status === 'done'),
  };

  const totalTasks = tasks.length;
  const completedTasks = tasksByStatus.done.length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-9 w-24" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-2 w-full" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-3">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-16 flex-1" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg">Tasks</CardTitle>
          <Button variant="outline" size="sm" onClick={handleOpenModal} disabled={!project || !project.name}>
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </CardHeader>
        <CardContent>
          {tasks.length > 0 ? (
            <>
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
                {tasks.slice(0, 5).map((task) => (
                  <div key={task.id} className="flex items-start rounded-lg border p-3 hover:bg-accent/50 transition-colors">
                    <div className="flex items-center h-5">
                      <input
                        type="checkbox"
                        checked={task.status === 'done'}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        readOnly
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
                        {task.assigneeName && (
                          <span className="ml-3">
                            Assigned to <span className="font-medium">{task.assigneeName}</span>
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

              {tasks.length > 5 && (
                <Button variant="ghost" className="mt-4 w-full text-sm" size="sm">
                  View all tasks ({tasks.length})
                </Button>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-4 mb-4">
                <ListTodo className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No tasks yet</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                Create your first task to start tracking project progress and collaborate with your team.
              </p>
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-muted/50 rounded-lg p-3">
                  <Users className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                  <p className="text-xs font-medium">Assign Team</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <Target className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                  <p className="text-xs font-medium">Set Deadlines</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <CheckCircle className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                  <p className="text-xs font-medium">Track Progress</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button size="sm" onClick={handleOpenModal} disabled={!project || !project.name}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Task
                </Button>
                <Button variant="outline" size="sm">
                  <ListTodo className="mr-2 h-4 w-4" />
                  Browse Templates
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Task Modal - Only render if project is available */}
      {project && project.name && (
        <CreateTaskModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onTaskCreated={handleTaskCreated}
          project={project}
        />
      )}
    </>
  );
}
