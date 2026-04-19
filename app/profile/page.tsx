'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      setLoading(false);
    }
  }, [status, router]);

  if (loading || status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 h-32"></div>
          
          <div className="px-6 pb-6">
            <div className="relative -mt-16 mb-4">
              <div className="w-24 h-24 bg-white rounded-full p-1">
                <div className="w-full h-full bg-blue-100 rounded-full flex items-center justify-center">
                  {(session?.user as any)?.image ? (
                    <img 
                      src={(session.user as any).image} 
                      alt={session?.user?.name || 'User'} 
                      className="w-full h-full rounded-full"
                    />
                  ) : (
                    <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                </div>
              </div>
            </div>

            <h1 className="text-2xl font-bold text-gray-800">
              {session?.user?.name || 'User'}
            </h1>
            <p className="text-gray-600">{session?.user?.email}</p>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Account Info</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Email verified:</span>
                  <span className="text-green-600 font-medium">Yes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Account type:</span>
                  <span className="text-blue-600 font-medium">{(session?.user as any)?.role || 'User'}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-4">
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}