import type { Task, TaskStatus, TaskPriority } from './task';
import { createTask } from './task';
import type { Project } from './project';

/**
 * Create a new task for a specific project with simplified interface
 */
export const createProjectTask = async (
  projectId: string,
  project: Project,
  taskData: {
    title: string;
    description?: string;
    priority?: TaskPriority;
    status?: TaskStatus;
    dueDate?: Date;
    assigneeName?: string;
    subtasks?: string[];
  }
): Promise<Task> => {
  const task = {
    title: taskData.title.trim(),
    description: taskData.description?.trim() || '',
    status: taskData.status || 'todo',
    priority: taskData.priority || 'medium',
    dueDate: taskData.dueDate || null,
    assigneeId: null,
    assigneeName: taskData.assigneeName || null,
    projectId: projectId,
    subtasks: taskData.subtasks?.map(title => ({ title, completed: false })) || [],
    createdBy: project.createdBy,
  };

  const taskId = await createTask(task);
  
  return {
    id: taskId,
    ...task,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

/**
 * Quick task creation with minimal required fields
 */
export const createQuickTask = async (
  projectId: string,
  project: Project,
  title: string
): Promise<Task> => {
  return createProjectTask(projectId, project, { title });
};

/**
 * Create multiple tasks at once
 */
export const createMultipleTasks = async (
  projectId: string,
  project: Project,
  tasks: Array<{ title: string; description?: string }>
): Promise<Task[]> => {
  const createdTasks: Task[] = [];
  
  for (const taskData of tasks) {
    const task = await createProjectTask(projectId, project, taskData);
    createdTasks.push(task);
  }
  
  return createdTasks;
};

/**
 * Create task from template
 */
export const createTaskFromTemplate = async (
  projectId: string,
  project: Project,
  template: {
    title: string;
    description?: string;
    subtasks?: string[];
    priority?: TaskPriority;
  }
): Promise<Task> => {
  return createProjectTask(projectId, project, {
    title: template.title,
    description: template.description,
    priority: template.priority,
    subtasks: template.subtasks,
  });
};

// Predefined task templates  [this is kept for showcaase kept if there is error i will show this as a sample (;)]
export const TASK_TEMPLATES = {
  'website-redesign': {
    title: 'Homepage Design',
    description: 'Create responsive homepage design with modern UI/UX',
    subtasks: [
      'Create wireframes',
      'Design mockups',
      'Implement responsive layout',
      'Add animations and interactions'
    ],
    priority: 'high' as TaskPriority
  },
  'feature-development': {
    title: 'New Feature Development',
    description: 'Implement new feature from requirements',
    subtasks: [
      'Analyze requirements',
      'Create technical specification',
      'Implement core functionality',
      'Write tests',
      'Deploy to staging'
    ],
    priority: 'medium' as TaskPriority
  },
  'bug-fix': {
    title: 'Bug Fix',
    description: 'Fix reported issue',
    subtasks: [
      'Reproduce the issue',
      'Identify root cause',
      'Implement fix',
      'Test solution',
      'Deploy fix'
    ],
    priority: 'high' as TaskPriority
  },
  'meeting': {
    title: 'Team Meeting',
    description: 'Schedule and prepare for team meeting',
    subtasks: [
      'Set agenda',
      'Send invitations',
      'Prepare materials',
      'Book meeting room',
      'Follow up with notes'
    ],
    priority: 'medium' as TaskPriority
  }
};
