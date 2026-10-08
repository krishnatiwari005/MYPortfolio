'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { GitBranch, Link2, MessageCircle, Mail, ArrowRight, Download, Code2, Activity, Sparkles } from 'lucide-react';
import { Hero } from '@/types';

export interface HeroSectionProps {
  data: Hero | null;
  onContactClick: () => void;
  onResumeClick: () => void;
}

// A simple counter component that animates from 0 to target value
const AnimatedCounter = ({ value }: { value: string | undefined }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (!value) return;
    const numericValue = parseInt(value.replace(/[^0-9]/g, ''), 10);
    if (isNaN(numericValue)) {
      setCount(numericValue || 0); // fallback
      return;
    }
    
    const duration = 1500;
    let startTime: number | null = null;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      
      // easeOutCubic
      const ease = 1 - Math.pow(1 - Math.min(progress / duration, 1), 3);
      
      setCount(Math.floor(ease * numericValue));
      
      if (progress < duration) {
        requestAnimationFrame(animate);
      } else {
        setCount(numericValue);
      }
    };
    
    requestAnimationFrame(animate);
  }, [value]);

  // Extract non-numeric suffix (like +, %, etc)
  const suffix = value?.replace(/[0-9]/g, '') || '';
  return <>{count}{suffix}</>;
};

