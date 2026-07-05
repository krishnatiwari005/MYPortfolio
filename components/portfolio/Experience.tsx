'use client';
// Cache-bust comment: 2026-07-05-02

import { motion } from 'framer-motion';
import { Experience } from '@/types';
import Card from '../ui/card';
import Badge from '../ui/badge';
import { Globe, ExternalLink, Calendar } from 'lucide-react';

export interface ExperienceSectionProps {
  experiences: Experience[];
}

export const ExperienceSection = ({ experiences }: ExperienceSectionProps) => {
  return (
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

                      {/* Certificate link */}
                      {(exp.certificate_url || exp.certificate_file_url) && (
                        <div className="mt-4 pt-3 border-t border-border-subtle flex justify-end">
                          <a
                            href={exp.certificate_url ?? exp.certificate_file_url ?? '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-accent-primary hover:text-accent-hover hover:underline cursor-pointer"
                          >
                            <span>Verify Reference Credential</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
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
  );
};

export default ExperienceSection;
