'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/apiClient';
import { TalentApplication, Invitation } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export function TalentDashboard() {
  const [applications, setApplications] = useState<TalentApplication[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [respondingId, setRespondingId] = useState<number | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [appRes, invRes] = await Promise.all([
          apiClient.getTalentApplications(),
          apiClient.getTalentInvitations(),
        ]);
        if (appRes.success && appRes.data) setApplications(appRes.data);
        if (invRes.success && invRes.data) setInvitations(invRes.data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleRespond = async (
    invitationId: number,
    status: 'accepted' | 'declined'
  ) => {
    setRespondingId(invitationId);
    try {
      const res = await apiClient.respondToInvitation(invitationId, status);
      if (res.success) {
        setInvitations((prev) =>
          prev.map((inv) =>
            inv.id === invitationId ? { ...inv, status } : inv
          )
        );
      }
    } finally {
      setRespondingId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900">
          My applications
        </h2>
        <Link href="/jobs">
          <Button variant="outline">Browse jobs</Button>
        </Link>
      </div>

      {loading ? (
        <p className="text-slate-600">Loading...</p>
      ) : applications.length === 0 ? (
        <p className="text-slate-600">No applications yet.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Source</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((app) => (
              <TableRow key={app.id}>
                <TableCell>
                  <Link
                    href={`/jobs/${app.jobId}`}
                    className="text-blue-600 hover:underline"
                  >
                    {app.title}
                  </Link>
                </TableCell>
                <TableCell>{app.companyName}</TableCell>
                <TableCell>{app.source}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          Invitations
        </h2>
        {invitations.length === 0 ? (
          <p className="text-slate-600">No invitations.</p>
        ) : (
          <ul className="space-y-4">
            {invitations.map((inv) => (
              <Card key={inv.id}>
                <CardHeader className="py-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-slate-900">{inv.title}</h3>
                      <p className="text-sm text-slate-500">
                        {inv.companyName} · Deadline:{' '}
                        {new Date(inv.deadline).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        Status: {inv.status}
                      </p>
                    </div>
                    {inv.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() =>
                            handleRespond(inv.id, 'accepted')
                          }
                          disabled={respondingId === inv.id}
                        >
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleRespond(inv.id, 'declined')
                          }
                          disabled={respondingId === inv.id}
                        >
                          Decline
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
              </Card>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
