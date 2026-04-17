import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import LogoutButton from './adminLogoutButton';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-gray-800 text-white p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <div className="flex gap-4 items-center">
            <Link href="/admin" className="hover:text-gray-300">Dashboard</Link>
            <Link href="/admin/categories" className="hover:text-gray-300">Categories</Link>
            <Link href="/admin/under-categories" className="hover:text-gray-300">Under Categories</Link>
            <Link href="/admin/posts" className="hover:text-gray-300">Posts</Link>
            <Link href="/admin/post-details" className="hover:text-gray-300">Post Details</Link>
            <Link href="/" className="hover:text-gray-300">View Site</Link>
            <LogoutButton />
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto p-4">
        {children}
      </main>
    </div>
  );
}