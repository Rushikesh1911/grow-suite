import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { Project } from '@/lib/project';
import { Calendar, Clock, Tag, AlertCircle, CheckCircle, Clock as ClockIcon } from 'lucide-react';
import { format } from 'date-fns';

export function ProjectOverview({ project }: { project: Project }) {
  const formatDate = (date: Date | string | undefined) => {
    if (!date) return 'Not set';
    return format(new Date(date), 'MMM d, yyyy');
  };

  const getPriorityIcon = () => {
    switch (project.priority) {
      case 'high':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'medium':
        return <ClockIcon className="h-4 w-4 text-yellow-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Overview</CardTitle>
        <CardDescription>Key information and progress</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Project Progress</span>
            <span className="text-sm text-muted-foreground">{project.progress}%</span>
          </div>
          <Progress value={project.progress} className="h-2" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="mr-2 h-4 w-4" />
              Start Date
            </div>
            <div className="font-medium">{formatDate(project.startDate)}</div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="mr-2 h-4 w-4" />
              Due Date
            </div>
            <div className="font-medium">
              {project.dueDate ? formatDate(project.dueDate) : 'No due date'}
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="mr-2 h-4 w-4" />
              Time Remaining
            </div>
            <div className="font-medium">
              {project.dueDate 
                ? `${Math.ceil((new Date(project.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days`
                : 'N/A'}
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center text-sm text-muted-foreground">
              {getPriorityIcon()}
              <span className="ml-2">Priority</span>
            </div>
            <div className="font-medium capitalize">{project.priority}</div>
          </div>
        </div>

        {/* Tags */}
        {project.tags && project.tags.length > 0 && (
          <div>
            <div className="flex items-center text-sm text-muted-foreground mb-2">
              <Tag className="mr-2 h-4 w-4" />
              Tags
            </div>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span 
                  key={tag}
                  className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground bg-secondary hover:bg-secondary/80"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
