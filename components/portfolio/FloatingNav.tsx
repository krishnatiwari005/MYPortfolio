'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface FloatingNavProps {
  initials?: string;
  logoUrl?: string;
  onHireMeClick: () => void;
  panelOpen?: boolean;
}

export const FloatingNav = ({ initials = 'JD', logoUrl, onHireMeClick, panelOpen = false }: FloatingNavProps) => {
  const [activeSection, setActiveSection] = useState('home');

  const navLinks = [
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Contact' },
    { id: 'github', label: 'Contributions' },
    { id: 'leetcode', label: 'DSA' },
  ] as const;

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    navLinks.forEach((link) => {
      const el = document.getElementById(link.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleLinkClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    /* Outer wrapper: full width, centered, pointer-events-none so it doesn't block page */
    <motion.div
      className="fixed top-4 z-[100] flex justify-center pointer-events-none"
      animate={{
        left: 0,
        right: panelOpen ? '480px' : '0px',
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 35 }}
    >
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.4 }}
        className="pointer-events-auto flex items-center gap-2 sm:gap-3 px-4 py-2 rounded-full border border-white/25 bg-white/15 backdrop-blur-[24px] shadow-[0_2px_24px_rgba(0,0,0,0.07)] max-w-[95vw]"
      >
        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-7 h-7 rounded-full bg-gradient-to-r from-accent-primary to-[#7C3AED] text-white flex items-center justify-center text-xs font-black font-display shadow-sm shrink-0 cursor-pointer overflow-hidden"
        >
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
          ) : (
            initials
          )}
        </button>

        <span className="w-px h-4 bg-black/10 shrink-0" />

        {/* Nav Links */}
        <div className="flex items-center gap-4 sm:gap-5">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={cn(
                  'text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase transition-colors relative py-1 cursor-pointer focus:outline-none shrink-0',
                  isActive ? 'text-accent-primary' : 'text-text-secondary hover:text-text-primary'
                )}
              >
                <span>{link.label}</span>
                {isActive && (
                  <motion.span
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-primary rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        <span className="w-px h-4 bg-black/10 shrink-0" />

        {/* Hire Me */}
        <button
          onClick={onHireMeClick}
          className="px-4 py-1.5 bg-gradient-to-r from-accent-primary to-[#7C3AED] hover:opacity-90 text-white font-bold text-[11px] tracking-wider uppercase rounded-full shadow-sm cursor-pointer shrink-0 transition-opacity"
        >
          Hire Me
        </button>
      </motion.nav>
    </motion.div>
  );
};

export default FloatingNav;
