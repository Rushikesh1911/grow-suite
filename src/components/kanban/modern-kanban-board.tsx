import { useState, useMemo , useEffect } from 'react';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors , closestCenter } from '@dnd-kit/core';
import type { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove, useSortable  } from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';
import { Plus, MoreVertical, MessageSquare, Paperclip, User, Clock, CheckCircle, Circle, AlertCircle, Check, ClipboardList, Calendar, CalendarDays, X, Edit, Trash2, Share2, Copy, Archive, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';


type Project = {
  id: string;
  name: string;
  description?: string;
  status: string;
  priority: 'low' | 'medium' | 'high';
  startDate: string;
  dueDate: string;
  progress: number;
  tags?: string[];
  teamMembers?: Array<{
    userId: string;
    name: string;
    role: string;
    avatar?: string;
  }>;
  budget?: number;
  completedTasks?: number;
  totalTasks?: number;
};

type Column = {
  id: string;
  title: string;
  color: string;
  icon: React.ReactNode;
};

const COLUMNS: Column[] = [
  {
    id: 'planning',
    title: 'Planning',
    color: 'bg-blue-500',
    icon: <ClipboardList className="h-3 w-3 text-blue-500" />
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    color: 'bg-yellow-500',
    icon: <div className="h-3 w-3 rounded-full bg-yellow-500 animate-pulse" />
  },
  {
    id: 'review',
    title: 'Review',
    color: 'bg-purple-500',
    icon: <AlertCircle className="h-3 w-3 text-purple-500" />
  },
  {
    id: 'completed',
    title: 'Completed',
    color: 'bg-green-500',
    icon: <CheckCircle className="h-3 w-3 text-green-500" />
  },
];

const TAG_COLORS = {
  web: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  mobile: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  design: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  marketing: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  research: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
  development: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
};

const initialProjects: Project[] = [
  {
    id: '1',
    name: 'E-commerce Platform',
    description: 'Build a modern e-commerce platform with React and Node.js',
    status: 'in-progress',
    priority: 'high',
    startDate: '2024-01-01',
    dueDate: '2024-03-15',
    progress: 65,
    tags: ['web', 'development'],
    teamMembers: [
      { userId: '1', name: 'Alex', role: 'Frontend', avatar: '' },
      { userId: '2', name: 'Jordan', role: 'Backend', avatar: '' },
      { userId: '3', name: 'Taylor', role: 'Design', avatar: '' },
    ]
  },
  {
    id: '2',
    name: 'Mobile App Redesign',
    description: 'Redesign the mobile app with new UI/UX improvements',
    status: 'planning',
    priority: 'medium',
    startDate: '2024-02-01',
    dueDate: '2024-04-30',
    progress: 15,
    tags: ['mobile', 'design'],
    teamMembers: [
      { userId: '4', name: 'Casey', role: 'Design', avatar: '' },
      { userId: '5', name: 'Riley', role: 'Mobile', avatar: '' },
    ]
  },
  {
    id: '3',
    name: 'Marketing Website',
    description: 'Develop a new marketing website to showcase our products',
    status: 'review',
    priority: 'high',
    startDate: '2023-12-15',
    dueDate: '2024-01-31',
    progress: 90,
    tags: ['web', 'marketing'],
    teamMembers: [
      { userId: '6', name: 'Morgan', role: 'Frontend', avatar: '' },
      { userId: '7', name: 'Jamie', role: 'Content', avatar: '' },
    ]
  },
  {
    id: '4',
    name: 'Customer Portal',
    description: 'Build a self-service customer portal',
    status: 'completed',
    priority: 'medium',
    startDate: '2023-11-01',
    dueDate: '2023-12-31',
    progress: 100,
    tags: ['web', 'development'],
    teamMembers: [
      { userId: '8', name: 'Alex', role: 'Frontend', avatar: '' },
      { userId: '9', name: 'Jordan', role: 'Backend', avatar: '' },
      { userId: '10', name: 'Taylor', role: 'QA', avatar: '' },
    ]
  },
];

interface ModernKanbanBoardProps {
  projects: Project[];
  onProjectUpdate?: (projectId: string, updates: Partial<Project>) => Promise<void>;
}

export function ModernKanbanBoard({ projects, onProjectUpdate }: ModernKanbanBoardProps) {
  const [localProjects, setLocalProjects] = useState<Project[]>(projects);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [newProjectName, setNewProjectName] = useState('');
  const [activeColumn, setActiveColumn] = useState<string | null>(null);

  useEffect(() => {
    setLocalProjects(projects);
  }, [projects]);

  const projectsByStatus = useMemo(() => {
    return localProjects.reduce((acc, project) => {
      if (!acc[project.status]) {
        acc[project.status] = [];
      }
      acc[project.status].push(project);
      return acc;
    }, {} as Record<string, Project[]>);
  }, [localProjects]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Reduced from 8 to make it more responsive
      },
    })
  );

  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === 'project') {
      setActiveProject(event.active.data.current.project);
      setActiveId(event.active.id);
    }
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveAProject = active.data.current?.type === 'project';
    const isOverAProject = over.data.current?.type === 'project';

    if (!isActiveAProject) return;

    // Dropping over a project
    if (isOverAProject) {
      setLocalProjects((projects) => {
        const activeIndex = projects.findIndex((p) => p.id === activeId);
        const overIndex = projects.findIndex((p) => p.id === overId);

        if (projects[activeIndex].status !== projects[overIndex].status) {
          projects[activeIndex].status = projects[overIndex].status;
          return arrayMove(projects, activeIndex, overIndex - 1);
        }

        return arrayMove(projects, activeIndex, overIndex);
      });
    }

    // Dropping over a column
    const isOverAColumn = over.data.current?.type === 'column';
    if (isOverAColumn) {
      setProjects((projects) => {
        const activeIndex = projects.findIndex((p) => p.id === activeId);
        projects[activeIndex].status = overId as string;
        return arrayMove(projects, activeIndex, activeIndex);
      });
    }
  };

  const addProject = (status: string) => {
    if (!newProjectName.trim()) return;

    const newProject: Project = {
      id: Math.random().toString(36).substr(2, 9),
      name: newProjectName,
      description: 'New project description',
      status,
      priority: 'medium',
      startDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      progress: 0,
      tags: ['development'],
      teamMembers: [],
      completedTasks: 0,
      totalTasks: 0,
    };

    setProjects([...projects, newProject]);
    setNewProjectName('');
    setActiveColumn(null);
  };

  const toggleProjectComplete = (projectId: string) => {
    setProjects(prevProjects =>
      prevProjects.map(project =>
        project.id === projectId
          ? {
            ...project,
            status: project.status === 'completed' ? 'planning' : 'completed',
            completed: !project.completed
          }
          : project
      )
    );
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id;
    const overId = over.id;
    if (activeId === overId) return;
    // Find the project being dragged
    const activeProject = projects.find(p => p.id === activeId);
    if (!activeProject) return;
    // Find the status of the column we're dropping into
    const overStatus = over.data.current?.status || over.id;
    // Only update if status changed
    if (activeProject.status !== overStatus) {
      setProjects(projects.map(project =>
        project.id === activeId
          ? { ...project, status: overStatus as Project['status'] }
          : project
      ));
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800';
    }
  };

  const renderAddProjectInput = (columnId: string) => {
    if (activeColumn !== columnId) return null;

    return (
      <div className="mt-2">
        <div className="flex space-x-2">
          <Input
            placeholder="Project name"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                addProject(columnId);
              } else if (e.key === 'Escape') {
                setActiveColumn(null);
                setNewProjectName('');
              }
            }}
            className="flex-1"
            autoFocus
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setActiveColumn(null)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex justify-end mt-2">
          <Button
            size="sm"
            onClick={() => addProject(columnId)}
            disabled={!newProjectName.trim()}
          >
            Add Project
          </Button>
        </div>
      </div>
    );
  };

  const renderEmptyState = (columnId: string) => {
    if (projectsByStatus[columnId]?.length > 0) return null;

    return (
      <div className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 text-center">
        <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-3">
          <ClipboardList className="h-5 w-5 text-blue-500" />
        </div>
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          No projects here
        </h4>
        <Button
          variant="ghost"
          size="sm"
          className="mt-2"
          onClick={() => setActiveColumn(columnId)}
        >
          <Plus className="h-4 w-4 mr-1" /> Add project
        </Button>
      </div>
    );
  };

  return (
    <div className="h-full w-full overflow-hidden">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
      >
        <div className="flex h-full overflow-x-auto pb-6 scrollbar-hide px-4">
          <div className="flex space-x-6">
            {COLUMNS.map((column) => {
              const columnProjects = projectsByStatus[column.id] || [];
              return (
                <div key={column.id} className="w-80 flex-shrink-0 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className={`h-3 w-0.5 ${column.color}`} />
                      <h3 className="font-medium text-sm text-gray-700 dark:text-gray-300">
                        {column.title}
                      </h3>
                      <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 rounded-full px-2 py-0.5">
                        {columnProjects.length}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                      onClick={() => setActiveColumn(activeColumn === column.id ? null : column.id)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex-1 space-y-3 overflow-y-auto">
                    {renderAddProjectInput(column.id)}

                    <SortableContext items={columnProjects.map((p) => p.id)}>
                      <div className="space-y-3">
                        {columnProjects.length > 0 ? (
                          columnProjects.map((project) => (
                            <ProjectCard
                              key={project.id}
                              project={project}
                              onToggleComplete={toggleProjectComplete}
                              isDragging={activeId === project.id}
                            />
                          ))
                        ) : (
                          renderEmptyState(column.id)
                        )}
                      </div>
                    </SortableContext>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {createPortal(
          <DragOverlay>
            {activeProject && (
              <div className="w-80">
                <ProjectCard
                  project={activeProject}
                  onToggleComplete={toggleProjectComplete}
                  isDragging
                />
              </div>
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
}

interface ProjectCardProps {
  project: Project;
  onToggleComplete: (id: string) => void;
  isDragging?: boolean;
}
const ProjectCard = ({
  project,
  onToggleComplete,
  isDragging = false
}: ProjectCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: project.id,
    data: {
      type: 'project',
      project,
    },
  });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 50 : 0,
  };

  const priorityColors = {
    high: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    low: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  };

  const progress = project.progress || 0;
  const progressColor = progress < 30 ? 'bg-red-500' :
    progress < 70 ? 'bg-yellow-500' : 'bg-green-500';

  return (
    <>
      {/* PROJECT CARD */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <Card
          ref={setNodeRef}
          style={style}
          {...attributes}
          {...listeners}
          className={cn(
            'group relative overflow-hidden transition-all hover:shadow-md cursor-grab active:cursor-grabbing',
            isDragging ? 'ring-2 ring-primary ring-opacity-50' : ''
          )}
        >
          <CardHeader className="p-4 pb-2">
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base font-semibold leading-tight">
                    {project.name || 'Untitled Project'}
                  </CardTitle>
                  {project.clientName && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Client: {project.clientName}
                    </p>
                  )}
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    'text-xs font-medium',
                    priorityColors[project.priority]
                  )}
                >
                  {project.priority}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="flex items-center">
                  <div className={cn(
                    'h-2 w-2 rounded-full mr-1.5',
                    {
                      'bg-blue-500': project.status === 'in-progress',
                      'bg-green-500': project.status === 'completed',
                      'bg-yellow-500': project.status === 'planning',
                      'bg-purple-500': project.status === 'review',
                      'bg-gray-500': project.status === 'on-hold' || project.status === 'cancelled',
                    }
                  )} />
                  <span className="capitalize">{project.status.replace('-', ' ')}</span>
                </div>
                {project.dueDate && (
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>{new Date(project.dueDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

            </div>
            
            {project.description && (
              <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                {project.description}
              </p>
            )}

            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between text-xs mb-1">
                <span>Progress</span>
                <span className="font-medium">{progress}%</span>
              </div>
              <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${progressColor} transition-all duration-500`}
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                {project.completedTasks !== undefined &&
                  project.totalTasks !== undefined && (
                    <span>
                      {project.completedTasks}/{project.totalTasks} tasks
                    </span>
                  )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-4 pt-0">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-1">
                <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {new Date(project.dueDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>

              <div className="flex -space-x-2">
                {(project.teamMembers || []).slice(0, 3).map((member, index) => (
                  <Avatar
                    key={index}
                    className="h-6 w-6 border-2 border-background"
                  >
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback className="text-[10px] bg-gray-200 dark:bg-gray-700">
                      {member.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {(project.teamMembers || []).length > 3 && (
                  <div className="h-6 w-6 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs">
                    +{(project.teamMembers || []).length - 3}
                  </div>
                )}
              </div>
            </div>

            {project.tags && project.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className={cn(
                      'text-xs px-2 py-0.5 rounded-full',
                      TAG_COLORS[tag as keyof typeof TAG_COLORS] ||
                      'bg-gray-100 dark:bg-gray-800'
                    )}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* TASK ITEM */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Card>
          <CardContent className="p-4 flex gap-3 group">
            <button
              onClick={() => onToggleComplete(project.id)}
              className={cn(
                "mt-0.5 flex-shrink-0 h-4 w-4 rounded border flex items-center justify-center transition-colors",
                project.completed
                  ? "bg-blue-500 border-blue-500 text-white"
                  : "border-gray-300 dark:border-gray-600 hover:border-blue-500"
              )}
            >
              {project.completed && <Check className="h-3 w-3" />}
            </button>

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  {project.name}
                </h3>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="text-gray-400 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300">
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Edit Project</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Share2 className="mr-2 h-4 w-4" />
                        <span>Share</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy className="mr-2 h-4 w-4" />
                        <span>Duplicate</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Tag className="mr-2 h-4 w-4" />
                        <span>Add Label</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Archive className="mr-2 h-4 w-4" />
                        <span>Archive</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400">
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {project.description && (
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                  {project.description}
                </p>
              )}

              {project.tags && project.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className={cn(
                        'text-xs px-2 py-0.5 rounded-full',
                        'bg-gray-100 text-gray-700 dark:bg-gray-800'
                      )}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100 dark:border-gray-700/50">
                <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-300">
                  {project.dueDate && (
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>
                        {new Date(project.dueDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  )}
                  {project.comments > 0 && (
                    <div className="flex items-center">
                      <MessageSquare className="h-3 w-3 mr-1" />
                      <span>{project.comments}</span>
                    </div>
                  )}
                  {project.attachments > 0 && (
                    <div className="flex items-center">
                      <Paperclip className="h-3 w-3 mr-1" />
                      <span>{project.attachments}</span>
                    </div>
                  )}
                </div>

                {project.teamMembers?.[0] && (
                  <Avatar className="h-6 w-6 border-2 border-white dark:border-gray-800">
                    <AvatarImage src={project.teamMembers[0].avatar} />
                    <AvatarFallback className="text-xs">
                      {project.teamMembers[0].name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
}
