'use client';

import { useState, useEffect } from 'react';

interface Blob {
  url: string;
  size: number;
  uploadedAt: string;
  contentType: string;
  isUsed: boolean;
  usedIn: string | null;
}

export default function BlobsPage() {
  const [blobs, setBlobs] = useState<Blob[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlob, setSelectedBlob] = useState<Blob | null>(null);

  useEffect(() => {
    fetchBlobs();
  }, []);

  const fetchBlobs = async () => {
    try {
      const res = await fetch('/api/blobs');
      const data = await res.json();
      if (Array.isArray(data)) {
        setBlobs(data);
      } else {
        console.error('API returned error:', data);
        setBlobs([]);
      }
    } catch (error) {
      console.error('Error:', error);
      setBlobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (url: string) => {
    if (!confirm('Delete this file?')) return;
    try {
      await fetch(`/api/blobs?url=${encodeURIComponent(url)}`, { method: 'DELETE' });
      fetchBlobs();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileType = (contentType?: string) => {
    if (contentType?.startsWith('image/')) return 'image';
    if (contentType?.startsWith('video/')) return 'video';
    if (contentType?.includes('pdf')) return 'pdf';
    if (contentType?.includes('word') || contentType?.includes('document')) return 'doc';
    return 'file';
  };

  const getFileExtension = (url: string) => {
    const ext = url.split('.').pop()?.toLowerCase() || '';
    return ext;
  };

  const filename = (url: string) => {
    const parts = url.split('/');
    return parts[parts.length - 1];
  };

  const getDescription = (blob: Blob) => {
    if (blob.isUsed && blob.usedIn) {
      return blob.usedIn;
    }
    return `Unused file - ${formatSize(blob.size)}`;
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Blob Storage</h1>
      <p className="mb-4 text-gray-600">{blobs.length} files</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {blobs.map((blob) => {
          const fileType = getFileType(blob.contentType);
          const ext = getFileExtension(blob.url);
          
          return (
            <div 
              key={blob.url} 
              className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer ${blob.isUsed ? 'ring-2 ring-blue-500' : 'ring-2 ring-yellow-400'}`}
              onClick={() => setSelectedBlob(blob)}
            >
              <div className="aspect-video bg-gray-100 flex items-center justify-center overflow-hidden">
                {fileType === 'image' && (
                  <img src={blob.url} alt="" className="w-full h-full object-cover" />
                )}
                {fileType === 'video' && (
                  <video src={blob.url} className="w-full h-full object-cover" />
                )}
                {fileType === 'pdf' && (
                  <div className="flex flex-col items-center justify-center p-4 text-center">
                    <svg className="w-16 h-16 text-red-500 mb-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                    </svg>
                    <span className="text-red-500 font-bold">PDF</span>
                    <span className="text-xs text-gray-500">{ext.toUpperCase()}</span>
                  </div>
                )}
                {fileType !== 'image' && fileType !== 'video' && fileType !== 'pdf' && (
                  <div className="flex flex-col items-center justify-center p-4 text-center">
                    <svg className="w-12 h-12 text-gray-400 mb-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs text-gray-500">{ext.toUpperCase()}</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-sm truncate mb-1" title={filename(blob.url)}>
                  {filename(blob.url)}
                </h3>
                <p className="text-xs text-gray-500 mb-2">
                  {formatSize(blob.size)} • {new Date(blob.uploadedAt).toLocaleDateString()}
                </p>
                <div className={`text-xs p-2 rounded mb-2 ${blob.isUsed ? 'bg-blue-50 text-blue-700' : 'bg-yellow-50 text-yellow-700'}`}>
                  {blob.isUsed ? `Used in: ${blob.usedIn}` : 'Not linked to any post'}
                </div>
                <div className="flex gap-2 mt-2">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setSelectedBlob(blob); }} 
                    className="text-blue-500 hover:text-blue-700 text-sm"
                  >
                    Preview
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDelete(blob.url); }} 
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedBlob && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={() => setSelectedBlob(null)}>
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold truncate">{filename(selectedBlob.url)}</h2>
              <button onClick={() => setSelectedBlob(null)} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
            </div>
            
            <div className="p-6 bg-gray-50">
              <div className="bg-white rounded-lg shadow p-4">
                {getFileType(selectedBlob.contentType) === 'image' && (
                  <img src={selectedBlob.url} alt="" className="max-w-full max-h-[50vh] mx-auto object-contain" />
                )}
                {getFileType(selectedBlob.contentType) === 'video' && (
                  <video src={selectedBlob.url} controls className="max-w-full max-h-[50vh] mx-auto" />
                )}
                {getFileType(selectedBlob.contentType) === 'pdf' && (
                  <div className="flex flex-col items-center justify-center py-8">
                    <svg className="w-24 h-24 text-red-500 mb-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                    </svg>
                    <p className="text-lg font-medium text-gray-700 mb-2">{filename(selectedBlob.url)}</p>
                    <a 
                      href={selectedBlob.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      Open PDF in new tab
                    </a>
                  </div>
                )}
                {getFileType(selectedBlob.contentType) === 'file' && (
                  <div className="flex flex-col items-center justify-center py-8">
                    <svg className="w-24 h-24 text-gray-400 mb-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                    </svg>
                    <a 
                      href={selectedBlob.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      Open File
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500">File Size</p>
                  <p className="text-sm font-medium">{formatSize(selectedBlob.size)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Type</p>
                  <p className="text-sm font-medium">{selectedBlob.contentType || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Uploaded</p>
                  <p className="text-sm font-medium">{new Date(selectedBlob.uploadedAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <p className={`text-sm font-medium ${selectedBlob.isUsed ? 'text-blue-600' : 'text-yellow-600'}`}>
                    {selectedBlob.isUsed ? 'Linked' : 'Unused'}
                  </p>
                </div>
              </div>
              
              {selectedBlob.isUsed && selectedBlob.usedIn && (
                <div className="bg-blue-50 p-3 rounded mb-4">
                  <p className="text-xs text-gray-500 mb-1">Used in:</p>
                  <p className="text-sm font-medium text-blue-700">{selectedBlob.usedIn}</p>
                </div>
              )}
              
              <div className="flex gap-2">
                <a 
                  href={selectedBlob.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 bg-blue-500 text-white px-4 py-2 rounded text-center hover:bg-blue-600"
                >
                  Open
                </a>
                <button 
                  onClick={() => { handleDelete(selectedBlob.url); setSelectedBlob(null); }} 
                  className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}