'use client';

import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ProjectHeader } from '@/components/project/project-header';
import { ProjectOverview } from '@/components/project/project-overview';
import { ProjectTeam } from '@/components/project/project-team';
import { ProjectTasks } from '@/components/project/project-tasks';
import { ProjectTimeline } from '@/components/project/project-timeline';
import { ProjectActivity } from '@/components/project/project-activity';
import { ProjectDocuments } from '@/components/project/project-documents';
import type { Project } from '@/lib/project';
import { getProjectById } from '@/lib/project';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjectData = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch real project data from Firebase
        const data = await getProjectById(id as string);
        setProject(data);
        
        if (!data) {
          setError('Project not found');
        }
      } catch (err) {
        console.error('Error fetching project:', err);
        setError('Failed to load project. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectData();
  }, [id]);

  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    // Re-run the fetch logic by triggering useEffect
  };

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
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center max-w-md">
            <div className="rounded-full bg-muted p-3 mb-4 mx-auto w-fit">
              <AlertCircle className="h-6 w-6 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {error || 'Project not found'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {error 
                ? 'There was an error loading this project. Please try again.'
                : 'The project you\'re looking for doesn\'t exist or you don\'t have permission to view it.'
              }
            </p>
            {error && (
              <Button onClick={handleRetry} variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            )}
          </div>
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
          <ProjectTeam 
            teamMembers={project.teamMembers || []} 
            isLoading={isLoading}
            error={error}
          />
          
          {/* Project Activity */}
          <ProjectActivity projectId={project.id} />
          
          {/* Project Documents */}
          <ProjectDocuments projectId={project.id} />
        </div>
      </div>
    </div>
  );
}
