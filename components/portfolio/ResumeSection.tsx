'use client';

import { Resume } from '@/types';
import Card from '../ui/card';
import Button from '../ui/button';
import { FileDown, Eye, FileText } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export interface ResumeSectionProps {
  data: Resume | null;
}

export const ResumeSection = ({ data }: ResumeSectionProps) => {
  const router = useRouter();

  if (!data) return null;

  return (
    <section id="resume-section" className="py-12 md:py-16 relative z-10 scroll-mt-12">
      <div className="w-full max-w-[900px] mx-auto px-6 md:px-12 space-y-8 md:space-y-12">
        <Card
          glass
          className="p-8 md:p-12 rounded-[28px] overflow-hidden flex flex-col md:flex-row items-center gap-10 md:gap-16 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 border-accent-primary/10 relative"
        >
          {/* Left: Blurred PDF Preview Simulation */}
          <div className="w-full md:w-[35%] shrink-0 flex items-center justify-center relative select-none">
            {/* Main Mock Card */}
            <div className="relative w-48 h-64 bg-white border border-border-default rounded-lg shadow-lg overflow-hidden flex flex-col p-4 space-y-3 blur-[1.5px] scale-102">
              <div className="h-4 w-12 bg-accent-primary/20 rounded" />
              <div className="space-y-1.5 pt-2">
                <div className="h-2 w-full bg-text-tertiary/20 rounded" />
                <div className="h-2 w-3/4 bg-text-tertiary/20 rounded" />
                <div className="h-2 w-5/6 bg-text-tertiary/20 rounded" />
              </div>
              <div className="h-px w-full bg-border-subtle" />
              <div className="space-y-1.5">
                <div className="h-2 w-2/3 bg-text-tertiary/20 rounded" />
                <div className="h-2 w-full bg-text-tertiary/20 rounded" />
              </div>
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
            </div>

            {/* Behind Mock Card */}
            <div className="absolute w-44 h-56 bg-white/70 border border-border-subtle rounded-lg shadow-sm -rotate-6 -translate-x-12 -z-10 blur-[2px]" />
            <div className="absolute w-44 h-56 bg-white/70 border border-border-subtle rounded-lg shadow-sm rotate-6 translate-x-12 -z-10 blur-[2px]" />
          </div>

          {/* Right: Actions */}
          <div className="flex-1 space-y-6 text-center md:text-left">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent-light text-accent-primary text-xs font-bold rounded-full">
                <FileText className="w-3.5 h-3.5" />
                Curriculum Vitae
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold font-display tracking-tight text-text-primary">
                Professional Resume
              </h2>
              <p className="text-sm text-text-tertiary font-medium">
                Last updated: {formatDate(data.uploaded_at)}
              </p>
            </div>

            <p className="text-sm text-text-secondary leading-relaxed max-w-lg">
              Download my complete professional CV detailing full career logs, education credentials, research projects, and stack certifications.
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <Button
                variant="primary"
                onClick={() => window.open('/resume', '_blank')}
                className="flex items-center gap-1.5 text-xs"
              >
                <Eye className="w-4 h-4" /> View in Viewer
              </Button>
              <Button
                variant="secondary"
                onClick={() => window.open(data.file_url, '_blank')}
                className="flex items-center gap-1.5 text-xs"
              >
                <FileDown className="w-4 h-4" /> Download PDF
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default ResumeSection;
