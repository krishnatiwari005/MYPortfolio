'use client';
// Cache-bust comment: cyberpunk-skills-v4

import { motion, AnimatePresence } from 'framer-motion';
import { Skill } from '@/types';
import { Globe, Cpu, Zap, Code2 } from 'lucide-react';

export interface SkillsSectionProps {
  skills: Skill[];
}

export const SkillsSection = ({ skills }: SkillsSectionProps) => {

  // Split skills into Core Domains and Tech Stack
  const coreSkills = skills.filter((s) => s.category.startsWith('CORE:'));
  const techSkills = skills.filter((s) => !s.category.startsWith('CORE:'));

  // Cyberpunk Category Color Mapper
  const getCategoryColor = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'frontend':
      case 'mobile':
      case 'app':
        return 'text-[#ff00ff] bg-[#ff00ff]/10 border-[#ff00ff]/30'; // Neon Magenta
      case 'backend':
      case 'database':
        return 'text-[#00ff88] bg-[#00ff88]/10 border-[#00ff88]/30'; // Neon Green
      case 'devops':
      case 'tools':
        return 'text-[#ffea00] bg-[#ffea00]/10 border-[#ffea00]/30'; // Neon Yellow
      case 'management':
      case 'ai/ml':
        return 'text-[#00e5ff] bg-[#00e5ff]/10 border-[#00e5ff]/30'; // Neon Cyan
      default:
        return 'text-[#00b4d8] bg-[#00b4d8]/10 border-[#00b4d8]/30';
    }
  };

  return (
    <section id="skills" className="py-12 md:py-20 relative z-10 scroll-mt-12">
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 space-y-16">
        
        {/* Top Header */}
        <div className="flex flex-col items-center text-center space-y-4 relative">
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(0,229,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_10%,transparent_100%)] h-[150px] top-[-30px]" />
          
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[rgba(0,229,255,0.05)] border border-[rgba(0,229,255,0.2)] text-[#00e5ff] text-xs font-bold tracking-widest uppercase rounded-full shadow-[0_0_15px_rgba(0,229,255,0.1)]">
            <Cpu className="w-3.5 h-3.5 animate-pulse" />
            System Capabilities
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold font-display text-[#e0f7fa] tracking-tight text-glow">
            Expertise & Tech Stack
          </h2>
          <p className="text-sm text-[#00b4d8] uppercase tracking-widest font-bold max-w-md">
            Initialize filtering protocols to inspect system capabilities.
          </p>
        </div>

        {/* Side-by-Side Container */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 xl:gap-8 items-start">
          
          {/* Left Side: Core Skills */}
          <div className="space-y-8 flex flex-col">
            <div className="flex items-center gap-3 border-b border-[#00e5ff]/30 pb-4">
              <Zap className="w-6 h-6 text-[#00e5ff]" />
              <h3 className="text-2xl font-bold font-display text-[#e0f7fa] tracking-wide">Core Domains</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative items-start content-start">
              {coreSkills.length === 0 && (
                <div className="col-span-1 sm:col-span-2 py-8 text-center text-[#00b4d8]/60 font-mono text-xs">
                  No Core Domains configured. Add them in the Skills Manager.
                </div>
              )}
              {coreSkills.map((skill, index) => {
                const cleanCat = skill.category.replace('CORE:', '');
                return (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25, delay: index * 0.1 }}
                  whileHover={{ scale: 1.03 }}
                  className="group relative"
                >
                  <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-[#00e5ff]/50 group-hover:border-[#00e5ff] transition-all z-20" />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-[#00e5ff]/50 group-hover:border-[#00e5ff] transition-all z-20" />

                  <div className="p-4 glass-card rounded-lg flex flex-col gap-4 relative overflow-hidden transition-all duration-300 border border-[rgba(0,229,255,0.15)] group-hover:border-[#00e5ff]/60 group-hover:bg-[#00e5ff]/5 z-10">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00e5ff]/10 to-transparent h-[200%] -top-[100%] group-hover:animate-[scanline_2s_linear_infinite] pointer-events-none opacity-0 group-hover:opacity-100 z-0" />
                    
                    <div className="flex items-start justify-between z-10">
                      <div className="w-10 h-10 shrink-0 rounded bg-[#000d1a] border border-[rgba(0,229,255,0.3)] flex items-center justify-center p-2 overflow-hidden group-hover:border-[#00e5ff] transition-all relative">
                        {skill.logo_url ? (
                            <img
                              src={skill.logo_url}
                              alt={skill.name}
                              width={24}
                              height={24}
                              loading="lazy"
                              className="object-contain w-full h-full group-hover:scale-110 transition-transform duration-300"
                            />
                        ) : (
                            <Cpu className="w-5 h-5 text-[#00b4d8] group-hover:text-[#00e5ff] group-hover:animate-pulse transition-all duration-300" />
                        )}
                      </div>
                      <div className={`text-[8px] font-bold px-1.5 py-0.5 border rounded shadow-sm uppercase tracking-widest ${getCategoryColor(cleanCat)}`}>
                        {cleanCat}
                      </div>
                    </div>

                    <div className="mt-auto z-10">
                      <div className="flex items-end justify-between mb-1.5">
                        <h3 className="text-sm font-extrabold text-[#e0f7fa] font-display group-hover:text-[#00e5ff] transition-colors leading-none tracking-wide truncate pr-2">{skill.name}</h3>
                        <span className="text-[9px] font-bold text-[#00b4d8] font-mono group-hover:text-[#00e5ff]">
                          {skill.proficiency}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-[#000d1a] border border-[rgba(0,229,255,0.2)] rounded-sm overflow-hidden relative">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.proficiency}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.5, ease: "circOut", delay: 0.1 }}
                          className="h-full absolute left-0 top-0"
                          style={{
                            background: 'repeating-linear-gradient(90deg, #00e5ff, #00e5ff 4px, transparent 4px, transparent 6px)',
                            boxShadow: '0 0 10px rgba(0,229,255,0.5)'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )})}
            </div>
          </div>

          {/* Right Side: Tech Stack */}
          <div className="space-y-8 flex flex-col">
            <div className="flex items-center gap-3 border-b border-[#00e5ff]/30 pb-4">
              <Code2 className="w-6 h-6 text-[#00e5ff]" />
              <h3 className="text-2xl font-bold font-display text-[#e0f7fa] tracking-wide">Tech Stack Nodes</h3>
            </div>
            
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative items-start content-start">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#00e5ff]/5 blur-[120px] rounded-full pointer-events-none" />

              <AnimatePresence mode="popLayout">
                {techSkills.map((skill, index) => {
                  const cleanCat = skill.category.replace('TECH:', '');
                  return (
                  <motion.div
                    layout
                    key={skill.id}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20, transition: { duration: 0.2 } }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25, delay: index * 0.03 }}
                    whileHover={{ scale: 1.03 }}
                    className="group relative"
                  >
                    <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-[#00e5ff]/50 group-hover:border-[#00e5ff] transition-all z-20" />
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-[#00e5ff]/50 group-hover:border-[#00e5ff] transition-all z-20" />

                    <div className="p-4 glass-card rounded-lg flex flex-col gap-4 relative overflow-hidden transition-all duration-300 border border-[rgba(0,229,255,0.15)] group-hover:border-[#00e5ff]/60 group-hover:bg-[#00e5ff]/5 z-10">
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00e5ff]/10 to-transparent h-[200%] -top-[100%] group-hover:animate-[scanline_2s_linear_infinite] pointer-events-none opacity-0 group-hover:opacity-100 z-0" />
                      
                      <div className="flex items-start justify-between z-10">
                        <div className="w-10 h-10 shrink-0 rounded bg-[#000d1a] border border-[rgba(0,229,255,0.3)] flex items-center justify-center p-2 overflow-hidden group-hover:border-[#00e5ff] transition-all relative">
                          {skill.logo_url ? (
                            <img
                              src={skill.logo_url}
                              alt={skill.name}
                              width={24}
                              height={24}
                              loading="lazy"
                              className="object-contain w-full h-full group-hover:scale-110 transition-transform duration-300"
                            />
                          ) : (
                            <Globe className="w-5 h-5 text-[#00b4d8] group-hover:text-[#00e5ff] group-hover:animate-spin-slow transition-all duration-300" />
                          )}
                        </div>

                        <div className={`text-[8px] font-bold px-1.5 py-0.5 border rounded shadow-sm uppercase tracking-widest ${getCategoryColor(cleanCat)}`}>
                          {cleanCat}
                        </div>
                      </div>

                      <div className="mt-auto z-10">
                        <div className="flex items-end justify-between mb-1.5">
                          <h3 className="text-sm font-extrabold text-[#e0f7fa] font-display group-hover:text-[#00e5ff] transition-colors leading-none tracking-wide truncate pr-2">{skill.name}</h3>
                          <span className="text-[9px] font-bold text-[#00b4d8] font-mono group-hover:text-[#00e5ff]">
                            {skill.proficiency}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-[#000d1a] border border-[rgba(0,229,255,0.2)] rounded-sm overflow-hidden relative">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.proficiency}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.5, ease: "circOut", delay: 0.1 }}
                            className="h-full absolute left-0 top-0"
                            style={{
                              background: 'repeating-linear-gradient(90deg, #00e5ff, #00e5ff 4px, transparent 4px, transparent 6px)',
                              boxShadow: '0 0 10px rgba(0,229,255,0.5)'
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )})}
              </AnimatePresence>
            </motion.div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;

