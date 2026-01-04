import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Clock, AlertCircle, Plus, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

interface TimelineEvent {
  id: string;
  title: string;
  description?: string;
  date: Date | string;
  status: 'completed' | 'in-progress' | 'upcoming' | 'delayed';
  type: 'milestone' | 'task' | 'meeting' | 'delivery';
}

// Mock data - replace with actual data fetching
const mockTimeline: TimelineEvent[] = [
  {
    id: '1',
    title: 'Project Kickoff',
    description: 'Initial meeting with the client to discuss project requirements',
    date: '2024-01-15',
    status: 'completed',
    type: 'meeting',
  },
  {
    id: '2',
    title: 'UI/UX Design Phase',
    description: 'Complete wireframes and design mockups',
    date: '2024-01-25',
    status: 'completed',
    type: 'milestone',
  },
  {
    id: '3',
    title: 'Development Sprint 1',
    description: 'Implement core features and authentication',
    date: '2024-02-15',
    status: 'completed',
    type: 'task',
  },
  {
    id: '4',
    title: 'Client Review',
    description: 'Present initial version to client for feedback',
    date: '2024-02-25',
    status: 'in-progress',
    type: 'meeting',
  },
  {
    id: '5',
    title: 'Development Sprint 2',
    description: 'Implement feedback and additional features',
    date: '2024-03-10',
    status: 'upcoming',
    type: 'task',
  },
  {
    id: '6',
    title: 'Final Delivery',
    description: 'Project handover and deployment',
    date: '2024-03-30',
    status: 'upcoming',
    type: 'delivery',
  },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case 'in-progress':
      return <div className="h-5 w-5 rounded-full border-2 border-blue-500 flex items-center justify-center">
        <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
      </div>;
    case 'delayed':
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    default:
      return <div className="h-5 w-5 rounded-full border-2 border-gray-300"></div>;
  }
};

const getEventTypeColor = (type: string) => {
  switch (type) {
    case 'milestone':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
    case 'meeting':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    case 'delivery':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  }
};

export function ProjectTimeline({ project }: { project: any }) {
  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Project Timeline</CardTitle>
        <button className="inline-flex items-center justify-center text-sm font-medium text-primary hover:underline">
          <Plus className="mr-1 h-4 w-4" />
          Add Event
        </button>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
          
          {/* Timeline events */}
          <div className="space-y-8">
            {mockTimeline.map((event, index) => (
              <div key={event.id} className="relative pl-10">
                {/* Timeline dot and line */}
                <div className="absolute left-0 top-1 flex h-8 w-8 items-center justify-center rounded-full bg-background">
                  {getStatusIcon(event.status)}
                </div>
                
                {/* Event card */}
                <div className="rounded-lg border bg-card p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{event.title}</h3>
                      {event.description && (
                        <p className="mt-1 text-sm text-muted-foreground">{event.description}</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getEventTypeColor(event.type)}`}>
                        {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center text-sm text-muted-foreground">
                    <CalendarIcon className="mr-1 h-4 w-4" />
                    {format(new Date(event.date), 'MMM d, yyyy')}
                  </div>
                </div>
                
                {/* Connect line between events */}
                {index < mockTimeline.length - 1 && (
                  <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700 -translate-y-4"></div>
                )}
              </div>
            ))}
          </div>
          
          {/* View all events button */}
          <div className="mt-6 text-center">
            <button className="inline-flex items-center text-sm font-medium text-primary hover:underline">
              View Full Timeline
              <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
