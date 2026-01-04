'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ProjectHeader } from '@/components/project/project-header';
import { ProjectOverview } from '@/components/project/project-overview';
import { ProjectTeam } from '@/components/project/project-team';
import { ProjectTasks } from '@/components/project/project-tasks';
import { ProjectTimeline } from '@/components/project/project-timeline';
import { ProjectActivity } from '@/components/project/project-activity';
import { ProjectDocuments } from '@/components/project/project-documents';
import { Project } from '@/lib/project';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch
    const fetchProject = async () => {
      try {
        // Replace with actual API call
        // const data = await getProjectById(id as string);
        // setProject(data);
        
        // Mock data for now
        setTimeout(() => {
          setProject({
            id: id as string,
            name: 'Website Redesign',
            description: 'Complete redesign of the company website with modern UI/UX and improved performance.',
            status: 'in-progress',
            priority: 'high',
            startDate: new Date('2024-01-15'),
            dueDate: new Date('2024-03-30'),
            progress: 65,
            clientName: 'Acme Corp',
            budget: 15000,
            estimatedHours: 320,
            completedTasks: 13,
            totalTasks: 20,
            tags: ['design', 'development', 'marketing'],
            teamMembers: [
              { userId: '1', name: 'Alex Johnson', role: 'Project Manager', avatar: '' },
              { userId: '2', name: 'Sam Wilson', role: 'UI/UX Designer', avatar: '' },
              { userId: '3', name: 'Jordan Lee', role: 'Frontend Developer', avatar: '' },
              { userId: '4', name: 'Taylor Smith', role: 'Backend Developer', avatar: '' },
            ],
            createdBy: '1',
            createdAt: new Date('2024-01-10'),
            updatedAt: new Date(),
          });
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching project:', error);
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [id]);

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
          <ProjectTasks projectId={project.id} />
          
          {/* Project Timeline */}
          <ProjectTimeline project={project} />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Project Team */}
          <ProjectTeam teamMembers={project.teamMembers || []} />
          
          {/* Project Activity */}
          <ProjectActivity projectId={project.id} />
          
          {/* Project Documents */}
          <ProjectDocuments projectId={project.id} />
        </div>
      </div>
    </div>
  );
}
