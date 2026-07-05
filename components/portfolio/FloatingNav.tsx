'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface FloatingNavProps {
  initials?: string;
  logoUrl?: string;
  onHireMeClick: () => void;
}

export const FloatingNav = ({ initials = 'JD', logoUrl, onHireMeClick }: FloatingNavProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const navLinks = [
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Contact' },
  ] as const;

  // Monitor scroll for transition opacity/blur and observe sections
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };

    window.addEventListener('scroll', handleScroll);

    // Intersection Observer to monitor active section
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

    // Observe each section element
    navLinks.forEach((link) => {
      const el = document.getElementById(link.id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const handleLinkClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.header
      initial={{ y: -60, x: '-50%', opacity: 0 }}
      animate={{ y: 0, x: '-50%', opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.5 }}
      className={cn(
        'fixed top-5 left-1/2 -translate-x-1/2 z-[100] w-max max-w-[90vw] flex items-center justify-between rounded-full py-2 pl-5 pr-2 gap-8 border transition-all duration-300',
        scrolled
          ? 'glass-card backdrop-blur-[40px] bg-white/85 border-border-default/50 shadow-md'
          : 'bg-transparent border-transparent shadow-none'
      )}
    >
      {/* Initials/Logo Circle */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="w-8 h-8 rounded-full bg-gradient-to-r from-accent-primary to-[#7C3AED] text-white flex items-center justify-center text-xs font-black font-display tracking-tight shadow-sm shrink-0 cursor-pointer overflow-hidden"
      >
        {logoUrl ? (
          <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
        ) : (
          initials
        )}
      </button>

      {/* Nav Link Checklist */}
      <nav className="hidden sm:flex items-center gap-6">
        {navLinks.map((link) => {
          const isActive = activeSection === link.id;

          return (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link.id)}
              className={cn(
                'text-xs font-semibold tracking-wider uppercase transition-colors relative py-1 cursor-pointer focus:outline-none',
                isActive ? 'text-accent-primary' : 'text-text-secondary hover:text-text-primary'
              )}
            >
              <span>{link.label}</span>
              {/* Bottom underline slide animation */}
              {isActive && (
                <motion.span
                  layoutId="activeNavIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-primary"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Hire Me CTA Button */}
      <button
        onClick={onHireMeClick}
        className="px-4 py-2 bg-gradient-to-r from-accent-primary to-[#7C3AED] hover:opacity-95 text-white font-bold text-xs tracking-wider uppercase rounded-full shadow-sm cursor-pointer shrink-0"
      >
        Hire Me
      </button>
    </motion.header>
  );
};

export default FloatingNav;
