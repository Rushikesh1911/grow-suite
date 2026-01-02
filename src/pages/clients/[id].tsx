import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { clientService } from '@/lib/client';
import { useToast } from '@/components/ui/use-toast';
import { format, isAfter, isBefore, subDays } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ClientSecondaryPanel, ClientSecondaryPanelToggle } from '@/components/clients/ClientSecondaryPanel';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Mail, 
  Phone, 
  Plus, 
  User, 
  X, 
  MoreVertical, 
  FileText, 
  FolderOpen, 
  Activity,
  CheckCircle2,
  Clock as ClockIcon,
  AlertCircle,
  MessageSquare,
  BellPlus,
  FileText as FileTextIcon,
  Calendar as CalendarIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  Building2,
  Globe,
  MapPin,
  ChevronRight,
  Check,
  CircleDollarSign,
  Tag,
  Users,
  Briefcase,
  FileCheck,
  FileClock,
  MessageSquareText,
  Star,
  BarChart2,
  TrendingUp,
  ClipboardList,
  CheckSquare,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  MailCheck,
  PhoneCall,
  Video,
  FileEdit,
  Trash2,
  MoreHorizontal,
  ExternalLink,
  Link as LinkIcon,
  File,
  Download,
  Upload,
  Filter,
  Search,
  Settings,
  HelpCircle,
  RefreshCw
} from 'lucide-react';
import { Loader2 } from 'lucide-react';

type TimelineEvent = {
  id: string;
  type: 'comment' | 'status_change' | 'file' | 'meeting' | 'project';
  content: string;
  createdAt: string;
  user: {
    name: string;
    avatar?: string;
  };
  metadata?: Record<string, any>;
};

type Project = {
  id: string;
  name: string;
  status: 'planning' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled';
  progress: number;
  dueDate?: string;
  budget?: number;
  description?: string;
  updatedAt: string;
};

// Mock projects data - replace with actual API call [not useful anymore ! ]
const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Website Redesign',
    status: 'in_progress',
    progress: 65,
    dueDate: '2024-12-15',
    budget: 5000,
    description: 'Complete redesign of the company website with modern UI/UX',
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Mobile App Development',
    status: 'planning',
    progress: 15,
    dueDate: '2025-02-28',
    budget: 12000,
    description: 'Development of a cross-platform mobile application',
    updatedAt: new Date().toISOString(),
  },
];

