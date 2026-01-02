import { useState } from 'react';
import {
  X,
  FolderPlus,
  FileText,
  Calendar,
  Users,
  Tag as TagIcon,
  DollarSign,
  AlertCircle,
  Loader2,
  Clock,
  Flag,
  Type,
  Hash,
  User,
  ListChecks,
  BarChart2,
  FileCheck,
  FileClock,
  Building2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/toast';
import { auth } from '@/config/firebase';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (projectData: ProjectData) => void;
}

type ProjectStatus = 'planning' | 'in-progress' | 'on-hold' | 'completed' | 'cancelled';
type Priority = 'low' | 'medium' | 'high' | 'urgent';

type ProjectData = {
  // Basic Info
  projectName: string;
  projectCode: string;
  description: string;
  clientId?: string;
  clientName: string;
  
  // Timeline
  startDate: string;
  dueDate: string;
  estimatedHours: string;
  
  // Budget & Billing
  budget: string;
  currency: string;
  billingMethod: 'fixed' | 'hourly' | 'milestone';
  
  // Status & Priority
  status: ProjectStatus;
  priority: Priority;
  
  // Team
  teamMembers: string[];
  projectManager: string;
  
  // Additional
  tags: string[];
  notes: string;
};

const STATUS_OPTIONS = [
  { value: 'planning', label: 'Planning', icon: FileText },
  { value: 'in-progress', label: 'In Progress', icon: BarChart2 },
  { value: 'on-hold', label: 'On Hold', icon: FileClock },
  { value: 'completed', label: 'Completed', icon: FileCheck },
  { value: 'cancelled', label: 'Cancelled' },
];

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

const BILLING_METHODS = [
  { value: 'fixed', label: 'Fixed Price' },
  { value: 'hourly', label: 'Hourly Rate' },
  { value: 'milestone', label: 'Milestone-based' },
];

const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
];

