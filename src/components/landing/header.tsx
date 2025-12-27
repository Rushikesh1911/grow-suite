import * as React from 'react';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Features', href: '#features' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Testimonials', href: '/testimonials' },
  { name: 'Resources', href: '/resources' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [isDarkMode, setIsDarkMode] = React.useState(
    document.documentElement.classList.contains('dark')
  );

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <>
      {/* ================= HEADER ================= */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-lg dark:border-gray-800 dark:bg-gray-950/80">
        <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
          {/* Logo */}
          <a href="/" className="flex items-center">
            <img 
              src="/growsuite-logo.png" 
              alt="GrowSuite" 
              className="h-8 w-auto"
            />
          </a>

          {/* Desktop nav */}
          <div className="hidden lg:flex gap-x-12">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-gray-900 hover:text-primary dark:text-gray-100"
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Right actions */}
          <div className="hidden lg:flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <a href="/login" className="text-sm font-medium">
              Log in →
            </a>

            <Button variant="gradient" className="rounded-full">
              Get Started
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 -mr-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 rounded-full transition-colors"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
        </nav>
      </header>

      {/* ================= MOBILE MENU ================= */}
      <div
        className={cn(
          'lg:hidden fixed inset-0 z-[60] transition-opacity duration-300',
          mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
      >
        {/* Backdrop with blur */}
        <div
          className={cn(
            'fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300',
            mobileMenuOpen ? 'opacity-100' : 'opacity-0'
          )}
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />

        {/* Drawer */}
        <div 
          className={cn(
            'fixed inset-y-0 right-0 w-[85%] max-w-sm bg-white/95 dark:bg-gray-950/95 backdrop-blur-lg shadow-2xl px-6 py-8 flex flex-col transition-transform duration-300 ease-in-out',
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <a 
              href="/" 
              className="flex items-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              <img 
                src="/growsuite-logo.png" 
                alt="GrowSuite" 
                className="h-7 w-auto"
              />
            </a>
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 -mr-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Close menu"
            >
              <X size={22} />
            </button>
          </div>

          {/* Nav links */}
          <nav className="space-y-3 flex-1">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center w-full px-4 py-3 mt-4 text-base font-medium text-left text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            {isDarkMode ? (
              <>
                <Sun className="w-5 h-5 mr-3" />
                Light Mode
              </>
            ) : (
              <>
                <Moon className="w-5 h-5 mr-3" />
                Dark Mode
              </>
            )}
          </button>

          {/* Auth buttons */}
          <div className="mt-6 space-y-3">
            <a
              href="/login"
              className="block w-full px-4 py-3 text-base font-medium text-center text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Log In
            </a>
            <Button 
              variant="gradient" 
              className="w-full py-3 text-base font-medium"
              onClick={() => {
                setMobileMenuOpen(false);
                // Add your sign up logic here
              }}
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
