// src/components/landing/footer.tsx
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Github } from 'lucide-react';

const socialLinks = [
  {
    name: 'Facebook',
    icon: Facebook,
    url: 'https://facebook.com',
    color: 'hover:bg-[#1877F2]',
    iconColor: 'group-hover:text-white',
    bgColor: 'bg-[#1877F2]/10'
  },
  {
    name: 'X (Twitter)',
    icon: Twitter,
    url: 'https://x.com',
    color: 'hover:bg-black dark:hover:bg-white',
    iconColor: 'group-hover:text-white dark:group-hover:text-black',
    bgColor: 'bg-black/5 dark:bg-white/10'
  },
  {
    name: 'Instagram',
    icon: Instagram,
    url: 'https://instagram.com',
    color: 'hover:bg-gradient-to-br from-[#F09433] via-[#E6683C] via-25% to-[#DC2743] to-50%',
    iconColor: 'group-hover:text-white',
    bgColor: 'bg-gradient-to-br from-[#F09433]/10 via-[#E6683C]/10 via-25% to-[#DC2743]/10 to-50%',
    hoverStyle: 'hover:scale-105 hover:shadow-lg hover:shadow-pink-500/20'
  },
  {
    name: 'LinkedIn',
    icon: Linkedin,
    url: 'https://linkedin.com',
    color: 'hover:bg-[#0077B5]',
    iconColor: 'group-hover:text-white',
    bgColor: 'bg-[#0077B5]/10'
  },
  {
    name: 'YouTube',
    icon: Youtube,
    url: 'https://youtube.com',
    color: 'hover:bg-[#FF0000]',
    iconColor: 'group-hover:text-white',
    bgColor: 'bg-[#FF0000]/10'
  },
  {
    name: 'GitHub',
    icon: Github,
    url: 'https://github.com',
    color: 'hover:bg-[#333]',
    iconColor: 'group-hover:text-white',
    bgColor: 'bg-gray-200 dark:bg-gray-700/50'
  }
];

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-950/50 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center mb-12">
          <a href="/" className="flex items-center">
            <img 
              src="/growsuite-logo.png" 
              alt="GrowSuite" 
              className="h-14 w-auto"
            />
          </a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Product</h3>
            <div className="mt-4 space-y-2">
              {['Features', 'Pricing', 'Templates', 'Integrations'].map((item) => (
                <a 
                  key={item} 
                  href="#" 
                  className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white block"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Resources</h3>
            <div className="mt-4 space-y-2">
              {['Documentation', 'Guides', 'Blog', 'Support'].map((item) => (
                <a 
                  key={item} 
                  href="#" 
                  className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white block"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Company</h3>
            <div className="mt-4 space-y-2">
              {['About', 'Careers', 'Contact', 'Press'].map((item) => (
                <a 
                  key={item} 
                  href="#" 
                  className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white block"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Legal</h3>
            <div className="mt-4 space-y-2">
              {['Privacy', 'Terms', 'Security', 'Cookies'].map((item) => (
                <a 
                  key={item} 
                  href="#" 
                  className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white block"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {currentYear} GrowSuite. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-3">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group p-2 rounded-full transition-all duration-300 ${social.bgColor} ${social.color} ${social.hoverStyle || 'hover:shadow-lg'}`}
                  aria-label={`Visit our ${social.name}`}
                >
                  <Icon className={`h-5 w-5 text-gray-700 dark:text-gray-300 ${social.iconColor} transition-colors duration-300`} />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}