export const HeroSection = ({ data, onContactClick, onResumeClick }: HeroSectionProps) => {
  const name = data?.name ?? 'Jane Doe';
  const role = data?.role ?? 'Full Stack Developer';
  const available = data?.available ?? true;
  const availabilityLabel = data?.availability_label ?? 'Available for new opportunities';

  // Parse pipe-separated taglines
  const rawTagline = data?.tagline ?? '🚀 Building intelligent AI solutions that solve real-world problems.';
  const taglines = rawTagline.split('|').map((t) => t.trim()).filter(Boolean);

  const [taglineIndex, setTaglineIndex] = useState(0);

  // Rotate tagline every 3.5 seconds
  useEffect(() => {
    if (taglines.length <= 1) return;
    const interval = setInterval(() => {
      setTaglineIndex((prev) => (prev + 1) % taglines.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [taglines.length]);

  const socialLinks = [
    { icon: GitBranch, href: data?.github_url, label: 'GitHub' },
    { icon: Link2, href: data?.linkedin_url, label: 'LinkedIn' },
    { icon: MessageCircle, href: data?.twitter_url, label: 'Twitter' },
    { icon: Code2, href: data?.leetcode_url, label: 'LeetCode' },
    { icon: Mail, href: data?.email ? `mailto:${data.email}` : undefined, label: 'Email' },
  ].filter((link) => link.href);

  // Stats Grid Helper
  const stats = [
    { value: data?.stat_1_value, label: data?.stat_1_label },
    { value: data?.stat_2_value, label: data?.stat_2_label },
    { value: data?.stat_3_value, label: data?.stat_3_label },
    { value: data?.stat_4_value, label: data?.stat_4_label },
  ].filter((stat) => stat.value && stat.label);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  };

  return (
    <section className="flex items-center justify-center pt-20 sm:pt-24 md:pt-32 pb-12 relative z-10">
      <div className="w-full max-w-[1100px] mx-auto px-4 sm:px-6 md:px-12 flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
        {/* Left Column (Main Intro) */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex-1 text-left space-y-4 sm:space-y-6 lg:max-w-[55%] w-full"
        >
          {/* Header Row on Mobile: Intro Text on Left + Advanced Rectangular Portrait on Right */}
          <div className="flex items-center justify-between gap-3 sm:gap-4">
            <div className="space-y-1.5 sm:space-y-2 flex-1 min-w-0">
              <motion.div variants={itemVariants} className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 bg-[rgba(0,229,255,0.05)] border border-[rgba(0,229,255,0.2)] text-[#00e5ff] text-[10px] sm:text-xs font-bold tracking-widest uppercase rounded-full">
                <span>👋</span> Hey, I&apos;m
              </motion.div>

              <motion.h1
                variants={itemVariants}
                className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold font-display tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#00b4d8] to-[#00e5ff] animate-[shimmer_3s_ease-in-out_infinite] leading-tight"
              >
                {name}
              </motion.h1>

              <motion.p variants={itemVariants} className="text-sm sm:text-lg md:text-2xl font-medium text-[#00e5ff]">
                {role}
              </motion.p>
            </div>

            {/* ADVANCED RECTANGULAR PORTRAIT FRAME (Mobile Only - lg:hidden) */}
            <motion.div
              variants={itemVariants}
              className="lg:hidden shrink-0 self-center"
            >
              <div className="relative w-24 h-32 sm:w-28 sm:h-36 rounded-xl p-[2px] bg-gradient-to-b from-[#00e5ff] via-[#00b4d8]/40 to-[#001f3f] shadow-[0_0_25px_rgba(0,229,255,0.35)] group">
                {/* HUD Corner Tech Accents */}
                <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-[#00e5ff] z-20 pointer-events-none" />
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-[#00e5ff] z-20 pointer-events-none" />
                <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-[#00e5ff] z-20 pointer-events-none" />
                <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-[#00e5ff] z-20 pointer-events-none" />

                <div className="w-full h-full rounded-xl overflow-hidden bg-[#000d1a] border border-[#00e5ff]/40 relative">
                  {data?.photo_url ? (
                    <img
                      src={data.photo_url}
                      alt={name}
                      className="w-full h-full object-cover object-top"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#00e5ff] font-bold text-xl font-display">
                      {name.split(' ').map((n) => n[0]).join('')}
                    </div>
                  )}

                  {/* Scanline overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00e5ff]/10 to-transparent pointer-events-none" />
                </div>

                {/* Status Dot */}
                {available && (
                  <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-[#000d1a] flex items-center gap-1 border border-[#00ff88]/60 shadow-[0_0_8px_rgba(0,255,136,0.4)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse" />
                    <span className="text-[7px] font-mono font-bold text-[#00ff88] uppercase">LIVE</span>
                  </span>
                )}
              </div>
            </motion.div>
          </div>

          {/* Rotating Tagline */}
          <motion.div variants={itemVariants} className="min-h-[2.75rem] sm:min-h-[3.5rem] flex items-start">
            <AnimatePresence mode="wait">
              <motion.p
                key={taglineIndex}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.45, ease: 'easeInOut' }}
                className="text-xs sm:text-sm md:text-lg text-[#80deea] max-w-md leading-relaxed"
              >
                {taglines[taglineIndex]}
              </motion.p>
            </AnimatePresence>
          </motion.div>

          {/* CTA Row */}
          <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-2.5 sm:gap-3.5 pt-1 sm:pt-4 w-full">
            <button onClick={onContactClick} className="btn-cyber flex-1 sm:flex-initial justify-center px-4 sm:px-6 py-2.5 rounded-lg flex items-center gap-1.5 font-bold uppercase tracking-wide group text-xs sm:text-sm">
              Let&apos;s Talk
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button onClick={onResumeClick} className="flex-1 sm:flex-initial justify-center px-4 sm:px-6 py-2.5 rounded-lg border border-[#00e5ff] text-[#00e5ff] bg-transparent hover:bg-[#00e5ff] hover:text-[#000d1a] transition-all duration-300 font-bold uppercase tracking-wide flex items-center gap-1.5 shadow-[0_0_10px_rgba(0,229,255,0.2)] hover:shadow-[0_0_20px_rgba(0,229,255,0.6)] text-xs sm:text-sm">
              <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Download Resume
            </button>
          </motion.div>

          {/* Desktop Social Row */}
          <motion.div variants={itemVariants} className="hidden lg:flex items-center gap-2.5 pt-2">
            {socialLinks.map((link, idx) => {
              const Icon = link.icon;
              return (
                <a
                  key={idx}
                  href={link.href ?? undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-[rgba(0,229,255,0.3)] bg-transparent backdrop-blur-sm flex items-center justify-center text-[#80deea] hover:text-[#00e5ff] hover:border-[#00e5ff] hover:shadow-[0_0_15px_rgba(0,229,255,0.5)] transition-all duration-300"
                  aria-label={link.label}
                >
                  <Icon className="w-4 h-4" />
                </a>
              );
            })}
          </motion.div>
        </motion.div>

        {/* Right Column / Mobile Lower Section (Structured HUD Metrics Card) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.4 }}
          className="w-full lg:w-[40%] shrink-0 lg:mt-20"
        >
          {/* ============================================================ */}
          {/* MOBILE VIEW: Advanced Cyber HUD Metrics Card (lg:hidden)     */}
          {/* ============================================================ */}
          <div className="lg:hidden w-full space-y-3">
            {/* HUD Status Header */}
            {available && (
              <div className="flex items-center justify-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[rgba(0,229,255,0.06)] backdrop-blur-md border border-[rgba(0,229,255,0.25)] rounded-full shadow-[0_0_15px_rgba(0,229,255,0.12)]">
                  <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-ping" />
                  <span className="text-[10px] font-bold text-[#00e5ff] tracking-wider uppercase font-mono">
                    {availabilityLabel}
                  </span>
                </div>
              </div>
            )}

            {/* Advanced 4-Grid Telemetry Card */}
            {stats.length > 0 && (
              <div className="relative rounded-2xl bg-[#001326]/85 border border-[#00e5ff]/25 p-3.5 backdrop-blur-md shadow-[0_0_25px_rgba(0,229,255,0.1)] overflow-hidden">
                {/* HUD Corner Accents */}
                <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#00e5ff]/60" />
                <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#00e5ff]/60" />
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#00e5ff]/60" />
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#00e5ff]/60" />

                <div className="grid grid-cols-4 gap-2 divide-x divide-[#00e5ff]/15">
                  {stats.map((stat, idx) => (
                    <div key={idx} className={`flex flex-col items-center text-center ${idx !== 0 ? 'pl-2' : ''}`}>
                      <h4 className="text-base sm:text-lg font-black font-display text-[#00e5ff] leading-none text-glow">
                        <AnimatedCounter value={stat.value ?? undefined} />
                      </h4>
                      <p className="text-[8px] sm:text-[9px] text-[#80deea] font-mono font-bold uppercase tracking-tight mt-1.5 line-clamp-2">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mobile Social Links Row */}
            {socialLinks.length > 0 && (
              <div className="flex items-center justify-center gap-3 pt-1">
                {socialLinks.map((link, idx) => {
                  const Icon = link.icon;
                  return (
                    <a
                      key={idx}
                      href={link.href ?? undefined}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full border border-[rgba(0,229,255,0.3)] bg-[#001020]/80 flex items-center justify-center text-[#80deea] hover:text-[#00e5ff] hover:border-[#00e5ff] hover:shadow-[0_0_12px_rgba(0,229,255,0.5)] transition-all active:scale-95"
                      aria-label={link.label}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* ============================================================ */}
          {/* DESKTOP VIEW: 3D Diamond Photo Container (hidden lg:flex)    */}
          {/* ============================================================ */}
          <div className="hidden lg:flex flex-col items-center text-center space-y-6">
            {/* Background Accent glow */}
            <div className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#00e5ff]/20 rounded-full blur-[60px] pointer-events-none" />

            {/* === 3D OUT-OF-BOUNDS PHOTO CONTAINER (Desktop Only) === */}
            <div className="relative w-64 h-64 md:w-72 md:h-72 lg:w-[320px] lg:h-[320px] mt-8 mb-4">
              
              {/* Rotating outer diamond 1 (Behind Image) */}
              <motion.div
                animate={{ rotate: [45, 405] }}
                transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-[-10px] border-[2px] border-dashed border-[#00e5ff]/40 pointer-events-none"
              />

              {/* Rotating outer diamond 2 (Behind Image) */}
              <motion.div
                animate={{ rotate: [45, -315] }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-[-25px] border-[2px] border-[#00b4d8]/30 pointer-events-none"
              />

              {/* Static Enhanced Glowing Diamond (Behind Image) */}
              <div className="absolute inset-[15px] rotate-45 border-[3px] border-[#00e5ff] shadow-[0_0_40px_rgba(0,229,255,0.6),inset_0_0_20px_rgba(0,229,255,0.3)] pointer-events-none">
                <div className="absolute -top-1 -left-1 w-3 h-3 bg-[#00e5ff] shadow-[0_0_15px_rgba(0,229,255,1)]" />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#00e5ff] shadow-[0_0_15px_rgba(0,229,255,1)]" />
              </div>
              
              {/* Inner dark diamond */}
              <div className="absolute inset-[15px] rotate-45 bg-[#000d1a]/85 backdrop-blur-md pointer-events-none" />

              {/* The Photo itself */}
              <div 
                className="absolute inset-x-[-20%] bottom-0 top-[-30%] z-10 pointer-events-none flex justify-center"
                style={{ 
                  WebkitMaskImage: 'linear-gradient(to bottom, black 65%, transparent 100%)',
                  maskImage: 'linear-gradient(to bottom, black 65%, transparent 100%)'
                }}
              >
                {data?.photo_url ? (
                  <img
                    src={data.photo_url}
                    alt={name}
                    className="w-[90%] h-full object-contain object-bottom drop-shadow-[0_0_25px_rgba(0,229,255,0.4)] pointer-events-auto"
                  />
                ) : (
                  <div className="absolute inset-[10%] flex items-center justify-center text-[#00e5ff] font-bold text-6xl font-display pointer-events-auto rotate-[-45]">
                    {name.split(' ').map((n) => n[0]).join('')}
                  </div>
                )}
              </div>

              {/* Subtle animated scan line */}
              <motion.div
                animate={{ top: ['0%', '100%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                className="absolute left-[-10%] right-[-10%] h-[2px] pointer-events-none z-0"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(0,229,255,0.5), transparent)',
                  boxShadow: '0 0 10px rgba(0,229,255,0.4)',
                }}
              />
            </div>

            {/* Availability Badge */}
            {available && (
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[rgba(0,229,255,0.05)] backdrop-blur-md border border-[rgba(0,229,255,0.2)] rounded-full shadow-[0_0_15px_rgba(0,229,255,0.1)] z-10">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00ff88] animate-[pulse-dot_2s_infinite]" />
                <span className="text-xs font-bold text-[#00e5ff] tracking-wide uppercase">
                  {availabilityLabel}
                </span>
              </div>
            )}

            {/* Stats Grid Desktop */}
            {stats.length > 0 && (
              <div className="w-full max-w-sm flex flex-wrap items-center justify-center gap-6 pt-2 z-10">
                {stats.map((stat, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <h4 className="text-lg md:text-xl font-extrabold font-display text-[#00e5ff] leading-tight text-glow">
                      <AnimatedCounter value={stat.value ?? undefined} />
                    </h4>
                    <p className="text-[9px] md:text-[10px] text-[#80deea] font-bold uppercase tracking-widest mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
