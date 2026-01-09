import { collection, getDocs, getDoc, doc, query, where, Timestamp, addDoc, updateDoc, deleteDoc, orderBy } from 'firebase/firestore';
import { db } from '@/config/firebase';

export type TimelineEventStatus = 'completed' | 'in-progress' | 'upcoming' | 'delayed';
export type TimelineEventType = 'milestone' | 'task' | 'meeting' | 'delivery';

export interface TimelineEvent {
  id: string;
  title: string;
  description?: string;
  date: string | Date | Timestamp;
  status: TimelineEventStatus;
  type: TimelineEventType;
  projectId: string;
  assigneeId?: string;
  assigneeName?: string;
  createdBy: string;
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
}

const TIMELINE_COLLECTION = 'timeline';

/**
 * Get all timeline events for a specific project
 */
export const getProjectTimeline = async (projectId: string): Promise<TimelineEvent[]> => {
  try {
    const timelineRef = collection(db, TIMELINE_COLLECTION);
    // Simple query by projectId only to avoid index requirements
    const q = query(timelineRef, where('projectId', '==', projectId));
    const querySnapshot = await getDocs(q);
    
    // Return empty array if no documents exist (this is normal)
    if (querySnapshot.empty) {
      return [];
    }
    
    // Sort in JavaScript instead of Firestore to avoid index requirements
    const events = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      // Convert Firestore timestamps to Date objects if they exist
      date: doc.data().date?.toDate() || new Date(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as TimelineEvent[];
    
    // Sort by date in JavaScript
    return events.sort((a, b) => (a.date as Date).getTime() - (b.date as Date).getTime());
  } catch (error) {
    console.error('Error fetching project timeline:', error);
    // Handle Firebase index requirement gracefully
    if (error instanceof Error && error.message.includes('requires an index')) {
      console.warn('Timeline query requires Firestore index. Returning empty array for now.');
      return [];
    }
    // Don't throw an error for empty collections, just return empty array
    if (error instanceof Error && error.message.includes('No documents to fetch')) {
      return [];
    }
    throw new Error('Failed to fetch timeline');
  }
};

/**
 * Get a single timeline event by ID
 */
export const getTimelineEventById = async (eventId: string): Promise<TimelineEvent | null> => {
  try {
    const eventDoc = await getDoc(doc(db, TIMELINE_COLLECTION, eventId));
    
    if (!eventDoc.exists()) {
      return null;
    }
    
    return {
      id: eventDoc.id,
      ...eventDoc.data(),
      // Convert Firestore timestamps to Date objects if they exist
      date: eventDoc.data().date?.toDate() || new Date(),
      createdAt: eventDoc.data().createdAt?.toDate() || new Date(),
      updatedAt: eventDoc.data().updatedAt?.toDate() || new Date(),
    } as TimelineEvent;
  } catch (error) {
    console.error('Error fetching timeline event:', error);
    throw new Error('Failed to fetch timeline event');
  }
};

/**
 * Create a new timeline event
 */
export const createTimelineEvent = async (event: Omit<TimelineEvent, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const eventData = {
      ...event,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    
    const docRef = await addDoc(collection(db, TIMELINE_COLLECTION), eventData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating timeline event:', error);
    throw new Error('Failed to create timeline event');
  }
};

/**
 * Update an existing timeline event
 */
export const updateTimelineEvent = async (eventId: string, updates: Partial<TimelineEvent>): Promise<void> => {
  try {
    const eventRef = doc(db, TIMELINE_COLLECTION, eventId);
    await updateDoc(eventRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating timeline event:', error);
    throw new Error('Failed to update timeline event');
  }
};

/**
 * Delete a timeline event
 */
export const deleteTimelineEvent = async (eventId: string): Promise<void> => {
  try {
    const eventRef = doc(db, TIMELINE_COLLECTION, eventId);
    await deleteDoc(eventRef);
  } catch (error) {
    console.error('Error deleting timeline event:', error);
    throw new Error('Failed to delete timeline event');
  }
};

/**
 * Generate automatic timeline events based on project data
 */
export const generateProjectTimeline = async (project: any): Promise<string[]> => {
  try {
    const eventIds: string[] = [];
    
    // Project kickoff event
    const kickoffId = await createTimelineEvent({
      title: 'Project Kickoff',
      description: 'Initial meeting to discuss project requirements and goals',
      date: project.startDate || new Date(),
      status: 'completed',
      type: 'meeting',
      projectId: project.id,
      createdBy: project.createdBy,
    });
    eventIds.push(kickoffId);
    
    // Project completion milestone
    if (project.dueDate) {
      const completionId = await createTimelineEvent({
        title: 'Project Completion',
        description: 'Final delivery and project handover',
        date: project.dueDate,
        status: 'upcoming',
        type: 'delivery',
        projectId: project.id,
        createdBy: project.createdBy,
      });
      eventIds.push(completionId);
    }
    
    return eventIds;
  } catch (error) {
    console.error('Error generating project timeline:', error);
    throw new Error('Failed to generate timeline');
  }
};

export const timelineService = {
  getProjectTimeline,
  getTimelineEventById,
  createTimelineEvent,
  updateTimelineEvent,
  deleteTimelineEvent,
  generateProjectTimeline,
};
