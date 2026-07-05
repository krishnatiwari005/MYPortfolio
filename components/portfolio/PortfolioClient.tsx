'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminAuth } from '@/hooks/useAdminAuth';

// Components
import FloatingNav from './FloatingNav';
import HeroSection from './Hero';
import AboutSection from './About';
import SkillsSection from './Skills';
import ExperienceSection from './Experience';
import ProjectsSection from './Projects';
import CertificatesSection from './Certificates';
import ResumeSection from './ResumeSection';
import ContactSection from './Contact';
import Footer from './Footer';

// Admin / Auth Portals
import LockButton from '../auth/LockButton';
import OtpModal from '../auth/OtpModal';
import AdminPanel from '../auth/AdminPanel';

import { Hero, About, Skill, Experience, Project, Certificate, Resume, Settings } from '@/types';

export interface PortfolioClientProps {
  hero: Hero | null;
  about: About | null;
  skills: Skill[];
  experience: Experience[];
  projects: Project[];
  certificates: Certificate[];
  resume: Resume | null;
  settings: Settings | null;
}

export default function PortfolioClient({
  hero,
  about,
  skills,
  experience,
  projects,
  certificates,
  resume,
  settings,
}: PortfolioClientProps) {
  const { isAdmin, loading, logout } = useAdminAuth();
  const [panelOpen, setPanelOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  // Close the admin panel immediately if the user loses auth (e.g. session expires)
  useEffect(() => {
    if (!isAdmin && panelOpen) {
      setPanelOpen(false);
    }
  }, [isAdmin]);

  // Mouse Follow Glow Effect Listener
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleHireMeClick = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleResumeClick = () => {
    document.getElementById('resume-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const initials = hero?.name
    ? hero.name.split(' ').map((n) => n[0]).join('')
    : 'JD';

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--gradient-hero)]">
      {/* Drifting Background Decorative Orbs */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] rounded-full orb-indigo z-0 pointer-events-none translate-x-1/3 -translate-y-1/3" />
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] rounded-full orb-purple z-0 pointer-events-none -translate-x-1/3 translate-y-1/3" />
      <div className="fixed top-1/2 right-0 w-[300px] h-[300px] rounded-full orb-emerald z-0 pointer-events-none translate-x-1/2 -translate-y-1/2" />

      {/* Floating Navigation Header */}
      <FloatingNav initials={initials} logoUrl="/logo.png" onHireMeClick={handleHireMeClick} />

      {/* Main Content Area: dynamically scales down width on desktop when panel is open */}
      <motion.div
        layout
        animate={{
          width: panelOpen ? 'calc(100% - 480px)' : '100%',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 35 }}
        className="relative min-h-screen z-10 flex flex-col items-stretch"
      >
        <HeroSection data={hero} onContactClick={handleHireMeClick} onResumeClick={handleResumeClick} />
        <AboutSection data={about} />
        <SkillsSection skills={skills} />
        <ExperienceSection experiences={experience} />
        <ProjectsSection projects={projects} />
        <CertificatesSection certificates={certificates} />
        <ResumeSection data={resume} />
        <ContactSection data={hero} />
        <Footer hero={hero} settings={settings} />
      </motion.div>

      {/* Admin Control Widgets — hidden while auth is being checked */}
      {!loading && (
        <LockButton
          isAdmin={isAdmin}
          panelOpen={panelOpen}
          onTogglePanel={() => {
            // Only allow opening the panel if actually authenticated
            if (isAdmin) {
              setPanelOpen((prev) => !prev);
            } else {
              setLoginOpen(true);
            }
          }}
          onOpenLogin={() => setLoginOpen(true)}
        />
      )}

      <OtpModal
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSuccess={() => {
          setLoginOpen(false);
          setPanelOpen(true);
        }}
      />

      {/* Admin Panel — only renders when authenticated */}
      {isAdmin && (
        <AdminPanel
          isOpen={panelOpen}
          onClose={() => setPanelOpen(false)}
          onLogout={() => {
            logout();
            setPanelOpen(false);
          }}
        />
      )}
    </div>
  );
}
