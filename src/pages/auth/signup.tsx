import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthForm } from '@/components/auth/auth-form';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/auth-context';

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signup, loginWithGoogle } = useAuth();

  const handleSubmit = async (data: { email: string; password: string; name?: string }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await signup(data.email, data.password);
      toast({
        title: 'Account created',
        description: 'Your account has been created successfully! Please log in.',
      });
      // Redirect to login page after signup
      navigate('/login');
    } catch (error: any) {
      console.error('Signup failed:', error);
      setError(error.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setIsLoading(true);
      setError(null);
await loginWithGoogle();
      toast({
        title: 'Account created',
        description: 'Your account has been created successfully with Google!',
      });
      // Redirect to onboarding after Google signup
      navigate('/onboarding');
    } catch (error: any) {
      console.error('Google signup failed:', error);
      setError(error.message || 'Failed to sign up with Google.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-2 text-center">
      <AuthForm 
        type="signup" 
        onSubmit={handleSubmit} 
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}
