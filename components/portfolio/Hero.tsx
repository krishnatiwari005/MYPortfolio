'use client';

import { motion, type Variants } from 'framer-motion';
import { GitBranch, Link2, MessageCircle, Mail, ArrowRight, Download, Code2 } from 'lucide-react';
import { Hero } from '@/types';
import Button from '../ui/button';
import { cn } from '@/lib/utils';

export interface HeroSectionProps {
  data: Hero | null;
  onContactClick: () => void;
  onResumeClick: () => void;
}

export const HeroSection = ({ data, onContactClick, onResumeClick }: HeroSectionProps) => {
  const name = data?.name ?? 'Jane Doe';
  const role = data?.role ?? 'Full Stack Developer';
  const tagline = data?.tagline ?? 'Building premium, high-performance web products with clean architecture.';
  const available = data?.available ?? true;
  const availabilityLabel = data?.availability_label ?? 'Available for new opportunities';

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
    <section className="flex items-center justify-center pt-32 pb-12 relative z-10">
      <div className="w-full max-w-[1100px] mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        {/* Left Column (Main Intro) */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex-1 text-left space-y-6 lg:max-w-[55%]"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent-light border border-accent-primary/10 text-accent-primary text-xs font-bold tracking-widest uppercase rounded-full">
            <span>👋</span> Hey, I&apos;m
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold font-display tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-accent-primary to-[#7C3AED]"
          >
            {name}
          </motion.h1>

          <motion.p variants={itemVariants} className="text-xl md:text-2xl font-medium text-text-secondary">
            {role}
          </motion.p>

          <motion.p variants={itemVariants} className="text-base md:text-lg text-text-tertiary max-w-md leading-relaxed">
            {tagline}
          </motion.p>

          {/* Social Row Desktop */}
          <motion.div variants={itemVariants} className="hidden sm:flex items-center gap-2.5 pt-2">
            {socialLinks.map((link, idx) => {
              const Icon = link.icon;
              return (
                <a
                  key={idx}
                  href={link.href ?? undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-border-default bg-white/50 backdrop-blur-sm flex items-center justify-center text-text-secondary hover:text-accent-primary hover:border-accent-primary transition-all duration-300 shadow-sm"
                  aria-label={link.label}
                >
                  <Icon className="w-4 h-4" />
                </a>
              );
            })}
          </motion.div>

          {/* CTA Row */}
          <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3.5 pt-4">
            <Button variant="primary" onClick={onContactClick} className="group flex items-center gap-1.5">
              Let&apos;s Talk
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="secondary" onClick={onResumeClick} className="flex items-center gap-1.5">
              <Download className="w-4 h-4" /> Download Resume
            </Button>
          </motion.div>
        </motion.div>

        {/* Right Column (Profile Photo & Stats) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.4 }}
          className="w-full lg:w-[40%] shrink-0"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="relative flex flex-col items-center text-center space-y-6"
          >
            {/* Background Accent glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent-primary/10 rounded-full blur-3xl pointer-events-none" />

            {/* Profile Photo */}
            <div className="w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-full overflow-hidden border-4 border-white shadow-2xl relative bg-white shrink-0 z-10">
              {data?.photo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={data.photo_url}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-accent-light flex items-center justify-center text-accent-primary font-bold text-5xl font-display">
                  {name.split(' ').map((n) => n[0]).join('')}
                </div>
              )}
            </div>

            {/* Availability Badge */}
            {available && (
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50/80 backdrop-blur-md border border-emerald-200/50 rounded-full shadow-sm z-10">
                <span className="w-2.5 h-2.5 rounded-full bg-success animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                <span className="text-xs font-bold text-emerald-800 tracking-wide uppercase">
                  {availabilityLabel}
                </span>
              </div>
            )}

            {/* Stats / Tags Grid */}
            {stats.length > 0 && (
              <div className="w-full max-w-sm flex flex-wrap items-center justify-center gap-6 pt-2 z-10">
                {stats.map((stat, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <h4 className="text-lg md:text-xl font-extrabold font-display text-text-primary leading-tight">{stat.value}</h4>
                    <p className="text-[9px] md:text-[10px] text-text-tertiary font-bold uppercase tracking-widest mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>
            )}

              {/* Divider & Social Icons for Mobile */}
              {socialLinks.length > 0 && (
                <div className="w-full pt-4 border-t border-border-subtle flex sm:hidden items-center justify-center gap-3">
                  {socialLinks.map((link, idx) => {
                    const Icon = link.icon;
                    return (
                      <a
                        key={idx}
                        href={link.href ?? undefined}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 rounded-full border border-border-default bg-white flex items-center justify-center text-text-secondary"
                        aria-label={link.label}
                      >
                        <Icon className="w-4 h-4" />
                      </a>
                    );
                  })}
                </div>
              )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
