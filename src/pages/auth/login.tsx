import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthForm } from '@/components/auth/auth-form';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/auth-context';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login, loginWithGoogle } = useAuth();

  const handleSubmit = async (data: { email: string; password: string }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await login(data.email, data.password);
      toast({
        title: 'Login successful',
        description: 'Welcome back!',
      });
      // Redirect to onboarding page after login
      navigate('/onboarding');
    } catch (error: any) {
      console.error('Login failed:', error);
      setError(error.message || 'Failed to log in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await loginWithGoogle();
      toast({
        title: 'Login successful',
        description: 'Welcome back with Google!',
      });
      // Redirect to onboarding page after Google login
      navigate('/onboarding');
    } catch (error: any) {
      console.error('Google login failed:', error);
      setError(error.message || 'Failed to log in with Google.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-2 text-center">
      <AuthForm 
        type="login" 
        onSubmit={handleSubmit} 
        onGoogleSignIn={handleGoogleLogin}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}