const statusColors = {
  planning: 'bg-gray-100 text-gray-800',
  in_progress: 'bg-blue-100 text-blue-800',
  on_hold: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const ClientDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [isSecondaryPanelOpen, setIsSecondaryPanelOpen] = useState(false);
  const { toast } = useToast();

  const toggleSecondaryPanel = () => {
    setIsSecondaryPanelOpen(!isSecondaryPanelOpen);
  };

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
        
        // Initialize with empty timeline
        setTimeline([]);
        
        // Fetch projects for this client
        try {
          const clientProjects = await clientService.getClientProjects(id);
          setProjects(clientProjects || []);
        } catch (error) {
          console.error('Error fetching projects:', error);
          setProjects([]);
        }
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

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: string }> = {
      planning: { label: 'Planning', variant: 'outline' },
      in_progress: { label: 'In Progress', variant: 'default' },
      on_hold: { label: 'On Hold', variant: 'secondary' },
      completed: { label: 'Completed', variant: 'success' },
      cancelled: { label: 'Cancelled', variant: 'destructive' },
    };
    
    const statusInfo = statusMap[status] || { label: status, variant: 'outline' };
    return (
      <Badge variant={statusInfo.variant as any} className="capitalize">
        {statusInfo.label}
      </Badge>
    );
  };

  const renderProjectCard = (project: Project) => (
    <Card key={project.id} className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-medium">{project.name}</h3>
              {getStatusBadge(project.status)}
            </div>
            <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
            
            <div className="mt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{project.progress}%</span>
              </div>
              <Progress value={project.progress} className="h-2" />
            </div>

            <div className="flex justify-between items-center mt-4 text-sm">
              <div className="text-muted-foreground">
                {project.dueDate && (
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1.5" />
                    {format(new Date(project.dueDate), 'MMM d, yyyy')}
                  </div>
                )}
              </div>
              <div className="font-medium">
                {project.budget && `$${project.budget.toLocaleString()}`}
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Client Not Found</h1>
        </div>
        <p className="text-muted-foreground mb-6">
          The client you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => navigate('/clients')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Clients
        </Button>
      </div>
    );
  }

  return (
  <div className="container mx-auto px-4 py-4 relative">
    <div className="relative">
      {/* Main content goes here */}
      <div className="space-y-4">
        {/* Header with client info and actions */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{client.name}</h1>
              <p className="text-sm text-muted-foreground">
                {client.title || 'No title'}{client.company ? ` • ${client.company}` : ''}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Project
            </Button>
            <Button 
              variant="outline" 
              onClick={toggleSecondaryPanel}
              className="flex items-center"
            >
              {isSecondaryPanelOpen ? (
                <>
                  <X className="h-4 w-4 mr-2" />
                  Hide Details
                </>
              ) : (
                <>
                  <User className="h-4 w-4 mr-2" />
                  Show Details
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Tabs for different sections */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="w-full justify-start bg-transparent p-0 border-b rounded-none">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2 h-auto"
            >
              <FileText className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="projects" 
              className="data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2 h-auto"
            >
              <FolderOpen className="h-4 w-4 mr-2" />
              Projects
            </TabsTrigger>
            <TabsTrigger 
              value="activity" 
              className="data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2 h-auto"
            >
              <Activity className="h-4 w-4 mr-2" />
              Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Projects</p>
                      <h3 className="text-2xl font-bold mt-1">{projects?.length || 0}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {projects?.filter(p => p?.status === 'completed').length || 0} completed
                      </p>
                    </div>
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <FolderOpen className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
                      <h3 className="text-2xl font-bold mt-1">
                        {projects?.filter(p => p?.status === 'in_progress').length || 0}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {projects?.filter(p => p?.status === 'in_progress').length || 0} in progress
                      </p>
                    </div>
                    <div className="p-2 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                      <h3 className="text-2xl font-bold mt-1">
                        ${(projects?.reduce((sum, p) => sum + (p?.budget || 0), 0) || 0).toLocaleString()}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        From {projects?.length || 0} projects
                      </p>
                    </div>
                    <div className="p-2 rounded-lg bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400">
                      <CircleDollarSign className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Client Since</p>
                      <h3 className="text-2xl font-bold mt-1">
                        {client?.createdAt ? format(new Date(client.createdAt), 'MMM yyyy') : 'N/A'}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {client?.yearsWithUs || 'Less than a'} year{client?.yearsWithUs > 1 ? 's' : ''} with us
                      </p>
                    </div>
                    <div className="p-2 rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
                      <Calendar className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Projects & Tasks */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between py-4">
                  <CardTitle className="text-lg">Recent Projects</CardTitle>
                  {projects?.length > 0 && (
                    <Button variant="ghost" size="sm" className="text-primary h-8">
                      View All
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  {projects?.length > 0 ? (
                    <div className="space-y-4">
                      {projects.slice(0, 3).map(project => (
                        <div key={project.id} className="border rounded-lg p-3 hover:bg-accent/50 transition-colors">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{project.name}</h4>
                              <div className="flex items-center mt-1 space-x-2">
                                <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[project.status]}`}>
                                  {project.status.replace('_', ' ')}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {project.dueDate ? `Due ${format(new Date(project.dueDate), 'MMM d')}` : 'No deadline'}
                                </span>
                              </div>
                              <Progress value={project.progress} className="h-2 mt-2" />
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-6 border rounded-lg">
                      <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                      <h3 className="text-sm font-medium mb-1">No projects yet</h3>
                      <p className="text-sm text-muted-foreground mb-4">Create your first project to get started</p>
                      <Button size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        New Project
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between py-4">
                  <CardTitle className="text-lg">Upcoming Tasks</CardTitle>
                  <Button variant="ghost" size="sm" className="text-primary h-8">
                    View All
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="text-center p-6 border rounded-lg">
                    <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                    <h3 className="text-sm font-medium mb-1">No tasks yet</h3>
                    <p className="text-sm text-muted-foreground mb-4">Add tasks to keep track of your work</p>
                    <Button variant="outline" size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Task
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader className="py-4">
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {timeline.length > 0 ? (
                  <div className="space-y-4">
                    {timeline.slice(0, 5).map(event => (
                      <div key={event.id} className="flex items-start space-x-3">
                        <div className="p-2 rounded-lg bg-accent">
                          {event.type === 'comment' ? (
                            <MessageSquareText className="h-4 w-4" />
                          ) : event.type === 'status_change' ? (
                            <RefreshCw className="h-4 w-4" />
                          ) : (
                            <FileText className="h-4 w-4" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">{event.user?.name || 'System'}</p>
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(event.createdAt), 'MMM d, h:mm a')}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{event.content}</p>
                          {event.metadata && (
                            <div className="mt-1 text-xs text-muted-foreground">
                              {event.metadata.from && event.metadata.to && (
                                <span>
                                  Changed from <span className="font-medium">{event.metadata.from}</span> to{' '}
                                  <span className="font-medium">{event.metadata.to}</span>
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-6 border rounded-lg">
                    <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                    <h3 className="text-sm font-medium mb-1">No activity yet</h3>
                    <p className="text-sm text-muted-foreground mb-4">Interact with this client to see activity here</p>
                    <div className="flex justify-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Mail className="mr-2 h-4 w-4" />
                        Send Email
                      </Button>
                      <Button variant="outline" size="sm">
                        <Phone className="mr-2 h-4 w-4" />
                        Log Call
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects" className="space-y-4">
            <Card>
              <CardContent className="p-8 text-center">
                <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No projects yet</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  You haven't created any projects for this client yet. Create your first project to get started.
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Project
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardContent className="p-8 text-center">
                <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No activity recorded</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Start working with this client to see their activity history here.
                </p>
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Log Activity
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Secondary Panel */}
      <ClientSecondaryPanel 
        client={client} 
        isOpen={isSecondaryPanelOpen} 
        onToggle={toggleSecondaryPanel}
        onEdit={() => {
          // Handle edit client
          console.log('Edit client', client.id);
        }}
      />
      <ClientSecondaryPanelToggle 
        isOpen={isSecondaryPanelOpen} 
        onToggle={toggleSecondaryPanel} 
      />
    </div>
  );
};

// Separate component for Suspense boundary
const ClientDetailPageWithSuspense = () => (
  <ClientDetailPage />
);

export default ClientDetailPageWithSuspense;
