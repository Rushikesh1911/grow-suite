import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Filter, Search, LayoutGrid, List, MoreHorizontal, Edit, Trash2, Share2, Copy, Archive, Tag, AlertCircle, ClipboardList, RefreshCw, PlusCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { ModernKanbanBoard } from '@/components/kanban/modern-kanban-board';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton, TableSkeleton, KanbanSkeleton } from '@/components/ui/skeleton';
import { useProjects } from '@/hooks/useProjects';
import type { Project } from '@/lib/project';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Simple list view component
function ListView({ projects }) {
  const projectsToRender = projects || [];

  if (!projectsToRender || projectsToRender.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <ClipboardList className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No projects found</h3>
        <p className="text-sm text-muted-foreground">
          Get started by creating a new project
        </p>
      </div>
    );
  }

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
    switch (status?.toLowerCase()) {
      case 'in-progress':
      case 'in progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'planning':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'on-hold':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'review':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const formatStatus = (status) => {
    if (!status) return 'Not Set';
    return status
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
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
          {projectsToRender.map((project) => {
            const projectName = project.name || 'Untitled Project';
            return (
              <TableRow key={project.id}>
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span className="font-medium">{projectName}</span>
                    {project.clientName && (
                      <span className="text-xs text-muted-foreground">
                        {project.clientName}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusColor(project.status)}>
                    {formatStatus(project.status)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={getPriorityColor(project.priority)}>
                    {project.priority?.charAt(0).toUpperCase() + project.priority?.slice(1) || 'Medium'}
                  </Badge>
                </TableCell>
                <TableCell>
                  {project.dueDate ? (
                    new Date(project.dueDate).toLocaleDateString()
                  ) : (
                    <span className="text-muted-foreground">No due date</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div
                        className={`h-2.5 rounded-full ${project.progress < 30 ? 'bg-red-500' :
                            project.progress < 70 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                        style={{ width: `${project.progress || 0}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {project.progress || 0}%
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
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
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}


export default function ProjectsPage() {
  const [view, setView] = useState<'board' | 'list'>('board');
  const [searchQuery, setSearchQuery] = useState('');

  // Use the projects hook to fetch real data
  const { projects, loading, error, loadProjects } = useProjects();

  // Handle project updates (e.g., when dragging to a new status)
  const handleProjectUpdate = async (projectId: string, updates: Partial<Project>) => {
    try {
      // Update the project in the database
      // This is a placeholder - you'll need to implement the actual update logic
      // await updateProject(projectId, updates);

      // Optimistically update the UI
      loadProjects();
    } catch (error) {
      console.error('Failed to update project:', error);
      // Revert the UI if the update fails
      loadProjects();
    }
  };

  // Format projects for the Kanban board
  const kanbanProjects = useMemo(() => {
    return projects.map(project => ({
      ...project,
      // Ensure the status matches one of the column IDs in the Kanban board
      status: project.status?.toLowerCase().replace(/\s+/g, '-') || 'planning',
      // Ensure required fields have defaults
      name: project.name || 'Untitled Project',
      priority: project.priority || 'medium',
      startDate: project.startDate || new Date().toISOString(),
      dueDate: project.dueDate || '',
      progress: project.progress || 0,
      teamMembers: project.teamMembers || [],
      tags: project.tags || [],
    }));
  }, [projects]);

  // Filter projects based on search query
  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) return projects;

    const query = searchQuery.toLowerCase();
    return projects.filter(project => {
      const searchableText = [
        project.name,
        project.status,
        project.priority,
        project.clientName || '',
        project.dueDate ? new Date(project.dueDate).toLocaleDateString() : '',
        project.progress?.toString() || '0',
      ].join(' ').toLowerCase();

      return searchableText.includes(query);
    });
  }, [projects, searchQuery]);

  // Show loading state
  if (loading) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex flex-col space-y-4 mb-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex-1">
          {view === 'list' ? <TableSkeleton /> : <KanbanSkeleton />}
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Error loading projects</h2>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={loadProjects}>
          Try Again
        </Button>
      </div>
    );
  }

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
              placeholder="Search projects by name, status, client..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="text-sm text-muted-foreground">
              {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'} found
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
