import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    // If user is not logged in, redirect to login
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const handleComplete = () => {
    // Redirect to dashboard after onboarding is complete
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome to GrowSuite!</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Let's get started by setting up your account.
          </p>
        </div>
        
        <div className="mt-8 space-y-6">
          <div className="space-y-4">
            <div className="p-4 border rounded-lg border-gray-200 dark:border-gray-700">
              <h3 className="font-medium text-gray-900 dark:text-white">Step 1: Complete your profile</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Add your personal and business details to get started.
              </p>
            </div>
            
            <div className="p-4 border rounded-lg border-gray-200 dark:border-gray-700">
              <h3 className="font-medium text-gray-900 dark:text-white">Step 2: Connect your tools</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Integrate with your favorite tools and services.
              </p>
            </div>
            
            <div className="p-4 border rounded-lg border-gray-200 dark:border-gray-700">
              <h3 className="font-medium text-gray-900 dark:text-white">Step 3: Invite your team</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Collaborate with your team members.
              </p>
            </div>
          </div>

          <div className="pt-4">
            <Button 
              onClick={handleComplete}
              className="w-full"
            >
              Complete Setup
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
