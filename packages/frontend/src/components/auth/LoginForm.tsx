'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from '@/lib/validation';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useState } from 'react';
import Link from 'next/link';

export function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const message = searchParams.get('message');
  const showSuccessMessage = message === 'signup-success';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setSubmitError(null);

    try {
      await login(data.email, data.password);
      router.push('/dashboard');
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Sign in to your account
          </h2>
          <p className="text-sm text-slate-600">
            Or{' '}
            <Link
              href="/signup"
              className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer transition-colors duration-200 motion-reduce:transition-none"
            >
              create a new account
            </Link>
          </p>
        </div>

        {showSuccessMessage && (
          <Alert className="bg-green-50 border-green-200 text-green-800">
            <AlertDescription>
              Account created successfully! Please sign in.
            </AlertDescription>
          </Alert>
        )}
        
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
              placeholder="Enter your password"
              error={errors.password?.message}
              autoComplete="current-password"
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
              Sign in
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}