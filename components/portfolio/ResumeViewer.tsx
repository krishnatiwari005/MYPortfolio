'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { Resume } from '@/types';
import { ArrowLeft, ZoomIn, ZoomOut, Download, Printer, Maximize2, Loader2, FileX } from 'lucide-react';
import Button from '@/components/ui/button';

// React PDF Configs
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set up CDN Worker for pdfjs fallback
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function ResumeViewer() {
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1.0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const { data } = await supabase.from('resume').select('*').eq('id', true).maybeSingle();
        if (data) setResume(data as Resume);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchResume();
  }, []);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const handlePrint = () => {
    if (!resume?.file_url) return;
    const printWindow = window.open(resume.file_url, '_blank');
    printWindow?.focus();
    printWindow?.print();
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-accent-primary animate-spin" />
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="p-4 bg-accent-light text-accent-primary rounded-2xl">
          <FileX className="w-12 h-12" />
        </div>
        <h1 className="text-xl font-bold font-display text-text-primary">No resume uploaded yet</h1>
        <p className="text-xs text-text-tertiary max-w-xs leading-relaxed">
          Please access the CMS dashboard on the main page to upload your professional CV.
        </p>
        <Link href="/" className="inline-flex items-center gap-1 text-xs font-semibold text-accent-primary hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Portfolio
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-text-tertiary/10">
      {/* Sticky Toolbar */}
      <header className="sticky top-0 z-50 h-14 bg-white border-b border-border-default/50 flex items-center justify-between px-4 md:px-8 shadow-sm">
        <div className="flex items-center gap-4 min-w-0">
          <Link
            href="/"
            className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-primary rounded-full transition-colors cursor-pointer shrink-0"
            title="Back to portfolio"
          >
            <ArrowLeft className="w-4.5 h-4.5" />
          </Link>
          <span className="text-xs font-bold text-text-primary truncate" title={resume.original_filename}>
            {resume.original_filename}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <div className="hidden sm:flex items-center gap-1 border-r border-border-subtle pr-2">
            <button
              onClick={() => setZoom((prev) => Math.max(prev - 0.1, 0.5))}
              className="p-1.5 text-text-secondary hover:bg-bg-primary rounded cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-[10px] font-bold text-text-secondary min-w-[36px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom((prev) => Math.min(prev + 0.1, 2.0))}
              className="p-1.5 text-text-secondary hover:bg-bg-primary rounded cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          {/* Action links */}
          <button
            onClick={toggleFullscreen}
            className="p-2 text-text-secondary hover:bg-bg-primary rounded-full cursor-pointer"
            title="Fullscreen toggle"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          <button
            onClick={handlePrint}
            className="p-2 text-text-secondary hover:bg-bg-primary rounded-full cursor-pointer"
            title="Print Document"
          >
            <Printer className="w-4 h-4" />
          </button>

          <button
            onClick={() => window.open(resume.file_url, '_blank')}
            className="p-2 text-white bg-accent-primary hover:bg-accent-hover rounded-full shadow-sm cursor-pointer"
            title="Download PDF"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Sequential page scroll container */}
      <main className="flex-1 overflow-y-auto py-8 flex justify-center bg-zinc-100">
        <div className="flex flex-col gap-6 max-w-full">
          <Document
            file={resume.file_url}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={
              <div className="flex flex-col items-center py-16 gap-2">
                <Loader2 className="w-6 h-6 text-accent-primary animate-spin" />
                <span className="text-[10px] font-bold text-text-tertiary">Rendering PDF document pages...</span>
              </div>
            }
          >
            {Array.from(new Array(numPages), (el, index) => (
              <div
                key={`page_${index + 1}`}
                className="bg-white p-2 rounded-xl shadow-md border border-border-subtle"
                style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
              >
                <Page
                  pageNumber={index + 1}
                  renderAnnotationLayer={false}
                  renderTextLayer={true}
                  className="max-w-[95vw]"
                  width={680}
                />
              </div>
            ))}
          </Document>
        </div>
      </main>
    </div>
  );
}
