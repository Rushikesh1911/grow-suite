import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { MessageSquare, Plus, Activity, FileText, Users, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useState, useEffect } from 'react';
import type { Activity as ActivityType } from '@/lib/activity';
import { getProjectActivities } from '@/lib/activity';

interface Activity {
  id: string;
  userName: string;
  userAvatar?: string;
  userEmail: string;
  action: string;
  target?: string;
  targetType?: string;
  timestamp: Date | string;
  read?: boolean;
}

export function ProjectActivity({ projectId }: { projectId: string }) {
  const [activities, setActivities] = useState<ActivityType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const projectActivities = await getProjectActivities(projectId, 20);
        setActivities(projectActivities);
      } catch (err) {
        console.error('Error fetching activities:', err);
        // Only set error if it's a real error, not just empty data or index requirements
        if (err instanceof Error && 
            !err.message.includes('No documents to fetch') && 
            !err.message.includes('requires an index')) {
          setError('Failed to load activities. Please try again.');
        } else {
          // Empty data or index requirement is not an error for the user
          setActivities([]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (projectId) {
      fetchActivities();
    }
  }, [projectId]);

const getActionIcon = (action: string) => {
  switch (action) {
    case 'commented':
      return <MessageSquare className="h-4 w-4 text-blue-500" />;
    case 'created':
      return <Plus className="h-4 w-4 text-green-500" />;
    case 'uploaded':
      return (
        <svg
          className="h-4 w-4 text-purple-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
      );
    case 'updated':
      return (
        <svg
          className="h-4 w-4 text-yellow-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      );
    case 'changed status':
      return (
        <svg
          className="h-4 w-4 text-indigo-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
          />
        </svg>
      );
    default:
      return (
        <div className="h-2 w-2 rounded-full bg-gray-400"></div>
      );
  }
};

const formatActivityMessage = (activity: Activity) => {
  const { action, target, targetType } = activity;
  
  switch (action) {
    case 'commented':
      return (
        <span>
          <span className="font-medium">{activity.userName}</span> commented: "{target}"
        </span>
      );
    case 'created':
      return (
        <span>
          <span className="font-medium">{activity.userName}</span> created the {targetType}
        </span>
      );
    case 'uploaded':
      return (
        <span>
          <span className="font-medium">{activity.userName}</span> uploaded a new file: {target}
        </span>
      );
    case 'updated':
      return (
        <span>
          <span className="font-medium">{activity.userName}</span> updated {targetType}: {target}
        </span>
      );
    case 'changed status':
      return (
        <span>
          <span className="font-medium">{activity.userName}</span> changed the project status
        </span>
      );
    default:
      return `${activity.userName} ${action} ${targetType}`;
  }
};

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-8 w-16" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start space-x-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
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
          <CardTitle className="text-lg">Recent Activity</CardTitle>
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Recent Activity</CardTitle>
        <Button variant="ghost" size="sm" className="text-sm">
          View All
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {activities.length > 0 ? (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div 
                key={activity.id} 
                className={`relative flex items-start pb-4 last:pb-0 ${
                  !activity.read ? 'pl-3 border-l-2 border-blue-500' : 'pl-3 border-l-2 border-transparent'
                }`}
              >
                <div className="absolute left-0 top-0 flex h-6 w-6 -translate-x-4 items-center justify-center">
                  {getActionIcon(activity.action)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={activity.userAvatar} alt={activity.userName} />
                      <AvatarFallback className="text-xs">
                        {activity.userName
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <p className="text-sm text-muted-foreground">
                      {formatActivityMessage(activity)}
                    </p>
                  </div>
                  
                  <p className="mt-1 text-xs text-muted-foreground">
                    {format(new Date(activity.timestamp), 'MMM d, yyyy h:mm a')}
                  </p>
                </div>
                
                {!activity.read && (
                  <span className="ml-2 h-2 w-2 rounded-full bg-blue-500"></span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <Activity className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No activity yet</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
              Project activity will appear here as you and your team work on tasks, share files, and collaborate.
            </p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-muted/50 rounded-lg p-3">
                <FileText className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                <p className="text-xs font-medium">Task Updates</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <MessageSquare className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                <p className="text-xs font-medium">Comments</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <Users className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                <p className="text-xs font-medium">Team Changes</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <CheckCircle className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                <p className="text-xs font-medium">Milestones</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Start Collaboration
            </Button>
          </div>
        )}
        
        {activities.length > 0 && (
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t"></div>
            </div>
            <div className="relative flex justify-center">
              <Button variant="ghost" size="sm" className="bg-background px-2 text-xs text-muted-foreground">
                <MessageSquare className="mr-2 h-3.5 w-3.5" />
                Add a comment
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
