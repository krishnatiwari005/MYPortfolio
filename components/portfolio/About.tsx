'use client';

import { motion } from 'framer-motion';
import { About } from '@/types';
import { GraduationCap, MapPin, Briefcase, Heart } from 'lucide-react';
import Card from '../ui/card';

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
    <section id="about" className="py-12 md:py-16 relative z-10 scroll-mt-12">
      <div className="w-full max-w-[1100px] mx-auto px-6 md:px-12 space-y-8 md:space-y-12">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="px-3 py-1 bg-accent-light border border-accent-primary/10 text-accent-primary text-xs font-bold tracking-widest uppercase rounded-full">
            About Me
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold font-display text-text-primary tracking-tight">
            My Background & Story
          </h2>
          <p className="text-sm text-text-tertiary max-w-md">
            A quick glimpse into my professional summary, credentials, and goals.
          </p>
        </div>

        {/* Contents Container */}
        <div className="flex flex-col gap-12 items-center">
          {/* Bio text (No box, spread out) */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="w-full max-w-5xl px-4"
          >
            <div
              className="text-text-secondary text-base md:text-lg lg:text-xl leading-relaxed space-y-6"
              dangerouslySetInnerHTML={{ __html: bioHtml }}
            />
          </motion.div>

          {/* Info cards (Bottom Grid, spread length-wise) */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
            className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6 px-4 mt-4"
          >
            {infoItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="flex flex-row items-center gap-5 p-5 bg-white border border-border-subtle rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-accent-primary/30 transition-all duration-300"
                >
                  <div className="p-3.5 bg-accent-light text-accent-primary rounded-xl shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-text-tertiary uppercase tracking-wider">{item.label}</p>
                    <h4 className="text-base font-semibold text-text-primary mt-1">{item.value}</h4>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
