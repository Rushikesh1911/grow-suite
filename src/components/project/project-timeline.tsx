import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Clock, AlertCircle, Plus, Calendar as CalendarIcon, Target, Users, FileText, Package } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useState, useEffect } from 'react';
import { AlertCircle as AlertCircleIcon } from 'lucide-react';
import type { TimelineEvent } from '@/lib/timeline';
import { getProjectTimeline } from '@/lib/timeline';
import type { Project } from '@/lib/project';


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

export function ProjectTimeline({ project }: { project: Project }) {
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const projectTimeline = await getProjectTimeline(project.id);
        setTimeline(projectTimeline);
      } catch (err) {
        console.error('Error fetching timeline:', err);
        // Only set error if it's a real error, not just empty data or index requirements
        if (err instanceof Error && 
            !err.message.includes('No documents to fetch') && 
            !err.message.includes('requires an index')) {
          setError('Failed to load timeline. Please try again.');
        } else {
          // Empty data or index requirement is not an error for the user
          setTimeline([]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (project.id) {
      fetchTimeline();
    }
  }, [project.id]);

  if (isLoading) {
    return (
      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-9 w-24" />
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="relative pl-10">
                <Skeleton className="absolute left-0 top-1 h-8 w-8 rounded-full" />
                <div className="rounded-lg border p-4">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-3 w-24" />
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
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Project Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircleIcon className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Project Timeline</CardTitle>
        <Button variant="ghost" size="sm">
          <Plus className="mr-1 h-4 w-4" />
          Add Event
        </Button>
      </CardHeader>
      <CardContent>
        {timeline.length > 0 ? (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
            
            {/* Timeline events */}
            <div className="space-y-8">
              {timeline.map((event, index) => (
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
                  {index < timeline.length - 1 && (
                    <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700 -translate-y-4"></div>
                  )}
                </div>
              ))}
            </div>
            
            {/* View all events button */}
            {timeline.length > 5 && (
              <div className="mt-6 text-center">
                <Button variant="ghost" size="sm">
                  View Full Timeline
                  <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <CalendarIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No timeline events yet</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
              Create a timeline to track project milestones, meetings, and important dates.
            </p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-muted/50 rounded-lg p-3">
                <Target className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                <p className="text-xs font-medium">Milestones</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <Users className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                <p className="text-xs font-medium">Meetings</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <FileText className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                <p className="text-xs font-medium">Tasks</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <Package className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                <p className="text-xs font-medium">Deliverables</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Create Timeline
              </Button>
              <Button variant="outline" size="sm">
                <Target className="mr-2 h-4 w-4" />
                Add Milestone
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
