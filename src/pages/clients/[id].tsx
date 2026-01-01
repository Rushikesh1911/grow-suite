import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { clientService } from '@/lib/client';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/ui/icons';

type TimelineEvent = {
  id: string;
  type: 'comment' | 'status_change' | 'file' | 'meeting';
  content: string;
  createdAt: string;
  user: {
    name: string;
    avatar?: string;
  };
  metadata?: Record<string, any>;
};

const ClientDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchClient = async () => {
      if (!id) {
        console.error('No client ID provided');
        navigate('/clients');
        return;
      }
      
      console.log('Fetching client with ID:', id);

      try {
        setLoading(true);
        const data = await clientService.getClient(id);
        if (!data) {
          throw new Error('Client not found');
        }
        setClient(data);
        
        // Mock timeline data - replace with actual API call
        setTimeline([
          {
            id: '1',
            type: 'status_change',
            content: 'Status changed to In Progress',
            createdAt: new Date().toISOString(),
            user: { name: 'System' },
            metadata: { from: 'New', to: 'In Progress' }
          },
          // Add more mock events as needed
        ]);
      } catch (error) {
        console.error('Error fetching client:', error);
        toast({
          title: 'Error',
          description: 'Failed to load client details',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [id, toast]);

  const handleAddComment = async () => {
    if (!comment.trim()) return;
    
    const newComment: TimelineEvent = {
      id: Date.now().toString(),
      type: 'comment',
      content: comment,
      createdAt: new Date().toISOString(),
      user: { name: 'Current User' }, // Replace with actual user
    };
    
    setTimeline([newComment, ...timeline]);
    setComment('');
    
    // TODO: Save comment to API
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Icons.spinner className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!client) {
    return <div>Client not found</div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left sidebar - Client Info Card */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <Card className="sticky top-6">
            <CardHeader className="border-b">
              <div className="flex flex-col items-center text-center space-y-3">
                <Avatar className="h-20 w-20 mb-2">
                  <AvatarImage src={client.avatar} />
                  <AvatarFallback className="text-xl">
                    {client.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-xl font-bold">{client.name}</h1>
                  <p className="text-sm text-muted-foreground">{client.email}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-1">
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</h3>
                <div className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                  <span className="capitalize font-medium">{client.status || 'Active'}</span>
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Phone</h3>
                <p className="text-sm">{client.phone || 'Not provided'}</p>
              </div>
              <div className="space-y-1">
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Company</h3>
                <p className="text-sm">{client.company || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Created</h3>
                <p className="text-sm">
                  {client.createdAt ? format(new Date(client.createdAt), 'MMM d, yyyy') : 'N/A'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Comment input */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <Textarea
                placeholder="Add a comment or update..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-h-[100px] mb-4 text-sm"
              />
              <div className="flex justify-end">
                <Button 
                  onClick={handleAddComment} 
                  disabled={!comment.trim()}
                  size="sm"
                  className="px-4"
                >
                  Comment
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold mb-2">Activity</h2>
            {timeline.map((event) => (
              <Card key={event.id} className="overflow-hidden">
                <div className="flex p-4">
                  <div className="flex-shrink-0 mr-4">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                      {event.user.avatar ? (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={event.user.avatar} />
                          <AvatarFallback className="text-sm">
                            {event.user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <span className="text-sm">{event.user.name.charAt(0)}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">{event.user.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(event.createdAt), 'MMM d, yyyy h:mm a')}
                        </span>
                      </div>
                      {event.type === 'status_change' && (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary">
                          Status Update
                        </span>
                      )}
                    </div>
                    <div className="mt-1">
                      {event.type === 'comment' && (
                        <p className="text-sm text-foreground">{event.content}</p>
                      )}
                      {event.type === 'status_change' && (
                        <div className="mt-2 p-3 bg-muted/30 rounded-md">
                          <p className="text-sm">
                            Status changed from 
                            <span className="font-medium"> {event.metadata?.from} </span> 
                            to 
                            <span className="font-medium"> {event.metadata?.to}</span>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDetailPage;
