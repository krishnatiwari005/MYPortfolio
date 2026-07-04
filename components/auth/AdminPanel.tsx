'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, ChevronRight, LogOut, GripVertical } from 'lucide-react';
import { AdminSection } from '@/types';
import AdminNav from './AdminNav';

// Manager Imports
import DashboardManager from '../admin/DashboardManager';
import HeroManager from '../admin/HeroManager';
import AboutManager from '../admin/AboutManager';
import SkillsManager from '../admin/SkillsManager';
import ExperienceManager from '../admin/ExperienceManager';
import ProjectsManager from '../admin/ProjectsManager';
import CertificatesManager from '../admin/CertificatesManager';
import ResumeManager from '../admin/ResumeManager';
import SeoManager from '../admin/SeoManager';
import SettingsManager from '../admin/SettingsManager';

import Button from '../ui/button';

const MIN_WIDTH = 360;
const MAX_WIDTH = 900;
const DEFAULT_WIDTH = 480;

export interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export const AdminPanel = ({ isOpen, onClose, onLogout }: AdminPanelProps) => {
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');
  const [showSignoutConfirm, setShowSignoutConfirm] = useState(false);
  const [panelWidth, setPanelWidth] = useState(DEFAULT_WIDTH);
  const [isResizing, setIsResizing] = useState(false);
  const [isHoveringHandle, setIsHoveringHandle] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardManager onNavigate={(sec) => setActiveSection(sec)} />;
      case 'hero':
        return <HeroManager />;
      case 'about':
        return <AboutManager />;
      case 'skills':
        return <SkillsManager />;
      case 'experience':
        return <ExperienceManager />;
      case 'projects':
        return <ProjectsManager />;
      case 'certificates':
        return <CertificatesManager />;
      case 'resume':
        return <ResumeManager />;
      case 'seo':
        return <SeoManager />;
      case 'settings':
        return <SettingsManager />;
    }
  };

  const hasStickySave = ['hero', 'about', 'seo', 'settings'].includes(activeSection);

  // --- Resize Logic ---
  const startResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);

    const startX = e.clientX;
    const startWidth = panelWidth;

    const onMouseMove = (moveEvent: MouseEvent) => {
      // Panel is on the right side, so dragging left = wider, dragging right = narrower
      const delta = startX - moveEvent.clientX;
      const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, startWidth + delta));
      setPanelWidth(newWidth);
    };

    const onMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, [panelWidth]);

  // Reset width when panel closes
  useEffect(() => {
    if (!isOpen) {
      setPanelWidth(DEFAULT_WIDTH);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={panelRef}
          initial={{ x: DEFAULT_WIDTH }}
          animate={{ x: 0 }}
          exit={{ x: panelWidth }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          style={{ width: panelWidth }}
          className="fixed top-0 right-0 h-screen bg-white border-l border-border-subtle shadow-2xl z-[200] flex flex-col"
        >
          {/* Drag Resize Handle — left edge */}
          <div
            onMouseDown={startResize}
            onMouseEnter={() => setIsHoveringHandle(true)}
            onMouseLeave={() => setIsHoveringHandle(false)}
            className="absolute left-0 top-0 bottom-0 w-3 z-30 flex items-center justify-center group"
            style={{ cursor: 'col-resize' }}
            title="Drag to resize panel"
          >
            {/* Visual indicator strip */}
            <div
              className="h-full w-[3px] transition-all duration-150 rounded-full"
              style={{
                background: isResizing
                  ? 'var(--color-accent-primary, #4F46E5)'
                  : isHoveringHandle
                  ? 'rgba(99,102,241,0.45)'
                  : 'transparent',
              }}
            />
            {/* Grip dots shown on hover */}
            {(isHoveringHandle || isResizing) && (
              <div className="absolute inset-y-0 left-0 flex items-center justify-center pointer-events-none">
                <GripVertical
                  className="w-3 h-5 text-accent-primary opacity-80"
                  style={{ strokeWidth: 2.5 }}
                />
              </div>
            )}
          </div>

          {/* Drawer Header */}
          <div className="h-14 border-b border-border-subtle flex items-center justify-between px-4 shrink-0 bg-bg-secondary pl-5">
            <div className="flex items-center gap-2 text-text-primary">
              <Settings className="w-4 h-4 text-accent-primary animate-spin-[20s]" />
              <span className="text-sm font-bold font-display">Portfolio CMS</span>
              {/* Width badge while resizing */}
              {isResizing && (
                <span className="text-[10px] font-mono bg-accent-light text-accent-primary px-1.5 py-0.5 rounded-md">
                  {panelWidth}px
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              {showSignoutConfirm ? (
                <div className="flex items-center gap-1.5 animate-enter">
                  <span className="text-[10px] font-bold text-text-tertiary">Sign out?</span>
                  <button
                    onClick={() => setShowSignoutConfirm(false)}
                    className="text-[10px] font-bold text-text-secondary px-2 py-1 hover:bg-border-subtle rounded cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={onLogout}
                    className="text-[10px] font-bold text-error px-2 py-1 hover:bg-error/10 rounded cursor-pointer"
                  >
                    Yes
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setShowSignoutConfirm(true)}
                    className="p-2 text-text-tertiary hover:text-error hover:bg-error/10 rounded-full cursor-pointer transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                  <button
                    onClick={onClose}
                    className="p-2 text-text-tertiary hover:text-text-primary hover:bg-border-subtle rounded-full cursor-pointer transition-colors"
                    title="Collapse Panel"
                  >
                    <ChevronRight className="w-4.5 h-4.5" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Core Panel Split Layout */}
          <div className="flex-1 flex overflow-hidden min-h-0">
            {/* Sidebar Left Nav (Internal Scroll) */}
            <div className="w-48 border-r border-border-subtle overflow-y-auto shrink-0 bg-bg-secondary hidden md:block">
              <AdminNav activeSection={activeSection} onSelectSection={setActiveSection} />
            </div>

            {/* Main scrollable editor view */}
            <div className="flex-1 overflow-y-auto p-5 pb-20 relative bg-bg-primary">
              {/* Mobile back option to view navbar list */}
              <div className="md:hidden mb-4">
                <select
                  value={activeSection}
                  onChange={(e) => setActiveSection(e.target.value as AdminSection)}
                  className="w-full text-xs font-semibold h-9 px-3 border border-border-default rounded-xl bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/40"
                >
                  <option value="dashboard">Dashboard</option>
                  <option value="hero">Hero Section</option>
                  <option value="about">About Details</option>
                  <option value="skills">Skills Manager</option>
                  <option value="experience">Experience Manager</option>
                  <option value="projects">Projects Portfolio</option>
                  <option value="certificates">Certificates</option>
                  <option value="resume">Resume PDF</option>
                  <option value="seo">SEO Meta Settings</option>
                  <option value="settings">Global Settings</option>
                </select>
              </div>

              {renderContent()}
            </div>
          </div>

          {/* Sticky save bar when editor forms are active */}
          {hasStickySave && (
            <div className="absolute bottom-0 left-0 right-0 py-3.5 px-5 bg-white border-t border-border-subtle flex items-center justify-center shadow-lg z-20">
              <Button
                type="submit"
                form="admin-active-form"
                className="w-full justify-center text-xs font-bold"
              >
                Save Changes
              </Button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AdminPanel;
