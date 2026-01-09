import { collection, getDocs, getDoc, doc, query, where, Timestamp, addDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';

export type ActivityType = 'created' | 'updated' | 'deleted' | 'commented' | 'uploaded' | 'changed status' | 'assigned' | 'completed';

export interface Activity {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  action: ActivityType;
  target?: string;
  targetType?: 'project' | 'task' | 'file' | 'comment' | 'status' | 'team';
  projectId: string;
  timestamp: Date | Timestamp;
  read?: boolean;
  metadata?: Record<string, any>;
}

const ACTIVITIES_COLLECTION = 'activities';

/**
 * Get all activities for a specific project
 */
export const getProjectActivities = async (projectId: string, limitCount: number = 50): Promise<Activity[]> => {
  try {
    const activitiesRef = collection(db, ACTIVITIES_COLLECTION);
    // Simple query by projectId only to avoid index requirements
    const q = query(activitiesRef, where('projectId', '==', projectId));
    const querySnapshot = await getDocs(q);
    
    // Return empty array if no documents exist (this is normal)
    if (querySnapshot.empty) {
      return [];
    }
    
    // Sort and limit in JavaScript instead of Firestore to avoid index requirements
    const activities = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      // Convert Firestore timestamps to Date objects if they exist
      timestamp: doc.data().timestamp?.toDate() || new Date(),
    })) as Activity[];
    
    // Sort by timestamp (newest first) and limit in JavaScript
    return activities
      .sort((a, b) => (b.timestamp as Date).getTime() - (a.timestamp as Date).getTime())
      .slice(0, limitCount);
  } catch (error) {
    console.error('Error fetching project activities:', error);
    // Handle Firebase index requirement gracefully
    if (error instanceof Error && error.message.includes('requires an index')) {
      console.warn('Activity query requires Firestore index. Returning empty array for now.');
      return [];
    }
    // Don't throw an error for empty collections, just return empty array
    if (error instanceof Error && error.message.includes('No documents to fetch')) {
      return [];
    }
    throw new Error('Failed to fetch activities');
  }
};

/**
 * Get a single activity by ID
 */
export const getActivityById = async (activityId: string): Promise<Activity | null> => {
  try {
    const activityDoc = await getDoc(doc(db, ACTIVITIES_COLLECTION, activityId));
    
    if (!activityDoc.exists()) {
      return null;
    }
    
    return {
      id: activityDoc.id,
      ...activityDoc.data(),
      // Convert Firestore timestamps to Date objects if they exist
      timestamp: activityDoc.data().timestamp?.toDate() || new Date(),
    } as Activity;
  } catch (error) {
    console.error('Error fetching activity:', error);
    throw new Error('Failed to fetch activity');
  }
};

/**
 * Create a new activity log entry
 */
export const createActivity = async (activity: Omit<Activity, 'id' | 'timestamp'>): Promise<string> => {
  try {
    const activityData = {
      ...activity,
      timestamp: Timestamp.now(),
      read: false,
    };
    
    const docRef = await addDoc(collection(db, ACTIVITIES_COLLECTION), activityData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating activity:', error);
    throw new Error('Failed to create activity');
  }
};

/**
 * Mark activities as read
 */
export const markActivitiesAsRead = async (activityIds: string[]): Promise<void> => {
  try {
    const batch = activityIds.map(async (id) => {
      const activityRef = doc(db, ACTIVITIES_COLLECTION, id);
      await updateDoc(activityRef, { read: true });
    });
    
    await Promise.all(batch);
  } catch (error) {
    console.error('Error marking activities as read:', error);
    throw new Error('Failed to mark activities as read');
  }
};

/**
 * Common activity creation helpers
 */
export const logProjectCreated = async (projectId: string, userId: string, userName: string, userEmail: string, projectName: string): Promise<string> => {
  return createActivity({
    userId,
    userName,
    userEmail,
    action: 'created',
    target: projectName,
    targetType: 'project',
    projectId,
  });
};

export const logTaskUpdated = async (projectId: string, userId: string, userName: string, userEmail: string, taskTitle: string): Promise<string> => {
  return createActivity({
    userId,
    userName,
    userEmail,
    action: 'updated',
    target: taskTitle,
    targetType: 'task',
    projectId,
  });
};

export const logCommentAdded = async (projectId: string, userId: string, userName: string, userEmail: string, comment: string): Promise<string> => {
  return createActivity({
    userId,
    userName,
    userEmail,
    action: 'commented',
    target: comment,
    targetType: 'comment',
    projectId,
  });
};

export const logFileUploaded = async (projectId: string, userId: string, userName: string, userEmail: string, fileName: string): Promise<string> => {
  return createActivity({
    userId,
    userName,
    userEmail,
    action: 'uploaded',
    target: fileName,
    targetType: 'file',
    projectId,
  });
};

export const logStatusChanged = async (projectId: string, userId: string, userName: string, userEmail: string): Promise<string> => {
  return createActivity({
    userId,
    userName,
    userEmail,
    action: 'changed status',
    targetType: 'status',
    projectId,
  });
};

export const activityService = {
  getProjectActivities,
  getActivityById,
  createActivity,
  markActivitiesAsRead,
  logProjectCreated,
  logTaskUpdated,
  logCommentAdded,
  logFileUploaded,
  logStatusChanged,
};
