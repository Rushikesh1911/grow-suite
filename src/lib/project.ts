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
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      // Convert Firestore timestamps to Date objects if they exist
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Project[];
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
    
    return {
      id: projectDoc.id,
      ...projectDoc.data(),
      // Convert Firestore timestamps to Date objects if they exist
      createdAt: projectDoc.data().createdAt?.toDate() || new Date(),
      updatedAt: projectDoc.data().updatedAt?.toDate() || new Date(),
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
