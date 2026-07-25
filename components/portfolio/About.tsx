'use client';

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
    <section id="about" className="py-12 md:py-20 relative z-10 scroll-mt-12">
      <div className="w-full max-w-[1100px] mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative glass-card rounded-3xl p-8 md:p-12 overflow-hidden border border-[rgba(0,229,255,0.15)] shadow-[0_0_40px_rgba(0,229,255,0.05)]"
        >
          {/* Cyberpunk accents */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00e5ff] to-transparent opacity-50" />
          <div className="absolute -top-32 -right-32 w-72 h-72 bg-[#00e5ff]/10 rounded-full blur-[80px] pointer-events-none" />

          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 relative z-10">
            
            {/* Left Column: Story & Text */}
            <div className="flex-1 flex flex-col space-y-8">
              {/* Header */}
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[rgba(0,229,255,0.05)] border border-[rgba(0,229,255,0.2)] text-[#00e5ff] text-xs font-bold tracking-widest uppercase rounded-full shadow-[0_0_15px_rgba(0,229,255,0.1)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00e5ff] animate-pulse" />
                  About Me
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold font-display text-[#e0f7fa] tracking-tight text-glow">
                  My Background & Story
                </h2>
                <p className="text-sm text-[#00b4d8] uppercase tracking-widest font-bold">
                  A quick glimpse into my professional credentials
                </p>
              </div>

              {/* Bio Content - customized prose for dark theme */}
              <div className="relative">
                {/* Vertical accent line */}
                <div className="absolute left-0 top-1 bottom-1 w-[2px] bg-gradient-to-b from-[#00e5ff] to-transparent opacity-30 rounded-full" />
                
                <div 
                  className="pl-6 text-[#80deea] text-sm md:text-base leading-relaxed space-y-5"
                  dangerouslySetInnerHTML={{ __html: bioHtml }}
                />
              </div>
            </div>

            {/* Right Column: Info panel stack */}
            <div className="lg:w-[380px] shrink-0 flex flex-col gap-4 justify-center">
              {infoItems.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + idx * 0.1, duration: 0.5 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-[#000d1a]/60 border border-[rgba(0,229,255,0.1)] hover:border-[rgba(0,229,255,0.3)] hover:shadow-[0_0_20px_rgba(0,229,255,0.1)] transition-all group"
                  >
                    <div className="p-3 bg-[rgba(0,229,255,0.05)] text-[#00e5ff] rounded-lg group-hover:scale-110 group-hover:bg-[rgba(0,229,255,0.15)] transition-all">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-[#00b4d8] uppercase tracking-widest mb-0.5">{item.label}</p>
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
