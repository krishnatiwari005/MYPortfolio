'use client';
// Cache-bust comment: cyberpunk-certs-hackathons-v2-mobile-2col

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Certificate, Hackathon } from '@/types';
import { ExternalLink, X, Download, Award, Trophy, GitBranch, Globe, Image as ImageIcon, Star, Eye } from 'lucide-react';

export interface CertificatesSectionProps {
  certificates: Certificate[];
  hackathons: Hackathon[];
}

export const CertificatesSection = ({ certificates, hackathons }: CertificatesSectionProps) => {
  const [activeLightbox, setActiveLightbox] = useState<Certificate | null>(null);
  const [activeHackathonLightbox, setActiveHackathonLightbox] = useState<Hackathon | null>(null);
  const [activeTab, setActiveTab] = useState<'certificates' | 'hackathons'>('certificates');

  const featuredHackathons = hackathons.filter((h) => Boolean(h.is_featured));
  const standardHackathons = hackathons.filter((h) => !h.is_featured);

  return (
    <section id="certificates" className={`py-10 md:py-20 relative scroll-mt-12 ${(activeLightbox || activeHackathonLightbox) ? 'z-[999]' : 'z-10'}`}>
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-12 space-y-10 md:space-y-12">

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
        <div className="flex justify-center gap-3 sm:gap-4">
          {(['certificates', 'hackathons'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-5 sm:px-8 py-2 sm:py-2.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest transition-all duration-300 ${
                activeTab === tab
                  ? 'text-[#000d1a] bg-[#00e5ff] shadow-[0_0_20px_rgba(0,229,255,0.5)] scale-105'
                  : 'text-[#80deea] bg-[#000d1a]/80 border border-[rgba(0,229,255,0.3)] hover:text-[#00e5ff] hover:border-[#00e5ff]'
              }`}
              style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
            >
              {tab === 'certificates' ? (
                <span className="flex items-center gap-1.5 sm:gap-2"><Award className="w-3.5 h-3.5" /> Certificates</span>
              ) : (
                <span className="flex items-center gap-1.5 sm:gap-2"><Trophy className="w-3.5 h-3.5" /> Hackathons</span>
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
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
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
                      <div className="absolute -top-1 -left-1 w-3 sm:w-4 h-3 sm:h-4 border-t-2 border-l-2 border-[#00e5ff]/40 group-hover:border-[#00e5ff] transition-all z-20" />
                      <div className="absolute -bottom-1 -right-1 w-3 sm:w-4 h-3 sm:h-4 border-b-2 border-r-2 border-[#00e5ff]/40 group-hover:border-[#00e5ff] transition-all z-20" />

                      <div className="h-full rounded-lg overflow-hidden border border-[#00e5ff]/20 bg-[#001a33]/80 shadow-[0_0_15px_rgba(0,229,255,0.08)] group-hover:border-[#00e5ff]/60 group-hover:shadow-[0_0_25px_rgba(0,229,255,0.2)] transition-all duration-300 backdrop-blur-sm flex flex-col justify-between">
                        {/* Thumbnail */}
                        <div className="relative w-full bg-[#000d1a] border-b border-[#00e5ff]/10 min-h-[100px] sm:min-h-[150px] flex items-center justify-center p-2 sm:p-3 overflow-hidden">
                          {cert.preview_image_url ? (
                            <img
                              src={cert.preview_image_url}
                              alt={cert.title}
                              className="w-full h-auto max-h-[110px] sm:max-h-[160px] object-contain transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <Award className="w-10 sm:w-14 h-10 sm:h-14 text-[#00e5ff]/20" />
                          )}
                          {/* Scanline overlay on hover */}
                          <div className="absolute inset-0 bg-[#00e5ff]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                          {/* View overlay */}
                          <div className="hidden sm:flex absolute inset-0 bg-[#000d1a]/70 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <span className="text-[9px] font-bold font-mono uppercase tracking-widest px-3 py-1.5 border border-[#00e5ff] bg-[#00e5ff]/10 text-[#00e5ff]" style={{ clipPath: 'polygon(6px 0,100% 0,100% calc(100% - 6px),calc(100% - 6px) 100%,0 100%,0 6px)' }}>
                              View Credential_
                            </span>
                          </div>
                        </div>

                        {/* Details */}
                        <div className="p-2.5 sm:p-4 space-y-1.5 sm:space-y-2 flex-1 flex flex-col justify-between">
                          <h3 className="text-xs sm:text-sm font-bold text-white leading-tight font-display group-hover:text-[#00e5ff] transition-colors line-clamp-2">{cert.title}</h3>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-0.5 sm:gap-1 pt-1 border-t border-[rgba(0,229,255,0.08)]">
                            <span className="text-[8px] sm:text-[10px] font-bold font-mono text-[#00b4d8] uppercase tracking-wider truncate">{cert.issuer}</span>
                            <span className="text-[8px] sm:text-[9px] font-mono text-[#00ff88]">{cert.issue_date}</span>
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
              className="space-y-8 sm:space-y-12"
            >
              {hackathons.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-[#00b4d8]/20 text-[#00b4d8] text-xs font-mono uppercase tracking-widest">
                  No hackathon achievements uploaded yet.
                </div>
              ) : (
                <>
                  {/* ── FEATURED HACKATHONS SPOTLIGHT ── */}
                  {featuredHackathons.length > 0 && (
                    <div className="w-full max-w-[960px] mx-auto space-y-4">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1.5 px-3 py-1 bg-[rgba(0,229,255,0.06)] border border-[#00e5ff]/30 text-[#00e5ff] text-[10px] font-mono font-bold uppercase tracking-widest rounded-full shadow-[0_0_12px_rgba(0,229,255,0.12)]">
                          <Trophy className="w-3.5 h-3.5 text-[#00e5ff]" />
                          Featured Achievement
                        </span>
                        <div className="h-px flex-1 bg-gradient-to-r from-[#00e5ff]/25 via-[#00b4d8]/10 to-transparent" />
                      </div>

                      <div className="grid grid-cols-1 gap-6">
                        {featuredHackathons.map((hack, idx) => (
                          <motion.div
                            key={hack.id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35, delay: idx * 0.1 }}
                            className="relative"
                          >
                            <div className="relative rounded-xl overflow-hidden border border-[#00e5ff]/35 bg-[#001a33]/85 backdrop-blur-xl shadow-[0_0_25px_rgba(0,229,255,0.12)] hover:border-[#00e5ff]/70 hover:shadow-[0_0_35px_rgba(0,229,255,0.2)] transition-all duration-300">
                              {/* Top Cyan Accent Line */}
                              <div className="h-0.5 w-full bg-gradient-to-r from-[#00b4d8] via-[#00e5ff] to-[#00ff88]" />

                              <div className="p-3.5 sm:p-5 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 items-center">
                                
                                {/* ── CERTIFICATE SHOWCASE (Compact & Crisp) ── */}
                                <div
                                  className="md:col-span-5 cursor-pointer group/cert"
                                  onClick={() => setActiveHackathonLightbox(hack)}
                                >
                                  <div className="relative rounded-lg overflow-hidden border border-[#00e5ff]/25 bg-[#000d1a] shadow-[0_0_15px_rgba(0,229,255,0.1)] group-hover/cert:border-[#00e5ff]/60 group-hover/cert:shadow-[0_0_25px_rgba(0,229,255,0.25)] transition-all duration-300 min-h-[160px] sm:min-h-[190px] md:min-h-[220px] flex items-center justify-center p-2.5 sm:p-3">
                                    {/* Ambient Glow */}
                                    <div className="absolute inset-0 bg-radial from-[#00e5ff]/10 via-transparent to-transparent opacity-50 group-hover/cert:opacity-100 transition-opacity" />

                                    {/* Certificate Image */}
                                    {hack.certificate_url ? (
                                      <img
                                        src={hack.certificate_url}
                                        alt={hack.title}
                                        className="w-full h-auto max-h-[150px] sm:max-h-[180px] md:max-h-[200px] object-contain rounded transition-transform duration-300 group-hover/cert:scale-[1.02]"
                                        onError={(e) => {
                                          (e.target as HTMLImageElement).style.display = 'none';
                                        }}
                                      />
                                    ) : (
                                      <div className="flex flex-col items-center justify-center py-8 text-[#00b4d8]">
                                        <Trophy className="w-12 h-12 text-[#00e5ff]/40 mb-2" />
                                        <span className="text-[10px] font-mono tracking-widest uppercase">Verified Certificate</span>
                                      </div>
                                    )}

                                    {/* Badges on Certificate */}
                                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 bg-[#000d1a]/85 backdrop-blur-md border border-[#00e5ff]/35 rounded text-[8px] sm:text-[9px] font-mono font-bold text-[#00e5ff]">
                                      <Award className="w-3 h-3 text-[#00e5ff]" />
                                      Official Credential
                                    </div>

                                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 bg-[#00e5ff]/15 backdrop-blur-md border border-[#00e5ff]/50 rounded text-[8px] sm:text-[9px] font-mono font-bold text-[#00e5ff] shadow-[0_0_10px_rgba(0,229,255,0.2)]">
                                      <Star className="w-2.5 h-2.5 fill-[#00e5ff] text-[#00e5ff]" />
                                      Featured
                                    </div>

                                    {/* Hover prompt */}
                                    <div className="absolute inset-0 bg-[#000d1a]/70 opacity-0 group-hover/cert:opacity-100 transition-opacity duration-300 flex items-center justify-center p-2">
                                      <span
                                        className="text-[9px] sm:text-[10px] font-bold font-mono uppercase tracking-widest px-3 py-1.5 bg-[#00e5ff] text-[#000d1a] shadow-[0_0_15px_rgba(0,229,255,0.6)] flex items-center gap-1.5"
                                        style={{ clipPath: 'polygon(6px 0,100% 0,100% calc(100% - 6px),calc(100% - 6px) 100%,0 100%,0 6px)' }}
                                      >
                                        <Eye className="w-3 h-3" /> View Credential_
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* ── INTEL & PROJECT DETAILS ── */}
                                <div className="md:col-span-7 space-y-3 flex flex-col justify-between">
                                  <div className="space-y-2">
                                    {/* Badges row */}
                                    <div className="flex flex-wrap items-center gap-2">
                                      <span className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider bg-[#00e5ff]/10 border border-[#00e5ff]/30 text-[#00e5ff] rounded flex items-center gap-1">
                                        <Trophy className="w-2.5 h-2.5 text-[#00e5ff]" /> Spotlight
                                      </span>
                                      <span className="px-2 py-0.5 text-[9px] font-mono text-[#00ff88] bg-[#00ff88]/10 border border-[#00ff88]/30 rounded">
                                        {hack.date}
                                      </span>
                                    </div>

                                    {/* Title */}
                                    <h3
                                      onClick={() => setActiveHackathonLightbox(hack)}
                                      className="text-base sm:text-lg md:text-xl font-bold text-white font-display leading-snug cursor-pointer hover:text-[#00e5ff] transition-colors line-clamp-2"
                                    >
                                      {hack.title}
                                    </h3>

                                    {/* Host */}
                                    <p className="text-[11px] sm:text-xs font-mono text-[#00b4d8] flex items-center gap-1.5">
                                      <span className="text-[#80deea]/60">Host:</span>
                                      <span className="text-[#00e5ff] font-semibold uppercase tracking-wider">{hack.organization}</span>
                                    </p>

                                    {/* Project Box */}
                                    {(hack.project_name || hack.description) && (
                                      <div className="p-2.5 sm:p-3 rounded-lg bg-[#000d1a]/80 border border-[#00e5ff]/15 space-y-1">
                                        {hack.project_name && (
                                          <div className="flex items-center gap-1.5">
                                            <Globe className="w-3 h-3 text-[#00e5ff]" />
                                            <h4 className="text-xs sm:text-sm font-semibold text-white font-display truncate">
                                              {hack.project_name}
                                            </h4>
                                          </div>
                                        )}
                                        {hack.description && (
                                          <p className="text-[11px] sm:text-xs text-[#80deea]/80 leading-relaxed line-clamp-2 sm:line-clamp-3">
                                            {hack.description}
                                          </p>
                                        )}
                                      </div>
                                    )}

                                    {/* Gallery Strip */}
                                    {hack.gallery_urls && hack.gallery_urls.length > 0 && (
                                      <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none pt-0.5">
                                        {hack.gallery_urls.slice(0, 4).map((url, gIdx) => (
                                          <div
                                            key={gIdx}
                                            onClick={() => setActiveHackathonLightbox(hack)}
                                            className="w-14 h-9 shrink-0 rounded overflow-hidden border border-[#00e5ff]/20 hover:border-[#00e5ff] cursor-pointer transition-colors bg-[#000d1a]"
                                          >
                                            <img src={url} alt="Gallery" className="w-full h-full object-cover" />
                                          </div>
                                        ))}
                                        {hack.gallery_urls.length > 4 && (
                                          <div
                                            onClick={() => setActiveHackathonLightbox(hack)}
                                            className="w-14 h-9 shrink-0 rounded border border-[#00e5ff]/20 bg-[#000d1a] flex items-center justify-center text-[9px] font-mono text-[#00e5ff] cursor-pointer hover:border-[#00e5ff]"
                                          >
                                            +{hack.gallery_urls.length - 4}
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>

                                  {/* Action Buttons */}
                                  <div className="pt-1 flex flex-wrap items-center gap-2">
                                    <button
                                      onClick={() => setActiveHackathonLightbox(hack)}
                                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00e5ff] hover:bg-[#80deea] text-[#000d1a] font-mono font-bold text-[10px] sm:text-xs uppercase tracking-wider transition-all shadow-[0_0_12px_rgba(0,229,255,0.35)] cursor-pointer"
                                      style={{ clipPath: 'polygon(5px 0,100% 0,100% calc(100% - 5px),calc(100% - 5px) 100%,0 100%,0 5px)' }}
                                    >
                                      <Trophy className="w-3 h-3" /> Details
                                    </button>

                                    {hack.project_url && (
                                      <a
                                        href={hack.project_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00e5ff]/10 hover:bg-[#00e5ff]/20 border border-[#00e5ff]/40 text-[#00e5ff] font-mono font-bold text-[10px] sm:text-xs uppercase tracking-wider transition-all"
                                        style={{ clipPath: 'polygon(5px 0,100% 0,100% calc(100% - 5px),calc(100% - 5px) 100%,0 100%,0 5px)' }}
                                      >
                                        <Globe className="w-3 h-3" /> Live Demo
                                      </a>
                                    )}

                                    {hack.github_url && (
                                      <a
                                        href={hack.github_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/20 text-white/80 hover:text-white font-mono font-bold text-[10px] sm:text-xs uppercase tracking-wider transition-all"
                                        style={{ clipPath: 'polygon(5px 0,100% 0,100% calc(100% - 5px),calc(100% - 5px) 100%,0 100%,0 5px)' }}
                                      >
                                        <GitBranch className="w-3 h-3" /> Source
                                      </a>
                                    )}
                                  </div>
                                </div>

                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ── SECTION DIVIDER (if both featured and standard exist) ── */}
                  {featuredHackathons.length > 0 && standardHackathons.length > 0 && (
                    <div className="pt-4 pb-2 flex items-center gap-4">
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#00b4d8]/40 to-transparent" />
                      <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-[#80deea] px-3.5 py-1 bg-[#001a33]/90 border border-[#00b4d8]/30 rounded-full flex items-center gap-2 shadow-sm">
                        <Award className="w-3.5 h-3.5 text-[#00b4d8]" />
                        All Hackathons & Participations ({standardHackathons.length})
                      </span>
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#00b4d8]/40 to-transparent" />
                    </div>
                  )}

                  {/* ── STANDARD HACKATHONS GRID ── */}
                  {standardHackathons.length > 0 && (
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
                      {standardHackathons.map((hack, idx) => (
                        <motion.div
                          key={hack.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="group relative"
                        >
                          {/* HUD Corner Accents */}
                          <div className="absolute -top-1 -left-1 w-3 sm:w-5 h-3 sm:h-5 border-t-2 border-l-2 border-[#00b4d8]/40 group-hover:border-[#00b4d8] transition-all z-20" />
                          <div className="absolute -bottom-1 -right-1 w-3 sm:w-5 h-3 sm:h-5 border-b-2 border-r-2 border-[#00b4d8]/40 group-hover:border-[#00b4d8] transition-all z-20" />

                          <div 
                            className="h-full rounded-lg overflow-hidden border border-[#00b4d8]/20 bg-[#001a33]/80 shadow-[0_0_15px_rgba(0,180,216,0.08)] group-hover:border-[#00b4d8]/60 group-hover:shadow-[0_0_25px_rgba(0,180,216,0.2)] transition-all duration-300 backdrop-blur-sm cursor-pointer flex flex-col justify-between"
                            onClick={() => setActiveHackathonLightbox(hack)}
                          >
                            {/* Thumbnail / Certificate Front */}
                            <div className="relative w-full bg-[#000d1a] border-b border-[#00b4d8]/10 min-h-[100px] sm:min-h-[150px] flex items-center justify-center p-2 sm:p-3 overflow-hidden">
                              {hack.certificate_url ? (
                                <>
                                  <img
                                    src={hack.certificate_url}
                                    alt={hack.title}
                                    className="w-full h-auto max-h-[110px] sm:max-h-[160px] object-contain transition-transform duration-500 group-hover:scale-105"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).style.display = 'none';
                                      const sibling = (e.target as HTMLImageElement).nextElementSibling;
                                      if (sibling) sibling.classList.remove('hidden');
                                    }}
                                  />
                                  <div className="hidden flex items-center justify-center w-full h-full">
                                    <Trophy className="w-10 sm:w-14 h-10 sm:h-14 text-[#00b4d8]/20" />
                                  </div>
                                </>
                              ) : (
                                <Trophy className="w-10 sm:w-14 h-10 sm:h-14 text-[#00b4d8]/20" />
                              )}
                              {/* Scanline overlay on hover */}
                              <div className="absolute inset-0 bg-[#00b4d8]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                              {/* View overlay */}
                              <div className="hidden sm:flex absolute inset-0 bg-[#001a33]/70 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <span className="text-[9px] font-bold font-mono uppercase tracking-widest px-3 py-1.5 border border-[#00b4d8] bg-[#00b4d8]/10 text-[#e0f7fa]" style={{ clipPath: 'polygon(6px 0,100% 0,100% calc(100% - 6px),calc(100% - 6px) 100%,0 100%,0 6px)' }}>
                                  Open Details_
                                </span>
                              </div>
                            </div>

                            {/* Details */}
                            <div className="p-2.5 sm:p-4 space-y-1 sm:space-y-2 flex-1 flex flex-col justify-between">
                              <div>
                                <h3 className="text-xs sm:text-sm font-bold text-white leading-tight font-display group-hover:text-[#00b4d8] transition-colors line-clamp-2">{hack.title}</h3>
                                {hack.project_name && (
                                  <p className="text-[9px] sm:text-[10px] font-mono text-[#00e5ff]/70 truncate mt-0.5">{hack.project_name}</p>
                                )}
                              </div>
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-0.5 sm:gap-1 pt-1 border-t border-[rgba(0,180,216,0.08)]">
                                <span className="text-[8px] sm:text-[10px] font-bold font-mono text-[#00e5ff] uppercase tracking-wider truncate">{hack.organization}</span>
                                <span className="text-[8px] sm:text-[9px] font-mono text-[#00ff88]">{hack.date}</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Lightbox Modal for Certificates */}
      <AnimatePresence>
        {activeLightbox && (
          <div className="fixed inset-0 z-[201] flex items-center justify-center p-3 sm:p-4">
            <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={() => setActiveLightbox(null)} />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-2xl w-full bg-[#000d1a]/95 backdrop-blur-xl border-2 border-[#00e5ff]/40 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,229,255,0.2)] z-10 flex flex-col max-h-[92vh]"
            >
              {/* HUD Corner Accents */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-[#00e5ff] z-20 pointer-events-none" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-[#00e5ff] z-20 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-[#00e5ff] z-20 pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-[#00e5ff] z-20 pointer-events-none" />

              {/* Header */}
              <div className="p-3.5 sm:p-4 border-b border-[#00e5ff]/20 flex items-center justify-between bg-[#001a33]/80">
                <div className="overflow-hidden pr-6">
                  <h3 className="text-xs sm:text-sm font-bold text-white truncate font-display">{activeLightbox.title}</h3>
                  <p className="text-[9px] sm:text-[10px] font-mono text-[#00b4d8] mt-0.5 uppercase tracking-widest">{activeLightbox.issuer} • {activeLightbox.issue_date}</p>
                </div>
                <button
                  onClick={() => setActiveLightbox(null)}
                  className="p-1.5 sm:p-2 bg-[#000d1a] hover:bg-[#ff003c]/20 text-[#00e5ff] hover:text-[#ff003c] border border-[#00e5ff]/40 hover:border-[#ff003c] transition-all cursor-pointer z-30"
                  style={{ clipPath: 'polygon(20% 0,100% 0,100% 80%,80% 100%,0 100%,0 20%)' }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Certificate image */}
              <div className="flex-1 bg-[#000d1a] p-4 sm:p-6 flex items-center justify-center min-h-[220px] max-h-[60vh] overflow-y-auto">
                {activeLightbox.preview_image_url ? (
                  <img
                    src={activeLightbox.preview_image_url}
                    alt={activeLightbox.title}
                    className="max-w-full max-h-[50vh] object-contain rounded shadow-[0_0_30px_rgba(0,229,255,0.1)]"
                  />
                ) : (
                  <Award className="w-20 sm:w-24 h-20 sm:h-24 text-[#00e5ff]/20" />
                )}
              </div>

              {/* Footer actions */}
              <div className="p-3.5 sm:p-4 border-t border-[#00e5ff]/20 flex flex-wrap items-center justify-between gap-3 bg-[#001a33]/80">
                <div className="flex flex-wrap gap-2">
                  {activeLightbox.github_url && activeLightbox.github_url.split(',').map((url, idx) => {
                    const cleanUrl = url.trim();
                    if (!cleanUrl) return null;
                    const isMulti = activeLightbox.github_url!.split(',').filter(u => u.trim()).length > 1;
                    return (
                      <button
                        key={idx}
                        onClick={() => window.open(cleanUrl, '_blank')}
                        className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/40 text-white/70 hover:text-white font-mono font-bold text-[10px] sm:text-xs uppercase tracking-widest transition-all"
                        style={{ clipPath: 'polygon(6px 0,100% 0,100% calc(100% - 6px),calc(100% - 6px) 100%,0 100%,0 6px)' }}
                      >
                        <Globe className="w-3 h-3" /> Project {isMulti ? idx + 1 : ''}
                      </button>
                    );
                  })}
                </div>
                
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {activeLightbox.pdf_url && (
                    <button
                      onClick={() => window.open(activeLightbox.pdf_url!, '_blank')}
                      className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/40 text-white/70 hover:text-white font-mono font-bold text-[10px] sm:text-xs uppercase tracking-widest transition-all"
                      style={{ clipPath: 'polygon(6px 0,100% 0,100% calc(100% - 6px),calc(100% - 6px) 100%,0 100%,0 6px)' }}
                    >
                      <Download className="w-3 h-3" /> Download PDF
                    </button>
                  )}
                  {activeLightbox.credential_url && (
                    <button
                      onClick={() => window.open(activeLightbox.credential_url!, '_blank')}
                      className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-[#00e5ff]/10 hover:bg-[#00e5ff]/30 border border-[#00e5ff] text-[#00e5ff] hover:text-white font-mono font-bold text-[10px] sm:text-xs uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(0,229,255,0.2)]"
                      style={{ clipPath: 'polygon(6px 0,100% 0,100% calc(100% - 6px),calc(100% - 6px) 100%,0 100%,0 6px)' }}
                    >
                      <ExternalLink className="w-3 h-3" /> Verify Credential
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
          <div className="fixed inset-0 z-[201] flex items-center justify-center p-3 sm:p-4">
            <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={() => setActiveHackathonLightbox(null)} />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-3xl w-full bg-[#001a33]/95 backdrop-blur-xl border-2 border-[#00b4d8]/40 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,180,216,0.2)] z-10 flex flex-col max-h-[92vh]"
            >
              {/* HUD Corner Accents */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-[#00b4d8] z-20 pointer-events-none" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-[#00b4d8] z-20 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-[#00b4d8] z-20 pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-[#00b4d8] z-20 pointer-events-none" />

              {/* Header */}
              <div className="p-3.5 sm:p-4 border-b border-[#00b4d8]/20 flex items-center justify-between bg-[#000d1a]/80">
                <div className="overflow-hidden pr-6 flex items-center gap-2.5">
                  <div className="p-1.5 bg-[#00b4d8]/10 border border-[#00b4d8]/30 shadow-[0_0_10px_rgba(0,180,216,0.2)]">
                    <Trophy className="w-3.5 h-3.5 text-[#00b4d8]" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-white truncate font-display">{activeHackathonLightbox.title}</h3>
                    <p className="text-[9px] sm:text-[10px] font-mono text-[#00e5ff] mt-0.5 uppercase tracking-widest">{activeHackathonLightbox.organization} • {activeHackathonLightbox.date}</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveHackathonLightbox(null)}
                  className="p-1.5 sm:p-2 bg-[#000d1a] hover:bg-[#ff003c]/20 text-[#00b4d8] hover:text-[#ff003c] border border-[#00b4d8]/40 hover:border-[#ff003c] transition-all cursor-pointer z-30"
                  style={{ clipPath: 'polygon(20% 0,100% 0,100% 80%,80% 100%,0 100%,0 20%)' }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Hackathon details body */}
              <div className="flex-1 min-h-0 overflow-y-auto bg-[#000d1a]/50 p-4 sm:p-6 space-y-5">

                {/* ── 1. CERTIFICATE ── */}
                {activeHackathonLightbox.certificate_url && (
                  <div>
                    <p className="text-[9px] sm:text-[10px] font-bold font-mono text-[#00b4d8] uppercase tracking-widest mb-2 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5" /> Certificate
                    </p>
                    <div className="w-full bg-[#000d1a] border border-[#00b4d8]/20 rounded-lg overflow-hidden flex items-center justify-center">
                      <img
                        src={activeHackathonLightbox.certificate_url}
                        alt="Certificate"
                        className="w-full h-auto max-h-[35vh] object-contain opacity-90 hover:opacity-100 transition-opacity"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    </div>
                  </div>
                )}

                {/* ── 2. PROJECT SECTION ── */}
                {(activeHackathonLightbox.project_name || activeHackathonLightbox.description || activeHackathonLightbox.thumbnail_url) && (
                  <div className="space-y-3">
                    <div className="w-full h-px bg-gradient-to-r from-[#00b4d8]/30 via-[#00b4d8]/10 to-transparent" />
                    <p className="text-[9px] sm:text-[10px] font-bold font-mono text-[#00b4d8] uppercase tracking-widest flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5" /> Project
                    </p>

                    {activeHackathonLightbox.thumbnail_url && (
                      <div className="w-full bg-[#000d1a] border border-[#00e5ff]/15 rounded-lg overflow-hidden">
                        <img
                          src={activeHackathonLightbox.thumbnail_url}
                          alt="Project Thumbnail"
                          className="w-full h-auto max-h-[30vh] object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      </div>
                    )}

                    {activeHackathonLightbox.project_name && (
                      <h4 className="text-sm sm:text-base font-bold text-white font-display">{activeHackathonLightbox.project_name}</h4>
                    )}

                    {activeHackathonLightbox.description && (
                      <p className="text-xs sm:text-sm text-[#80deea] leading-relaxed">{activeHackathonLightbox.description}</p>
                    )}
                  </div>
                )}

                {/* ── 3. LINKS ── */}
                {(activeHackathonLightbox.project_url || activeHackathonLightbox.github_url) && (
                  <div className="space-y-2.5">
                    <div className="w-full h-px bg-gradient-to-r from-[#00b4d8]/30 via-[#00b4d8]/10 to-transparent" />
                    <p className="text-[9px] sm:text-[10px] font-bold font-mono text-[#00b4d8] uppercase tracking-widest">Links</p>
                    <div className="flex flex-wrap gap-2.5">
                      {activeHackathonLightbox.project_url && (
                        <a
                          href={activeHackathonLightbox.project_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-4 py-2 bg-[#00e5ff]/10 border border-[#00e5ff]/50 text-[#00e5ff] hover:bg-[#00e5ff]/20 hover:text-white transition-all text-[10px] sm:text-xs font-bold font-mono uppercase tracking-widest shadow-[0_0_15px_rgba(0,229,255,0.15)]"
                          style={{ clipPath: 'polygon(8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%,0 8px)' }}
                        >
                          <Globe className="w-3.5 h-3.5" /> Live Project
                        </a>
                      )}
                      {activeHackathonLightbox.github_url && (
                        <a
                          href={activeHackathonLightbox.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-4 py-2 bg-white/5 border border-white/30 text-white/80 hover:bg-white/10 hover:border-white/50 hover:text-white transition-all text-[10px] sm:text-xs font-bold font-mono uppercase tracking-widest"
                          style={{ clipPath: 'polygon(8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%,0 8px)' }}
                        >
                          <GitBranch className="w-3.5 h-3.5" /> GitHub Repo
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* ── 4. GALLERY ── */}
                {activeHackathonLightbox.gallery_urls && activeHackathonLightbox.gallery_urls.length > 0 && (
                  <div className="space-y-2.5">
                    <div className="w-full h-px bg-gradient-to-r from-[#00b4d8]/30 via-[#00b4d8]/10 to-transparent" />
                    <p className="text-[9px] sm:text-[10px] font-bold font-mono text-[#00b4d8] uppercase tracking-widest flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5" /> Project Gallery
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
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
