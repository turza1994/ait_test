'use client';

import { useRequireAuth } from '@/hooks/useAuth';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  LogOut,
} from 'lucide-react';

const statisticsData = [
  {
    icon: <Users className="h-4 w-4" />,
    value: '1,234',
    title: 'Total Users',
    changePercentage: '+12.5%',
  },
  {
    icon: <BarChart3 className="h-4 w-4" />,
    value: '5,678',
    title: 'Total Sessions',
    changePercentage: '+8.2%',
  },
  {
    icon: <LayoutDashboard className="h-4 w-4" />,
    value: '89',
    title: 'Active Projects',
    changePercentage: '+3.1%',
  },
];

const recentActivityData = [
  { id: 1, user: 'John Doe', action: 'Created project', time: '2 hours ago' },
  { id: 2, user: 'Jane Smith', action: 'Updated settings', time: '4 hours ago' },
  { id: 3, user: 'Bob Johnson', action: 'Logged in', time: '6 hours ago' },
  { id: 4, user: 'Alice Brown', action: 'Deleted file', time: '1 day ago' },
  { id: 5, user: 'Charlie Wilson', action: 'Uploaded document', time: '2 days ago' },
];

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Users, label: 'Users', href: '/dashboard/users' },
  { icon: BarChart3, label: 'Analytics', href: '/dashboard/analytics' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
];

export default function DashboardPage() {
  const { isLoading } = useRequireAuth();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const getUserInitials = () => {
    if (!user?.email) return 'U';
    return user.email
      .split('@')[0]
      .split('.')
      .map((n) => n[0].toUpperCase())
      .join('')
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-200 transition-all duration-200 motion-reduce:transition-none ${
          sidebarOpen ? 'w-64' : 'w-0'
        } overflow-hidden`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900">Dashboard</h2>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2 text-slate-700 rounded-md hover:bg-slate-100 cursor-pointer transition-colors duration-200 motion-reduce:transition-none"
                >
                  <Icon className="h-5 w-5" />
                  <span className="whitespace-nowrap">{item.label}</span>
                </a>
              );
            })}
          </nav>
          <div className="p-4 border-t border-slate-200">
            <Button
              variant="ghost"
              onClick={logout}
              className="w-full justify-start text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors duration-200 motion-reduce:transition-none"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      <div
        className={`flex-1 transition-all duration-200 motion-reduce:transition-none ${
          sidebarOpen ? 'ml-64' : 'ml-0'
        }`}
      >
        <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="cursor-pointer"
              >
                <LayoutDashboard className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-blue-600 text-white">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-slate-700 hidden sm:block">
                  {user?.email}
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="p-6 max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Welcome back!
            </h1>
            <p className="text-slate-600">
              Here&apos;s what&apos;s happening with your projects today.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {statisticsData.map((stat, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors duration-200 motion-reduce:transition-none cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                    {stat.icon}
                  </div>
                  <span className="text-sm font-medium text-emerald-600">
                    {stat.changePercentage}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-1">
                  {stat.value}
                </h3>
                <p className="text-sm text-slate-600">{stat.title}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-lg border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">
                Recent Activity
              </h2>
            </div>
            <div className="divide-y divide-slate-200">
              {recentActivityData.map((activity) => (
                <div
                  key={activity.id}
                  className="p-4 hover:bg-slate-50 transition-colors duration-200 motion-reduce:transition-none cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {activity.user}
                      </p>
                      <p className="text-sm text-slate-600">{activity.action}</p>
                    </div>
                    <span className="text-xs text-slate-500">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}