'use client';

import { useState, useEffect } from 'react';

interface PostDetail {
  id: number;
  name: string;
  description: string;
  slug: string;
  thumbnail: string;
  post_id: number;
  post_name?: string;
}

export default function PostDetailsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [details, setDetails] = useState<PostDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<PostDetail | null>(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    slug: '',
    thumbnail: '',
    post_id: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [pRes, dRes] = await Promise.all([
        fetch('/api/posts'),
        fetch('/api/post-details'),
      ]);
      const p = await pRes.json();
      const d = await dRes.json();
      setPosts(p);
      setDetails(d);
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
      const url = editingItem ? `/api/post-details/${editingItem.id}` : '/api/post-details';
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
    if (!confirm('Delete this detail?')) return;
    await fetch(`/api/post-details/${id}`, { method: 'DELETE' });
    fetchData();
  };

  const handleEdit = (item: PostDetail) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      slug: item.slug,
      thumbnail: item.thumbnail,
      post_id: item.post_id,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', slug: '', thumbnail: '', post_id: 0 });
    setEditingItem(null);
    setShowForm(false);
  };

  if (loading && details.length === 0) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Post Details</h1>
        <button onClick={() => setShowForm(true)} className="bg-blue-500 text-white px-4 py-2 rounded">Add Detail</button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{editingItem ? 'Edit' : 'Add'} Post Detail</h2>
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
                <label className="block text-sm font-medium mb-1">Post</label>
                <select value={formData.post_id} onChange={(e) => setFormData({ ...formData, post_id: parseInt(e.target.value) })} className="w-full border p-2 rounded" required>
                  <option value="">Select</option>
                  {posts.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full border p-2 rounded" rows={3} />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">File (Image/Video/PDF)</label>
                <input type="file" accept="image/*,video/*,.pdf" onChange={handleFileChange} className="w-full border p-2 rounded" />
                {uploading && <p>Uploading...</p>}
                {formData.thumbnail && (
                  formData.thumbnail.match(/\.(mp4|webm)$/i)
                    ? <video src={formData.thumbnail} controls className="mt-2 w-32 h-32 object-cover" />
                    : formData.thumbnail.match(/\.pdf$/i)
                    ? <a href={formData.thumbnail} target="_blank" className="text-blue-500">View PDF</a>
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

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Post</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {details.map((detail) => (
              <tr key={detail.id}>
                <td className="px-6 py-4">{detail.id}</td>
                <td className="px-6 py-4">{detail.name}</td>
                <td className="px-6 py-4">{detail.post_name || detail.post_id}</td>
                <td className="px-6 py-4">
                  <button onClick={() => handleEdit(detail)} className="text-blue-500 mr-2">Edit</button>
                  <button onClick={() => handleDelete(detail.id)} className="text-red-500">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}