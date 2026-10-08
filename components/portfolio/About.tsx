'use client';
// Cache-bust comment: cyberpunk-about-v3-mobile-scroll-points

import { motion } from 'framer-motion';
import { About } from '@/types';
import { GraduationCap, MapPin, Briefcase, Heart } from 'lucide-react';

export interface AboutSectionProps {
  data: About | null;
}

export const AboutSection = ({ data }: AboutSectionProps) => {
  const bioHtml = data?.bio ?? '<p>Hello! I am a software engineer passionate about building high-performance web applications and systems.</p>';
  const education = data?.education ?? 'B.S. Computer Science';
  const location = data?.location ?? 'London, UK';
  const currentRole = data?.current_position ?? 'Senior Software Engineer';
  const careerInterests = data?.career_interests ?? 'Distributed Systems, Web Dev, UX/UI';

  const infoItems = [
    { icon: GraduationCap, label: 'Education', value: education },
    { icon: MapPin, label: 'Location', value: location },
    { icon: Briefcase, label: 'Current Role', value: currentRole },
    { icon: Heart, label: 'Career Interests', value: careerInterests },
  ];

  return (
    <section id="about" className="py-10 md:py-20 relative z-10 scroll-mt-12">
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
        <motion.div
          initial={{ opacity: 0, rotateX: 75, y: 60 }}
          whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: 'top', perspective: 2000 }}
          className="relative glass-card rounded-xl sm:rounded-2xl md:rounded-none p-5 sm:p-8 md:p-12 overflow-hidden border border-[rgba(0,229,255,0.15)] shadow-[0_0_40px_rgba(0,229,255,0.05)]"
        >
          {/* Cyberpunk accents */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00e5ff] to-transparent opacity-50" />
          <div className="absolute -top-32 -right-32 w-72 h-72 bg-[#00e5ff]/10 rounded-full blur-[80px] pointer-events-none" />

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 relative z-10">
            
            {/* Left Column: Story & Text */}
            <div className="flex-1 flex flex-col space-y-6 md:space-y-8">
              {/* Header */}
              <div className="space-y-3 sm:space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[rgba(0,229,255,0.05)] border border-[rgba(0,229,255,0.2)] text-[#00e5ff] text-xs font-bold tracking-widest uppercase rounded-full shadow-[0_0_15px_rgba(0,229,255,0.1)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00e5ff] animate-pulse" />
                  About Me
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold font-display text-[#e0f7fa] tracking-tight text-glow">
                  My Background & Story
                </h2>
                <p className="text-xs sm:text-sm text-[#00b4d8] uppercase tracking-widest font-bold">
                  A quick glimpse into my professional credentials
                </p>
              </div>

              {/* Bio Content - Scrollable on mobile, natural on desktop */}
              <div className="relative">
                {/* Vertical accent line */}
                <div className="absolute left-0 top-1 bottom-1 w-[2px] bg-gradient-to-b from-[#00e5ff] to-transparent opacity-30 rounded-full" />
                
                <div 
                  className="pl-5 sm:pl-6 text-[#80deea] text-xs sm:text-sm md:text-base leading-relaxed space-y-4 max-h-[220px] sm:max-h-[260px] md:max-h-none overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#00e5ff]/30 scrollbar-track-transparent"
                  dangerouslySetInnerHTML={{ __html: bioHtml }}
                />
              </div>

              {/* MOBILE ONLY: Credentials list as compact points (lg:hidden) */}
              <div className="lg:hidden space-y-2 pt-3 border-t border-[rgba(0,229,255,0.15)]">
                <p className="text-[9px] font-bold font-mono text-[#00b4d8] uppercase tracking-widest mb-1.5">
                  [ CREDENTIAL_SUMMARY ]
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {infoItems.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={idx}
                        className="flex items-center gap-2.5 py-2 px-3 rounded-lg bg-[rgba(0,13,26,0.7)] border border-[rgba(0,229,255,0.15)] shadow-sm"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00e5ff] shadow-[0_0_6px_#00e5ff] shrink-0" />
                        <Icon className="w-3.5 h-3.5 text-[#00e5ff] shrink-0" />
                        <div className="min-w-0 flex-1 flex items-baseline justify-between gap-2">
                          <span className="text-[10px] font-bold font-mono text-[#00b4d8] uppercase tracking-wide shrink-0">
                            {item.label}:
                          </span>
                          <span className="text-xs font-semibold text-[#e0f7fa] truncate text-right">
                            {item.value}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* DESKTOP ONLY: Right Column 3D Info Panel Stack (hidden lg:flex - UNCHANGED) */}
            <div className="hidden lg:flex lg:w-[380px] shrink-0 flex-col gap-4 justify-center">
              {infoItems.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + idx * 0.1, duration: 0.5 }}
                    className="relative flex items-center gap-4 p-4 bg-[#000d1a]/80 border border-[rgba(0,229,255,0.15)] hover:border-[rgba(0,229,255,0.4)] hover:shadow-[0_0_24px_rgba(0,229,255,0.15)] transition-all group"
                    style={{ clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))' }}
                  >
                    {/* HUD corner accents */}
                    <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#00e5ff]/60 group-hover:border-[#00e5ff] transition-colors" />
                    <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#00e5ff]/60 group-hover:border-[#00e5ff] transition-colors" />
                    <div className="p-3 bg-[rgba(0,229,255,0.07)] text-[#00e5ff] group-hover:scale-110 group-hover:bg-[rgba(0,229,255,0.15)] transition-all shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-[#00b4d8] uppercase tracking-widest mb-0.5 font-mono">{item.label}</p>
                      <h4 className="text-sm md:text-base font-semibold text-[#e0f7fa] leading-tight">{item.value}</h4>
                    </div>
                  </motion.div>
                );
              })}
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
