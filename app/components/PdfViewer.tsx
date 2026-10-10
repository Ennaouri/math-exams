'use client';
// components/PdfViewer.tsx
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { useSession } from 'next-auth/react';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';


const PdfViewer = ({ url }: { url: string }) => {
  const { status } = useSession();
  const isAuth = status === 'authenticated';

  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  return (
    <div className={`h-full w-full ${!isAuth ? 'pdf-viewer-no-download' : ''}`}>
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.10.111/build/pdf.worker.min.js">
        <Viewer fileUrl={url} plugins={[defaultLayoutPluginInstance]} />
      </Worker>
    </div>
  );
};

export default PdfViewer;
