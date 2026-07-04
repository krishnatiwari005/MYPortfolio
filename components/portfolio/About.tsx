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
    <section id="about" className="py-24 relative z-10 scroll-mt-12">
      <div className="w-full max-w-[1100px] mx-auto px-6 md:px-12 space-y-12">
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

        {/* Contents Grid */}
        <div className="flex flex-col lg:flex-row gap-8 items-stretch">
          {/* Bio card Left (60%) */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex-1 lg:max-w-[60%]"
          >
            <Card glass className="h-full p-8 rounded-[24px] flex flex-col justify-between">
              <div
                className="text-text-secondary text-sm md:text-base leading-relaxed space-y-4"
                dangerouslySetInnerHTML={{ __html: bioHtml }}
              />
            </Card>
          </motion.div>

          {/* Info cards Right (40%) */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
            className="w-full lg:w-[40%] flex flex-col gap-4"
          >
            {infoItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="flex items-center gap-4 p-4 bg-white border border-border-subtle rounded-xl shadow-sm hover:border-accent-primary/20 transition-all duration-300"
                >
                  <div className="p-3 bg-accent-light text-accent-primary rounded-xl shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">{item.label}</p>
                    <h4 className="text-sm font-semibold text-text-primary mt-0.5">{item.value}</h4>
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
