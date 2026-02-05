'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, SignupFormData } from '@/lib/validation';
import { apiClient } from '@/lib/apiClient';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useState } from 'react';
import Link from 'next/link';

export function SignupForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    setSubmitError(null);

    try {
      const response = await apiClient.signup(data);
      
      if (response.success && response.data) {
        router.push('/login?message=signup-success');
      } else {
        throw new Error(response.message || 'Signup failed');
      }
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Create your account
          </h2>
          <p className="text-sm text-slate-600">
            Or{' '}
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer transition-colors duration-200 motion-reduce:transition-none"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>
        
        {submitError && (
          <Alert className="bg-red-50 border-red-200 text-red-800">
            <AlertDescription>
              {submitError}
            </AlertDescription>
          </Alert>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <Input
              {...register('name')}
              type="text"
              label="Full name"
              placeholder="Enter your full name"
              error={errors.name?.message}
              autoComplete="name"
              className="h-10 px-3 focus-visible:ring-2 motion-reduce:transition-none"
            />

            <Input
              {...register('email')}
              type="email"
              label="Email address"
              placeholder="Enter your email"
              error={errors.email?.message}
              autoComplete="email"
              className="h-10 px-3 focus-visible:ring-2 motion-reduce:transition-none"
            />
            
            <Input
              {...register('password')}
              type="password"
              label="Password"
              placeholder="Create a password"
              error={errors.password?.message}
              autoComplete="new-password"
              className="h-10 px-3 focus-visible:ring-2 motion-reduce:transition-none"
            />
          </div>

          <div>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 transition-colors duration-200 motion-reduce:transition-none"
              isLoading={isLoading}
              disabled={isLoading}
            >
              Create account
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}