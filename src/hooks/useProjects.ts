import { useState, useEffect, useCallback } from 'react';
import { projectService } from '@/lib/project';
import type { Project, ProjectStatus } from '@/lib/project';
import { useAuth } from '@/contexts/auth-context';

export function useProjects() {
  const { currentUser } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load all projects for the current user
  const loadProjects = useCallback(async () => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const userProjects = await projectService.getUserProjects(currentUser.uid);
      setProjects(userProjects);
      setError(null);
    } catch (err) {
      console.error('Failed to load projects:', err);
      setError('Failed to load projects. Please try again.');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  // Filter projects by status
  const getProjectsByStatus = (status: ProjectStatus) => {
    return projects.filter(project => project.status === status);
  };

  // Get projects by priority
  const getProjectsByPriority = (priority: 'low' | 'medium' | 'high') => {
    return projects.filter(project => project.priority === priority);
  };

  // Get projects due soon (within 7 days)
  const getDueSoonProjects = () => {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    
    return projects.filter(project => {
      if (!project.dueDate) return false;
      const dueDate = typeof project.dueDate === 'string' ? new Date(project.dueDate) : project.dueDate;
      return dueDate >= today && dueDate <= nextWeek;
    });
  };

  // Load projects on component mount and when currentUser changes
  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  return {
    projects,
    loading,
    error,
    loadProjects,
    getProjectsByStatus,
    getProjectsByPriority,
    getDueSoonProjects,
  };
}
