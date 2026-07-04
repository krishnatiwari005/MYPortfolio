'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

const ResumeViewer = dynamic(() => import('@/components/portfolio/ResumeViewer'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-accent-primary animate-spin" />
    </div>
  ),
});

export default function ResumePage() {
  return <ResumeViewer />;
}
