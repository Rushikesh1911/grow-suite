import React, { useState } from 'react';
import type { ReactNode } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Settings, FileText, BarChart, HelpCircle, Menu, X, Bell, ChevronDown, User, LogOut, ChevronsUpDown, ListTodo, Clock, CreditCard, LayoutGrid, Folder, Plus } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { ProfileSettings } from '@/components/profile/profile-settings';
import { QuickActions } from '@/components/quick-actions/quick-actions';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SettingsModal } from '@/components/settings/settings-modal';

type SidebarItem = {
  name: string;
  href: string;
  icon: React.ReactNode;
  children?: SidebarItem[];
  type?: 'header';
};

const sidebarItems = [
  {
    name: 'WORK',
    type: 'header'
  },
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    name: 'Clients',
    href: '/clients',
    icon: <Users className="h-5 w-5" />,
  },
  {
    name: 'Projects',
    href: '/projects',
    icon: <Folder className="h-5 w-5" />,
  },
  {
    name: 'Tasks',
    href: '/tasks',
    icon: <ListTodo className="h-5 w-5" />,
  },
  {
    name: 'Workspace',
    href: '/workspace',
    icon: <LayoutGrid className="h-5 w-5" />,
  },
  {
    name: 'TIME & MONEY',
    type: 'header'
  },
  {
    name: 'Time Tracking',
    href: '/time-tracking',
    icon: <Clock className="h-5 w-5" />,
  },
  {
    name: 'Invoices',
    href: '/invoices',
    icon: <FileText className="h-5 w-5" />,
  },
  {
    name: 'Payments',
    href: '/payments',
    icon: <CreditCard className="h-5 w-5" />,
  },
  {
    name: 'INSIGHTS',
    type: 'header'
  },
  {
    name: 'Reports',
    href: '/reports',
    icon: <BarChart className="h-5 w-5" />,
  }
];

