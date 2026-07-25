'use client';
// Cache-bust comment: cyberpunk-certs-hackathons-v1

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Certificate, Hackathon } from '@/types';
import { ExternalLink, X, Download, Award, Trophy, GitBranch, Globe, ChevronRight } from 'lucide-react';

export interface CertificatesSectionProps {
  certificates: Certificate[];
  hackathons: Hackathon[];
}

export const CertificatesSection = ({ certificates, hackathons }: CertificatesSectionProps) => {
  const [activeLightbox, setActiveLightbox] = useState<Certificate | null>(null);
  const [activeTab, setActiveTab] = useState<'certificates' | 'hackathons'>('certificates');

  return (
    <section id="certificates" className={`py-12 md:py-20 relative scroll-mt-12 ${activeLightbox ? 'z-[999]' : 'z-10'}`}>
      <div className="w-full max-w-[1200px] mx-auto px-6 md:px-12 space-y-12">

        {/* Section Header */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[rgba(0,229,255,0.05)] border border-[rgba(0,229,255,0.2)] text-[#00e5ff] text-xs font-bold tracking-widest uppercase rounded-full shadow-[0_0_15px_rgba(0,229,255,0.1)]">
            <Award className="w-3.5 h-3.5" />
            Credentials
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold font-display text-[#e0f7fa] tracking-tight">
            Certifications <span className="text-[#00e5ff]">&</span> Hackathons
          </h2>
          <p className="text-sm text-[#00b4d8] uppercase tracking-widest font-bold max-w-md">
            Verified credentials and competitive achievements.
          </p>
        </div>

        {/* HUD Tab Switcher */}
        <div className="flex justify-center gap-4">
          {(['certificates', 'hackathons'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-8 py-2.5 text-[11px] font-bold uppercase tracking-widest transition-all duration-300 ${
                activeTab === tab
                  ? 'text-[#000d1a] bg-[#00e5ff] shadow-[0_0_20px_rgba(0,229,255,0.5)] scale-105'
                  : 'text-[#80deea] bg-[#000d1a]/80 border border-[rgba(0,229,255,0.3)] hover:text-[#00e5ff] hover:border-[#00e5ff]'
              }`}
              style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
            >
              {tab === 'certificates' ? (
                <span className="flex items-center gap-2"><Award className="w-3.5 h-3.5" /> Certificates</span>
              ) : (
                <span className="flex items-center gap-2"><Trophy className="w-3.5 h-3.5" /> Hackathons</span>
              )}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'certificates' ? (
            <motion.div
              key="certificates"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {certificates.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-[#00e5ff]/20 text-[#00b4d8] text-xs font-mono uppercase tracking-widest">
                  No certificates uploaded yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {certificates.map((cert, idx) => (
                    <motion.div
                      key={cert.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => setActiveLightbox(cert)}
                      className="group relative cursor-pointer"
                    >
                      {/* HUD Corner Accents */}
                      <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-[#00e5ff]/40 group-hover:border-[#00e5ff] transition-all z-20" />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-[#00e5ff]/40 group-hover:border-[#00e5ff] transition-all z-20" />

                      <div className="h-full rounded-lg overflow-hidden border border-[#00e5ff]/20 bg-[#001a33]/80 shadow-[0_0_15px_rgba(0,229,255,0.08)] group-hover:border-[#00e5ff]/60 group-hover:shadow-[0_0_25px_rgba(0,229,255,0.2)] transition-all duration-300 backdrop-blur-sm">
                        {/* Thumbnail */}
                        <div className="relative w-full bg-[#000d1a] border-b border-[#00e5ff]/10 min-h-[150px] flex items-center justify-center p-3 overflow-hidden">
                          {cert.preview_image_url ? (
                            <img
                              src={cert.preview_image_url}
                              alt={cert.title}
                              className="w-full h-auto max-h-[160px] object-contain transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <Award className="w-14 h-14 text-[#00e5ff]/20" />
                          )}
                          {/* Scanline overlay on hover */}
                          <div className="absolute inset-0 bg-[#00e5ff]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                          {/* View overlay */}
                          <div className="absolute inset-0 bg-[#000d1a]/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <span className="text-[9px] font-bold font-mono uppercase tracking-widest px-3 py-1.5 border border-[#00e5ff] bg-[#00e5ff]/10 text-[#00e5ff]" style={{ clipPath: 'polygon(6px 0,100% 0,100% calc(100% - 6px),calc(100% - 6px) 100%,0 100%,0 6px)' }}>
                              View Credential_
                            </span>
                          </div>
                        </div>

                        {/* Details */}
                        <div className="p-4 space-y-2">
                          <h3 className="text-sm font-bold text-white leading-tight font-display group-hover:text-[#00e5ff] transition-colors">{cert.title}</h3>
                          <div className="flex flex-wrap items-center justify-between gap-1">
                            <span className="text-[10px] font-bold font-mono text-[#ff00ff] uppercase tracking-widest">{cert.issuer}</span>
                            <span className="text-[9px] font-mono text-[#00ff88] border-b border-[#00ff88]/30">{cert.issue_date}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            /* HACKATHONS TAB */
            <motion.div
              key="hackathons"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {hackathons.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-[#ff00ff]/20 text-[#ff00ff] text-xs font-mono uppercase tracking-widest">
                  No hackathon achievements uploaded yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {hackathons.map((hack, idx) => (
                    <motion.div
                      key={hack.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="group relative"
                    >
                      {/* HUD Corner Accents — magenta for hackathons */}
                      <div className="absolute -top-1 -left-1 w-5 h-5 border-t-2 border-l-2 border-[#ff00ff]/40 group-hover:border-[#ff00ff] transition-all z-20" />
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-2 border-r-2 border-[#ff00ff]/40 group-hover:border-[#ff00ff] transition-all z-20" />

                      <div className="relative rounded-lg border border-[#ff00ff]/20 bg-[#1a0033]/60 backdrop-blur-md shadow-[0_0_20px_rgba(255,0,255,0.08)] group-hover:border-[#ff00ff]/50 group-hover:shadow-[0_0_30px_rgba(255,0,255,0.2)] transition-all duration-300 overflow-hidden p-6">
                        {/* Background glow */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#ff00ff]/5 via-transparent to-transparent pointer-events-none" />

                        <div className="relative z-10 space-y-4">
                          {/* Header */}
                          <div className="flex items-start gap-3">
                            <div className="p-2.5 bg-[#ff00ff]/10 border border-[#ff00ff]/30 shadow-[0_0_10px_rgba(255,0,255,0.2)] shrink-0" style={{ clipPath: 'polygon(8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%,0 8px)' }}>
                              <Trophy className="w-5 h-5 text-[#ff00ff]" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-base font-bold text-white font-display leading-tight group-hover:text-[#ffb3ff] transition-colors">{hack.title}</h3>
                              <p className="text-[11px] font-bold font-mono text-[#ff00ff] uppercase tracking-widest mt-0.5">{hack.organization}</p>
                            </div>
                            <span className="text-[9px] font-bold font-mono text-[#00ff88] border-b border-[#00ff88]/30 shrink-0">{hack.date}</span>
                          </div>

                          {/* Separator */}
                          <div className="w-full h-px bg-gradient-to-r from-[#ff00ff]/30 via-[#ff00ff]/10 to-transparent" />

                          {/* Links row */}
                          <div className="flex flex-wrap gap-3">
                            {hack.certificate_url && (
                              <a
                                href={hack.certificate_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#ff00ff]/10 border border-[#ff00ff]/40 text-[#ffb3ff] hover:bg-[#ff00ff]/20 hover:border-[#ff00ff] hover:text-white transition-all text-[10px] font-bold font-mono uppercase tracking-widest shadow-[0_0_8px_rgba(255,0,255,0.1)] hover:shadow-[0_0_15px_rgba(255,0,255,0.3)]"
                                style={{ clipPath: 'polygon(6px 0,100% 0,100% calc(100% - 6px),calc(100% - 6px) 100%,0 100%,0 6px)' }}
                              >
                                <Award className="w-3 h-3" /> Certificate
                              </a>
                            )}
                            {hack.project_url && (
                              <a
                                href={hack.project_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00e5ff]/10 border border-[#00e5ff]/40 text-[#80deea] hover:bg-[#00e5ff]/20 hover:border-[#00e5ff] hover:text-white transition-all text-[10px] font-bold font-mono uppercase tracking-widest shadow-[0_0_8px_rgba(0,229,255,0.1)] hover:shadow-[0_0_15px_rgba(0,229,255,0.3)]"
                                style={{ clipPath: 'polygon(6px 0,100% 0,100% calc(100% - 6px),calc(100% - 6px) 100%,0 100%,0 6px)' }}
                              >
                                <Globe className="w-3 h-3" /> Live Project
                              </a>
                            )}
                            {hack.github_url && (
                              <a
                                href={hack.github_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/20 text-white/70 hover:bg-white/10 hover:border-white/40 hover:text-white transition-all text-[10px] font-bold font-mono uppercase tracking-widest"
                                style={{ clipPath: 'polygon(6px 0,100% 0,100% calc(100% - 6px),calc(100% - 6px) 100%,0 100%,0 6px)' }}
                              >
                                <GitBranch className="w-3 h-3" /> GitHub
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Lightbox Modal for Certificates */}
      <AnimatePresence>
        {activeLightbox && (
          <div className="fixed inset-0 z-[201] flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={() => setActiveLightbox(null)} />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-2xl w-full bg-[#000d1a]/95 backdrop-blur-xl border-2 border-[#00e5ff]/40 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,229,255,0.2)] z-10 flex flex-col"
            >
              {/* HUD Corner Accents */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-[#00e5ff] z-20 pointer-events-none" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-[#00e5ff] z-20 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-[#00e5ff] z-20 pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-[#00e5ff] z-20 pointer-events-none" />

              {/* Header */}
              <div className="p-4 border-b border-[#00e5ff]/20 flex items-center justify-between bg-[#001a33]/80">
                <div className="overflow-hidden pr-8">
                  <h3 className="text-sm font-bold text-white truncate font-display">{activeLightbox.title}</h3>
                  <p className="text-[10px] font-mono text-[#ff00ff] mt-0.5 uppercase tracking-widest">{activeLightbox.issuer} • {activeLightbox.issue_date}</p>
                </div>
                <button
                  onClick={() => setActiveLightbox(null)}
                  className="p-2 bg-[#000d1a] hover:bg-[#ff003c]/20 text-[#00e5ff] hover:text-[#ff003c] border border-[#00e5ff]/40 hover:border-[#ff003c] transition-all cursor-pointer z-30"
                  style={{ clipPath: 'polygon(20% 0,100% 0,100% 80%,80% 100%,0 100%,0 20%)' }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Certificate image */}
              <div className="flex-1 bg-[#000d1a] p-6 flex items-center justify-center min-h-[250px] max-h-[65vh] overflow-y-auto">
                {activeLightbox.preview_image_url ? (
                  <img
                    src={activeLightbox.preview_image_url}
                    alt={activeLightbox.title}
                    className="max-w-full max-h-[55vh] object-contain rounded shadow-[0_0_30px_rgba(0,229,255,0.1)]"
                  />
                ) : (
                  <Award className="w-24 h-24 text-[#00e5ff]/20" />
                )}
              </div>

              {/* Footer actions */}
              <div className="p-4 border-t border-[#00e5ff]/20 flex flex-wrap gap-3 justify-end bg-[#001a33]/80">
                {activeLightbox.pdf_url && (
                  <button
                    onClick={() => window.open(activeLightbox.pdf_url!, '_blank')}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/40 text-white/70 hover:text-white font-mono font-bold text-xs uppercase tracking-widest transition-all"
                    style={{ clipPath: 'polygon(8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%,0 8px)' }}
                  >
                    <Download className="w-3.5 h-3.5" /> Download PDF
                  </button>
                )}
                {activeLightbox.credential_url && (
                  <button
                    onClick={() => window.open(activeLightbox.credential_url!, '_blank')}
                    className="flex items-center gap-2 px-4 py-2 bg-[#00e5ff]/10 hover:bg-[#00e5ff]/30 border border-[#00e5ff] text-[#00e5ff] hover:text-white font-mono font-bold text-xs uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(0,229,255,0.2)] hover:shadow-[0_0_25px_rgba(0,229,255,0.5)]"
                    style={{ clipPath: 'polygon(8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%,0 8px)' }}
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Verify Credential
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default CertificatesSection;
