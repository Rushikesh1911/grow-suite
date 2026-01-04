import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { clientService } from '@/lib/client';
import { useToast } from '@/components/ui/use-toast';
import { format, isAfter, isBefore, subDays } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { CreateProjectModal } from '@/components/projects/create-project-modal';
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
  const { toast } = useToast();
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isSecondaryPanelOpen, setIsSecondaryPanelOpen] = useState(false);
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);

  // Helper function to safely format dates
  const formatEventDate = (dateString?: string) => {
    if (!dateString) return 'Recent';
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? 'Recent' : format(date, 'MMM d, h:mm a');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Recent';
    }
  };

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
        setLoadingProjects(true);
        try {
          const clientProjects = await clientService.getClientProjects(id);
          // Transform project data to match our Project type
          const formattedProjects = clientProjects?.map(project => ({
            id: project.id,
            name: project.projectName || 'Untitled Project',
            status: project.status || 'planning',
            progress: project.progress || 0,
            dueDate: project.endDate,
            budget: project.budget,
            description: project.description,
            updatedAt: project.updatedAt || new Date().toISOString(),
            startDate: project.startDate
          })) || [];
          setProjects(formattedProjects);
          
          // Add project creation to timeline
          if (formattedProjects.length > 0) {
            const projectEvents = formattedProjects.map(project => ({
              id: `project-${project.id}`,
              type: 'project' as const,
              content: `Created project "${project.name}"`,
              createdAt: project.updatedAt,
              user: {
                name: 'System',
                avatar: ''
              },
              metadata: {
                projectId: project.id
              }
            }));
            
            setTimeline(prev => [...projectEvents, ...prev]);
          }
        } catch (error) {
          console.error('Error fetching projects:', error);
          setProjects([]);
          toast({
            title: 'Error',
            description: 'Failed to load projects',
            variant: 'destructive',
          });
        } finally {
          setLoadingProjects(false);
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

  const handleProjectCreated = (newProject: any) => {
    // Add the new project to the projects list
    setProjects(prevProjects => [
      ...prevProjects,
      {
        id: newProject.id,
        name: newProject.projectName,
        status: newProject.status,
        progress: newProject.progress || 0,
        dueDate: newProject.endDate,
        budget: newProject.budget,
        description: newProject.description,
        updatedAt: new Date().toISOString()
      }
    ]);

    const safeFormatDate = (dateString?: string) => {
  if (!dateString) return 'No date';
  try {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'Invalid date' : format(date, 'MMM d, yyyy h:mm a');
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};
    
    // Add to timeline
    setTimeline(prev => [
      {
        id: `project-${Date.now()}`,
        type: 'project',
        content: `Created project "${newProject.projectName}"`,
        createdAt: new Date().toISOString(),
        user: {
          name: 'You',
          avatar: ''
        },
        metadata: {
          projectId: newProject.id
        }
      },
      ...prev
    ]);
    
    toast({
      title: 'Project created',
      description: `Project "${newProject.projectName}" has been created successfully.`,
      variant: 'default'
    });
    
    setIsCreateProjectModalOpen(false);
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: string; color: string }> = {
      planning: { 
        label: 'Planning', 
        variant: 'outline',
        color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
      },
      in_progress: { 
        label: 'In Progress', 
        variant: 'default',
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
      },
      on_hold: { 
        label: 'On Hold', 
        variant: 'secondary',
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
      },
      completed: { 
        label: 'Completed', 
        variant: 'success',
        color: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
      },
      cancelled: { 
        label: 'Cancelled', 
        variant: 'destructive',
        color: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
      },
    };
    
    const statusInfo = statusMap[status] || { 
      label: status, 
      variant: 'outline',
      color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
        {statusInfo.label}
      </span>
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
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">{client.name}</h1>
            <div className="flex items-center space-x-2">
              <Button 
                variant="default" 
                size="sm" 
                onClick={() => setIsCreateProjectModalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Project
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigate('/clients')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Clients
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
                                {formatEventDate(event.createdAt)}
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
              {loadingProjects ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : projects.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {projects.map(project => (
                    <Card key={project.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="w-full">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-medium text-base">{project.name}</h3>
                              {getStatusBadge(project.status)}
                            </div>
                            
                            {project.description && (
                              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                {project.description}
                              </p>
                            )}
                            
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
                                {project.budget ? `$${project.budget.toLocaleString()}` : 'No budget'}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No projects yet</h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      You haven't created any projects for this client yet. Create your first project to get started.
                    </p>
                    <Button onClick={() => setIsCreateProjectModalOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Project
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="activity" className="space-y-4">
              <Card>
                <CardHeader className="py-4">
                  <CardTitle>Activity Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  {timeline.length > 0 ? (
                    <div className="space-y-6">
                      {timeline
                        .sort((a, b) => {
                          try {
                            const dateA = new Date(a.createdAt).getTime();
                            const dateB = new Date(b.createdAt).getTime();
                            return isNaN(dateB) || isNaN(dateA) ? 0 : dateB - dateA;
                          } catch (error) {
                            console.error('Error sorting timeline:', error);
                            return 0;
                          }
                        })
                        .map(event => {
                          const eventDate = event.createdAt ? new Date(event.createdAt) : null;
                          const formattedDate = eventDate && !isNaN(eventDate.getTime()) 
                            ? format(eventDate, 'MMM d, yyyy h:mm a')
                            : 'Recent';
                            
                          return (
                            <div key={event.id} className="relative pb-6 last:pb-0">
                              <div className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700" aria-hidden="true"></div>
                              <div className="relative flex items-start space-x-4">
                                <div className="relative">
                                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center ring-8 ring-white dark:ring-gray-900">
                                    {event.type === 'comment' ? (
                                      <MessageSquareText className="h-4 w-4 text-primary" />
                                    ) : event.type === 'project' ? (
                                      <FolderOpen className="h-4 w-4 text-primary" />
                                    ) : (
                                      <Activity className="h-4 w-4 text-primary" />
                                    )}
                                  </div>
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="text-sm">
                                    <p className="font-medium text-gray-900 dark:text-white">
                                      {event.user?.name || 'System'}
                                      <span className="text-xs text-muted-foreground ml-2">
                                        {formattedDate}
                                      </span>
                                    </p>
                                    <p className="mt-0.5 text-sm text-muted-foreground">
                                      {event.content}
                                    </p>
                                  </div>
                                  {event.metadata?.projectId && (
                                    <div className="mt-2">
                                      <Link 
                                        to={`/projects/${event.metadata.projectId}`}
                                        className="inline-flex items-center text-sm text-primary hover:underline"
                                      >
                                        View project <ExternalLink className="ml-1 h-3 w-3" />
                                      </Link>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  ) : (
                    <div className="text-center p-8">
                      <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No activity recorded</h3>
                      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                        Start working with this client to see their activity history here.
                      </p>
                      <div className="flex justify-center space-x-2">
                        <Button variant="outline" onClick={() => setIsCreateProjectModalOpen(true)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Create Project
                        </Button>
                      </div>
                    </div>
                  )}
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

      {/* Create Project Modal */}
      {client && (
        <CreateProjectModal
          isOpen={isCreateProjectModalOpen}
          onClose={() => setIsCreateProjectModalOpen(false)}
          onSave={handleProjectCreated}
          initialData={{
            clientId: client.id,
            clientName: client.name
          }}
        />
      )}
    </div>
  );
};

// Separate component for Suspense boundary
const ClientDetailPageWithSuspense = () => (
  <ClientDetailPage />
);

export default ClientDetailPageWithSuspense;