export function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  // Helper to get filled icon variant for active state
  const getActiveIcon = (icon: React.ReactNode, isActive: boolean) => {
    if (!isActive || !React.isValidElement(icon)) return icon;
    
    const iconName = icon.type.name;
    const FilledIcon = LucideIcons[`${iconName} as any`];
    
    if (FilledIcon) {
      return React.cloneElement(icon, { fill: 'currentColor' });
    }
    return icon;
  };

  const toggleSubmenu = (name: string) => {
    setActiveSubmenu(activeSubmenu === name ? null : name);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const userDisplayName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User';
  const userEmail = currentUser?.email || '';
  const userInitial = userDisplayName.charAt(0).toUpperCase();

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      {/* Mobile sidebar backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/50 lg:hidden',
          !sidebarOpen && 'hidden'
        )}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 transform flex-col bg-white dark:bg-gray-900 transition-transform duration-300 ease-in-out lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          'border-r border-gray-200 dark:border-gray-800'
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4 dark:border-gray-800">
          <Link to="/dashboard" className="flex items-center">
            <img
              src="/growsuite-logo.png"
              alt="GrowSuite"
              className="h-10 w-auto"
            />
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 lg:hidden"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-4">
          <div className="space-y-1">
            {sidebarItems.map((item) => (
              <div key={item.name}>
                {item.type === 'header' ? (
                  <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    {item.name}
                  </div>
                ) : (
                  <>
                    <Link
                      to={item.href}
                      onClick={() => item.children && toggleSubmenu(item.name)}
                      className={cn(
                        'group flex w-full items-center rounded-md px-3 py-2.5 text-sm font-medium',
                        'transition-all duration-200 relative',
                        'mb-1',
                        // Base styles
                        'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                        'dark:text-gray-300 dark:hover:bg-gray-800/50 dark:hover:text-white',
                        // Active state
                        isActive(item.href) ? [
                          'bg-primary-50 text-primary-800 font-semibold',
                          'dark:bg-primary-900/40 dark:text-primary-100',
                          'before:absolute before:left-0 before:top-1/2 before:h-5 before:w-1',
                          'before:-translate-y-1/2 before:rounded-r-full',
                          'before:bg-primary-500 before:transition-all before:duration-200',
                          'hover:pl-4',
                        ] : 'pl-4',
                        // Hover effect
                        'hover:translate-x-1',
                        // Icon transition
                        '[&>div:first-child]:transition-transform [&>div:first-child]:duration-200',
                        'hover:[&>div:first-child]:scale-110',
                      )}
                    >
                      <div className="flex items-center">
                        <span className={cn(
                          'mr-3',
                          isActive(item.href) 
                            ? 'text-primary-600 dark:text-primary-300' 
                            : 'text-gray-500 group-hover:text-gray-600 dark:text-gray-400 dark:group-hover:text-gray-300'
                        )}>
                          {getActiveIcon(item.icon, isActive(item.href))}
                        </span>
                        {item.name}
                      </div>
                      {item.children && (
                        <ChevronDown
                          className={cn(
                            'h-4 w-4 transform transition-transform',
                            activeSubmenu === item.name && 'rotate-180'
                          )}
                        />
                      )}
                    </Link>
                    {item.children && activeSubmenu === item.name && (
                      <div className="mt-1 space-y-1 pl-11">
                        {item.children.map((subItem) => (
                          <Link
                            key={subItem.name}
                            to={subItem.href}
                            className={cn(
                              'block rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200',
                              isActive(subItem.href) 
                                ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-200 font-medium' 
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-gray-200'
                            )}
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </nav>

        <div className="mt-auto border-t border-gray-200 p-4 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-full items-center justify-between px-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={currentUser?.photoURL || ''} alt={userDisplayName} />
                        <AvatarFallback>{userInitial}</AvatarFallback>
                      </Avatar>
                      <div className="hidden flex-col md:flex">
                        <span className="text-sm font-medium">{userDisplayName}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{userEmail}</span>
                      </div>
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{userDisplayName}</p>
                      <p className="text-xs leading-none text-gray-500">{userEmail}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <button
                      onClick={() => {
                        setIsProfileOpen(true);
                        const dropdownTrigger = document.querySelector('[data-radix-popper-content-wrapper]');
                        if (dropdownTrigger) {
                          (dropdownTrigger as HTMLElement).style.display = 'none';
                        }
                      }}
                      className="flex w-full items-center"
                    >
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </button>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => {
                      setIsSettingsOpen(true);
                      const dropdownTrigger = document.querySelector('[data-radix-popper-content-wrapper]');
                      if (dropdownTrigger) {
                        (dropdownTrigger as HTMLElement).style.display = 'none';
                      }
                    }}
                    className="w-full cursor-pointer"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600 dark:text-red-400">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </aside>

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Main content */}
      <div className="flex flex-1 flex-col lg:pl-64">
        {/* Top navigation */}
        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:gap-x-6 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <button
              type="button"
              className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          {/* Search bar */}
          <div className="flex flex-1 px-4 lg:px-6">
            <div className="relative w-full max-w-2xl">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                className="block w-full rounded-md border-0 bg-white py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#4f46e5] focus:ring-offset-1 dark:bg-gray-800 dark:text-white dark:ring-gray-700 dark:placeholder-gray-500 dark:focus:ring-[#6366f1] sm:text-sm sm:leading-6"
                placeholder="Search..."
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-x-2 lg:gap-x-4">
            <div className="flex items-center gap-x-2 lg:gap-x-4">
              <button
                type="button"
                className="p-2 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-300 relative"
              >
                <span className="sr-only">View notifications</span>
                <Bell className="h-5 w-5" aria-hidden="true" />
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">3</span>
              </button>
              <QuickActions />
              <button
                type="button"
                className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-300"
              >
                <span className="sr-only">Help</span>
                <HelpCircle className="h-6 w-6" aria-hidden="true" />
              </button>

            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6 dark:bg-gray-950">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>

      <ProfileSettings
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </div>
  );
}
