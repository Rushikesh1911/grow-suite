import { Outlet, useLocation } from 'react-router-dom';
import { ThemeToggle } from '@/components/theme-toggle';

export function AuthLayout() {
  const location = useLocation();
  const isLogin = location.pathname.includes('login');
  const isForgotPassword = location.pathname.includes('forgot-password');
  const isResetPassword = location.pathname.includes('reset-password');
  
  let svgPath = '/singup-svg-crm-growsuite.svg';
  if (isLogin) {
    svgPath = '/workspace-login.svg';
  } else if (isForgotPassword) {
    svgPath = '/forgot-password.svg';
  } else if (isResetPassword) {
    svgPath = '/reset-password.svg';
  }
  return (
    <div className="min-h-screen bg-background">
      <div className="container relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-background" />
          <div className={`relative z-20 flex items-center justify-center w-full ${isLogin ? 'h-3/4 -mt-8' : 'h-4/5 -mt-12'}`}>
            <img 
              src={svgPath} 
              alt="Authentication" 
              className={`w-full h-full object-contain ${isLogin ? 'pt-0 pb-8' : 'p-6'}`}
            />
          </div>
          <div className="absolute bottom-8 left-8 right-8 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <blockquote className="space-y-3">
              <div className="text-primary-600 dark:text-primary-400">
                <svg className="w-6 h-6 mb-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
              <p className="text-gray-800 dark:text-gray-100 text-base leading-relaxed">
                {isLogin 
                  ? "GrowSuite has completely transformed how I manage my clients. The intuitive interface makes it effortless to stay organized and productive."
                  : "The most intuitive and powerful CRM I've ever used. It has completely transformed how we manage our customer relationships."
                }
              </p>
              <footer className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {isLogin ? 'Rugved Kulkarni, Freelancer' : 'Harsh, Founder Medilink'}
              </footer>
            </blockquote>
          </div>
        </div>
        
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            {/* Logo */}
            <div className="flex justify-center mb-2">
              <a href="/" className="-m-1.5 p-1.5">
                <span className="text-2xl font-bold tracking-tighter text-[#4f46e5] dark:text-[#6366f1]">
                  GROWSUITE
                </span>
              </a>
            </div>
            
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                {isForgotPassword ? 'Reset your password' : isResetPassword ? 'Set a new password' : 'Welcome to GrowSuite'}
              </h1>
              <p className="text-sm text-muted-foreground">
                {isForgotPassword 
                  ? 'Enter your email to receive a password reset link'
                  : isResetPassword
                    ? 'Enter your new password'
                    : 'Enter your credentials to access your account'}
              </p>
            </div>
            <Outlet />
            <p className="px-8 text-center text-sm text-muted-foreground">
              By clicking continue, you agree to our{' '}
              <a
                href="/terms"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </a>{' '}
              and{' '}
              <a
                href="/privacy"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>
      <div className="absolute right-4 top-4 md:right-8 md:top-8">
        <ThemeToggle />
      </div>
    </div>
  );
}
