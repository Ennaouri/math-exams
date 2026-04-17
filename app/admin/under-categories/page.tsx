'use client';

import { useState, useEffect } from 'react';

interface UnderCategory {
  id: number;
  name: string;
  description: string;
  slug: string;
  thumbnail: string;
  category_id: number;
  category_name?: string;
}

export default function UnderCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [underCategories, setUnderCategories] = useState<UnderCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<UnderCategory | null>(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    slug: '',
    thumbnail: '',
    category_id: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [catsRes, underCatsRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/under-categories'),
      ]);
      const cats = await catsRes.json();
      const underCats = await underCatsRes.json();
      setCategories(cats);
      setUnderCategories(underCats);
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
      const url = editingItem ? `/api/under-categories/${editingItem.id}` : '/api/under-categories';
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
    if (!confirm('Delete this under-category?')) return;
    await fetch(`/api/under-categories/${id}`, { method: 'DELETE' });
    fetchData();
  };

  const handleEdit = (item: UnderCategory) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      slug: item.slug,
      thumbnail: item.thumbnail,
      category_id: item.category_id,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', slug: '', thumbnail: '', category_id: 0 });
    setEditingItem(null);
    setShowForm(false);
  };

  if (loading && underCategories.length === 0) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Under Categories</h1>
        <button onClick={() => setShowForm(true)} className="bg-blue-500 text-white px-4 py-2 rounded">Add</button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{editingItem ? 'Edit' : 'Add'} Under Category</h2>
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
                <label className="block text-sm font-medium mb-1">Category</label>
                <select value={formData.category_id} onChange={(e) => setFormData({ ...formData, category_id: parseInt(e.target.value) })} className="w-full border p-2 rounded" required>
                  <option value="">Select Category</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full border p-2 rounded" rows={3} />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Thumbnail</label>
                <input type="file" accept="image/*" onChange={handleFileChange} className="w-full border p-2 rounded" />
                {uploading && <p>Uploading...</p>}
                {formData.thumbnail && <img src={formData.thumbnail} alt="Preview" className="mt-2 w-32 h-32 object-cover" />}
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {underCategories.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4">{item.id}</td>
                <td className="px-6 py-4">{item.name}</td>
                <td className="px-6 py-4">{item.category_name || item.category_id}</td>
                <td className="px-6 py-4">
                  <button onClick={() => handleEdit(item)} className="text-blue-500 mr-2">Edit</button>
                  <button onClick={() => handleDelete(item.id)} className="text-red-500">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}