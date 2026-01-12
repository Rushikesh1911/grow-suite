import { createQuickTask, createProjectTask, createMultipleTasks, createTaskFromTemplate, TASK_TEMPLATES } from '@/lib/task-helpers';
import { getProjectById } from '@/lib/project';

/**
 * Example: How to create tasks for a project
 */

// 1. Get project details
const project = await getProjectById('your-project-id');

if (!project) {
  throw new Error('Project not found');
}

// 2. Create a quick task (minimal data)
const quickTask = await createQuickTask(
  'your-project-id',
  project,
  'Review project requirements'
);

console.log('Created quick task:', quickTask);

// 3. Create a detailed task
const detailedTask = await createProjectTask(
  'your-project-id',
  project,
  {
    title: 'Implement user authentication',
    description: 'Add login and registration functionality with JWT tokens',
    priority: 'high',
    status: 'todo',
    dueDate: new Date('2024-02-15'),
    assigneeName: 'John Developer',
    subtasks: [
      'Design authentication flow',
      'Implement login API',
      'Implement registration API',
      'Add JWT token handling',
      'Create login form UI',
      'Create registration form UI'
    ]
  }
);

console.log('Created detailed task:', detailedTask);

// 4. Create multiple tasks at once
const multipleTasks = await createMultipleTasks(
  'your-project-id',
  project,
  [
    {
      title: 'Database schema design',
      description: 'Design database tables and relationships'
    },
    {
      title: 'API documentation',
      description: 'Write comprehensive API documentation'
    },
    {
      title: 'Unit tests',
      description: 'Write unit tests for all modules'
    }
  ]
);

console.log('Created multiple tasks:', multipleTasks);

// 5. Create task from template
const templateTask = await createTaskFromTemplate(
  'your-project-id',
  project,
  TASK_TEMPLATES['website-redesign']
);

console.log('Created template task:', templateTask);

// 6. Usage in React component
export const TaskCreationExample = () => {
  const handleCreateTask = async () => {
    try {
      const task = await createQuickTask(
        'project-123',
        project,
        'New task from component'
      );
      
      // Handle success - maybe update state or show notification
      console.log('Task created successfully:', task);
    } catch (error) {
      // Handle error
      console.error('Failed to create task:', error);
    }
  };

  return (
    <button onClick={handleCreateTask}>
      Create Quick Task
    </button>
  );
};
