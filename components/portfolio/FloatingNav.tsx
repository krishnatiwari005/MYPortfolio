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
  const [isScrolled, setIsScrolled] = useState(false);

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
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <motion.div
      className="hidden md:flex fixed top-4 z-[100] justify-center pointer-events-none"
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
        className={cn(
          "pointer-events-auto flex items-center gap-2 sm:gap-3 px-4 py-2 rounded-full border-b max-w-[95vw] transition-all duration-300",
          isScrolled 
            ? "bg-[rgba(0,13,26,0.9)] backdrop-blur-[30px] border-[rgba(0,229,255,0.2)] shadow-[0_4px_30px_rgba(0,229,255,0.1)]" 
            : "bg-[rgba(0,13,26,0.7)] backdrop-blur-[20px] border-[rgba(0,229,255,0.15)] shadow-[0_2px_24px_rgba(0,0,0,0.5)]"
        )}
      >
        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-7 h-7 rounded-full bg-gradient-to-r from-[#00b4d8] to-[#00e5ff] text-[#000d1a] flex items-center justify-center text-xs font-black font-display shadow-[0_0_15px_rgba(0,229,255,0.5)] shrink-0 cursor-pointer overflow-hidden"
        >
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
          ) : (
            initials
          )}
        </button>

        <span className="w-px h-4 bg-[rgba(0,229,255,0.2)] shrink-0" />

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
                  isActive ? 'text-[#00e5ff]' : 'text-[#80deea] hover:text-[#00e5ff]'
                )}
              >
                <span>{link.label}</span>
                {isActive && (
                  <motion.span
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-gradient-to-r from-[#00b4d8] to-[#00e5ff] shadow-[0_0_8px_rgba(0,229,255,0.8)]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        <span className="w-px h-4 bg-[rgba(0,229,255,0.2)] shrink-0" />

        {/* Hire Me */}
        <button
          onClick={onHireMeClick}
          className="btn-cyber px-4 py-1.5 rounded-full text-[11px] uppercase shrink-0 transition-all"
        >
          Hire Me
        </button>
      </motion.nav>
    </motion.div>
  );
};

export default FloatingNav;
