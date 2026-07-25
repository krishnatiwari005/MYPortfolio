'use client';
// Cache-bust comment: 2026-07-06-03

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Experience } from '@/types';
import Card from '../ui/card';
import { Globe, ExternalLink, Calendar, X, Award, Download, Maximize2, Minimize2, ShieldCheck } from 'lucide-react';

export interface ExperienceSectionProps {
  experiences: Experience[];
}

// ---------- Certificate Preview Modal ----------
interface CertModalProps {
  exp: Experience;
  onClose: () => void;
}

const CertModal = ({ exp, onClose }: CertModalProps) => {
  const [expanded, setExpanded] = useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const fileUrl = exp.certificate_file_url;  // offer letter
  const completionUrl = exp.certificate_url;  // certificate of completion
  const isPdf = fileUrl?.toLowerCase().endsWith('.pdf');

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[300] flex items-center justify-center p-3 sm:p-6">
        {/* Backdrop */}
        <motion.div
          key="cert-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal Card */}
        <motion.div
          key="cert-modal"
          initial={{ opacity: 0, y: 60, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 280, damping: 26 }}
          className={`relative z-10 bg-[rgba(0,13,26,0.9)] backdrop-blur-xl rounded-2xl shadow-[0_0_40px_rgba(0,229,255,0.15)] border border-[rgba(0,229,255,0.2)] flex flex-col overflow-hidden transition-all duration-300 ${
            expanded
              ? 'w-full max-w-5xl h-[95vh]'
              : 'w-full max-w-lg h-[85vh]'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-border-subtle bg-bg-secondary shrink-0">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="p-1.5 rounded-lg bg-accent-light">
                <ShieldCheck className="w-4 h-4 text-accent-primary" />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-text-primary truncate font-display">
                  {exp.role} — {exp.company_name}
                </p>
                <p className="text-[10px] text-text-tertiary">Offer Letter / Reference Document</p>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="p-1.5 text-text-tertiary hover:text-accent-primary hover:bg-accent-light rounded-lg cursor-pointer transition-colors"
                title={expanded ? 'Minimize' : 'Expand to full screen'}
              >
                {expanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 text-text-tertiary hover:text-text-primary hover:bg-border-subtle rounded-lg cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Content Area — scrollable by the modal, not the PDF viewer */}
          <div
            ref={scrollRef}
            className="flex-1 min-h-0 overflow-y-auto bg-[rgba(0,13,26,0.9)]"
          >
            {fileUrl ? (
              isPdf ? (
                /* Tall iframe so the full PDF renders from the top */
                <iframe
                  src={`${fileUrl}#toolbar=0&navpanes=0&zoom=page-width`}
                  className="w-full block border-0"
                  style={{ height: '900px' }}
                  title="Offer Letter Preview"
                  onLoad={() => {
                    if (scrollRef.current) scrollRef.current.scrollTop = 0;
                  }}
                />
              ) : (
                /* Image: show full with padding */
                <div className="p-4 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={fileUrl}
                    alt={`${exp.role} Offer Letter`}
                    className="max-w-full object-contain rounded-lg shadow-sm"
                  />
                </div>
              )
            ) : (
              /* No file */
              <div className="flex flex-col items-center justify-center gap-3 text-center py-16 px-4">
                <Award className="w-16 h-16 text-accent-primary/20" />
                <p className="text-sm font-semibold text-text-secondary">No offer letter uploaded</p>
                <p className="text-xs text-text-tertiary">Upload an offer letter in the admin dashboard</p>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="px-5 py-3.5 border-t border-border-subtle bg-bg-secondary flex flex-wrap gap-2 justify-end shrink-0">
            {fileUrl && (
              <a
                href={fileUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-bg-primary hover:bg-border-subtle border border-border-default rounded-lg text-text-secondary transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Download Offer Letter
              </a>
            )}
            {completionUrl && (
              <a
                href={completionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-green-50 hover:bg-green-100 border border-green-200 text-green-700 rounded-lg transition-colors cursor-pointer"
              >
                <Award className="w-3.5 h-3.5" />
                View Completion Certificate
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// ---------- Main Section ----------
export const ExperienceSection = ({ experiences }: ExperienceSectionProps) => {
  const [activeCert, setActiveCert] = useState<Experience | null>(null);

  return (
    <>
      <section id="experience" className="py-12 md:py-20 relative z-10 scroll-mt-12">
        <div className="w-full max-w-[1100px] mx-auto px-6 md:px-12 space-y-12">
          {/* Section Header */}
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[rgba(0,229,255,0.05)] border border-[rgba(0,229,255,0.2)] text-[#00e5ff] text-xs font-bold tracking-widest uppercase rounded-full shadow-[0_0_15px_rgba(0,229,255,0.1)]">
              <ShieldCheck className="w-3.5 h-3.5" />
              Career Log
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold font-display text-[#e0f7fa] tracking-tight text-glow">
              Work Experience
            </h2>
            <p className="text-sm text-[#00b4d8] uppercase tracking-widest font-bold max-w-md">
              A visual timeline of my career history and tech deployments.
            </p>
          </div>

          {/* Timeline container */}
          <div className="max-w-[900px] mx-auto relative pt-8">
            {/* Cybernetic Vertical Center Line */}
            <div className="absolute left-[24px] md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#00e5ff]/40 to-transparent -translate-x-1/2" />
            
            {/* Pulse traveling down the line */}
            <motion.div
              className="absolute left-[24px] md:left-1/2 top-0 w-[2px] h-[100px] bg-gradient-to-b from-transparent via-[#00ff88] to-transparent -translate-x-1/2 z-0"
              animate={{ top: ['0%', '100%'] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            />

            <div className="space-y-16">
              {[...experiences].sort((a, b) => {
                if (a.is_current && !b.is_current) return -1;
                if (!a.is_current && b.is_current) return 1;
                const dateA = new Date(`${a.start_month} 1, ${a.start_year}`);
                const dateB = new Date(`${b.start_month} 1, ${b.start_year}`);
                if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
                  return a.display_order - b.display_order;
                }
                return dateB.getTime() - dateA.getTime();
              }).map((exp, idx) => {
                const isEven = idx % 2 === 0;
                const hasCert = !!(exp.certificate_url || exp.certificate_file_url);

                return (
                  <div
                    key={exp.id}
                    className="relative flex flex-col md:flex-row items-stretch"
                  >
                    {/* Glowing Diamond Node */}
                    <div className="absolute left-[24px] md:left-1/2 top-8 w-4 h-4 bg-[#000d1a] border-[2px] border-[#00e5ff] rotate-45 -translate-x-1/2 z-10 shadow-[0_0_15px_rgba(0,229,255,0.8)]" />

                    {/* Desktop Layout left offset spacer (Time HUD) */}
                    <div className={`hidden md:flex w-1/2 ${isEven ? 'pr-16 justify-end order-1' : 'pl-16 justify-start order-2'}`}>
                       <div className="mt-6 flex items-center h-fit">
                         <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#000d1a] border border-[#00e5ff]/40 text-[#00e5ff] text-xs font-mono font-bold shadow-[inset_0_0_15px_rgba(0,229,255,0.2)]" style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}>
                           <Calendar className="w-3.5 h-3.5" />
                           [ {exp.start_month} {exp.start_year} - {exp.is_current ? 'Present' : `${exp.end_month} ${exp.end_year}`} ]
                         </span>
                       </div>
                    </div>

                    {/* Card Content */}
                    <motion.div
                      initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: '-80px' }}
                      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                      className={`w-full md:w-1/2 ${isEven ? 'md:pl-16 order-2' : 'md:pr-16 order-1'}`}
                    >
                      {/* Mobile Time Frame above card */}
                      <div className="md:hidden mb-4 pl-14">
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#000d1a] border border-[#00e5ff]/40 text-[#00e5ff] text-[10px] font-mono font-bold shadow-[inset_0_0_10px_rgba(0,229,255,0.2)]" style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}>
                          <Calendar className="w-3 h-3" />
                          [ {exp.start_month} {exp.start_year} - {exp.is_current ? 'Present' : `${exp.end_month} ${exp.end_year}`} ]
                        </span>
                      </div>

                      <div className="p-6 md:p-8 rounded-xl relative overflow-hidden group border-2 border-[#00e5ff]/30 bg-[#000d1a]/95 backdrop-blur-lg shadow-[0_0_25px_rgba(0,229,255,0.15)] hover:border-[#00e5ff]/60 hover:shadow-[0_0_40px_rgba(0,229,255,0.3)] transition-all ml-12 md:ml-0 z-10">
                        {/* Scanline */}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00e5ff]/10 to-transparent h-[200%] -top-[100%] group-hover:animate-[scanline_2s_linear_infinite] pointer-events-none opacity-0 group-hover:opacity-100 z-0" />
                        
                        {/* Header block */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 border-b border-[rgba(0,229,255,0.1)] pb-5 mb-5 relative z-10">
                          <div className="w-14 h-14 rounded bg-[#000d1a] border border-[rgba(0,229,255,0.3)] flex items-center justify-center p-2 shrink-0 shadow-[inset_0_0_10px_rgba(0,229,255,0.2)] overflow-hidden">
                            {exp.company_logo_url ? (
                              <img
                                src={exp.company_logo_url}
                                alt={exp.company_name}
                                width={48}
                                height={48}
                                loading="lazy"
                                className="object-contain w-full h-full"
                              />
                            ) : (
                              <Globe className="w-6 h-6 text-[#00b4d8]" />
                            )}
                          </div>
                          <div className="overflow-hidden">
                            <h3 className="text-lg md:text-xl font-bold text-[#e0f7fa] font-display">{exp.role}</h3>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                              <span className="text-sm font-semibold text-[#00b4d8]">{exp.company_name}</span>
                              <span className="text-[9px] text-[#00ff88] font-bold tracking-widest uppercase bg-[#00ff88]/10 px-2 py-0.5 rounded border border-[#00ff88]/30">
                                {exp.employment_type}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* HTML Details */}
                        {exp.description && (
                          <div
                            className="text-[#80deea] text-xs md:text-sm leading-relaxed mb-5 relative z-10"
                            dangerouslySetInnerHTML={{ __html: exp.description }}
                          />
                        )}

                        {/* Achievements bullets */}
                        {exp.achievements.length > 0 && (
                          <ul className="space-y-2 text-xs md:text-sm text-[#80deea] mb-5 relative z-10 font-mono">
                            {exp.achievements.map((bullet, bIdx) => (
                              <li key={bIdx} className="leading-relaxed flex items-start gap-2">
                                <span className="text-[#00e5ff] font-bold shrink-0 mt-0.5">{`>`}</span>
                                <span>{bullet}</span>
                              </li>
                            ))}
                          </ul>
                        )}

                        {/* Tech stack chips */}
                        {exp.tech_stack.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-2 relative z-10">
                            {exp.tech_stack.map((tag, tIdx) => (
                              <span
                                key={tIdx}
                                className="text-[10px] font-bold font-mono tracking-wider uppercase px-2.5 py-1 bg-[rgba(0,229,255,0.05)] border border-[rgba(0,229,255,0.2)] text-[#00e5ff]"
                                style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Certificate / Credential Footer */}
                        {hasCert && (
                          <div className="mt-6 pt-4 border-t border-[rgba(0,229,255,0.1)] flex flex-wrap items-center justify-between gap-3 relative z-10">
                            {/* Certificate of Completion direct link */}
                            {exp.certificate_url && (
                              <a
                                href={exp.certificate_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[#00ff88] hover:text-white hover:bg-[#00ff88]/20 px-3 py-1.5 rounded border border-[#00ff88]/30 transition-colors"
                              >
                                <Award className="w-3.5 h-3.5" />
                                <span>Verify Certificate</span>
                              </a>
                            )}

                            {/* Verify Reference Credential → opens modal with offer letter */}
                            {exp.certificate_file_url && (
                              <button
                                type="button"
                                onClick={() => setActiveCert(exp)}
                                className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[#00e5ff] hover:text-white hover:bg-[#00e5ff]/20 px-3 py-1.5 rounded border border-[#00e5ff]/30 transition-colors ml-auto"
                              >
                                <ShieldCheck className="w-3.5 h-3.5" />
                                <span>View Document</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Certificate Preview Modal */}
      {activeCert && (
        <CertModal exp={activeCert} onClose={() => setActiveCert(null)} />
      )}
    </>
  );
};

export default ExperienceSection;
