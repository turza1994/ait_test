'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/apiClient';
import { useState, useEffect } from 'react';
import { SampleItem } from '@/types/api';

export function Header() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">
              Next.js Boilerplate
            </h1>
          </div>
          
          {isAuthenticated && (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                {user?.email}
              </span>
              <Button
                variant="secondary"
                size="sm"
                onClick={logout}
              >
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export function DashboardContent() {
  const [sampleData, setSampleData] = useState<SampleItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSampleData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await apiClient.get<SampleItem>('/api/sample/items/1');
        if (response.success && response.data) {
          setSampleData(response.data);
        } else {
          setError(response.message || 'Failed to fetch sample data');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSampleData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="border-4 border-dashed border-gray-200 rounded-lg h-96">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Dashboard
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  API Integration Example
                </h3>
                <p className="text-gray-600 mb-4">
                  This section demonstrates fetching protected data from your Express.js API.
                </p>
                
                {isLoading && (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading sample data...</p>
                  </div>
                )}
                
                {error && (
                  <div className="rounded-md bg-red-50 p-4">
                    <div className="text-sm text-red-800">
                      {error}
                    </div>
                  </div>
                )}
                
                {sampleData && (
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-2">Sample Item Data:</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">ID:</span>
                        <span className="ml-2 text-gray-900">{sampleData.id}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Counter:</span>
                        <span className="ml-2 text-gray-900">{sampleData.counter}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Features
                </h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>JWT authentication with automatic token refresh</li>
                  <li>Protected routes with redirect functionality</li>
                  <li>Type-safe API integration</li>
                  <li>Form validation with React Hook Form + Zod</li>
                  <li>Tailwind CSS for styling</li>
                  <li>Next.js 15 App Router</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}