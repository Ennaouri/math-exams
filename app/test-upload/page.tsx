'use client';

import { useState } from 'react';

export default function TestUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setResult(data.url);
      } else {
        setError(data.error);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-6">Test Vercel Blob Upload</h1>

      <form onSubmit={handleSubmit} className="max-w-md">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="block w-full border p-2 rounded mb-4"
        />

        <button
          type="submit"
          disabled={!file || uploading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>

      {result && (
        <div className="mt-6">
          <p className="font-bold text-green-600">Success!</p>
          <p className="break-all">{result}</p>
          <img src={result} alt="Uploaded" className="mt-4 max-w-md" />
        </div>
      )}

      {error && (
        <div className="mt-6">
          <p className="font-bold text-red-600">Error:</p>
          <p className="text-red-500">{error}</p>
        </div>
      )}
    </div>
  );
}