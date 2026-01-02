import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Filter, Search, LayoutGrid, List, PlusCircle, MoreHorizontal } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { ModernKanbanBoard } from '@/components/kanban/modern-kanban-board';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

// Simple list view component
function ListView({ projects }) {
  // Mock projects data - replace with your actual data source
  const mockProjects = [
    {
      id: '1',
      name: 'Website Redesign',
      status: 'In Progress',
      dueDate: '2023-12-15',
      priority: 'high',
      progress: 65,
    },
    {
      id: '2',
      name: 'Mobile App Launch',
      status: 'Planning',
      dueDate: '2024-01-20',
      priority: 'medium',
      progress: 30,
    },
    {
      id: '3',
      name: 'Marketing Campaign',
      status: 'Completed',
      dueDate: '2023-11-30',
      priority: 'high',
      progress: 100,
    },
  ];

  const projectsToRender = projects || mockProjects;

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'in progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'planning':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Project Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead className="w-[50px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projectsToRender.map((project) => (
            <TableRow key={project.id}>
              <TableCell className="font-medium">{project.name}</TableCell>
              <TableCell>
                <Badge variant="outline" className={getStatusColor(project.status)}>
                  {project.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={getPriorityColor(project.priority)}>
                  {project.priority}
                </Badge>
              </TableCell>
              <TableCell>{new Date(project.dueDate).toLocaleDateString()}</TableCell>
              <TableCell>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div 
                    className={`h-2.5 rounded-full ${
                      project.progress < 30 ? 'bg-red-500' : 
                      project.progress < 70 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">{project.progress}%</span>
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default function ProjectsPage() {
  const [view, setView] = useState<'board' | 'list'>('board');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock projects data - replace with your actual data source
  const [projects, setProjects] = useState([
    {
      id: '1',
      name: 'Website Redesign',
      status: 'In Progress',
      dueDate: '2023-12-15',
      priority: 'high',
      progress: 65,
    },
    {
      id: '2',
      name: 'Mobile App Development',
      status: 'Completed',
      dueDate: '2023-11-30',
      priority: 'high',
      progress: 100,
    },
    {
      id: '3',
      name: 'Marketing Campaign',
      status: 'Planning',
      dueDate: '2024-01-20',
      priority: 'medium',
      progress: 30,
    },
    {
      id: '4',
      name: 'UI/UX Update',
      status: 'In Progress',
      dueDate: '2023-12-30',
      priority: 'medium',
      progress: 45,
    },
    {
      id: '5',
      name: 'Backend Optimization',
      status: 'Not Started',
      dueDate: '2024-01-15',
      priority: 'low',
      progress: 0,
    },
  ]);

  // Filter projects based on search query
  const filteredProjects = React.useMemo(() => {
    if (!searchQuery.trim()) return projects;
    
    const query = searchQuery.toLowerCase();
    return projects.filter(project => 
      project.name.toLowerCase().includes(query) ||
      project.status.toLowerCase().includes(query) ||
      project.priority.toLowerCase().includes(query) ||
      project.dueDate.includes(query) ||
      project.progress.toString().includes(query)
    );
  }, [projects, searchQuery]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
            <p className="text-muted-foreground">
              Manage and track your projects in a visual way
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Tabs 
            value={view} 
            onValueChange={(value) => setView(value as 'board' | 'list')}
            className="w-auto"
          >
            <TabsList>
              <TabsTrigger value="board" className="flex items-center gap-2">
                <LayoutGrid className="h-4 w-4" />
                <span>Board</span>
              </TabsTrigger>
              <TabsTrigger value="list" className="flex items-center gap-2">
                <List className="h-4 w-4" />
                <span>List</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="flex-1 overflow-hidden mt-6">
        {filteredProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 rounded-lg border border-dashed">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No projects found</h3>
            <p className="text-sm text-muted-foreground">
              {searchQuery ? 'Try a different search term' : 'No projects available'}
            </p>
            {searchQuery && (
              <Button 
                variant="ghost" 
                className="mt-4" 
                onClick={() => setSearchQuery('')}
              >
                Clear search
              </Button>
            )}
          </div>
        ) : view === 'board' ? (
          <ModernKanbanBoard projects={filteredProjects} />
        ) : (
          <ListView projects={filteredProjects} />
        )}
      </div>
    </div>
  );
}
