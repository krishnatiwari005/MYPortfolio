'use client';
// Cache-bust comment: 2026-07-05-02

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Skill } from '@/types';
import Card from '../ui/card';
import Badge from '../ui/badge';
import { Globe } from 'lucide-react';

export interface SkillsSectionProps {
  skills: Skill[];
}

export const SkillsSection = ({ skills }: SkillsSectionProps) => {
  const [activeCategory, setActiveCategory] = useState('All');

  // Extract unique categories from DB skills
  const categories = ['All', ...Array.from(new Set(skills.map((s) => s.category)))];

  const filteredSkills = activeCategory === 'All'
    ? skills
    : skills.filter((s) => s.category.toLowerCase() === activeCategory.toLowerCase());

  // Category Color Mapper
  const getCategoryColor = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'frontend':
        return 'bg-blue-50 text-blue-700';
      case 'backend':
        return 'bg-purple-50 text-purple-700';
      case 'devops':
        return 'bg-orange-50 text-orange-700';
      case 'mobile':
        return 'bg-pink-50 text-pink-700';
      case 'tools':
        return 'bg-teal-50 text-teal-700';
      default:
        return 'bg-accent-light text-accent-primary';
    }
  };

  return (
    <section id="skills" className="py-12 md:py-16 relative z-10 scroll-mt-12">
      <div className="w-full max-w-[1100px] mx-auto px-6 md:px-12 space-y-8 md:space-y-12">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="px-3 py-1 bg-accent-light border border-accent-primary/10 text-accent-primary text-xs font-bold tracking-widest uppercase rounded-full">
            Skills
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold font-display text-text-primary tracking-tight">
            Technical Competencies
          </h2>
          <p className="text-sm text-text-tertiary max-w-md">
            Filter skill items by category to inspect proficiency metrics.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none justify-start md:justify-center max-w-full no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-300 shadow-sm cursor-pointer border ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-accent-primary to-[#7C3AED] text-white border-transparent'
                  : 'bg-white text-text-secondary border-border-default hover:bg-bg-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          <AnimatePresence mode="popLayout">
            {filteredSkills.map((skill, index) => (
              <motion.div
                layout
                key={skill.id}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                transition={{ type: 'spring', stiffness: 350, damping: 25, delay: index * 0.05 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="h-full"
              >
                <Card glass className="p-3.5 rounded-2xl flex items-center gap-3.5 relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-accent-primary/10 group bg-white/80 hover:bg-white border-border-default hover:border-accent-primary/50 z-10 h-full">
                  {/* Decorative background element */}
                  <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-gradient-to-br from-accent-primary/5 to-purple-500/5 rounded-full blur-2xl group-hover:from-accent-primary/20 group-hover:to-purple-500/20 transition-colors duration-500 z-0"></div>
                  
                  {/* Logo */}
                  <div className="w-12 h-12 shrink-0 rounded-xl bg-white border border-border-subtle flex items-center justify-center p-2 overflow-hidden group-hover:border-accent-primary/40 transition-all duration-300 shadow-sm group-hover:shadow-md z-10 relative">
                    {skill.logo_url ? (
                      <img
                        src={skill.logo_url}
                        alt={skill.name}
                        width={32}
                        height={32}
                        loading="lazy"
                        className="object-contain w-full h-full group-hover:scale-110 group-hover:rotate-[5deg] transition-transform duration-300"
                      />
                    ) : (
                      <Globe className="w-6 h-6 text-text-tertiary group-hover:text-accent-primary group-hover:rotate-[15deg] transition-all duration-300" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 z-10 relative flex flex-col justify-center">
                    <h3 className="text-sm sm:text-base font-extrabold text-text-primary font-display group-hover:text-accent-primary transition-colors leading-tight mb-1 break-words">{skill.name}</h3>
                    
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md flex-shrink-0 uppercase tracking-wider ${getCategoryColor(skill.category)}`}>
                        {skill.category}
                      </div>
                      <span className="text-[10px] font-bold text-text-tertiary group-hover:text-text-secondary transition-colors">
                        {skill.proficiency}%
                      </span>
                    </div>
                    
                    {/* Proficiency progress bar */}
                    <div className="w-full h-1.5 bg-border-default/60 rounded-full overflow-hidden shadow-inner relative">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.proficiency}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
                        className="h-full bg-gradient-to-r from-accent-primary to-[#7C3AED] relative overflow-hidden"
                      >
                        {/* Shimmer effect inside progress bar */}
                        <motion.div 
                          className="absolute top-0 bottom-0 left-0 w-[50%] bg-gradient-to-r from-transparent via-white/40 to-transparent"
                          animate={{ x: ["-200%", "200%"] }}
                          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                        />
                      </motion.div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default SkillsSection;
