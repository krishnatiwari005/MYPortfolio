'use client';
// Cache-bust comment: cyberpunk-certs-hackathons-v1

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Certificate, Hackathon } from '@/types';
import { ExternalLink, X, Download, Award, Trophy, GitBranch, Globe, ChevronRight, Image as ImageIcon } from 'lucide-react';

export interface CertificatesSectionProps {
  certificates: Certificate[];
  hackathons: Hackathon[];
}

export const CertificatesSection = ({ certificates, hackathons }: CertificatesSectionProps) => {
  const [activeLightbox, setActiveLightbox] = useState<Certificate | null>(null);
  const [activeHackathonLightbox, setActiveHackathonLightbox] = useState<Hackathon | null>(null);
  const [activeTab, setActiveTab] = useState<'certificates' | 'hackathons'>('certificates');

  return (
    <section id="certificates" className={`py-12 md:py-20 relative scroll-mt-12 ${(activeLightbox || activeHackathonLightbox) ? 'z-[999]' : 'z-10'}`}>
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
                            <span className="text-[10px] font-bold font-mono text-[#00b4d8] uppercase tracking-widest">{cert.issuer}</span>
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
                <div className="text-center py-16 border border-dashed border-[#00b4d8]/20 text-[#00b4d8] text-xs font-mono uppercase tracking-widest">
                  No hackathon achievements uploaded yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {hackathons.map((hack, idx) => (
                    <motion.div
                      key={hack.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="group relative"
                    >
                      {/* HUD Corner Accents — magenta for hackathons */}
                      <div className="absolute -top-1 -left-1 w-5 h-5 border-t-2 border-l-2 border-[#00b4d8]/40 group-hover:border-[#00b4d8] transition-all z-20" />
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-2 border-r-2 border-[#00b4d8]/40 group-hover:border-[#00b4d8] transition-all z-20" />

                      <div 
                        className="h-full rounded-lg overflow-hidden border border-[#00b4d8]/20 bg-[#001a33]/80 shadow-[0_0_15px_rgba(0,180,216,0.08)] group-hover:border-[#00b4d8]/60 group-hover:shadow-[0_0_25px_rgba(0,180,216,0.2)] transition-all duration-300 backdrop-blur-sm cursor-pointer"
                        onClick={() => setActiveHackathonLightbox(hack)}
                      >
                        {/* Thumbnail / Certificate Front */}
                        <div className="relative w-full bg-[#000d1a] border-b border-[#00b4d8]/10 min-h-[150px] flex items-center justify-center p-3 overflow-hidden">
                          {hack.certificate_url ? (
                            <>
                              <img
                                src={hack.certificate_url}
                                alt={hack.title}
                                className="w-full h-auto max-h-[160px] object-contain transition-transform duration-500 group-hover:scale-105"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                  const sibling = (e.target as HTMLImageElement).nextElementSibling;
                                  if (sibling) sibling.classList.remove('hidden');
                                }}
                              />
                              <div className="hidden flex items-center justify-center w-full h-full">
                                <Trophy className="w-14 h-14 text-[#00b4d8]/20" />
                              </div>
                            </>
                          ) : (
                            <Trophy className="w-14 h-14 text-[#00b4d8]/20" />
                          )}
                          {/* Scanline overlay on hover */}
                          <div className="absolute inset-0 bg-[#00b4d8]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                          {/* View overlay */}
                          <div className="absolute inset-0 bg-[#001a33]/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <span className="text-[9px] font-bold font-mono uppercase tracking-widest px-3 py-1.5 border border-[#00b4d8] bg-[#00b4d8]/10 text-[#e0f7fa]" style={{ clipPath: 'polygon(6px 0,100% 0,100% calc(100% - 6px),calc(100% - 6px) 100%,0 100%,0 6px)' }}>
                              Open Details_
                            </span>
                          </div>
                        </div>

                        {/* Details */}
                        <div className="p-4 space-y-2">
                          <h3 className="text-sm font-bold text-white leading-tight font-display group-hover:text-[#00b4d8] transition-colors">{hack.title}</h3>
                          {hack.project_name && (
                            <p className="text-[10px] font-mono text-[#00e5ff]/70 truncate">{hack.project_name}</p>
                          )}
                          <div className="flex flex-wrap items-center justify-between gap-1">
                            <span className="text-[10px] font-bold font-mono text-[#00e5ff] uppercase tracking-widest">{hack.organization}</span>
                            <span className="text-[9px] font-mono text-[#00ff88] border-b border-[#00ff88]/30">{hack.date}</span>
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
                  <p className="text-[10px] font-mono text-[#00b4d8] mt-0.5 uppercase tracking-widest">{activeLightbox.issuer} • {activeLightbox.issue_date}</p>
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
              <div className="p-4 border-t border-[#00e5ff]/20 flex flex-wrap items-center justify-between gap-4 bg-[#001a33]/80">
                <div className="flex flex-wrap gap-2">
                  {activeLightbox.github_url && activeLightbox.github_url.split(',').map((url, idx) => {
                    const cleanUrl = url.trim();
                    if (!cleanUrl) return null;
                    const isMulti = activeLightbox.github_url!.split(',').filter(u => u.trim()).length > 1;
                    return (
                      <button
                        key={idx}
                        onClick={() => window.open(cleanUrl, '_blank')}
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/40 text-white/70 hover:text-white font-mono font-bold text-xs uppercase tracking-widest transition-all"
                        style={{ clipPath: 'polygon(8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%,0 8px)' }}
                      >
                        <Globe className="w-3.5 h-3.5" /> Project {isMulti ? idx + 1 : ''}
                      </button>
                    );
                  })}
                </div>
                
                <div className="flex flex-wrap gap-3">
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
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Lightbox Modal for Hackathons */}
      <AnimatePresence>
        {activeHackathonLightbox && (
          <div className="fixed inset-0 z-[201] flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={() => setActiveHackathonLightbox(null)} />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-3xl w-full bg-[#001a33]/95 backdrop-blur-xl border-2 border-[#00b4d8]/40 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,180,216,0.2)] z-10 flex flex-col max-h-[90vh]"
            >
              {/* HUD Corner Accents */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-[#00b4d8] z-20 pointer-events-none" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-[#00b4d8] z-20 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-[#00b4d8] z-20 pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-[#00b4d8] z-20 pointer-events-none" />

              {/* Header */}
              <div className="p-4 border-b border-[#00b4d8]/20 flex items-center justify-between bg-[#000d1a]/80">
                <div className="overflow-hidden pr-8 flex items-center gap-3">
                  <div className="p-2 bg-[#00b4d8]/10 border border-[#00b4d8]/30 shadow-[0_0_10px_rgba(0,180,216,0.2)]">
                    <Trophy className="w-4 h-4 text-[#00b4d8]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white truncate font-display">{activeHackathonLightbox.title}</h3>
                    <p className="text-[10px] font-mono text-[#00e5ff] mt-0.5 uppercase tracking-widest">{activeHackathonLightbox.organization} • {activeHackathonLightbox.date}</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveHackathonLightbox(null)}
                  className="p-2 bg-[#000d1a] hover:bg-[#ff003c]/20 text-[#00b4d8] hover:text-[#ff003c] border border-[#00b4d8]/40 hover:border-[#ff003c] transition-all cursor-pointer z-30"
                  style={{ clipPath: 'polygon(20% 0,100% 0,100% 80%,80% 100%,0 100%,0 20%)' }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Hackathon details body */}
              <div className="flex-1 min-h-0 overflow-y-auto bg-[#000d1a]/50 p-6 space-y-6">

                {/* ── 1. CERTIFICATE ── */}
                {activeHackathonLightbox.certificate_url && (
                  <div>
                    <p className="text-[10px] font-bold font-mono text-[#00b4d8] uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Award className="w-3.5 h-3.5" /> Certificate
                    </p>
                    <div className="w-full bg-[#000d1a] border border-[#00b4d8]/20 rounded-lg overflow-hidden flex items-center justify-center">
                      <img
                        src={activeHackathonLightbox.certificate_url}
                        alt="Certificate"
                        className="w-full h-auto max-h-[40vh] object-contain opacity-90 hover:opacity-100 transition-opacity"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    </div>
                  </div>
                )}

                {/* ── 2. PROJECT SECTION ── */}
                {(activeHackathonLightbox.project_name || activeHackathonLightbox.description || activeHackathonLightbox.thumbnail_url) && (
                  <div className="space-y-4">
                    <div className="w-full h-px bg-gradient-to-r from-[#00b4d8]/30 via-[#00b4d8]/10 to-transparent" />
                    <p className="text-[10px] font-bold font-mono text-[#00b4d8] uppercase tracking-widest flex items-center gap-2">
                      <Globe className="w-3.5 h-3.5" /> Project
                    </p>

                    {activeHackathonLightbox.thumbnail_url && (
                      <div className="w-full bg-[#000d1a] border border-[#00e5ff]/15 rounded-lg overflow-hidden">
                        <img
                          src={activeHackathonLightbox.thumbnail_url}
                          alt="Project Thumbnail"
                          className="w-full h-auto max-h-[35vh] object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      </div>
                    )}

                    {activeHackathonLightbox.project_name && (
                      <h4 className="text-lg font-bold text-white font-display">{activeHackathonLightbox.project_name}</h4>
                    )}

                    {activeHackathonLightbox.description && (
                      <p className="text-sm text-[#80deea] leading-relaxed">{activeHackathonLightbox.description}</p>
                    )}
                  </div>
                )}

                {/* ── 3. LINKS ── */}
                {(activeHackathonLightbox.project_url || activeHackathonLightbox.github_url) && (
                  <div className="space-y-3">
                    <div className="w-full h-px bg-gradient-to-r from-[#00b4d8]/30 via-[#00b4d8]/10 to-transparent" />
                    <p className="text-[10px] font-bold font-mono text-[#00b4d8] uppercase tracking-widest">Links</p>
                    <div className="flex flex-wrap gap-3">
                      {activeHackathonLightbox.project_url && (
                        <a
                          href={activeHackathonLightbox.project_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-6 py-2.5 bg-[#00e5ff]/10 border border-[#00e5ff]/50 text-[#00e5ff] hover:bg-[#00e5ff]/20 hover:text-white transition-all text-xs font-bold font-mono uppercase tracking-widest shadow-[0_0_15px_rgba(0,229,255,0.15)] hover:shadow-[0_0_25px_rgba(0,229,255,0.3)]"
                          style={{ clipPath: 'polygon(10px 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%,0 10px)' }}
                        >
                          <Globe className="w-4 h-4" /> Live Project
                        </a>
                      )}
                      {activeHackathonLightbox.github_url && (
                        <a
                          href={activeHackathonLightbox.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-6 py-2.5 bg-white/5 border border-white/30 text-white/80 hover:bg-white/10 hover:border-white/50 hover:text-white transition-all text-xs font-bold font-mono uppercase tracking-widest"
                          style={{ clipPath: 'polygon(10px 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%,0 10px)' }}
                        >
                          <GitBranch className="w-4 h-4" /> GitHub Repo
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* ── 4. GALLERY ── */}
                {activeHackathonLightbox.gallery_urls && activeHackathonLightbox.gallery_urls.length > 0 && (
                  <div className="space-y-3">
                    <div className="w-full h-px bg-gradient-to-r from-[#00b4d8]/30 via-[#00b4d8]/10 to-transparent" />
                    <p className="text-[10px] font-bold font-mono text-[#00b4d8] uppercase tracking-widest flex items-center gap-2">
                      <ImageIcon className="w-3.5 h-3.5" /> Project Gallery
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {activeHackathonLightbox.gallery_urls.map((url, idx) => (
                        <div key={idx} className="aspect-video bg-[#000d1a] border border-[#00b4d8]/10 rounded-lg overflow-hidden cursor-pointer group">
                          <img
                            src={url}
                            alt={`Gallery ${idx + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
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
