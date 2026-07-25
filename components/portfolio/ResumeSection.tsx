'use client';
// Cache-bust: cyberpunk-resume-v1

import { Resume } from '@/types';
import { FileDown, Eye, FileText, Cpu, Terminal } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { motion } from 'framer-motion';

export interface ResumeSectionProps {
  data: Resume | null;
}

export const ResumeSection = ({ data }: ResumeSectionProps) => {
  if (!data) return null;

  return (
    <section id="resume-section" className="py-12 md:py-20 relative z-10 scroll-mt-12">
      <div className="w-full max-w-[1100px] mx-auto px-6 md:px-12">

        {/* Section Header */}
        <div className="flex flex-col items-center text-center space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[rgba(0,229,255,0.05)] border border-[rgba(0,229,255,0.2)] text-[#00e5ff] text-xs font-bold tracking-widest uppercase rounded-full shadow-[0_0_15px_rgba(0,229,255,0.1)]">
            <FileText className="w-3.5 h-3.5" />
            Curriculum Vitae
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold font-display text-[#e0f7fa] tracking-tight">
            Professional <span className="text-[#00e5ff]">Resume</span>
          </h2>
          <p className="text-sm text-[#00b4d8] uppercase tracking-widest font-bold max-w-md">
            Complete career record, credentials & technical stack.
          </p>
        </div>

        {/* Main HUD Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative group"
        >
          {/* HUD Corner Accents */}
          <div className="absolute -top-1 -left-1 w-8 h-8 border-t-2 border-l-2 border-[#00e5ff]/60 group-hover:border-[#00e5ff] transition-all z-20" />
          <div className="absolute -top-1 -right-1 w-8 h-8 border-t-2 border-r-2 border-[#00e5ff]/60 group-hover:border-[#00e5ff] transition-all z-20" />
          <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-2 border-l-2 border-[#00e5ff]/60 group-hover:border-[#00e5ff] transition-all z-20" />
          <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-2 border-r-2 border-[#00e5ff]/60 group-hover:border-[#00e5ff] transition-all z-20" />

          <div className="rounded-lg border border-[#00e5ff]/20 bg-[#001a33]/80 backdrop-blur-md shadow-[0_0_40px_rgba(0,229,255,0.1)] group-hover:border-[#00e5ff]/50 group-hover:shadow-[0_0_60px_rgba(0,229,255,0.15)] transition-all duration-500 overflow-hidden flex flex-col md:flex-row">

            {/* LEFT — Animated CV Preview Panel */}
            <div className="w-full md:w-[38%] shrink-0 bg-[#000d1a] border-b md:border-b-0 md:border-r border-[#00e5ff]/15 flex items-center justify-center p-10 relative overflow-hidden">
              {/* Grid bg pattern */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.04)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

              {/* Animated document stack */}
              <div className="relative w-48 h-64 select-none">
                {/* Shadow docs behind */}
                <div className="absolute w-44 h-60 border border-[#00e5ff]/10 bg-[#001a33] rounded -rotate-6 -translate-x-8 top-2 shadow-[0_0_10px_rgba(0,229,255,0.05)]" />
                <div className="absolute w-44 h-60 border border-[#ff00ff]/10 bg-[#0d0020] rounded rotate-4 translate-x-8 top-2 shadow-[0_0_10px_rgba(255,0,255,0.05)]" />

                {/* Main doc */}
                <div className="relative w-48 h-64 bg-[#001a33] border border-[#00e5ff]/30 rounded overflow-hidden shadow-[0_0_30px_rgba(0,229,255,0.2)] group-hover:shadow-[0_0_40px_rgba(0,229,255,0.3)] transition-all duration-500 blur-[1px] group-hover:blur-0">
                  {/* Doc header bar */}
                  <div className="bg-[#00e5ff]/10 border-b border-[#00e5ff]/20 px-3 py-2 flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-[#ff003c]/60" />
                    <div className="w-2 h-2 rounded-full bg-[#ff9800]/60" />
                    <div className="w-2 h-2 rounded-full bg-[#00e5ff]/60" />
                    <div className="flex-1 h-1.5 bg-[#00e5ff]/20 rounded ml-2" />
                  </div>
                  {/* Doc content lines */}
                  <div className="p-3 space-y-2.5">
                    <div className="h-2.5 w-20 bg-[#00e5ff]/30 rounded" />
                    <div className="space-y-1.5 pt-1">
                      <div className="h-1.5 w-full bg-[#80deea]/15 rounded" />
                      <div className="h-1.5 w-4/5 bg-[#80deea]/15 rounded" />
                      <div className="h-1.5 w-3/4 bg-[#80deea]/15 rounded" />
                    </div>
                    <div className="h-px w-full bg-[#00e5ff]/10" />
                    <div className="h-2 w-16 bg-[#ff00ff]/25 rounded" />
                    <div className="space-y-1.5">
                      <div className="h-1.5 w-full bg-[#80deea]/15 rounded" />
                      <div className="h-1.5 w-2/3 bg-[#80deea]/15 rounded" />
                    </div>
                    <div className="h-px w-full bg-[#00e5ff]/10" />
                    <div className="h-2 w-14 bg-[#00ff88]/20 rounded" />
                    <div className="space-y-1.5">
                      <div className="h-1.5 w-full bg-[#80deea]/15 rounded" />
                      <div className="h-1.5 w-5/6 bg-[#80deea]/15 rounded" />
                      <div className="h-1.5 w-3/4 bg-[#80deea]/15 rounded" />
                    </div>
                  </div>
                  {/* Bottom fade gradient */}
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#001a33] to-transparent" />
                </div>
              </div>

              {/* Scan line animation */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00e5ff]/5 to-transparent animate-[scanline_4s_linear_infinite] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* RIGHT — Info + Actions */}
            <div className="flex-1 p-8 md:p-12 flex flex-col justify-center space-y-8 relative">
              {/* Header row */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#00e5ff]/10 border border-[#00e5ff]/30 shadow-[0_0_10px_rgba(0,229,255,0.2)]" style={{ clipPath: 'polygon(8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%,0 8px)' }}>
                    <Cpu className="w-5 h-5 text-[#00e5ff]" />
                  </div>
                  <span className="text-[10px] font-bold font-mono text-[#00ff88] uppercase tracking-widest border-b border-[#00ff88]/30">
                    [SYSTEM_FILE: CV.PDF]
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold font-display text-white leading-tight">
                  Professional <span className="text-[#00e5ff]">Resume</span>
                </h2>
                <div className="flex items-center gap-2 text-[11px] font-mono text-[#00b4d8] uppercase tracking-widest">
                  <Terminal className="w-3.5 h-3.5" />
                  Last updated: {formatDate(data.uploaded_at)}
                </div>
              </div>

              {/* Divider */}
              <div className="w-full h-px bg-gradient-to-r from-[#00e5ff]/40 via-[#00e5ff]/10 to-transparent" />

              {/* Description */}
              <p className="text-sm text-[#b2ebf2] leading-relaxed max-w-lg font-medium">
                Download my complete professional CV detailing full career logs, education credentials, research projects, and technical stack certifications.
              </p>

              {/* Stats row */}
              <div className="flex flex-wrap gap-6">
                {[
                  { label: 'Format', value: 'PDF' },
                  { label: 'Size', value: data.file_size ?? 'N/A' },
                  { label: 'Version', value: 'Latest' },
                ].map((stat) => (
                  <div key={stat.label} className="space-y-0.5">
                    <span className="text-[9px] font-bold font-mono uppercase tracking-widest text-[#00b4d8]">{stat.label}:</span>
                    <div className="text-sm font-bold font-mono text-white">{stat.value}</div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => window.open('/resume', '_blank')}
                  className="flex items-center gap-2 px-6 py-3 bg-[#00e5ff]/10 hover:bg-[#00e5ff]/25 border border-[#00e5ff] text-[#00e5ff] hover:text-white font-mono font-bold text-xs uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(0,229,255,0.2)] hover:shadow-[0_0_30px_rgba(0,229,255,0.5)]"
                  style={{ clipPath: 'polygon(12px 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%,0 12px)' }}
                >
                  <Eye className="w-4 h-4" /> View in Viewer
                </button>
                <button
                  onClick={() => window.open(data.file_url, '_blank')}
                  className="flex items-center gap-2 px-6 py-3 bg-[#ff00ff]/10 hover:bg-[#ff00ff]/25 border border-[#ff00ff] text-[#ff00ff] hover:text-white font-mono font-bold text-xs uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(255,0,255,0.2)] hover:shadow-[0_0_30px_rgba(255,0,255,0.5)]"
                  style={{ clipPath: 'polygon(12px 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%,0 12px)' }}
                >
                  <FileDown className="w-4 h-4" /> Download PDF
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ResumeSection;
