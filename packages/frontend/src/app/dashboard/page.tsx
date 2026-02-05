'use client';

import { useRequireAuth } from '@/hooks/useAuth';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LayoutDashboard, LogOut } from 'lucide-react';
import Link from 'next/link';
import { EmployerDashboard } from '@/components/dashboard/EmployerDashboard';
import { TalentDashboard } from '@/components/dashboard/TalentDashboard';

export default function DashboardPage() {
  const { isLoading } = useRequireAuth();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  const getUserInitials = () => {
    if (user?.name) {
      return user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    if (user?.email) {
      return user.email
        .split('@')[0]
        .split('.')
        .map((n) => n[0].toUpperCase())
        .join('')
        .slice(0, 2);
    }
    return 'U';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-200 transition-all duration-200 ${
          sidebarOpen ? 'w-64' : 'w-0'
        } overflow-hidden`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-slate-200">
            <Link href="/" className="text-xl font-bold text-slate-900">
              TalentX
            </Link>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-3 py-2 text-slate-700 rounded-md hover:bg-slate-100"
            >
              <LayoutDashboard className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/jobs"
              className="flex items-center gap-3 px-3 py-2 text-slate-700 rounded-md hover:bg-slate-100"
            >
              <span>Browse jobs</span>
            </Link>
          </nav>
          <div className="p-4 border-t border-slate-200">
            <Button
              variant="ghost"
              onClick={logout}
              className="w-full justify-start text-slate-700 hover:bg-slate-100"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      <div className={`flex-1 transition-all ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
          <div className="flex items-center justify-between px-6 py-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <LayoutDashboard className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-blue-600 text-white">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-slate-700 hidden sm:block">
                {user?.name ?? user?.email}
              </span>
              <span className="text-xs text-slate-500 hidden sm:block">
                ({user?.role})
              </span>
            </div>
          </div>
        </header>

        <main className="p-6 max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900">
              Welcome back{user?.name ? `, ${user.name}` : ''}
            </h1>
            <p className="text-slate-600">
              {user?.role === 'employer'
                ? 'Manage your jobs and invite talents.'
                : 'View your applications and invitations.'}
            </p>
          </div>

          {user?.role === 'employer' && <EmployerDashboard />}
          {user?.role === 'talent' && <TalentDashboard />}
          {user?.role !== 'employer' && user?.role !== 'talent' && (
            <p className="text-slate-600">
              Unknown role. Please sign up again as Employer or Talent.
            </p>
          )}
        </main>
      </div>
    </div>
  );
}
