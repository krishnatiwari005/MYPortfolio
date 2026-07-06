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

        {/* Mobile Skills Points */}
        <motion.div layout className="flex md:hidden flex-wrap gap-3 justify-center">
          <AnimatePresence mode="popLayout">
            {filteredSkills.map((skill) => (
              <motion.div
                layout
                key={skill.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                className="flex items-center gap-2 px-3 py-1.5 bg-white border border-border-default rounded-full shadow-sm"
              >
                {skill.logo_url ? (
                  <img src={skill.logo_url} alt={skill.name} className="w-4 h-4 object-contain" loading="lazy" />
                ) : (
                  <Globe className="w-3 h-3 text-text-tertiary" />
                )}
                <span className="text-sm font-semibold text-text-primary">{skill.name}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Desktop Skills Grid */}
        <motion.div layout className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredSkills.map((skill) => (
              <motion.div
                layout
                key={skill.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                whileHover={{ y: -4, boxShadow: 'var(--shadow-float)' }}
                className="h-full"
              >
                <Card glass className="p-5 rounded-2xl flex flex-col justify-between h-full relative overflow-hidden">
                  <div>
                    {/* Category pill */}
                    <div className="absolute top-4 right-4">
                      <Badge className={getCategoryColor(skill.category)} variant="outline">
                        {skill.category}
                      </Badge>
                    </div>

                    {/* Logo */}
                    <div className="w-10 h-10 rounded-xl bg-bg-primary border border-border-subtle flex items-center justify-center p-1.5 overflow-hidden">
                      {skill.logo_url ? (
                        <img
                          src={skill.logo_url}
                          alt={skill.name}
                          width={40}
                          height={40}
                          loading="lazy"
                          className="object-contain w-full h-full"
                        />
                      ) : (
                        <Globe className="w-5 h-5 text-text-tertiary" />
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold text-text-primary mt-4 font-display">{skill.name}</h3>
                    <p className="text-xs text-text-tertiary mt-0.5">{skill.years} {skill.years === 1 ? 'Year' : 'Years'} Exp</p>
                  </div>

                  {/* Proficiency progress bar */}
                  <div className="mt-4 space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-bold text-text-tertiary">
                      <span>Proficiency</span>
                      <span>{skill.proficiency}%</span>
                    </div>
                    <div className="w-full h-1 bg-border-default rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.proficiency}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
                        className="h-full bg-gradient-to-r from-accent-primary to-[#7C3AED]"
                      />
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
