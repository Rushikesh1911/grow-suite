import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthForm } from '@/components/auth/auth-form';
import { useToast } from '@/components/ui/use-toast';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (data: { email: string; password: string }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would make an API call here
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // });
      // const result = await response.json();
      // if (!response.ok) throw new Error(result.message || 'Login failed');
      
      // On success
      toast({
        title: 'Login successful',
        description: 'Welcome back!',
      });
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-2 text-center">
      <AuthForm 
        type="login" 
        onSubmit={handleSubmit} 
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}
