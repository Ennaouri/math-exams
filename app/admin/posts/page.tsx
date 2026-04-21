'use client';

import { useState, useEffect } from 'react';
import PaginatedTable from '@/app/components/PaginatedTable';

interface Post {
  id: number;
  name: string;
  description: string;
  slug: string;
  thumbnail: string;
  underCategoryId: number;
  under_category_name?: string;
  attribute?: string;
}

export default function PostsPage() {
  const [underCategories, setUnderCategories] = useState<any[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Post | null>(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    slug: '',
    thumbnail: '',
    underCategoryId: 0,
    attribute: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [ucRes, postsRes] = await Promise.all([
        fetch('/api/under-categories'),
        fetch('/api/posts'),
      ]);
      const uc = await ucRes.json();
      const p = await postsRes.json();
      setUnderCategories(uc);
      setPosts(p);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      const fd = new FormData();
      fd.append('file', file);
      try {
        const res = await fetch('/api/upload', { method: 'POST', body: fd });
        const data = await res.json();
        if (data.url) setFormData({ ...formData, thumbnail: data.url });
      } catch (error) {
        console.error('Upload error:', error);
      } finally {
        setUploading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = editingItem ? `/api/posts/${editingItem.id}` : '/api/posts';
      const method = editingItem ? 'PUT' : 'POST';
      await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
      fetchData();
      resetForm();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this post?')) return;
    await fetch(`/api/posts/${id}`, { method: 'DELETE' });
    fetchData();
  };

  const handleEdit = (item: Post) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      slug: item.slug,
      thumbnail: item.thumbnail,
      underCategoryId: item.underCategoryId,
      attribute: item.attribute || '',
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', slug: '', thumbnail: '', underCategoryId: 0, attribute: '' });
    setEditingItem(null);
    setShowForm(false);
  };

  if (loading && posts.length === 0) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Posts</h1>
        <button onClick={() => setShowForm(true)} className="bg-blue-500 text-white px-4 py-2 rounded">Add Post</button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{editingItem ? 'Edit' : 'Add'} Post</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Name</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: generateSlug(e.target.value) })} className="w-full border p-2 rounded" required />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Slug</label>
                <input type="text" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} className="w-full border p-2 rounded" required />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Under Category</label>
                <select value={formData.underCategoryId} onChange={(e) => setFormData({ ...formData, underCategoryId: parseInt(e.target.value) })} className="w-full border p-2 rounded" required>
                  <option value="">Select</option>
                  {underCategories.map((uc) => <option key={uc.id} value={uc.id}>{uc.name}</option>)}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Type</label>
                <select value={formData.attribute} onChange={(e) => setFormData({ ...formData, attribute: e.target.value })} className="w-full border p-2 rounded">
                  <option value="">Select type</option>
                  <option value="cours">Cours</option>
                  <option value="exercices">Exercices</option>
                  <option value="devoir">Devoir</option>
                  <option value="examens">Examens</option>
                  <option value="concours">Concours</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full border p-2 rounded" rows={3} />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Thumbnail</label>
                <input type="file" accept="image/*,video/*" onChange={handleFileChange} className="w-full border p-2 rounded" />
                {uploading && <p>Uploading...</p>}
                {formData.thumbnail && (
                  formData.thumbnail.match(/\.(mp4|webm)$/i)
                    ? <video src={formData.thumbnail} className="mt-2 w-32 h-32 object-cover" />
                    : <img src={formData.thumbnail} alt="Preview" className="mt-2 w-32 h-32 object-cover" />
                )}
              </div>
              <div className="flex gap-2">
                <button type="submit" disabled={loading || uploading} className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50">{loading ? 'Saving...' : 'Save'}</button>
                <button type="button" onClick={resetForm} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <PaginatedTable
        data={posts}
        columns={[
          { key: 'id', label: 'ID', sortable: true },
          { key: 'name', label: 'Name', sortable: true },
          { 
            key: 'attribute', 
            label: 'Type', 
            sortable: true,
            render: (post) => post.attribute ? (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">{post.attribute}</span>
            ) : null
          },
          { 
            key: 'under_category_name', 
            label: 'Category', 
            sortable: true,
            render: (post) => post.under_category_name || post.underCategoryId
          },
          { 
            key: 'thumbnail', 
            label: 'Thumbnail',
            render: (post) => post.thumbnail ? (
              post.thumbnail.match(/\.(mp4|webm)$/i)
                ? <video src={post.thumbnail} className="w-16 h-16 object-cover" />
                : <img src={post.thumbnail} alt={post.name} className="w-16 h-16 object-cover" />
            ) : null
          },
          { 
            key: 'actions', 
            label: 'Actions',
            sortable: false,
            render: (post) => (
              <div className="flex gap-2">
                <button onClick={() => handleEdit(post)} className="text-blue-500 hover:text-blue-700">Edit</button>
                <button onClick={() => handleDelete(post.id)} className="text-red-500 hover:text-red-700">Delete</button>
              </div>
            )
          },
        ]}
        filters={[
          { key: 'attribute', label: 'Filter by Type', options: [
            { value: 'cours', label: 'Cours' },
            { value: 'exercices', label: 'Exercices' },
            { value: 'devoir', label: 'Devoir' },
            { value: 'examens', label: 'Examens' },
            { value: 'concours', label: 'Concours' },
          ]},
        ]}
        searchPlaceholder="Search posts..."
      />
    </div>
  );
}