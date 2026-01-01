import * as LucideIcons from 'lucide-react';

// Re-export all Lucide icons
export * from 'lucide-react';

// Common icons used in the app
export const Icons = {
  // General
  logo: (props: any) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  spinner: (props: any) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  ),
  // Add more custom icons here
} as const;

// Type for the Icons object
export type IconName = keyof typeof Icons;

// Component that renders an icon by name
interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: keyof typeof LucideIcons | keyof typeof Icons;
  size?: number | string;
  className?: string;
}

export const Icon = ({ name, size = 24, className = '', ...props }: IconProps) => {
  // Check if it's a custom icon
  if (name in Icons) {
    const IconComponent = Icons[name as keyof typeof Icons];
    return <IconComponent size={size} className={className} {...props} />;
  }

  // Check if it's a Lucide icon
  const LucideIcon = LucideIcons[name as keyof typeof LucideIcons];
  if (LucideIcon) {
    return <LucideIcon size={size} className={className} {...props} />;
  }

  console.warn(`Icon "${name}" not found`);
  return null;
};

// Export Icons as default
export default Icons;
