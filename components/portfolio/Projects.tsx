'use client';
// Cache-bust comment: 2026-07-05-02

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '@/types';
import Card from '../ui/card';
import Badge from '../ui/badge';
import Button from '../ui/button';
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
    <section id="projects" className="py-24 relative z-10 scroll-mt-12">
      <div className="w-full max-w-[1100px] mx-auto px-6 md:px-12 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="px-3 py-1 bg-accent-light border border-accent-primary/10 text-accent-primary text-xs font-bold tracking-widest uppercase rounded-full">
            Portfolio
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold font-display text-text-primary tracking-tight">
            Featured Projects
          </h2>
          <p className="text-sm text-text-tertiary max-w-md">
            Click on any project card to open in-depth case studies, problem statements, and architectures.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 justify-start md:justify-center no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-300 shadow-sm cursor-pointer border ${
                activeFilter === cat
                  ? 'bg-gradient-to-r from-accent-primary to-[#7C3AED] text-white border-transparent'
                  : 'bg-white text-text-secondary border-border-default hover:bg-bg-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, idx) => {
              // The first element in the filtered array, if featured, can span full width on desktop!
              const isFirstFeatured = project.is_featured && idx === 0;

              return (
                <motion.div
                  layout
                  key={project.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ y: -4, boxShadow: 'var(--shadow-float)' }}
                  className={isFirstFeatured ? 'md:col-span-2 lg:col-span-3' : ''}
                >
                  <Card
                    glass
                    onClick={() => setSelectedProject(project)}
                    className="h-full rounded-2xl overflow-hidden cursor-pointer flex flex-col items-stretch p-0 border border-border-subtle"
                  >
                    {/* Thumbnail banner */}
                    <div className={`relative overflow-hidden bg-bg-primary shrink-0 ${isFirstFeatured ? 'aspect-[21/9]' : 'aspect-video'}`}>
                      {project.thumbnail_url ? (
                        <img
                          src={project.thumbnail_url}
                          alt={project.title}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-103"
                        />
                      ) : (
                        <div className="w-full h-full bg-accent-light flex items-center justify-center text-accent-primary">
                          <ImageIcon className="w-12 h-12" />
                        </div>
                      )}

                      {/* Featured Star Badge */}
                      {project.is_featured && (
                        <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow flex items-center gap-1">
                          <span>★</span> Featured
                        </div>
                      )}

                      {/* Hover Overlay info */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white">
                        <span className="text-xs font-bold uppercase tracking-widest px-4 py-2 border border-white/30 rounded-xl bg-white/10 backdrop-blur-sm">
                          View Details →
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Badge variant="accent">{project.category}</Badge>
                          <span className="text-[10px] font-bold text-text-tertiary bg-bg-primary border border-border-default px-2 py-0.5 rounded">
                            {project.status}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold font-display text-text-primary leading-tight mt-1">{project.title}</h3>
                        <p className="text-xs text-text-secondary leading-relaxed line-clamp-3">
                          {project.short_description}
                        </p>
                      </div>

                      {/* Tags & Action links */}
                      <div className="mt-5 space-y-4">
                        {project.tech_stack.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {project.tech_stack.slice(0, 4).map((tech, tIdx) => (
                              <span key={tIdx} className="text-[9px] font-bold font-mono tracking-wide uppercase px-2 py-0.5 bg-bg-primary border border-border-subtle text-text-secondary rounded">
                                {tech}
                              </span>
                            ))}
                            {project.tech_stack.length > 4 && (
                              <span className="text-[9px] font-bold font-mono px-1.5 py-0.5 bg-accent-light text-accent-primary rounded">
                                +{project.tech_stack.length - 4}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Case Study Lightbox Popup Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[201] flex items-center justify-center p-4 overflow-y-auto">
            {/* Backdrop close wrapper */}
            <div className="fixed inset-0 bg-black/60 backdrop-blur-md" onClick={() => setSelectedProject(null)} />

            {/* Modal Card content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col max-h-[90vh] my-8"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 bg-white/80 hover:bg-white text-text-secondary hover:text-text-primary p-2 rounded-full border border-border-default shadow-sm z-20 cursor-pointer focus:outline-none transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Scrollable container */}
              <div className="flex-1 overflow-y-auto pb-8">
                {/* Visual Banner */}
                <div className="relative aspect-video w-full max-h-[380px] bg-bg-primary overflow-hidden border-b border-border-subtle">
                  {selectedProject.thumbnail_url ? (
                    <img
                      src={selectedProject.thumbnail_url}
                      alt={selectedProject.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-accent-light flex items-center justify-center" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6">
                    <div className="space-y-1.5 text-white">
                      <Badge variant="primary" className="bg-accent-primary text-white border-transparent">
                        {selectedProject.category}
                      </Badge>
                      <h2 className="text-2xl md:text-3xl font-extrabold font-display tracking-tight text-white leading-tight">
                        {selectedProject.title}
                      </h2>
                    </div>
                  </div>
                </div>

                {/* Body details */}
                <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
                  {/* Left Column Description */}
                  <div className="flex-1 space-y-6">
                    {/* Bio */}
                    {selectedProject.description && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-bold font-display text-text-primary uppercase tracking-wider flex items-center gap-1.5">
                          <Info className="w-4 h-4 text-accent-primary" /> Case Study Overview
                        </h4>
                        <div className="text-text-secondary text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: selectedProject.description }} />
                      </div>
                    )}

                    {/* Problem */}
                    {selectedProject.problem_statement && (
                      <div className="space-y-2 p-5 bg-red-50/50 rounded-2xl border border-red-100">
                        <h4 className="text-sm font-bold font-display text-red-800 uppercase tracking-wider flex items-center gap-1.5">
                          <ShieldAlert className="w-4 h-4 text-red-500" /> The Problem / Challenge
                        </h4>
                        <div className="text-red-950/80 text-xs md:text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: selectedProject.problem_statement }} />
                      </div>
                    )}

                    {/* Solution */}
                    {selectedProject.solution && (
                      <div className="space-y-2 p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                        <h4 className="text-sm font-bold font-display text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                          <Award className="w-4 h-4 text-emerald-500" /> The Solution
                        </h4>
                        <div className="text-emerald-950/80 text-xs md:text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: selectedProject.solution }} />
                      </div>
                    )}

                    {/* Architecture */}
                    {selectedProject.architecture && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-bold font-display text-text-primary uppercase tracking-wider flex items-center gap-1.5">
                          <Cpu className="w-4 h-4 text-accent-primary" /> Architecture Details
                        </h4>
                        <div className="text-text-secondary text-xs md:text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: selectedProject.architecture }} />
                      </div>
                    )}

                    {/* Key features */}
                    {selectedProject.key_features && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-bold font-display text-text-primary uppercase tracking-wider flex items-center gap-1.5">
                          <Info className="w-4 h-4 text-accent-primary" /> Key Features
                        </h4>
                        <div className="text-text-secondary text-xs md:text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: selectedProject.key_features }} />
                      </div>
                    )}

                    {/* Challenges */}
                    {selectedProject.challenges && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-bold font-display text-text-primary uppercase tracking-wider flex items-center gap-1.5">
                          <HelpCircle className="w-4 h-4 text-accent-primary" /> Challenges & Solutions
                        </h4>
                        <div className="text-text-secondary text-xs md:text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: selectedProject.challenges }} />
                      </div>
                    )}
                  </div>

                  {/* Right Sidebar Metadata */}
                  <div className="w-full md:w-64 space-y-6 shrink-0">
                    {/* Action buttons */}
                    <div className="flex flex-col gap-2 pt-2">
                      {selectedProject.demo_url && (
                        <Button
                          variant="primary"
                          onClick={() => window.open(selectedProject.demo_url!, '_blank')}
                          className="w-full justify-center text-xs"
                        >
                          <ExternalLink className="w-4 h-4 mr-1.5" /> Launch Live Application
                        </Button>
                      )}
                      {selectedProject.github_url && (
                        <Button
                          variant="secondary"
                          onClick={() => window.open(selectedProject.github_url!, '_blank')}
                          className="w-full justify-center text-xs"
                        >
                          <GitBranch className="w-4 h-4 mr-1.5" /> View Source Repository
                        </Button>
                      )}
                    </div>

                    {/* Metadata Table */}
                    <div className="border border-border-default rounded-2xl p-4 space-y-3.5 bg-bg-primary/50 text-xs">
                      <div>
                        <span className="font-bold text-text-tertiary block">Status</span>
                        <span className="font-semibold text-text-primary mt-0.5 block">{selectedProject.status}</span>
                      </div>
                      <div>
                        <span className="font-bold text-text-tertiary block">Date Released</span>
                        <span className="font-semibold text-text-primary mt-0.5 block">{selectedProject.project_date}</span>
                      </div>
                      <div>
                        <span className="font-bold text-text-tertiary block">Category Group</span>
                        <span className="font-semibold text-text-primary mt-0.5 block">{selectedProject.category}</span>
                      </div>
                    </div>

                    {/* Tech list */}
                    {selectedProject.tech_stack.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Technologies Used</span>
                        <div className="flex flex-wrap gap-1">
                          {selectedProject.tech_stack.map((tech, idx) => (
                            <span key={idx} className="text-[9px] font-bold font-mono tracking-wide uppercase px-2.5 py-1 bg-white border border-border-default text-text-secondary rounded">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Image gallery strip list */}
                    {selectedProject.gallery_urls.length > 0 && (
                      <div className="space-y-2.5">
                        <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Gallery Images</span>
                        <div className="grid grid-cols-2 gap-2">
                          {selectedProject.gallery_urls.map((url, idx) => (
                            <div
                              key={idx}
                              onClick={() => window.open(url, '_blank')}
                              className="relative aspect-video rounded-lg overflow-hidden border border-border-subtle bg-white cursor-zoom-in"
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={url} alt={`Gallery slide ${idx}`} className="w-full h-full object-cover" />
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
