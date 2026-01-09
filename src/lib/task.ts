import { collection, getDocs, getDoc, doc, query, where, Timestamp, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';

export type TaskStatus = 'todo' | 'in-progress' | 'done' | 'blocked';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string | Date | Timestamp | null;
  assigneeId?: string | null;
  assigneeName?: string | null;
  projectId: string;
  subtasks?: Array<{
    title: string;
    completed: boolean;
  }>;
  createdBy: string;
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
  actualHours?: number;
  tags?: string[];
}

const TASKS_COLLECTION = 'tasks';

/**
 * Get all tasks for a specific project
 */
export const getProjectTasks = async (projectId: string): Promise<Task[]> => {
  try {
    const tasksRef = collection(db, TASKS_COLLECTION);
    const q = query(tasksRef, where('projectId', '==', projectId));
    const querySnapshot = await getDocs(q);
    
    // Return empty array if no documents exist (this is normal)
    if (querySnapshot.empty) {
      return [];
    }
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      // Convert Firestore timestamps to Date objects if they exist
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Task[];
  } catch (error) {
    console.error('Error fetching project tasks:', error);
    // Don't throw an error for empty collections, just return empty array
    if (error instanceof Error && error.message.includes('No documents to fetch')) {
      return [];
    }
    throw new Error('Failed to fetch tasks');
  }
};

/**
 * Get a single task by ID
 */
export const getTaskById = async (taskId: string): Promise<Task | null> => {
  try {
    const taskDoc = await getDoc(doc(db, TASKS_COLLECTION, taskId));
    
    if (!taskDoc.exists()) {
      return null;
    }
    
    return {
      id: taskDoc.id,
      ...taskDoc.data(),
      // Convert Firestore timestamps to Date objects if they exist
      createdAt: taskDoc.data().createdAt?.toDate() || new Date(),
      updatedAt: taskDoc.data().updatedAt?.toDate() || new Date(),
    } as Task;
  } catch (error) {
    console.error('Error fetching task:', error);
    throw new Error('Failed to fetch task');
  }
};

/**
 * Create a new task
 */
export const createTask = async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const taskData = {
      ...task,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    
    const docRef = await addDoc(collection(db, TASKS_COLLECTION), taskData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating task:', error);
    throw new Error('Failed to create task');
  }
};

/**
 * Update an existing task
 */
export const updateTask = async (taskId: string, updates: Partial<Task>): Promise<void> => {
  try {
    const taskRef = doc(db, TASKS_COLLECTION, taskId);
    await updateDoc(taskRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating task:', error);
    throw new Error('Failed to update task');
  }
};

/**
 * Delete a task
 */
export const deleteTask = async (taskId: string): Promise<void> => {
  try {
    const taskRef = doc(db, TASKS_COLLECTION, taskId);
    await deleteDoc(taskRef);
  } catch (error) {
    console.error('Error deleting task:', error);
    throw new Error('Failed to delete task');
  }
};

export const taskService = {
  getProjectTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
