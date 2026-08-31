'use client';

import { useState } from 'react';

interface WatermarkedDownloadButtonProps {
  pdfUrl: string;
  fileName?: string;
  className?: string;
  label?: string;
}

export default function WatermarkedDownloadButton({
  pdfUrl,
  fileName,
  className,
  label = 'Télécharger le PDF',
}: WatermarkedDownloadButtonProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');

  const handleDownload = async () => {
    setStatus('loading');
    try {
      const params = new URLSearchParams({ url: pdfUrl });
      if (fileName) params.set('name', fileName);

      const res = await fetch(`/api/pdf-download?${params.toString()}`);

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Erreur de téléchargement');
      }

      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = fileName
        ? `${fileName.replace(/\.pdf$/i, '')}-maths-exams.pdf`
        : 'document-maths-exams.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(objectUrl);

      setStatus('idle');
    } catch (err: any) {
      console.error('[download]', err.message);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const base =
    'inline-flex items-center gap-2 px-4 py-2 rounded font-semibold text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-1';

  if (status === 'loading') {
    return (
      <button disabled className={`${base} bg-blue-400 text-white cursor-not-allowed ${className}`}>
        <svg
          className="animate-spin h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
        Préparation…
      </button>
    );
  }

  if (status === 'error') {
    return (
      <button disabled className={`${base} bg-red-500 text-white cursor-not-allowed ${className}`}>
        ⚠️ Erreur — réessayez
      </button>
    );
  }

  return (
    <button
      onClick={handleDownload}
      className={
        className ||
        `${base} bg-blue-700 hover:bg-blue-800 text-white shadow-sm focus:ring-blue-600`
      }
    >
      <svg
        className="h-4 w-4 shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 4v12m0 0l-4-4m4 4l4-4" />
      </svg>
      {label}
    </button>
  );
}