export function CreateProjectModal({ isOpen, onClose, onSave }: CreateProjectModalProps) {
  const [errors, setErrors] = useState<Partial<Record<keyof ProjectData, string>>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'team' | 'budget'>('details');

  const [formData, setFormData] = useState<ProjectData>({
    projectName: '',
    projectCode: '',
    description: '',
    clientName: '',
    startDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    estimatedHours: '',
    budget: '',
    currency: 'USD',
    billingMethod: 'fixed',
    status: 'planning',
    priority: 'medium',
    teamMembers: [],
    projectManager: '',
    tags: [],
    notes: ''
  });

  const handleInputChange = (field: keyof ProjectData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ProjectData, string>> = {};

    if (!formData.projectName.trim()) {
      newErrors.projectName = 'Project name is required';
    }

    if (!formData.clientName.trim()) {
      newErrors.clientName = 'Client is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const currentUser = auth.currentUser;
    if (!currentUser) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to create a project',
        variant: 'error'
      });
      return;
    }

    setIsSaving(true);

    try {
      // Here you would typically make an API call to save the project
      // For now, we'll just call the onSave callback with the form data
      if (onSave) {
        onSave(formData);
      }
      
      toast({
        title: 'Success',
        description: 'Project created successfully',
        variant: 'success'
      });
      
      onClose();
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: 'Error',
        description: 'Failed to create project. Please try again.',
        variant: 'error'
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Project</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              disabled={isSaving}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="mb-6">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('details')}
                  className={cn(
                    'py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2',
                    activeTab === 'details'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200'
                  )}
                >
                  <FileText className="h-4 w-4" />
                  <span>Details</span>
                </button>
                <button
                  onClick={() => setActiveTab('team')}
                  className={cn(
                    'py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2',
                    activeTab === 'team'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200'
                  )}
                >
                  <Users className="h-4 w-4" />
                  <span>Team</span>
                </button>
                <button
                  onClick={() => setActiveTab('budget')}
                  className={cn(
                    'py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2',
                    activeTab === 'budget'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200'
                  )}
                >
                  <DollarSign className="h-4 w-4" />
                  <span>Budget</span>
                </button>
              </nav>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {activeTab === 'details' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="projectName" className="flex items-center">
                      <Type className="h-4 w-4 mr-2 text-gray-500" />
                      Project Name *
                    </Label>
                    <Input
                      id="projectName"
                      value={formData.projectName}
                      onChange={(e) => handleInputChange('projectName', e.target.value)}
                      placeholder="e.g. Website Redesign"
                      className={errors.projectName ? 'border-red-500' : ''}
                    />
                    {errors.projectName && (
                      <p className="text-sm text-red-500 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" /> {errors.projectName}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="projectCode" className="flex items-center">
                      <Hash className="h-4 w-4 mr-2 text-gray-500" />
                      Project Code
                    </Label>
                    <Input
                      id="projectCode"
                      value={formData.projectCode}
                      onChange={(e) => handleInputChange('projectCode', e.target.value)}
                      placeholder="e.g. WEB-2025"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="clientName" className="flex items-center">
                      <Building2 className="h-4 w-4 mr-2 text-gray-500" />
                      Client *
                    </Label>
                    <Input
                      id="clientName"
                      value={formData.clientName}
                      onChange={(e) => handleInputChange('clientName', e.target.value)}
                      placeholder="Select client"
                      className={errors.clientName ? 'border-red-500' : ''}
                    />
                    {errors.clientName && (
                      <p className="text-sm text-red-500 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" /> {errors.clientName}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status" className="flex items-center">
                      <Flag className="h-4 w-4 mr-2 text-gray-500" />
                      Status
                    </Label>
                    <select
                      id="status"
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value as ProjectStatus)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="startDate" className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      Start Date
                    </Label>
                    <Input
                      type="date"
                      id="startDate"
                      value={formData.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dueDate" className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      Due Date
                    </Label>
                    <Input
                      type="date"
                      id="dueDate"
                      value={formData.dueDate}
                      onChange={(e) => handleInputChange('dueDate', e.target.value)}
                      min={formData.startDate}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-gray-500" />
                    Description
                  </Label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Project description and objectives..."
                  />
                </div>
              </div>
            )}

            {activeTab === 'budget' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="billingMethod" className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
                      Billing Method
                    </Label>
                    <select
                      id="billingMethod"
                      value={formData.billingMethod}
                      onChange={(e) => handleInputChange('billingMethod', e.target.value as any)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {BILLING_METHODS.map((method) => (
                        <option key={method.value} value={method.value}>
                          {method.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="budget" className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
                      Budget
                    </Label>
                    <div className="relative">
                      <Input
                        id="budget"
                        type="number"
                        value={formData.budget}
                        onChange={(e) => handleInputChange('budget', e.target.value)}
                        placeholder="0.00"
                        className="pl-8"
                      />
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        {CURRENCIES.find(c => c.code === formData.currency)?.symbol || '$'}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currency" className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
                      Currency
                    </Label>
                    <select
                      id="currency"
                      value={formData.currency}
                      onChange={(e) => handleInputChange('currency', e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {CURRENCIES.map((currency) => (
                        <option key={currency.code} value={currency.code}>
                          {currency.code} - {currency.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="estimatedHours" className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-gray-500" />
                      Estimated Hours
                    </Label>
                    <Input
                      id="estimatedHours"
                      type="number"
                      value={formData.estimatedHours}
                      onChange={(e) => handleInputChange('estimatedHours', e.target.value)}
                      placeholder="e.g. 40"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'team' && (
              <div className="space-y-6">
                <div className="text-center py-8">
                  <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Team Management</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Coming Soon! Team management features are under development.</p>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-gray-500" />
                    Team Members
                  </Label>
                  <div className="border rounded-md p-4 min-h-[100px] bg-gray-50 dark:bg-gray-800">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formData.teamMembers.length === 0 
                        ? 'No team members added yet.' 
                        : formData.teamMembers.join(', ')}
                    </p>
                  </div>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => {
                      // In a real app, this would open a team member selector
                      const newMember = prompt('Enter team member email:');
                      if (newMember) {
                        handleInputChange('teamMembers', [...formData.teamMembers, newMember]);
                      }
                    }}
                  >
                    + Add Team Member
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="projectManager" className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-gray-500" />
                    Project Manager
                  </Label>
                  <Input
                    id="projectManager"
                    value={formData.projectManager}
                    onChange={(e) => handleInputChange('projectManager', e.target.value)}
                    placeholder="Project manager's email"
                  />
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Project'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}