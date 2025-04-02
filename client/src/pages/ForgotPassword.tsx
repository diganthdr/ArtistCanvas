import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'wouter';
import { apiRequest } from '@/lib/queryClient';

// Forgot password form schema
const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address')
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [resetLink, setResetLink] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ''
    }
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setIsLoading(true);
    try {
      const response = await apiRequest('POST', '/api/forgot-password', {
        email: values.email
      });

      const data = await response.json();
      
      if (response.ok) {
        setIsSubmitted(true);
        toast({
          title: 'Request submitted',
          description: 'If the email exists in our system, a password reset link has been sent.',
        });
        
        // Only for demo purposes - in production this wouldn't be in the response
        if (data.resetLink) {
          setResetLink(data.resetLink);
        }
      } else {
        toast({
          title: 'Error',
          description: data.message || 'Failed to process your request',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Check Your Email</h1>
            <p className="mt-2 text-gray-600">
              We've sent password reset instructions to your email address (if it exists in our system).
            </p>
          </div>
          
          {resetLink && (
            <div className="p-4 mt-4 bg-gray-100 rounded-md">
              <p className="text-sm font-medium text-gray-700">Demo Mode Only:</p>
              <p className="mt-1 text-sm text-gray-600">
                In a production environment, the link would be sent via email. For this demo, you can use the following link:
              </p>
              <a 
                href={resetLink} 
                className="block mt-2 text-sm text-primary hover:underline break-all"
              >
                {resetLink}
              </a>
            </div>
          )}
          
          <div className="pt-4">
            <Link to="/auth">
              <button className="w-full px-4 py-2 text-white bg-primary rounded hover:bg-primary/90">
                Return to Login
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Forgot Password</h1>
          <p className="mt-2 text-gray-600">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              {...form.register('email')}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
            />
            {form.formState.errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 text-white bg-primary rounded hover:bg-primary/90 disabled:opacity-50"
          >
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="text-center">
          <Link to="/auth" className="text-sm text-primary hover:underline">
            Return to login
          </Link>
        </div>
      </div>
    </div>
  );
}