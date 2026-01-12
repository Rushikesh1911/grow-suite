import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X, Calendar, User, Flag, Target } from 'lucide-react';
import type { Task, TaskStatus, TaskPriority } from '@/lib/task';
import { createTask } from '@/lib/task';
import type { Project } from '@/lib/project';

interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated: (task: Task) => void;
  project?: Project;
}

export function CreateTaskModal({ isOpen, onClose, onTaskCreated, project }: CreateTaskModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo' as TaskStatus,
    priority: 'medium' as TaskPriority,
    dueDate: '',
    assigneeId: '',
    assigneeName: '',
  });
  
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [newSubtask, setNewSubtask] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        dueDate: '',
        assigneeId: '',
        assigneeName: '',
      });
      setSubtasks([]);
      setNewSubtask('');
      setError(null);
    }
  }, [isOpen]);

  // Debug logging
  console.log('CreateTaskModal render:', { isOpen, project: project?.name });

  // Early return if project is not available or modal is not open - after all hooks
  if (!project || !project.name || !isOpen) {
    return null;
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addSubtask = () => {
    if (newSubtask.trim()) {
      const subtask: Subtask = {
        id: Date.now().toString(),
        title: newSubtask.trim(),
        completed: false,
      };
      setSubtasks(prev => [...prev, subtask]);
      setNewSubtask('');
    }
  };

  const removeSubtask = (id: string) => {
    setSubtasks(prev => prev.filter(subtask => subtask.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('Task title is required');
      return;
    }

    if (!project) {
      setError('Project information is required');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const taskData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        status: formData.status,
        priority: formData.priority,
        dueDate: formData.dueDate ? new Date(formData.dueDate) : null,
        assigneeId: formData.assigneeId || null,
        assigneeName: formData.assigneeName || null,
        projectId: project.id,
        subtasks: subtasks.map(({ title, completed }) => ({ title, completed })),
        createdBy: project.createdBy, // Use project creator as task creator
      };

      const taskId = await createTask(taskData);
      
      // Create the task object for callback
      const newTask: Task = {
        id: taskId,
        ...taskData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      onTaskCreated(newTask);
      onClose();
    } catch (err) {
      console.error('Error creating task:', err);
      setError('Failed to create task. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const priorityOptions = [
    { 
      value: 'low', 
      label: 'Low', 
      color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      dotColor: 'bg-green-500',
    },
    { 
      value: 'medium', 
      label: 'Medium', 
      color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      dotColor: 'bg-yellow-500',
    },
    { 
      value: 'high', 
      label: 'High', 
      color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      dotColor: 'bg-red-500',
    },
  ];

  const statusOptions = [
    { 
      value: 'todo', 
      label: 'To Do', 
      color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
      dotColor: 'bg-gray-500',
    },
    { 
      value: 'in-progress', 
      label: 'In Progress', 
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      dotColor: 'bg-blue-500',
    },
    { 
      value: 'done', 
      label: 'Done', 
      color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      dotColor: 'bg-green-500',
    },
  ];
  
  const SelectOption = ({ 
    value, 
    label, 
    dotColor, 
    isSelected, 
    onClick 
  }: { 
    value: string; 
    label: string; 
    dotColor: string; 
    isSelected: boolean; 
    onClick: () => void 
  }) => (
    <div 
      onClick={onClick}
      className={`relative flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer transition-all duration-200 ${
        isSelected 
          ? 'bg-primary/5 dark:bg-primary/10 border border-primary/20 shadow-sm' 
          : 'hover:bg-muted/30 border border-transparent hover:border-muted-foreground/10'
      }`}
    >
      <div className={`h-2.5 w-2.5 rounded-full ${dotColor} flex-shrink-0`}></div>
      <span className="text-sm font-medium">{label}</span>
      {isSelected && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary"></div>
      )}
    </div>
  );
  
  const SelectGroup = ({ 
    label, 
    children 
  }: { 
    label: string; 
    children: React.ReactNode 
  }) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-muted-foreground">{label}</Label>
      <div className="space-y-2">
        {children}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 dark:bg-background/80">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Target className="h-5 w-5" />
            Create New Task
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project and Client Info */}
          <Card className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600">
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-300">Project</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                    <span className="text-sm font-medium">{project?.name || 'Loading...'}</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-300">Client</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="text-sm font-medium">{project?.clientName || 'No Client'}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Basic Task Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Task Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter task title..."
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe the task..."
                className="mt-1"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <SelectGroup label="Status">
                <div className="space-y-2 p-1.5 bg-muted/20 dark:bg-gray-800/50 rounded-lg">
                  {statusOptions.map((option) => (
                    <SelectOption
                      key={option.value}
                      value={option.value}
                      label={option.label}
                      dotColor={option.dotColor}
                      isSelected={formData.status === option.value}
                      onClick={() => handleInputChange('status', option.value as TaskStatus)}
                    />
                  ))}
                </div>
              </SelectGroup>

              <SelectGroup label="Priority">
                <div className="space-y-2 p-1.5 bg-muted/20 dark:bg-gray-800/50 rounded-lg">
                  {priorityOptions.map((option) => (
                    <SelectOption
                      key={option.value}
                      value={option.value}
                      label={option.label}
                      dotColor={option.dotColor}
                      isSelected={formData.priority === option.value}
                      onClick={() => handleInputChange('priority', option.value as TaskPriority)}
                    />
                  ))}
                </div>
              </SelectGroup>

              <div>
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => handleInputChange('dueDate', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="assignee">Assignee</Label>
              <Input
                id="assignee"
                value={formData.assigneeName}
                onChange={(e) => handleInputChange('assigneeName', e.target.value)}
                placeholder="Enter assignee name..."
                className="mt-1"
              />
            </div>
          </div>

          {/* Subtasks */}
          <div>
            <Label className="text-base font-medium">Subtasks</Label>
            <div className="mt-2 space-y-2">
              {subtasks.map((subtask) => (
                <div key={subtask.id} className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded border border-gray-300 flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-gray-300"></div>
                  </div>
                  <span className="flex-1 text-sm">{subtask.title}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSubtask(subtask.id)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded border border-dashed border-gray-300"></div>
                <Input
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e.target.value)}
                  placeholder="Add subtask..."
                  className="flex-1"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSubtask();
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addSubtask}
                  disabled={!newSubtask.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.title.trim()}
            >
              {isSubmitting ? 'Creating...' : 'Create Task'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
