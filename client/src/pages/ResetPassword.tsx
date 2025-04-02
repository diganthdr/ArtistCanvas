import { useState, useEffect } from 'react';
import { useLocation, useRoute, Link } from 'wouter';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

// Password reset form schema
const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword']
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPassword() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute('/reset-password');
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  });

  useEffect(() => {
    // Extract token from URL query parameters
    if (match) {
      const url = new URL(window.location.href);
      const tokenParam = url.searchParams.get('token');
      if (tokenParam) {
        setToken(tokenParam);
      } else {
        toast({
          title: 'Missing reset token',
          description: 'The password reset link is invalid. Please request a new one.',
          variant: 'destructive'
        });
        setLocation('/auth');
      }
    }
  }, [match, setLocation, toast]);

  const onSubmit = async (values: ResetPasswordFormValues) => {
    if (!token) return;

    setIsLoading(true);
    try {
      const response = await apiRequest('POST', '/api/reset-password', {
        token,
        newPassword: values.password
      });

      if (response.ok) {
        setIsSuccess(true);
        toast({
          title: 'Password updated',
          description: 'Your password has been successfully updated. You can now login with your new password.',
        });
      } else {
        const data = await response.json();
        toast({
          title: 'Error',
          description: data.message || 'Failed to reset password. The link may have expired.',
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

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Password Reset Successful</h1>
            <p className="mt-2 text-gray-600">
              Your password has been successfully reset. You can now login with your new password.
            </p>
          </div>
          <div className="pt-4">
            <Link to="/auth">
              <button className="w-full px-4 py-2 text-white bg-primary rounded hover:bg-primary/90">
                Go to Login
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
          <h1 className="text-2xl font-bold text-gray-900">Reset Your Password</h1>
          <p className="mt-2 text-gray-600">
            Please enter your new password below.
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              id="password"
              type="password"
              {...form.register('password')}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
            />
            {form.formState.errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              {...form.register('confirmPassword')}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
            />
            {form.formState.errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">
                {form.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 text-white bg-primary rounded hover:bg-primary/90 disabled:opacity-50"
          >
            {isLoading ? 'Resetting Password...' : 'Reset Password'}
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