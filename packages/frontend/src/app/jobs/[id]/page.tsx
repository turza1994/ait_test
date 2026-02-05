'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/apiClient';
import { useAuth } from '@/contexts/AuthContext';
import { Job } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl');
  const id = Number(params.id);
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [applyLoading, setApplyLoading] = useState(false);
  const [applyError, setApplyError] = useState<string | null>(null);

  useEffect(() => {
    if (isNaN(id)) {
      setLoading(false);
      return;
    }
    const load = async () => {
      setLoading(true);
      try {
        const res = await apiClient.getJob(id);
        if (res.success && res.data) {
          setJob(res.data);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const deadlinePassed = job
    ? new Date(job.deadline) < new Date()
    : false;
  const canApply =
    isAuthenticated &&
    user?.role === 'talent' &&
    job &&
    !deadlinePassed;

  const handleApply = async () => {
    if (!canApply || !job) return;
    setApplyLoading(true);
    setApplyError(null);
    try {
      const res = await apiClient.applyToJob(job.id, { source: 'manual' });
      if (res.success) {
        router.push('/dashboard');
      } else {
        setApplyError(res.message || 'Apply failed');
      }
    } catch {
      setApplyError('Apply failed');
    } finally {
      setApplyLoading(false);
    }
  };

  const handleApplyAsGuest = () => {
    const url = `/login?returnUrl=${encodeURIComponent(returnUrl || `/jobs/${id}`)}`;
    router.push(url);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-600">Loading...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-slate-600">Job not found.</p>
        <Link href="/jobs">
          <Button variant="outline">Back to jobs</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/jobs" className="text-lg font-semibold text-slate-900">
            ← Back to jobs
          </Link>
          {isAuthenticated ? (
            <Link href="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
          ) : (
            <div className="flex gap-2">
              <Link href="/login">
                <Button variant="ghost">Log in</Button>
              </Link>
              <Link href="/signup">
                <Button>Sign up</Button>
              </Link>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  {job.title}
                </h1>
                <p className="text-slate-600 mt-1">{job.companyName}</p>
              </div>
              <span className="text-sm text-slate-500">
                {job.applicationCount} application
                {job.applicationCount !== 1 ? 's' : ''}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h2 className="text-sm font-medium text-slate-700">
                Description
              </h2>
              <p className="mt-1 text-slate-600 whitespace-pre-wrap">
                {job.description}
              </p>
            </div>
            <div>
              <h2 className="text-sm font-medium text-slate-700">
                Tech stack
              </h2>
              <p className="mt-1 text-slate-600">{job.techStack}</p>
            </div>
            <p className="text-sm text-slate-500">
              Application deadline:{' '}
              {new Date(job.deadline).toLocaleDateString()}
            </p>

            {applyError && (
              <p className="text-red-600 text-sm">{applyError}</p>
            )}

            <div className="pt-4">
              {deadlinePassed ? (
                <Button disabled>Deadline passed</Button>
              ) : canApply ? (
                <Button
                  onClick={handleApply}
                  disabled={applyLoading}
                >
                  {applyLoading ? 'Applying...' : 'Apply now'}
                </Button>
              ) : isAuthenticated && user?.role !== 'talent' ? (
                <p className="text-slate-600 text-sm">
                  Only talents can apply. You are signed in as an employer.
                </p>
              ) : !isAuthenticated ? (
                <Button onClick={handleApplyAsGuest}>
                  Log in to apply
                </Button>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
