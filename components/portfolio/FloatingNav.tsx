'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  Menu, 
  X, 
  User, 
  Cpu, 
  Briefcase, 
  Layers, 
  Award, 
  FileText, 
  Activity, 
  Code2, 
  Mail, 
  ArrowRight, 
  Download, 
  Sparkles, 
  ChevronRight 
} from 'lucide-react';

export interface FloatingNavProps {
  initials?: string;
  logoUrl?: string;
  onHireMeClick: () => void;
  panelOpen?: boolean;
}

export const FloatingNav = ({ initials = 'JD', logoUrl, onHireMeClick, panelOpen = false }: FloatingNavProps) => {
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Desktop nav links (kept unchanged)
  const navLinks = [
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Contact' },
    { id: 'github', label: 'Contributions' },
    { id: 'leetcode', label: 'DSA' },
  ] as const;

  // Complete mobile drawer tabs with icons & subtitles
  const mobileNavLinks = [
    { id: 'about', label: 'About', subtitle: 'Background & Bio', icon: User },
    { id: 'skills', label: 'Skills', subtitle: 'Tech Stack & Domains', icon: Cpu },
    { id: 'experience', label: 'Experience', subtitle: 'Career & Milestones', icon: Briefcase },
    { id: 'projects', label: 'Projects', subtitle: 'System Deployments', icon: Layers },
    { id: 'certificates', label: 'Credentials', subtitle: 'Certs & Hackathons', icon: Award },
    { id: 'resume-section', label: 'Resume', subtitle: 'CV & Qualifications', icon: FileText },
    { id: 'github', label: 'Contributions', subtitle: 'GitHub Activity', icon: Activity },
    { id: 'leetcode', label: 'DSA', subtitle: 'LeetCode Problem Solving', icon: Code2 },
    { id: 'contact', label: 'Contact', subtitle: 'Get In Touch', icon: Mail },
  ];

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

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
    const allIds = ['about', 'skills', 'experience', 'projects', 'certificates', 'resume-section', 'github', 'leetcode', 'contact'];
    allIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleLinkClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  const handleResumeScroll = () => {
    const el = document.getElementById('resume-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* ============================================================ */}
      {/* MOBILE NAVIGATION BAR (md:hidden)                             */}
      {/* ============================================================ */}
      <div className="md:hidden fixed top-3 inset-x-3 z-[100] pointer-events-none">
        <header
          className={cn(
            "pointer-events-auto flex items-center justify-between px-3.5 py-2.5 rounded-full border transition-all duration-300",
            isScrolled
              ? "bg-[rgba(0,13,26,0.92)] backdrop-blur-[24px] border-[rgba(0,229,255,0.3)] shadow-[0_4px_24px_rgba(0,229,255,0.15)]"
              : "bg-[rgba(0,13,26,0.75)] backdrop-blur-[16px] border-[rgba(0,229,255,0.2)] shadow-[0_2px_18px_rgba(0,0,0,0.6)]"
          )}
        >
          {/* Left: Hamburger Drawer Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-[rgba(0,229,255,0.08)] hover:bg-[rgba(0,229,255,0.18)] active:scale-95 border border-[rgba(0,229,255,0.3)] text-[#00e5ff] transition-all cursor-pointer"
            aria-label="Open Navigation Sidebar"
          >
            <Menu className="w-4 h-4" />
            <span className="text-[10px] font-bold font-mono uppercase tracking-wider pr-0.5">Menu</span>
          </button>

          {/* Center: Logo / Avatar (Scroll to Top) */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 cursor-pointer active:scale-95 transition-transform"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-r from-[#00b4d8] to-[#00e5ff] text-[#000d1a] flex items-center justify-center text-xs font-black font-display shadow-[0_0_12px_rgba(0,229,255,0.6)] overflow-hidden">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                initials
              )}
            </div>
            <span className="font-display font-bold text-xs text-[#e0f7fa] tracking-wide">
              Krishna <span className="text-[#00e5ff]">Tiwari</span>
            </span>
          </button>

          {/* Right: Quick Hire Me Button */}
          <button
            onClick={onHireMeClick}
            className="btn-cyber px-3 py-1.5 rounded-full text-[10px] uppercase font-bold tracking-wider shrink-0 active:scale-95 transition-all shadow-[0_0_12px_rgba(0,229,255,0.3)]"
          >
            Hire Me
          </button>
        </header>
      </div>

      {/* ============================================================ */}
      {/* MOBILE SIDEBAR DRAWER (Scrollable from left side)            */}
      {/* ============================================================ */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-[150] flex">
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Slide-out Sidebar Panel from Left */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="relative w-[85vw] max-w-[320px] h-full bg-[#000d1a] border-r border-[rgba(0,229,255,0.3)] shadow-[0_0_50px_rgba(0,229,255,0.25)] flex flex-col z-10 overflow-hidden"
            >
              {/* Corner Cyber Accents */}
              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#00e5ff]/50 pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#00e5ff]/50 pointer-events-none" />

              {/* Sidebar Header */}
              <div className="p-4 border-b border-[rgba(0,229,255,0.18)] bg-gradient-to-b from-[#001f3f]/50 to-transparent flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-r from-[#00b4d8] to-[#00e5ff] p-0.5 shadow-[0_0_15px_rgba(0,229,255,0.5)]">
                    <div className="w-full h-full rounded-full bg-[#000d1a] overflow-hidden flex items-center justify-center">
                      {logoUrl ? (
                        <img src={logoUrl} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs font-black text-[#00e5ff]">{initials}</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#e0f7fa] font-display leading-tight flex items-center gap-1.5">
                      Krishna Tiwari
                      <Sparkles className="w-3 h-3 text-[#00e5ff]" />
                    </h3>
                    <p className="text-[10px] font-mono text-[#00b4d8] uppercase tracking-wider">AI-ML Engineer</p>
                  </div>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg bg-[rgba(0,229,255,0.08)] hover:bg-[rgba(255,0,60,0.15)] text-[#00e5ff] hover:text-[#ff003c] border border-[rgba(0,229,255,0.25)] hover:border-[#ff003c] transition-all cursor-pointer active:scale-90"
                  aria-label="Close Navigation Sidebar"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Sidebar Navigation Items (Smooth Scrollable Area) */}
              <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 scrollbar-thin scrollbar-thumb-[#00e5ff]/20 scrollbar-track-transparent">
                <div className="px-3 pb-2 text-[9px] font-bold font-mono uppercase tracking-widest text-[#00b4d8]/70 flex items-center justify-between">
                  <span>Navigation Tabs</span>
                  <span>[09]</span>
                </div>

                {mobileNavLinks.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleLinkClick(item.id)}
                      className={cn(
                        "w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 text-left group cursor-pointer relative overflow-hidden",
                        isActive
                          ? "bg-gradient-to-r from-[rgba(0,229,255,0.15)] to-transparent border border-[rgba(0,229,255,0.4)] shadow-[inset_0_0_15px_rgba(0,229,255,0.1)]"
                          : "border border-transparent hover:border-[rgba(0,229,255,0.15)] hover:bg-[rgba(0,229,255,0.04)]"
                      )}
                    >
                      {/* Active Left Neon Glow Bar */}
                      {isActive && (
                        <motion.div
                          layoutId="mobileActiveIndicator"
                          className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-[#00e5ff] shadow-[0_0_10px_#00e5ff]"
                        />
                      )}

                      <div className="flex items-center gap-3 relative z-10">
                        <div
                          className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                            isActive
                              ? "bg-[#00e5ff] text-[#000d1a] shadow-[0_0_12px_rgba(0,229,255,0.6)]"
                              : "bg-[rgba(0,229,255,0.06)] text-[#80deea] group-hover:text-[#00e5ff] group-hover:bg-[rgba(0,229,255,0.12)]"
                          )}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p
                            className={cn(
                              "text-xs font-bold font-display leading-none tracking-wide",
                              isActive ? "text-[#00e5ff]" : "text-[#e0f7fa] group-hover:text-[#00e5ff]"
                            )}
                          >
                            {item.label}
                          </p>
                          <p className="text-[9px] text-[#80deea]/70 mt-1 font-sans leading-none">{item.subtitle}</p>
                        </div>
                      </div>

                      <ChevronRight
                        className={cn(
                          "w-3.5 h-3.5 transition-transform",
                          isActive
                            ? "text-[#00e5ff] translate-x-0"
                            : "text-[#80deea]/40 -translate-x-1 group-hover:translate-x-0 group-hover:text-[#00e5ff]"
                        )}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Sidebar Bottom Actions */}
              <div className="p-4 border-t border-[rgba(0,229,255,0.18)] bg-[#000d1a]/95 shrink-0 space-y-2.5">
                <button
                  onClick={() => {
                    onHireMeClick();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full btn-cyber py-2.5 rounded-xl text-xs uppercase font-bold tracking-wider flex items-center justify-center gap-2 active:scale-98 shadow-[0_0_15px_rgba(0,229,255,0.3)]"
                >
                  <span>Let&apos;s Talk</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={handleResumeScroll}
                  className="w-full py-2.5 rounded-xl border border-[rgba(0,229,255,0.35)] text-[#00e5ff] hover:bg-[rgba(0,229,255,0.1)] text-xs uppercase font-bold tracking-wider flex items-center justify-center gap-2 transition-all active:scale-98"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Resume</span>
                </button>

                <div className="pt-2 text-center">
                  <p className="text-[9px] font-mono text-[#80deea]/50 tracking-widest uppercase">
                    &copy; Krishna Tiwari &bull; 2026
                  </p>
                </div>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================ */}
      {/* DESKTOP NAVIGATION BAR (md:flex - UNCHANGED)                 */}
      {/* ============================================================ */}
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
    </>
  );
};

export default FloatingNav;
