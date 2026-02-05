'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/apiClient';
import { Job, Applicant, MatchedTalent } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export function EmployerDashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [matchedTalents, setMatchedTalents] = useState<MatchedTalent[]>([]);
  const [applicants, setApplicants] = useState<Applicant[] | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [createLoading, setCreateLoading] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [inviteError, setInviteError] = useState<string | null>(null);

  const [createForm, setCreateForm] = useState({
    title: '',
    techStack: '',
    companyName: '',
    deadline: '',
  });
  const [inviteForm, setInviteForm] = useState({ jobId: '', talentId: '' });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [jobsRes, talentsRes] = await Promise.all([
          apiClient.getEmployerJobs(),
          apiClient.getMatchedTalents(),
        ]);
        if (jobsRes.success && jobsRes.data) setJobs(jobsRes.data);
        if (talentsRes.success && talentsRes.data)
          setMatchedTalents(talentsRes.data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (selectedJobId == null) {
      setApplicants(null);
      return;
    }
    const load = async () => {
      const res = await apiClient.getEmployerJobApplicants(selectedJobId);
      if (res.success && res.data) setApplicants(res.data);
      else setApplicants([]);
    };
    load();
  }, [selectedJobId]);

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    setCreateError(null);
    try {
      const deadline = new Date(createForm.deadline).toISOString();
      const res = await apiClient.createJob({
        title: createForm.title,
        techStack: createForm.techStack,
        companyName: createForm.companyName,
        deadline,
      });
      if (res.success && res.data) {
        setJobs((prev) => [res.data!, ...prev]);
        setCreateForm({ title: '', techStack: '', companyName: '', deadline: '' });
        setCreateOpen(false);
      } else {
        setCreateError(res.message || 'Failed to create job');
      }
    } catch {
      setCreateError('Failed to create job');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    const jobId = Number(inviteForm.jobId);
    const talentId = Number(inviteForm.talentId);
    if (!jobId || !talentId) return;
    setInviteLoading(true);
    setInviteError(null);
    try {
      const res = await apiClient.invite({ jobId, talentId });
      if (res.success) {
        setInviteForm({ jobId: '', talentId: '' });
        setInviteOpen(false);
      } else {
        setInviteError(res.message || 'Failed to invite');
      }
    } catch {
      setInviteError('Failed to invite');
    } finally {
      setInviteLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          My jobs
        </h2>
        {loading ? (
          <p className="text-slate-600">Loading...</p>
        ) : jobs.length === 0 ? (
          <p className="text-slate-600">No jobs yet.</p>
        ) : (
          <ul className="space-y-2">
            {jobs.map((job) => (
              <li key={job.id}>
                <Card
                  className={
                    selectedJobId === job.id
                      ? 'border-blue-600'
                      : undefined
                  }
                >
                  <CardHeader className="py-3">
                    <div className="flex justify-between items-center">
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedJobId(
                            selectedJobId === job.id ? null : job.id
                          )
                        }
                        className="text-left"
                      >
                        <h3 className="font-medium text-slate-900">
                          {job.title}
                        </h3>
                        <p className="text-sm text-slate-500">
                          {job.companyName} · {job.applicationCount} applicants
                        </p>
                      </button>
                    </div>
                  </CardHeader>
                  {selectedJobId === job.id && applicants !== null && (
                    <CardContent className="pt-0">
                      <h4 className="text-sm font-medium text-slate-700 mb-2">
                        Applicants
                      </h4>
                      {applicants.length === 0 ? (
                        <p className="text-sm text-slate-500">
                          No applicants yet.
                        </p>
                      ) : (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Email</TableHead>
                              <TableHead>Source</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {applicants.map((a) => (
                              <TableRow key={a.talentId}>
                                <TableCell>{a.name}</TableCell>
                                <TableCell>{a.email}</TableCell>
                                <TableCell>{a.source}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      )}
                    </CardContent>
                  )}
                </Card>
              </li>
            ))}
          </ul>
        )}
        <Button
          className="mt-4"
          variant="outline"
          onClick={() => setCreateOpen((o) => !o)}
        >
          {createOpen ? 'Cancel' : 'Create job'}
        </Button>
        {createOpen && (
          <Card className="mt-4 max-w-md">
            <CardHeader>
              <h3 className="font-medium">Create job</h3>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateJob} className="space-y-4">
                <div>
                  <Label>Title</Label>
                  <Input
                    value={createForm.title}
                    onChange={(e) =>
                      setCreateForm((f) => ({ ...f, title: e.target.value }))
                    }
                    required
                  />
                </div>
                <div>
                  <Label>Tech stack (comma-separated)</Label>
                  <Input
                    value={createForm.techStack}
                    onChange={(e) =>
                      setCreateForm((f) => ({ ...f, techStack: e.target.value }))
                    }
                    required
                  />
                </div>
                <div>
                  <Label>Company name</Label>
                  <Input
                    value={createForm.companyName}
                    onChange={(e) =>
                      setCreateForm((f) => ({
                        ...f,
                        companyName: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div>
                  <Label>Deadline (date)</Label>
                  <Input
                    type="date"
                    value={createForm.deadline}
                    onChange={(e) =>
                      setCreateForm((f) => ({ ...f, deadline: e.target.value }))
                    }
                    required
                  />
                </div>
                {createError && (
                  <p className="text-sm text-red-600">{createError}</p>
                )}
                <Button type="submit" disabled={createLoading}>
                  {createLoading ? 'Creating...' : 'Create'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          Matched talents
        </h2>
        {matchedTalents.length === 0 ? (
          <p className="text-slate-600">No talents yet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Match score</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {matchedTalents.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>{t.name}</TableCell>
                  <TableCell>{t.email}</TableCell>
                  <TableCell>{t.matchScore}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setInviteForm((f) => ({ ...f, talentId: String(t.id) }));
                        setInviteOpen(true);
                      }}
                    >
                      Invite
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {inviteOpen && (
          <Card className="mt-4 max-w-md">
            <CardHeader>
              <h3 className="font-medium">Invite talent to job</h3>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleInvite} className="space-y-4">
                <div>
                  <Label>Job ID</Label>
                  <Input
                    type="number"
                    value={inviteForm.jobId}
                    onChange={(e) =>
                      setInviteForm((f) => ({ ...f, jobId: e.target.value }))
                    }
                    required
                  />
                </div>
                <div>
                  <Label>Talent ID</Label>
                  <Input
                    type="number"
                    value={inviteForm.talentId}
                    onChange={(e) =>
                      setInviteForm((f) => ({ ...f, talentId: e.target.value }))
                    }
                    required
                  />
                </div>
                {inviteError && (
                  <p className="text-sm text-red-600">{inviteError}</p>
                )}
                <div className="flex gap-2">
                  <Button type="submit" disabled={inviteLoading}>
                    {inviteLoading ? 'Sending...' : 'Send invitation'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setInviteOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
