'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/apiClient';
import { Job } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiClient.getJobs(search || undefined);
        if (res.success && res.data) {
          setJobs(res.data);
        } else {
          setError(res.message || 'Failed to load jobs');
        }
      } catch {
        setError('Failed to load jobs');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [search]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput.trim());
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
          <Link href="/" className="text-xl font-bold text-slate-900">
            TalentX
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign up</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">
          Browse jobs
        </h1>

        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <Input
            type="text"
            placeholder="Search by job title..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="max-w-sm"
          />
          <Button type="submit">Search</Button>
        </form>

        {error && (
          <p className="text-red-600 mb-4">{error}</p>
        )}

        {loading ? (
          <p className="text-slate-600">Loading jobs...</p>
        ) : jobs.length === 0 ? (
          <p className="text-slate-600">No jobs found.</p>
        ) : (
          <ul className="space-y-4">
            {jobs.map((job) => (
              <li key={job.id}>
                <Link href={`/jobs/${job.id}`}>
                  <Card className="hover:border-slate-300 transition-colors cursor-pointer">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <h2 className="text-lg font-semibold text-slate-900">
                          {job.title}
                        </h2>
                        <span className="text-sm text-slate-500">
                          {job.applicationCount} application
                          {job.applicationCount !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600">
                        {job.companyName}
                      </p>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-slate-500 line-clamp-2">
                        {job.description}
                      </p>
                      <p className="text-xs text-slate-400 mt-2">
                        Tech: {job.techStack} · Deadline:{' '}
                        {new Date(job.deadline).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
