import { collection, getDocs, getDoc, doc, query, where, Timestamp } from 'firebase/firestore';
import { db } from '@/config/firebase';

export type ProjectStatus = 'planning' | 'in-progress' | 'review' | 'completed' | 'on-hold' | 'cancelled';
export type ProjectPriority = 'low' | 'medium' | 'high';

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  startDate: string | Date;
  dueDate?: string | Date | null;
  progress: number;
  clientId?: string;
  clientName?: string;
  budget?: number;
  estimatedHours?: number;
  completedTasks?: number;
  totalTasks?: number;
  tags?: string[];
  teamMembers?: Array<{
    userId: string;
    name: string;
    role: string;
    avatar?: string;
  }>;
  createdBy: string;
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
}

const PROJECTS_COLLECTION = 'projects';

/**
 * Get all projects for the current user
 */
export const getUserProjects = async (userId: string): Promise<Project[]> => {
  try {
    const projectsRef = collection(db, PROJECTS_COLLECTION);
    const q = query(projectsRef, where('createdBy', '==', userId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        // Map Firebase field names to TypeScript interface
        name: data.projectName || data.projectname || data.name || 'Untitled Project',
        description: data.description,
        status: data.status || 'planning',
        priority: data.priority || 'medium',
        startDate: data.startDate || new Date(),
        dueDate: data.dueDate || null,
        progress: data.progress || 0,
        clientId: data.clientId,
        clientName: data.clientName || data.clientname || '',
        budget: data.budget,
        estimatedHours: data.estimatedHours,
        completedTasks: data.completedTasks,
        totalTasks: data.totalTasks,
        tags: data.tags || [],
        teamMembers: data.teamMembers || [],
        createdBy: data.createdBy || '',
        // Convert Firestore timestamps to Date objects if they exist
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Project;
    });
  } catch (error) {
    console.error('Error fetching user projects:', error);
    throw new Error('Failed to fetch projects');
  }
};

/**
 * Get a single project by ID
 */
export const getProjectById = async (projectId: string): Promise<Project | null> => {
  try {
    const projectDoc = await getDoc(doc(db, PROJECTS_COLLECTION, projectId));
    
    if (!projectDoc.exists()) {
      return null;
    }
    
    const data = projectDoc.data();
    
    // Debug logging to see what fields are available
    console.log('Firebase project data:', data);
    console.log('projectname field:', data.projectname);
    console.log('name field:', data.name);
    
    return {
      id: projectDoc.id,
      // Map Firebase field names to TypeScript interface
      name: data.projectName || data.projectname || data.name || 'Untitled Project',
      description: data.description,
      status: data.status || 'planning',
      priority: data.priority || 'medium',
      startDate: data.startDate || new Date(),
      dueDate: data.dueDate || null,
      progress: data.progress || 0,
      clientId: data.clientId,
      clientName: data.clientName || data.clientname || '',
      budget: data.budget,
      estimatedHours: data.estimatedHours,
      completedTasks: data.completedTasks,
      totalTasks: data.totalTasks,
      tags: data.tags || [],
      teamMembers: data.teamMembers || [],
      createdBy: data.createdBy || '',
      // Convert Firestore timestamps to Date objects if they exist
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    } as Project;
  } catch (error) {
    console.error('Error fetching project:', error);
    throw new Error('Failed to fetch project');
  }
};

export const projectService = {
  getUserProjects,
  getProjectById,
};
