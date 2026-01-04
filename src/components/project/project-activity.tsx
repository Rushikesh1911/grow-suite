import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { MessageSquare, Plus } from 'lucide-react';

interface Activity {
  id: string;
  user: {
    name: string;
    avatar?: string;
    email: string;
  };
  action: string;
  target?: string;
  targetType?: string;
  timestamp: Date | string;
  read?: boolean;
}

// Mock data - replace with actual data fetching
const mockActivities: Activity[] = [
  {
    id: '1',
    user: {
      name: 'Alex Johnson',
      email: 'alex@example.com',
      avatar: '',
    },
    action: 'created',
    target: 'Website Redesign',
    targetType: 'project',
    timestamp: '2024-02-28T14:30:00Z',
    read: true,
  },
  {
    id: '2',
    user: {
      name: 'Sam Wilson',
      email: 'sam@example.com',
      avatar: '',
    },
    action: 'uploaded',
    target: 'homepage-wireframes.pdf',
    targetType: 'file',
    timestamp: '2024-02-28T15:45:00Z',
    read: true,
  },
  {
    id: '3',
    user: {
      name: 'Jordan Lee',
      email: 'jordan@example.com',
      avatar: '',
    },
    action: 'commented',
    target: 'I think we should consider a different color scheme for the dashboard',
    targetType: 'comment',
    timestamp: '2024-02-28T16:20:00Z',
    read: false,
  },
  {
    id: '4',
    user: {
      name: 'Taylor Smith',
      email: 'taylor@example.com',
      avatar: '',
    },
    action: 'updated',
    target: 'User authentication flow',
    targetType: 'task',
    timestamp: '2024-02-29T09:15:00Z',
    read: false,
  },
  {
    id: '5',
    user: {
      name: 'Alex Johnson',
      email: 'alex@example.com',
      avatar: '',
    },
    action: 'changed status',
    target: 'Project',
    targetType: 'status',
    timestamp: '2024-02-29T10:30:00Z',
    read: true,
  },
];

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
          <span className="font-medium">{activity.user.name}</span> commented: "{target}"
        </span>
      );
    case 'created':
      return (
        <span>
          <span className="font-medium">{activity.user.name}</span> created the {targetType}
        </span>
      );
    case 'uploaded':
      return (
        <span>
          <span className="font-medium">{activity.user.name}</span> uploaded a new file: {target}
        </span>
      );
    case 'updated':
      return (
        <span>
          <span className="font-medium">{activity.user.name}</span> updated {targetType}: {target}
        </span>
      );
    case 'changed status':
      return (
        <span>
          <span className="font-medium">{activity.user.name}</span> changed the project status
        </span>
      );
    default:
      return `${activity.user.name} ${action} ${targetType}`;
  }
};

export function ProjectActivity({ projectId }: { projectId: string }) {
  const activities = mockActivities; // In a real app, fetch based on projectId
  
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
                      <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                      <AvatarFallback className="text-xs">
                        {activity.user.name
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
          <div className="py-6 text-center">
            <p className="text-sm text-muted-foreground">No recent activity</p>
          </div>
        )}
        
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
      </CardContent>
    </Card>
  );
}
