import { getCategories, getUnderCategories, getPosts } from '@/lib/db';

export default async function AdminDashboard() {
  const [categories, underCategories, posts] = await Promise.all([
    getCategories(),
    getUnderCategories(),
    getPosts(),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold">Categories</h2>
          <p className="text-3xl font-bold">{categories.length}</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold">Under Categories</h2>
          <p className="text-3xl font-bold">{underCategories.length}</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold">Posts</h2>
          <p className="text-3xl font-bold">{posts.length}</p>
        </div>
      </div>
    </div>
  );
}