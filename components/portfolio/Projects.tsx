'use client';
// Cache-bust comment: cyberpunk-projects-v1

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '@/types';
import { GitBranch, ExternalLink, X, Info, HelpCircle, ShieldAlert, Cpu, Award } from 'lucide-react';

export interface ProjectsSectionProps {
  projects: Project[];
}

export const ProjectsSection = ({ projects }: ProjectsSectionProps) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Extract unique categories from DB
  const categories = ['All', ...Array.from(new Set(projects.map((p) => p.category)))];

  // Filters projects
  const sortedProjects = [...projects].sort((a, b) => {
    if (a.is_featured && !b.is_featured) return -1;
    if (!a.is_featured && b.is_featured) return 1;
    return a.display_order - b.display_order;
  });

  const filteredProjects = activeFilter === 'All'
    ? sortedProjects
    : sortedProjects.filter((p) => p.category.toLowerCase() === activeFilter.toLowerCase());

  // Focus trap / scroll lock for modal
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedProject]);

  return (
    <section id="projects" className={`py-12 md:py-20 relative scroll-mt-12 ${selectedProject ? 'z-[999]' : 'z-10'}`}>
      <div className="w-full max-w-[1200px] mx-auto px-6 md:px-12 space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[rgba(0,229,255,0.05)] border border-[rgba(0,229,255,0.2)] text-[#00e5ff] text-xs font-bold tracking-widest uppercase rounded-full shadow-[0_0_15px_rgba(0,229,255,0.1)]">
            <Cpu className="w-3.5 h-3.5" />
            Project Archive
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold font-display text-[#e0f7fa] tracking-tight text-glow">
            System Deployments
          </h2>
          <p className="text-sm text-[#00b4d8] uppercase tracking-widest font-bold max-w-md">
            Inspect data nodes to view architectures and case studies.
          </p>
        </div>

        {/* HUD Filter Tabs */}
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-none justify-start md:justify-center max-w-full no-scrollbar relative">
          <div className="absolute bottom-4 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00e5ff]/30 to-transparent" />
          
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`relative px-6 py-2 text-[11px] font-bold uppercase tracking-widest whitespace-nowrap transition-all duration-300 transform ${
                activeFilter === cat
                  ? 'text-[#000d1a] bg-[#00e5ff] shadow-[0_0_20px_rgba(0,229,255,0.5)] scale-105'
                  : 'text-[#80deea] bg-[#000d1a]/80 border border-[rgba(0,229,255,0.3)] hover:text-[#00e5ff] hover:border-[#00e5ff] hover:shadow-[0_0_15px_rgba(0,229,255,0.3)]'
              }`}
              style={{
                clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, idx) => {
              const isFirstFeatured = project.is_featured && idx === 0;

              return (
                <motion.div
                  layout
                  key={project.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ y: -4 }}
                  className={`group relative ${isFirstFeatured ? 'md:col-span-2 lg:col-span-3' : ''}`}
                >
                  {/* HUD Corner Accents */}
                  <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-[#00e5ff]/50 group-hover:border-[#00e5ff] transition-all z-20" />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-[#00e5ff]/50 group-hover:border-[#00e5ff] transition-all z-20" />
                  
                  <div
                    onClick={() => setSelectedProject(project)}
                    className="h-full rounded-lg overflow-hidden cursor-pointer flex flex-col items-stretch p-0 border border-[#00e5ff]/30 bg-[#001a33]/90 shadow-[0_0_20px_rgba(0,229,255,0.15)] group-hover:border-[#00e5ff] group-hover:shadow-[0_0_30px_rgba(0,229,255,0.4)] transition-all duration-500 relative backdrop-blur-md"
                  >
                    {/* Scanline hover effect */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00e5ff]/20 to-transparent h-[200%] -top-[100%] group-hover:animate-[scanline_2s_linear_infinite] pointer-events-none opacity-0 group-hover:opacity-100 z-0" />

                    {/* Thumbnail banner */}
                    <div className={`relative overflow-hidden shrink-0 border-b border-[#00e5ff]/20 ${isFirstFeatured ? 'aspect-[21/9]' : 'aspect-video'}`}>
                      {project.thumbnail_url ? (
                        <img
                          src={project.thumbnail_url}
                          alt={project.title}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#000d1a] flex items-center justify-center">
                          <ImageIcon className="w-12 h-12 text-[#00b4d8]" />
                        </div>
                      )}
                      
                      {/* Cyan Overlay Glitch on Hover */}
                      <div className="absolute inset-0 bg-[#00e5ff] mix-blend-overlay opacity-0 group-hover:opacity-30 transition-opacity duration-300" />

                      {/* Featured Star Badge */}
                      {project.is_featured && (
                        <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-[#ff00ff] to-[#bd00ff] text-white text-[9px] font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(255,0,255,0.5)] flex items-center gap-1 z-10" style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}>
                          <span>★</span> Featured
                        </div>
                      )}

                      {/* Hover Data Overlay */}
                      <div className="absolute inset-0 bg-[#000d1a]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10 backdrop-blur-[2px]">
                        <span className="text-[10px] font-bold font-mono uppercase tracking-widest px-4 py-2 border border-[#00e5ff] bg-[#00e5ff]/20 text-[#00e5ff] shadow-[0_0_20px_rgba(0,229,255,0.6)]" style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}>
                          Initialize Data Sequence_
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6 flex-1 flex flex-col justify-between relative z-10 bg-gradient-to-b from-[#001a33]/50 to-[#000d1a]/80">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          {/* Category Neon Tag */}
                          <div className="text-[9px] font-bold font-mono tracking-widest uppercase px-2.5 py-1 bg-[#ff00ff]/20 border border-[#ff00ff]/50 text-[#ffb3ff] shadow-[0_0_10px_rgba(255,0,255,0.2)]" style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}>
                            {project.category}
                          </div>
                          <span className="text-[9px] font-bold font-mono text-[#00ff88] px-2 py-0.5 uppercase tracking-widest border-b border-[#00ff88]/50 shadow-[0_2px_4px_rgba(0,255,136,0.1)]">
                            [{project.status}]
                          </span>
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold font-display text-white group-hover:text-[#00e5ff] transition-colors leading-tight drop-shadow-md">{project.title}</h3>
                        <p className="text-sm text-[#b2ebf2] leading-relaxed line-clamp-3 font-medium">
                          {project.short_description}
                        </p>
                      </div>

                      {/* Tech stack chips */}
                      <div className="mt-6 space-y-4">
                        {project.tech_stack.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {project.tech_stack.slice(0, 4).map((tech, tIdx) => (
                              <span key={tIdx} className="text-[9px] font-bold font-mono tracking-wide uppercase px-2.5 py-1 bg-[#00e5ff]/10 border border-[#00e5ff]/40 text-[#80deea] shadow-[0_0_8px_rgba(0,229,255,0.1)]" style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}>
                                {tech}
                              </span>
                            ))}
                            {project.tech_stack.length > 4 && (
                              <span className="text-[9px] font-bold font-mono px-2 py-1 bg-[#00e5ff]/20 text-[#00e5ff]" style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}>
                                +{project.tech_stack.length - 4}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* HUD Data Readout Lightbox Popup Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[201] flex items-center justify-center p-4 overflow-y-auto">
            {/* Backdrop close wrapper */}
            <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={() => setSelectedProject(null)} />

            {/* Modal Card content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="relative w-full max-w-5xl bg-[#000d1a]/95 backdrop-blur-xl border-2 border-[#00e5ff]/40 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,229,255,0.2)] z-10 flex flex-col max-h-[95vh] my-4"
            >
              {/* HUD Modal Border Accents */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#00e5ff] z-20 pointer-events-none" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#00e5ff] z-20 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#00e5ff] z-20 pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#00e5ff] z-20 pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 bg-[#000d1a] hover:bg-[#ff003c]/20 text-[#00e5ff] hover:text-[#ff003c] p-2 border border-[#00e5ff]/40 hover:border-[#ff003c] shadow-[0_0_10px_rgba(0,229,255,0.2)] z-30 cursor-pointer transition-all"
                style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 80%, 80% 100%, 0 100%, 0 20%)' }}
              >
                <X className="w-5 h-5" />
              </button>

              {/* Scrollable container */}
              <div className="flex-1 overflow-y-auto pb-8 cyber-scrollbar">
                {/* Visual Banner */}
                <div className="relative aspect-video md:aspect-[21/9] w-full bg-[#000d1a] overflow-hidden border-b border-[#00e5ff]/20">
                  {selectedProject.thumbnail_url ? (
                    <img
                      src={selectedProject.thumbnail_url}
                      alt={selectedProject.title}
                      className="w-full h-full object-cover opacity-100"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[linear-gradient(rgba(0,229,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]" />
                  )}
                  {/* Digital overlay - subtle so image remains visible */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#000d1a]/90 via-[#000d1a]/30 to-transparent flex items-end p-6 md:p-10 z-10 pointer-events-none">
                    <div className="space-y-3 w-full">
                      <div className="text-[10px] font-bold font-mono tracking-widest uppercase px-3 py-1 bg-[#ff00ff]/20 border border-[#ff00ff]/50 text-[#ff00ff] inline-block shadow-[0_0_15px_rgba(255,0,255,0.3)]" style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}>
                        SYSTEM_CATEGORY: {selectedProject.category}
                      </div>
                      <h2 className="text-3xl md:text-5xl font-extrabold font-display tracking-tight text-[#e0f7fa] leading-tight text-glow">
                        <span className="text-[#00e5ff] mr-2 opacity-50">&gt;</span>
                        {selectedProject.title}
                      </h2>
                    </div>
                  </div>
                </div>

                {/* Body details */}
                <div className="p-6 md:p-10 flex flex-col lg:flex-row gap-10">
                  {/* Left Column Description */}
                  <div className="flex-1 space-y-8">
                    {/* Bio */}
                    {selectedProject.description && (
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold font-mono text-[#00e5ff] uppercase tracking-widest flex items-center gap-2 border-b border-[#00e5ff]/20 pb-2">
                          <Info className="w-4 h-4" /> [ OVERVIEW ]
                        </h4>
                        <div className="text-[#80deea] text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: selectedProject.description }} />
                      </div>
                    )}

                    {/* Problem */}
                    {selectedProject.problem_statement && (
                      <div className="space-y-3 p-5 bg-[#ff003c]/5 border-l-4 border-[#ff003c] relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-2 opacity-10">
                          <ShieldAlert className="w-24 h-24 text-[#ff003c]" />
                        </div>
                        <h4 className="text-xs font-bold font-mono text-[#ff003c] uppercase tracking-widest flex items-center gap-2 relative z-10">
                          <ShieldAlert className="w-4 h-4" /> [ MISSION_CRITICAL: PROBLEM ]
                        </h4>
                        <div className="text-[#ffb3c1] text-sm leading-relaxed relative z-10 font-mono" dangerouslySetInnerHTML={{ __html: selectedProject.problem_statement }} />
                      </div>
                    )}

                    {/* Solution */}
                    {selectedProject.solution && (
                      <div className="space-y-3 p-5 bg-[#00ff88]/5 border-l-4 border-[#00ff88] relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-2 opacity-10">
                          <Award className="w-24 h-24 text-[#00ff88]" />
                        </div>
                        <h4 className="text-xs font-bold font-mono text-[#00ff88] uppercase tracking-widest flex items-center gap-2 relative z-10">
                          <Award className="w-4 h-4" /> [ EXECUTION: SOLUTION ]
                        </h4>
                        <div className="text-[#a7f3d0] text-sm leading-relaxed relative z-10" dangerouslySetInnerHTML={{ __html: selectedProject.solution }} />
                      </div>
                    )}

                    {/* Architecture */}
                    {selectedProject.architecture && (
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold font-mono text-[#00e5ff] uppercase tracking-widest flex items-center gap-2 border-b border-[#00e5ff]/20 pb-2">
                          <Cpu className="w-4 h-4" /> [ SYS_ARCHITECTURE ]
                        </h4>
                        <div className="text-[#80deea] text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: selectedProject.architecture }} />
                      </div>
                    )}

                    {/* Key features */}
                    {selectedProject.key_features && (
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold font-mono text-[#00e5ff] uppercase tracking-widest flex items-center gap-2 border-b border-[#00e5ff]/20 pb-2">
                          <Info className="w-4 h-4" /> [ PROTOCOL_FEATURES ]
                        </h4>
                        <div className="text-[#80deea] text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: selectedProject.key_features }} />
                      </div>
                    )}

                    {/* Challenges */}
                    {selectedProject.challenges && (
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold font-mono text-[#00e5ff] uppercase tracking-widest flex items-center gap-2 border-b border-[#00e5ff]/20 pb-2">
                          <HelpCircle className="w-4 h-4" /> [ ANOMALIES_RESOLVED ]
                        </h4>
                        <div className="text-[#80deea] text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: selectedProject.challenges }} />
                      </div>
                    )}
                  </div>

                  {/* Right Sidebar Metadata */}
                  <div className="w-full lg:w-72 space-y-8 shrink-0">
                    
                    {/* Action buttons */}
                    <div className="flex flex-col gap-3">
                      {selectedProject.demo_url && (
                        <button
                          onClick={() => window.open(selectedProject.demo_url!, '_blank')}
                          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#00e5ff]/10 hover:bg-[#00e5ff]/30 border border-[#00e5ff] text-[#00e5ff] hover:text-white font-mono font-bold text-xs uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(0,229,255,0.2)] hover:shadow-[0_0_25px_rgba(0,229,255,0.5)]"
                          style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}
                        >
                          <ExternalLink className="w-4 h-4" /> Launch Sequence
                        </button>
                      )}
                      {selectedProject.github_url && (
                        <button
                          onClick={() => window.open(selectedProject.github_url!, '_blank')}
                          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#ff00ff]/10 hover:bg-[#ff00ff]/30 border border-[#ff00ff] text-[#ff00ff] hover:text-white font-mono font-bold text-xs uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(255,0,255,0.2)] hover:shadow-[0_0_25px_rgba(255,0,255,0.5)]"
                          style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}
                        >
                          <GitBranch className="w-4 h-4" /> View Source Code
                        </button>
                      )}
                    </div>

                    {/* Metadata Readout */}
                    <div className="border border-[#00e5ff]/30 p-5 space-y-4 bg-[#00e5ff]/5 text-xs font-mono relative overflow-hidden" style={{ clipPath: 'polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)' }}>
                      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#00e5ff]/50" />
                      <div>
                        <span className="font-bold text-[#00b4d8] block">STATUS:</span>
                        <span className="font-semibold text-[#00ff88] mt-1 block">[{selectedProject.status}]</span>
                      </div>
                      <div className="w-full h-px bg-[#00e5ff]/20" />
                      <div>
                        <span className="font-bold text-[#00b4d8] block">DATE_RELEASED:</span>
                        <span className="font-semibold text-[#e0f7fa] mt-1 block">{selectedProject.project_date}</span>
                      </div>
                      <div className="w-full h-px bg-[#00e5ff]/20" />
                      <div>
                        <span className="font-bold text-[#00b4d8] block">CATEGORY_GROUP:</span>
                        <span className="font-semibold text-[#ff00ff] mt-1 block">{selectedProject.category}</span>
                      </div>
                    </div>

                    {/* Tech list */}
                    {selectedProject.tech_stack.length > 0 && (
                      <div className="space-y-3">
                        <span className="text-xs font-bold font-mono text-[#00e5ff] uppercase tracking-widest flex items-center gap-2 border-b border-[#00e5ff]/20 pb-2">
                          [ DEPENDENCIES ]
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {selectedProject.tech_stack.map((tech, idx) => (
                            <span key={idx} className="text-[10px] font-bold font-mono tracking-widest uppercase px-2.5 py-1 bg-[#00e5ff]/10 border border-[#00e5ff]/30 text-[#80deea]" style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}>
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Image gallery strip list */}
                    {selectedProject.gallery_urls.length > 0 && (
                      <div className="space-y-3">
                        <span className="text-xs font-bold font-mono text-[#00e5ff] uppercase tracking-widest flex items-center gap-2 border-b border-[#00e5ff]/20 pb-2">
                          [ LOG_ARCHIVE_IMAGES ]
                        </span>
                        <div className="grid grid-cols-2 gap-3">
                          {selectedProject.gallery_urls.map((url, idx) => (
                            <div
                              key={idx}
                              onClick={() => window.open(url, '_blank')}
                              className="relative aspect-video rounded overflow-hidden border border-[#00e5ff]/30 bg-[#000d1a] cursor-zoom-in group"
                            >
                              <img src={url} alt={`Gallery slide ${idx}`} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                              <div className="absolute inset-0 border border-transparent group-hover:border-[#00e5ff] transition-all" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

const ImageIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
    <circle cx="9" cy="9" r="2" />
    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
  </svg>
);

export default ProjectsSection;
