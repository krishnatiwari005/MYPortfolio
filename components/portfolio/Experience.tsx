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
          className={`relative z-10 bg-white rounded-2xl shadow-2xl border border-border-subtle flex flex-col overflow-hidden transition-all duration-300 ${
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
            className="flex-1 min-h-0 overflow-y-auto bg-white"
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
      <section id="experience" className="py-12 md:py-16 relative z-10 scroll-mt-12">
        <div className="w-full max-w-[1100px] mx-auto px-6 md:px-12 space-y-8 md:space-y-12">
          {/* Section Header */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="px-3 py-1 bg-accent-light border border-accent-primary/10 text-accent-primary text-xs font-bold tracking-widest uppercase rounded-full">
              Journey
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold font-display text-text-primary tracking-tight">
              Work Experience
            </h2>
            <p className="text-sm text-text-tertiary max-w-md">
              A visual timeline of my career history, achievements, and technologies.
            </p>
          </div>

          {/* Timeline container */}
          <div className="max-w-[850px] mx-auto relative pt-8">
            {/* Vertical Center Line */}
            <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-[2px] bg-accent-primary/10 -translate-x-1/2" />

            <div className="space-y-12">
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
                    {/* Timeline Node Dot */}
                    <div className="absolute left-[20px] md:left-1/2 top-6 w-3.5 h-3.5 rounded-full bg-white border-2 border-accent-primary -translate-x-1/2 z-10 shadow-sm" />

                    {/* Desktop Layout left offset spacer */}
                    <div className={`hidden md:block w-1/2 ${isEven ? 'pr-12 text-right order-1' : 'pl-12 text-left order-2'}`}>
                      {/* Spacer remains empty, date pills are attached to the card */}
                    </div>

                    {/* Desktop Layout right offset content */}
                    <motion.div
                      initial={{ opacity: 0, x: isEven ? -32 : 32 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: '-80px' }}
                      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                      className={`w-full md:w-1/2 ${isEven ? 'pl-10 md:pl-12 order-2' : 'pr-10 md:pr-12 order-1'}`}
                    >
                      {/* Mobile Time Frame above card */}
                      <div className="md:hidden mb-3">
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-accent-light text-accent-primary text-[10px] font-bold rounded-full">
                          <Calendar className="w-3 h-3" />
                          {exp.start_month} {exp.start_year} - {exp.is_current ? 'Present' : `${exp.end_month} ${exp.end_year}`}
                        </span>
                      </div>

                      <Card glass className="p-6 rounded-2xl relative">
                        {/* Desktop Date Pills */}
                        <div className={`hidden md:block absolute top-5 whitespace-nowrap ${isEven ? 'right-full mr-12 pr-0.5' : 'left-full ml-12 pl-0.5'}`}>
                          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-accent-light border border-accent-primary/20 text-accent-primary text-xs font-bold rounded-full shadow-sm">
                            <Calendar className="w-3.5 h-3.5" />
                            {exp.start_month} {exp.start_year} - {exp.is_current ? 'Present' : `${exp.end_month} ${exp.end_year}`}
                          </span>
                        </div>

                        {/* Header block */}
                        <div className="flex items-center gap-3.5 border-b border-border-subtle pb-4 mb-4">
                          <div className="w-12 h-12 rounded-xl bg-bg-primary border border-border-subtle flex items-center justify-center p-1.5 shrink-0 overflow-hidden">
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
                              <Globe className="w-6 h-6 text-text-tertiary" />
                            )}
                          </div>
                          <div className="overflow-hidden">
                            <h3 className="text-base font-bold text-text-primary truncate font-display">{exp.role}</h3>
                            <div className="flex flex-wrap items-center gap-2 mt-0.5">
                              <span className="text-xs font-semibold text-text-secondary">{exp.company_name}</span>
                              <span className="text-[10px] text-text-tertiary font-bold tracking-wider uppercase bg-bg-primary px-2 py-0.5 rounded border border-border-subtle">
                                {exp.employment_type}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* HTML Details */}
                        {exp.description && (
                          <div
                            className="text-text-secondary text-xs md:text-sm leading-relaxed mb-4 space-y-2"
                            dangerouslySetInnerHTML={{ __html: exp.description }}
                          />
                        )}

                        {/* Achievements bullets */}
                        {exp.achievements.length > 0 && (
                          <ul className="list-disc list-inside space-y-1.5 text-xs text-text-secondary mb-4 pr-1.5">
                            {exp.achievements.map((bullet, bIdx) => (
                              <li key={bIdx} className="leading-relaxed">
                                <span className="font-medium text-text-secondary">{bullet}</span>
                              </li>
                            ))}
                          </ul>
                        )}

                        {/* Tech stack chips */}
                        {exp.tech_stack.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1.5">
                            {exp.tech_stack.map((tag, tIdx) => (
                              <span
                                key={tIdx}
                                className="text-[9px] font-bold font-mono tracking-wide uppercase px-2 py-1 bg-white border border-border-default rounded-md text-text-secondary"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Certificate / Credential Footer */}
                        {hasCert && (
                          <div className="mt-4 pt-3 border-t border-border-subtle flex flex-wrap items-center justify-between gap-2">
                            {/* Certificate of Completion direct link (certificate_url) */}
                            {exp.certificate_url && (
                              <a
                                href={exp.certificate_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] font-semibold text-green-600 hover:text-green-700 hover:underline cursor-pointer transition-colors"
                              >
                                <Award className="w-3 h-3" />
                                <span>Certificate of Completion</span>
                              </a>
                            )}

                            {/* Verify Reference Credential → opens modal with offer letter */}
                            {exp.certificate_file_url && (
                              <button
                                type="button"
                                onClick={() => setActiveCert(exp)}
                                className="inline-flex items-center gap-1 text-[11px] font-semibold text-accent-primary hover:text-accent-hover hover:underline cursor-pointer transition-colors ml-auto"
                              >
                                <ShieldCheck className="w-3 h-3" />
                                <span>Verify Reference Credential</span>
                              </button>
                            )}
                          </div>
                        )}
                      </Card>
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
