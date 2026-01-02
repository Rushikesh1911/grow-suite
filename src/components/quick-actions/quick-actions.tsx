import { useState } from 'react';
import { Plus, User, Briefcase, CheckSquare, FileText, MessageSquare, Calendar, Clock, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { CreateClientModal } from '@/components/clients/create-client-modal';
import { CreateProjectModal } from '@/components/projects/create-project-modal';

type ActionItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  shortcut?: string;
  group: 'primary' | 'secondary' | 'tertiary';
};

export function QuickActions() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreateClientModalOpen, setIsCreateClientModalOpen] = useState(false);
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleCreateClient = (clientData: any) => {
    // Here you would typically make an API call to create the client
    console.log('Creating client:', clientData);
    // Show success message
    // You might want to use a toast notification here
    alert('Client created successfully!');
  };

  const actionGroups = [
    {
      id: 'create',
      title: 'CREATE',
      items: [
        {
          id: 'new-client',
          label: 'New Client',
          icon: <User className="h-4 w-4" />,
          shortcut: '⌘+C',
          onClick: () => setIsCreateClientModalOpen(true),
        },
        {
          id: 'new-project',
          label: 'New Project',
          icon: <Briefcase className="h-4 w-4" />,
          shortcut: '⌘+P',
          onClick: () => setIsCreateProjectModalOpen(true),
        },
        {
          id: 'new-task',
          label: 'New Task',
          icon: <CheckSquare className="h-4 w-4" />,
          shortcut: '⌘+T',
          onClick: () => navigate('/tasks/new'),
        },
        {
          id: 'new-invoice',
          label: 'Create Invoice',
          icon: <FileText className="h-4 w-4" />,
          shortcut: '⌘+I',
          onClick: () => navigate('/invoices/new'),
        },
      ],
    },
    {
      id: 'organize',
      title: 'ORGANIZE',
      items: [
        {
          id: 'set-reminder',
          label: 'Set Reminder',
          icon: <Clock className="h-4 w-4" />,
          shortcut: '⌘+R',
          onClick: () => navigate('/reminders/new'),
        },
        {
          id: 'schedule-event',
          label: 'Schedule Event',
          icon: <Calendar className="h-4 w-4" />,
          shortcut: '⌘+E',
          onClick: () => navigate('/calendar/new'),
        },
      ],
    },
    {
      id: 'communication',
      title: 'COMMUNICATION',
      items: [
        {
          id: 'send-message',
          label: 'Send Message',
          icon: <MessageSquare className="h-4 w-4" />,
          shortcut: '⌘+M',
          onClick: () => navigate('/messages/new'),
        },
      ],
    },
  ];


  return (
    <div className="relative">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Plus className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-45' : ''}`} />
            <span className="sr-only">Quick Actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64 p-0" align="end" sideOffset={8}>
          {actionGroups.map((group, groupIndex) => (
            <div key={group.id}>
              {groupIndex > 0 && <DropdownMenuSeparator className="m-0" />}
              <DropdownMenuLabel className="px-3 py-2 text-xs font-medium text-muted-foreground bg-gray-50 dark:bg-gray-900/50">
                {group.title}
              </DropdownMenuLabel>
              <DropdownMenuGroup className="px-1 py-1">
                {group.items.map((item) => (
                  <DropdownMenuItem
                    key={item.id}
                    onSelect={(e) => {
                      e.preventDefault();
                      item.onClick();
                    }}
                    className="px-2 py-1.5 text-sm rounded cursor-pointer flex items-center"
                  >
                    <span className="mr-2 text-muted-foreground">{item.icon}</span>
                    <span className="flex-1">{item.label}</span>
                    {item.shortcut && (
                      <span className="ml-4 text-xs text-muted-foreground">
                        {item.shortcut}
                      </span>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </div>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Create Client Modal */}
      <CreateClientModal
        isOpen={isCreateClientModalOpen}
        onClose={() => setIsCreateClientModalOpen(false)}
        onSave={handleCreateClient}
      />
      <CreateProjectModal
        isOpen={isCreateProjectModalOpen}
        onClose={() => setIsCreateProjectModalOpen(false)}
        onSave={(projectData) => {
          console.log('Creating project:', projectData);
          // Here you would typically make an API call to create the project
          // For now, we'll just show an alert
          alert('Project created successfully!');
          setIsCreateProjectModalOpen(false);
        }}
      />
    </div>
  );
}
