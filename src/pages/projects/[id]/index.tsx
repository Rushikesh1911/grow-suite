import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ProjectHeader } from '@/components/project/project-header';
import { ProjectOverview } from '@/components/project/project-overview';
import { ProjectTeam } from '@/components/project/project-team';
import { ProjectTasks } from '@/components/project/project-tasks';
import { ProjectTimeline } from '@/components/project/project-timeline';
import { ProjectActivity } from '@/components/project/project-activity';
import { projectService } from '@/lib/project';
import type { Project } from '@/lib/project';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) {
        navigate('/projects');
        return;
      }

      try {
        setIsLoading(true);
        const data = await projectService.getProjectById(id);
        
        if (data) {
          setProject(data);
        } else {
          toast({
            title: 'Project not found',
            description: 'The requested project could not be found.',
            variant: 'destructive',
          });
          navigate('/projects');
        }
      } catch (error) {
        console.error('Error fetching project:', error);
        toast({
          title: 'Error',
          description: 'Failed to load project. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [id, navigate, toast]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <Skeleton className="h-12 w-1/3" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-96" />
              <Skeleton className="h-64" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-64" />
              <Skeleton className="h-64" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Project not found</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">The project you're looking for doesn't exist or you don't have permission to view it.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Project Header */}
      <ProjectHeader project={project} />

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project Overview */}
          <ProjectOverview project={project} />
          
          {/* Project Tasks */}
          <ProjectTasks projectId={project.id} project={project} />
          
          {/* Project Timeline */}
          <ProjectTimeline project={project} />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Project Team */}
          <ProjectTeam teamMembers={project.teamMembers || []} />
          
          {/* Project Activity */}
          <ProjectActivity projectId={project.id} />
        </div>
      </div>
    </div>
  );
}
