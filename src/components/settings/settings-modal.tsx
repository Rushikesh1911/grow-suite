import { useState, useEffect } from 'react';
import { 
  X, 
  Globe, 
  Palette, 
  Bell, 
  Shield, 
  CreditCard, 
  Database,
  Monitor,
  Sun,
  Moon,
  Check,
  Eye,
  EyeOff,
  Smartphone,
  LogOut,
  Download,
  ExternalLink,
  Calendar,
  Clock,
  Keyboard,
  Command,
  Search,
  Plus,
  FileText,
  Users,
  DollarSign as DollarSignIcon,
  CheckSquare,
  Layout,
  Settings as SettingsIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

type SettingsSection = 'general' | 'appearance' | 'notifications' | 'keyboard-shortcuts' | 'security' | 'billing' | 'data-privacy';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type GeneralSettings = {
  language: string;
  timezone: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  defaultLandingPage: string;
};

type AppearanceSettings = {
  theme: 'light' | 'dark' | 'system';
  layoutDensity: 'comfortable' | 'compact';
};

type NotificationSettings = {
  email: {
    projectUpdates: boolean;
    taskDeadlines: boolean;
    invoiceSent: boolean;
    paymentReceived: boolean;
    weeklySummary: boolean;
  };
  inApp: {
    mentions: boolean;
    statusChanges: boolean;
    overdueReminders: boolean;
  };
};

type KeyboardShortcut = {
  id: string;
  label: string;
  description: string;
  defaultShortcut: string;
  customShortcut: string;
  category: 'navigation' | 'actions' | 'creation' | 'views';
  enabled: boolean;
};

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [activeSection, setActiveSection] = useState<SettingsSection>('general');
  const [saveStatus, setSaveStatus] = useState<{ [key: string]: 'idle' | 'saving' | 'saved' }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  // Settings State
  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>({
    language: 'en',
    timezone: 'auto',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    defaultLandingPage: '/dashboard'
  });

  const [appearanceSettings, setAppearanceSettings] = useState<AppearanceSettings>({
    theme: 'system',
    layoutDensity: 'comfortable'
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    email: {
      projectUpdates: true,
      taskDeadlines: true,
      invoiceSent: true,
      paymentReceived: true,
      weeklySummary: false
    },
    inApp: {
      mentions: true,
      statusChanges: true,
      overdueReminders: true
    }
  });

  const [keyboardShortcuts, setKeyboardShortcuts] = useState<KeyboardShortcut[]>([
    // Navigation
    { id: 'nav-dashboard', label: 'Go to Dashboard', description: 'Navigate to main dashboard', defaultShortcut: 'G then D', customShortcut: 'G then D', category: 'navigation', enabled: true },
    { id: 'nav-projects', label: 'Go to Projects', description: 'Navigate to projects page', defaultShortcut: 'G then P', customShortcut: 'G then P', category: 'navigation', enabled: true },
    { id: 'nav-clients', label: 'Go to Clients', description: 'Navigate to clients page', defaultShortcut: 'G then C', customShortcut: 'G then C', category: 'navigation', enabled: true },
    { id: 'nav-tasks', label: 'Go to Tasks', description: 'Navigate to tasks page', defaultShortcut: 'G then T', customShortcut: 'G then T', category: 'navigation', enabled: true },
    { id: 'nav-invoices', label: 'Go to Invoices', description: 'Navigate to invoices page', defaultShortcut: 'G then I', customShortcut: 'G then I', category: 'navigation', enabled: true },
    { id: 'nav-calendar', label: 'Go to Calendar', description: 'Navigate to calendar view', defaultShortcut: 'G then A', customShortcut: 'G then A', category: 'navigation', enabled: true },
    
    // Actions
    { id: 'action-search', label: 'Global Search', description: 'Open quick search', defaultShortcut: 'Ctrl+K', customShortcut: 'Ctrl+K', category: 'actions', enabled: true },
    { id: 'action-command', label: 'Command Menu', description: 'Open command palette', defaultShortcut: 'Ctrl+Shift+P', customShortcut: 'Ctrl+Shift+P', category: 'actions', enabled: true },
    { id: 'action-settings', label: 'Open Settings', description: 'Open settings modal', defaultShortcut: 'Ctrl+,', customShortcut: 'Ctrl+,', category: 'actions', enabled: true },
    { id: 'action-profile', label: 'View Profile', description: 'Open profile settings', defaultShortcut: 'Ctrl+Shift+U', customShortcut: 'Ctrl+Shift+U', category: 'actions', enabled: true },
    
    // Creation
    { id: 'create-project', label: 'New Project', description: 'Create a new project', defaultShortcut: 'C then P', customShortcut: 'C then P', category: 'creation', enabled: true },
    { id: 'create-client', label: 'New Client', description: 'Add a new client', defaultShortcut: 'C then C', customShortcut: 'C then C', category: 'creation', enabled: true },
    { id: 'create-task', label: 'New Task', description: 'Create a new task', defaultShortcut: 'C then T', customShortcut: 'C then T', category: 'creation', enabled: true },
    { id: 'create-invoice', label: 'New Invoice', description: 'Create a new invoice', defaultShortcut: 'C then I', customShortcut: 'C then I', category: 'creation', enabled: true },
    { id: 'create-note', label: 'Quick Note', description: 'Add a quick note', defaultShortcut: 'C then N', customShortcut: 'C then N', category: 'creation', enabled: true },
    
    // Views
    { id: 'view-toggle-sidebar', label: 'Toggle Sidebar', description: 'Show/hide sidebar', defaultShortcut: 'Ctrl+B', customShortcut: 'Ctrl+B', category: 'views', enabled: true },
    { id: 'view-toggle-theme', label: 'Toggle Theme', description: 'Switch between light/dark mode', defaultShortcut: 'Ctrl+Shift+T', customShortcut: 'Ctrl+Shift+T', category: 'views', enabled: true },
    { id: 'view-fullscreen', label: 'Toggle Fullscreen', description: 'Enter/exit fullscreen mode', defaultShortcut: 'F11', customShortcut: 'F11', category: 'views', enabled: true },
    { id: 'view-zen-mode', label: 'Zen Mode', description: 'Focus mode with minimal UI', defaultShortcut: 'Ctrl+Shift+Z', customShortcut: 'Ctrl+Shift+Z', category: 'views', enabled: true },
  ]);

  const [editingShortcut, setEditingShortcut] = useState<string | null>(null);
  const [recordingKeys, setRecordingKeys] = useState<string[]>([]);

  // Close on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleSave = (section: string) => {
    setSaveStatus(prev => ({ ...prev, [section]: 'saving' }));
    // Simulate API call
    setTimeout(() => {
      setSaveStatus(prev => ({ ...prev, [section]: 'saved' }));
      setTimeout(() => {
        setSaveStatus(prev => ({ ...prev, [section]: 'idle' }));
      }, 2000);
    }, 500);
  };

  const handleGeneralChange = (field: keyof GeneralSettings, value: string) => {
    setGeneralSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleAppearanceChange = (field: keyof AppearanceSettings, value: any) => {
    setAppearanceSettings(prev => ({ ...prev, [field]: value }));
    // Apply theme instantly
    if (field === 'theme') {
      // TODO: Apply theme to document
      document.documentElement.classList.toggle('dark', value === 'dark');
    }
  };

  const handleNotificationToggle = (category: 'email' | 'inApp', field: string) => {
    setNotificationSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: !prev[category][field as keyof typeof prev.email]
      }
    }));
  };

  const toggleShortcut = (id: string) => {
    setKeyboardShortcuts(prev =>
      prev.map(shortcut =>
        shortcut.id === id ? { ...shortcut, enabled: !shortcut.enabled } : shortcut
      )
    );
  };

  const resetShortcut = (id: string) => {
    setKeyboardShortcuts(prev =>
      prev.map(shortcut =>
        shortcut.id === id ? { ...shortcut, customShortcut: shortcut.defaultShortcut } : shortcut
      )
    );
  };

  const resetAllShortcuts = () => {
    setKeyboardShortcuts(prev =>
      prev.map(shortcut => ({ ...shortcut, customShortcut: shortcut.defaultShortcut }))
    );
  };

  const getCategoryIcon = (category: KeyboardShortcut['category']) => {
    switch (category) {
      case 'navigation': return Layout;
      case 'actions': return Command;
      case 'creation': return Plus;
      case 'views': return Monitor;
    }
  };

  const getCategoryLabel = (category: KeyboardShortcut['category']) => {
    switch (category) {
      case 'navigation': return 'Navigation';
      case 'actions': return 'Actions';
      case 'creation': return 'Creation';
      case 'views': return 'Views';
    }
  };

  if (!isOpen) return null;

  const sidebarItems = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'keyboard-shortcuts', label: 'Keyboard Shortcuts', icon: Keyboard },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'data-privacy', label: 'Data & Privacy', icon: Database },
  ] as const;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal Container */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative w-full max-w-5xl transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all dark:bg-gray-900 max-h-[85vh] flex flex-col">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-800 dark:bg-gray-900">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Settings
            </h2>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content Area */}
          <div className="flex flex-1 overflow-hidden">
            
            {/* Left Sidebar */}
            <nav className="w-64 border-r border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-800/50 overflow-y-auto">
              <div className="p-3 space-y-1">
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={cn(
                        "flex w-full items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                        activeSection === item.id
                          ? "bg-primary-100 text-primary-900 dark:bg-primary-900/30 dark:text-primary-100"
                          : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </nav>

            {/* Right Content Panel */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-6">
                
                {/* GENERAL SECTION */}
                {activeSection === 'general' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        General Settings
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Manage your basic app preferences and behavior
                      </p>
                    </div>

                    <div className="space-y-5">
                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="language">Language</Label>
                          <select
                            id="language"
                            value={generalSettings.language}
                            onChange={(e) => handleGeneralChange('language', e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            <option value="en">English</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                            <option value="de">German</option>
                            <option value="hi">Hindi</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="timezone">Timezone</Label>
                          <select
                            id="timezone"
                            value={generalSettings.timezone}
                            onChange={(e) => handleGeneralChange('timezone', e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            <option value="auto">Auto-detect</option>
                            <option value="America/New_York">Eastern Time (ET)</option>
                            <option value="America/Chicago">Central Time (CT)</option>
                            <option value="America/Los_Angeles">Pacific Time (PT)</option>
                            <option value="Europe/London">London (GMT)</option>
                            <option value="Europe/Paris">Paris (CET)</option>
                            <option value="Asia/Kolkata">India (IST)</option>
                            <option value="Asia/Tokyo">Tokyo (JST)</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="dateFormat">Date Format</Label>
                          <select
                            id="dateFormat"
                            value={generalSettings.dateFormat}
                            onChange={(e) => handleGeneralChange('dateFormat', e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="timeFormat">Time Format</Label>
                          <select
                            id="timeFormat"
                            value={generalSettings.timeFormat}
                            onChange={(e) => handleGeneralChange('timeFormat', e.target.value as '12h' | '24h')}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            <option value="12h">12-hour (AM/PM)</option>
                            <option value="24h">24-hour</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="landingPage">Default Landing Page</Label>
                        <select
                          id="landingPage"
                          value={generalSettings.defaultLandingPage}
                          onChange={(e) => handleGeneralChange('defaultLandingPage', e.target.value)}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <option value="/dashboard">Dashboard</option>
                          <option value="/projects">Projects</option>
                          <option value="/clients">Clients</option>
                          <option value="/tasks">Tasks</option>
                          <option value="/calendar">Calendar</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-800">
                      <Button
                        onClick={() => handleSave('general')}
                        disabled={saveStatus.general === 'saving'}
                        className="bg-primary-600 hover:bg-primary-700"
                      >
                        {saveStatus.general === 'saving' && (
                          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        )}
                        {saveStatus.general === 'saved' && (
                          <Check className="mr-2 h-4 w-4" />
                        )}
                        {saveStatus.general === 'saved' ? 'Saved' : 'Save Changes'}
                      </Button>
                    </div>
                  </div>
                )}

                {/* APPEARANCE SECTION */}
                {activeSection === 'appearance' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Appearance
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Customize how the app looks and feels
                      </p>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-3">
                        <Label>Theme</Label>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { value: 'light', label: 'Light', icon: Sun },
                            { value: 'dark', label: 'Dark', icon: Moon },
                            { value: 'system', label: 'System', icon: Monitor }
                          ].map(({ value, label, icon: Icon }) => (
                            <button
                              key={value}
                              onClick={() => handleAppearanceChange('theme', value)}
                              className={cn(
                                "flex flex-col items-center justify-center space-y-2 rounded-lg border-2 p-4 transition-all",
                                appearanceSettings.theme === value
                                  ? "border-primary-600 bg-primary-50 dark:bg-primary-900/20"
                                  : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
                              )}
                            >
                              <Icon className="h-6 w-6" />
                              <span className="text-sm font-medium">{label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label>Layout Density</Label>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { value: 'comfortable', label: 'Comfortable', desc: 'More spacing' },
                            { value: 'compact', label: 'Compact', desc: 'Less spacing' }
                          ].map(({ value, label, desc }) => (
                            <button
                              key={value}
                              onClick={() => handleAppearanceChange('layoutDensity', value)}
                              className={cn(
                                "flex flex-col items-start rounded-lg border-2 p-4 text-left transition-all",
                                appearanceSettings.layoutDensity === value
                                  ? "border-primary-600 bg-primary-50 dark:bg-primary-900/20"
                                  : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
                              )}
                            >
                              <span className="text-sm font-medium">{label}</span>
                              <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">{desc}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 dark:bg-blue-900/20 dark:border-blue-800">
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                          <strong>Note:</strong> Theme changes apply instantly and are saved automatically.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* NOTIFICATIONS SECTION */}
                {activeSection === 'notifications' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Notifications
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Manage how and when you receive notifications
                      </p>
                    </div>

                    <div className="space-y-6">
                      {/* Email Notifications */}
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Bell className="h-5 w-5 text-gray-500" />
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            Email Notifications
                          </h4>
                        </div>
                        <div className="space-y-3 pl-7">
                          {Object.entries({
                            projectUpdates: 'Project updates',
                            taskDeadlines: 'Task deadlines',
                            invoiceSent: 'Invoice sent',
                            paymentReceived: 'Payment received',
                            weeklySummary: 'Weekly summary'
                          }).map(([key, label]) => (
                            <div key={key} className="flex items-center justify-between py-2">
                              <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                              <button
                                type="button"
                                onClick={() => handleNotificationToggle('email', key)}
                                className={cn(
                                  "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2",
                                  notificationSettings.email[key as keyof typeof notificationSettings.email]
                                    ? "bg-primary-600"
                                    : "bg-gray-200 dark:bg-gray-700"
                                )}
                              >
                                <span
                                  className={cn(
                                    "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                                    notificationSettings.email[key as keyof typeof notificationSettings.email]
                                      ? "translate-x-5"
                                      : "translate-x-0"
                                  )}
                                />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* In-App Notifications */}
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Smartphone className="h-5 w-5 text-gray-500" />
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            In-App Notifications
                          </h4>
                        </div>
                        <div className="space-y-3 pl-7">
                          {Object.entries({
                            mentions: 'Mentions',
                            statusChanges: 'Status changes',
                            overdueReminders: 'Overdue reminders'
                          }).map(([key, label]) => (
                            <div key={key} className="flex items-center justify-between py-2">
                              <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                              <button
                                type="button"
                                onClick={() => handleNotificationToggle('inApp', key)}
                                className={cn(
                                  "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2",
                                  notificationSettings.inApp[key as keyof typeof notificationSettings.inApp]
                                    ? "bg-primary-600"
                                    : "bg-gray-200 dark:bg-gray-700"
                                )}
                              >
                                <span
                                  className={cn(
                                    "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                                    notificationSettings.inApp[key as keyof typeof notificationSettings.inApp]
                                      ? "translate-x-5"
                                      : "translate-x-0"
                                  )}
                                />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-800">
                      <Button
                        onClick={() => handleSave('notifications')}
                        disabled={saveStatus.notifications === 'saving'}
                        className="bg-primary-600 hover:bg-primary-700"
                      >
                        {saveStatus.notifications === 'saving' && (
                          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        )}
                        {saveStatus.notifications === 'saved' && (
                          <Check className="mr-2 h-4 w-4" />
                        )}
                        {saveStatus.notifications === 'saved' ? 'Saved' : 'Save Changes'}
                      </Button>
                    </div>
                  </div>
                )}

                {/* KEYBOARD SHORTCUTS SECTION */}
                {activeSection === 'keyboard-shortcuts' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Keyboard Shortcuts
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Customize keyboard shortcuts for faster workflow
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={resetAllShortcuts}
                      >
                        Reset All
                      </Button>
                    </div>

                    <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 dark:bg-blue-900/20 dark:border-blue-800">
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        <strong>Tip:</strong> Most shortcuts use a two-key sequence. For example, press <kbd className="px-2 py-1 bg-white dark:bg-gray-800 rounded border border-blue-300 dark:border-blue-700 text-xs font-mono">G</kbd> then <kbd className="px-2 py-1 bg-white dark:bg-gray-800 rounded border border-blue-300 dark:border-blue-700 text-xs font-mono">D</kbd> to go to Dashboard.
                      </p>
                    </div>

                    <div className="space-y-6">
                      {['navigation', 'actions', 'creation', 'views'].map((category) => {
                        const categoryShortcuts = keyboardShortcuts.filter(s => s.category === category);
                        const CategoryIcon = getCategoryIcon(category as KeyboardShortcut['category']);
                        
                        return (
                          <div key={category} className="space-y-4">
                            <div className="flex items-center space-x-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                              <CategoryIcon className="h-5 w-5 text-gray-500" />
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                {getCategoryLabel(category as KeyboardShortcut['category'])}
                              </h4>
                            </div>
                            
                            <div className="space-y-2">
                              {categoryShortcuts.map((shortcut) => (
                                <div
                                  key={shortcut.id}
                                  className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800/50 transition-colors"
                                >
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-3">
                                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {shortcut.label}
                                      </p>
                                      {!shortcut.enabled && (
                                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                                          Disabled
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                      {shortcut.description}
                                    </p>
                                  </div>
                                  
                                  <div className="flex items-center space-x-3 ml-4">
                                    <kbd className="hidden sm:inline-flex items-center px-3 py-1.5 bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600 text-xs font-mono text-gray-700 dark:text-gray-300 whitespace-nowrap">
                                      {shortcut.customShortcut}
                                    </kbd>
                                    
                                    <div className="flex items-center space-x-2">
                                      {shortcut.customShortcut !== shortcut.defaultShortcut && (
                                        <button
                                          onClick={() => resetShortcut(shortcut.id)}
                                          className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400"
                                          title="Reset to default"
                                        >
                                          Reset
                                        </button>
                                      )}
                                      
                                      <button
                                        type="button"
                                        onClick={() => toggleShortcut(shortcut.id)}
                                        className={cn(
                                          "relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2",
                                          shortcut.enabled
                                            ? "bg-primary-600"
                                            : "bg-gray-200 dark:bg-gray-700"
                                        )}
                                      >
                                        <span
                                          className={cn(
                                            "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                                            shortcut.enabled ? "translate-x-4" : "translate-x-0"
                                          )}
                                        />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                      <div className="rounded-lg bg-gray-50 border border-gray-200 p-4 dark:bg-gray-800/50 dark:border-gray-700">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                          Common Keyboard Modifiers
                        </h4>
                        <div className="grid grid-cols-2 gap-3 text-xs text-gray-600 dark:text-gray-400">
                          <div className="flex items-center space-x-2">
                            <kbd className="px-2 py-1 bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600 font-mono">Ctrl</kbd>
                            <span>Control key (Windows/Linux)</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <kbd className="px-2 py-1 bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600 font-mono">⌘</kbd>
                            <span>Command key (Mac)</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <kbd className="px-2 py-1 bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600 font-mono">Shift</kbd>
                            <span>Shift key</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <kbd className="px-2 py-1 bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600 font-mono">Alt</kbd>
                            <span>Alt/Option key</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-800">
                      <Button
                        onClick={() => handleSave('keyboard-shortcuts')}
                        disabled={saveStatus['keyboard-shortcuts'] === 'saving'}
                        className="bg-primary-600 hover:bg-primary-700"
                      >
                        {saveStatus['keyboard-shortcuts'] === 'saving' && (
                          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        )}
                        {saveStatus['keyboard-shortcuts'] === 'saved' && (
                          <Check className="mr-2 h-4 w-4" />
                        )}
                        {saveStatus['keyboard-shortcuts'] === 'saved' ? 'Saved' : 'Save Changes'}
                      </Button>
                    </div>
                  </div>
                )}

                {/* SECURITY SECTION */}
                {activeSection === 'security' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Security
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Manage your account security and authentication
                      </p>
                    </div>

                    <div className="space-y-6">
                      {/* Change Password */}
                      <div className="space-y-4">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          Change Password
                        </h4>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="currentPassword">Current Password</Label>
                            <div className="relative">
                              <Input
                                id="currentPassword"
                                type={showPassword ? 'text' : 'password'}
                                value={passwordData.current}
                                onChange={(e) => setPasswordData(prev => ({ ...prev, current: e.target.value }))}
                                className="pr-10"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                              >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <Input
                              id="newPassword"
                              type={showPassword ? 'text' : 'password'}
                              value={passwordData.new}
                              onChange={(e) => setPasswordData(prev => ({ ...prev, new: e.target.value }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                            <Input
                              id="confirmPassword"
                              type={showPassword ? 'text' : 'password'}
                              value={passwordData.confirm}
                              onChange={(e) => setPasswordData(prev => ({ ...prev, confirm: e.target.value }))}
                            />
                          </div>
                          <Button variant="outline" className="w-full sm:w-auto">
                            Update Password
                          </Button>
                        </div>
                      </div>

                      {/* Connected Accounts */}
                      <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          Connected Accounts
                        </h4>
                        <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                          <div className="flex items-center space-x-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white border border-gray-200">
                              <svg className="h-5 w-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">Google</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Connected</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Disconnect
                          </Button>
                        </div>
                      </div>

                      {/* Active Sessions */}
                      <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          Active Sessions
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                            <div className="flex items-center space-x-3">
                              <Monitor className="h-5 w-5 text-gray-400" />
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  Chrome on Windows
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  Current session • New York, US
                                </p>
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout from all other devices
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* BILLING SECTION */}
                {activeSection === 'billing' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Billing
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Manage your subscription and payment methods
                      </p>
                    </div>

                    <div className="space-y-6">
                      {/* Current Plan */}
                      <div className="rounded-lg border-2 border-primary-200 bg-primary-50 p-6 dark:border-primary-800 dark:bg-primary-900/20">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                              Professional Plan
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              $29/month • Billed monthly
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                              Next billing date: January 15, 2026
                            </p>
                          </div>
                          <span className="inline-flex items-center rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                            Active
                          </span>
                        </div>
                        <div className="mt-6 flex space-x-3">
                          <Button variant="outline" size="sm">
                            Upgrade Plan
                          </Button>
                          <Button variant="outline" size="sm">
                            Change Billing
                          </Button>
                        </div>
                      </div>

                      {/* Payment Method */}
                      <div className="space-y-4">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          Payment Method
                        </h4>
                        <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                          <div className="flex items-center space-x-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded bg-gray-100 dark:bg-gray-800">
                              <CreditCard className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                •••• •••• •••• 4242
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Expires 12/2027
                              </p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Update
                          </Button>
                        </div>
                      </div>

                      {/* Billing History */}
                      <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          Billing History
                        </h4>
                        <div className="space-y-2">
                          {[
                            { date: 'Dec 15, 2025', amount: '$29.00', status: 'Paid' },
                            { date: 'Nov 15, 2025', amount: '$29.00', status: 'Paid' },
                            { date: 'Oct 15, 2025', amount: '$29.00', status: 'Paid' }
                          ].map((invoice, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                            >
                              <div className="flex items-center space-x-4">
                                <div>
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {invoice.date}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Professional Plan
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-4">
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                  {invoice.amount}
                                </span>
                                <Button variant="ghost" size="sm">
                                  <Download className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* DATA & PRIVACY SECTION */}
                {activeSection === 'data-privacy' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Data & Privacy
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Control your data and privacy preferences
                      </p>
                    </div>

                    <div className="space-y-6">
                      {/* Export Data */}
                      <div className="space-y-4">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          Export Your Data
                        </h4>
                        <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Download a copy of your data including projects, clients, and tasks.
                          </p>
                          <Button variant="outline" className="w-full sm:w-auto">
                            <Download className="mr-2 h-4 w-4" />
                            Export Data (CSV)
                          </Button>
                        </div>
                      </div>

                      {/* Download Account Data */}
                      <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          Download Account Data
                        </h4>
                        <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Request a complete copy of all your account data.
                          </p>
                          <Button variant="outline" className="w-full sm:w-auto">
                            <Download className="mr-2 h-4 w-4" />
                            Request Full Archive
                          </Button>
                        </div>
                      </div>

                      {/* Analytics */}
                      <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          Analytics
                        </h4>
                        <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              Usage Analytics
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Help us improve by sharing anonymous usage data
                            </p>
                          </div>
                          <button
                            type="button"
                            className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 bg-primary-600"
                          >
                            <span className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out translate-x-5" />
                          </button>
                        </div>
                      </div>

                      {/* Legal Links */}
                      <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          Legal
                        </h4>
                        <div className="space-y-2">
                          <a
                            href="#"
                            className="flex items-center justify-between rounded-lg border border-gray-200 p-4 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
                          >
                            Privacy Policy
                            <ExternalLink className="h-4 w-4 text-gray-400" />
                          </a>
                          <a
                            href="#"
                            className="flex items-center justify-between rounded-lg border border-gray-200 p-4 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
                          >
                            Terms of Service
                            <ExternalLink className="h-4 w-4 text-gray-400" />
                          </a>
                        </div>
                      </div>

                      {/* Delete Account */}
                      <div className="space-y-4 pt-4 border-t border-red-200 dark:border-red-900">
                        <h4 className="font-medium text-red-600 dark:text-red-400">
                          Danger Zone
                        </h4>
                        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-900/20">
                          <p className="text-sm text-red-800 dark:text-red-200 mb-3">
                            Once you delete your account, there is no going back. Please be certain.
                          </p>
                          <Button
                            variant="outline"
                            className="border-red-300 text-red-600 hover:bg-red-100 dark:border-red-800 dark:hover:bg-red-900/30"
                          >
                            Delete Account
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
