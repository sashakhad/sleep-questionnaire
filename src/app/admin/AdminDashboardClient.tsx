'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, LogOut, RefreshCw } from 'lucide-react';

interface Response {
  id: string;
  yearOfBirth: number | null;
  sex: string | null;
  zipcode: string | null;
  weight: number | null;
  height: number | null;
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export function AdminDashboardClient() {
  const router = useRouter();
  const [responses, setResponses] = useState<Response[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function fetchResponses(page = 1) {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`/api/responses?page=${page}&limit=50`);

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/admin/login');
          return;
        }
        throw new Error('Failed to fetch responses');
      }

      const data = await response.json();
      setResponses(data.responses);
      setPagination(data.pagination);
    } catch (err) {
      setError('Failed to load responses. Please try again.');
      console.error('Error fetching responses:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void fetchResponses();
  }, []);

  async function handleLogout() {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    }
  }

  function handleDownloadCSV() {
    window.location.href = '/api/responses/csv';
  }

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-blue-50 to-white p-4'>
      <div className='container mx-auto max-w-7xl'>
        <Card className='shadow-xl'>
          <CardHeader className='bg-gradient-to-r from-blue-600 to-indigo-600 text-white'>
            <div className='flex items-center justify-between'>
              <div>
                <CardTitle className='text-2xl'>Admin Dashboard</CardTitle>
                <CardDescription className='mt-1 text-blue-100'>
                  Questionnaire Responses
                </CardDescription>
              </div>
              <div className='flex gap-2'>
                <Button
                  variant='secondary'
                  onClick={handleDownloadCSV}
                  className='bg-white text-blue-600 hover:bg-blue-50'
                >
                  <Download className='mr-2 h-4 w-4' />
                  Download CSV
                </Button>
                <Button
                  variant='secondary'
                  onClick={() => void fetchResponses(pagination?.page || 1)}
                  disabled={loading}
                  className='bg-white text-blue-600 hover:bg-blue-50'
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button
                  variant='secondary'
                  onClick={handleLogout}
                  className='bg-white text-blue-600 hover:bg-blue-50'
                >
                  <LogOut className='mr-2 h-4 w-4' />
                  Logout
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className='pt-6'>
            {error && (
              <div className='mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800'>
                {error}
              </div>
            )}

            {loading && responses.length === 0 ? (
              <div className='py-12 text-center'>
                <RefreshCw className='mx-auto mb-4 h-8 w-8 animate-spin text-blue-600' />
                <p className='text-gray-600'>Loading responses...</p>
              </div>
            ) : responses.length === 0 ? (
              <div className='py-12 text-center'>
                <p className='text-lg text-gray-600'>No responses yet.</p>
                <p className='mt-2 text-gray-500'>
                  Questionnaire responses will appear here once submitted.
                </p>
              </div>
            ) : (
              <>
                {pagination && (
                  <div className='mb-4 text-sm text-gray-600'>
                    Showing {responses.length} of {pagination.total} responses
                    {pagination.totalPages > 1 && (
                      <span className='ml-2'>
                        (Page {pagination.page} of {pagination.totalPages})
                      </span>
                    )}
                  </div>
                )}

                <div className='overflow-x-auto'>
                  <table className='w-full border-collapse'>
                    <thead>
                      <tr className='border-b-2 border-gray-200 bg-gray-50'>
                        <th className='p-3 text-left font-semibold text-gray-700'>ID</th>
                        <th className='p-3 text-left font-semibold text-gray-700'>Year of Birth</th>
                        <th className='p-3 text-left font-semibold text-gray-700'>Sex</th>
                        <th className='p-3 text-left font-semibold text-gray-700'>Zipcode</th>
                        <th className='p-3 text-left font-semibold text-gray-700'>Weight (lbs)</th>
                        <th className='p-3 text-left font-semibold text-gray-700'>Height (in)</th>
                        <th className='p-3 text-left font-semibold text-gray-700'>Submitted</th>
                      </tr>
                    </thead>
                    <tbody>
                      {responses.map(response => (
                        <tr
                          key={response.id}
                          className='border-b border-gray-100 transition-colors hover:bg-gray-50'
                        >
                          <td className='p-3 font-mono text-sm text-gray-600'>
                            {response.id.slice(0, 8)}...
                          </td>
                          <td className='p-3 text-sm text-gray-700'>
                            {response.yearOfBirth ?? '—'}
                          </td>
                          <td className='p-3 text-sm text-gray-700'>
                            {response.sex
                              ? response.sex.charAt(0).toUpperCase() + response.sex.slice(1)
                              : '—'}
                          </td>
                          <td className='p-3 text-sm text-gray-700'>{response.zipcode ?? '—'}</td>
                          <td className='p-3 text-sm text-gray-700'>{response.weight ?? '—'}</td>
                          <td className='p-3 text-sm text-gray-700'>{response.height ?? '—'}</td>
                          <td className='p-3 text-sm text-gray-600'>
                            {formatDate(response.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {pagination && pagination.totalPages > 1 && (
                  <div className='mt-6 flex justify-center gap-2'>
                    <Button
                      variant='outline'
                      onClick={() => void fetchResponses(pagination.page - 1)}
                      disabled={pagination.page === 1 || loading}
                    >
                      Previous
                    </Button>
                    <span className='flex items-center px-4 text-sm text-gray-600'>
                      Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <Button
                      variant='outline'
                      onClick={() => void fetchResponses(pagination.page + 1)}
                      disabled={pagination.page >= pagination.totalPages || loading}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
