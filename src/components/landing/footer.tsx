// src/components/landing/footer.tsx
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
      <div className="container px-4 py-12 mx-auto">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">GrowSuite</h3>
            <p className="text-gray-600 dark:text-gray-400">
              The all-in-one CRM for freelancers to manage clients, projects, and payments.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Linkedin className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider">Product</h4>
            <nav className="mt-4 space-y-2">
              <a href="#" className="block text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">Features</a>
              <a href="#" className="block text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">Pricing</a>
              <a href="#" className="block text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">Updates</a>
              <a href="#" className="block text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">Roadmap</a>
            </nav>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider">Company</h4>
            <nav className="mt-4 space-y-2">
              <a href="#" className="block text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">About Us</a>
              <a href="#" className="block text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">Careers</a>
              <a href="#" className="block text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">Blog</a>
              <a href="#" className="block text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">Contact</a>
            </nav>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider">Resources</h4>
            <nav className="mt-4 space-y-2">
              <a href="#" className="block text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">Documentation</a>
              <a href="#" className="block text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">Help Center</a>
              <a href="#" className="block text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">Community</a>
              <a href="#" className="block text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">Status</a>
            </nav>
          </div>
        </div>
        <div className="pt-8 mt-8 border-t border-gray-200 dark:border-gray-800">
          <p className="text-sm text-center text-gray-600 dark:text-gray-400">
            &copy; {new Date().getFullYear()} GrowSuite. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}