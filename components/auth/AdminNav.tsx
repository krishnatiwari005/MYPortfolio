'use client';

import {
  LayoutDashboard,
  User,
  FileText,
  Zap,
  Briefcase,
  FolderOpen,
  Award,
  FileUp,
  Search,
  Settings2,
} from 'lucide-react';
import { AdminSection } from '@/types';
import { cn } from '@/lib/utils';

export interface AdminNavProps {
  activeSection: AdminSection;
  onSelectSection: (section: AdminSection) => void;
}

export const AdminNav = ({ activeSection, onSelectSection }: AdminNavProps) => {
  const items = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'hero', label: 'Hero', icon: User },
    { id: 'about', label: 'About', icon: FileText },
    { id: 'skills', label: 'Skills', icon: Zap },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'projects', label: 'Projects', icon: FolderOpen },
    { id: 'certificates', label: 'Certificates', icon: Award },
    { id: 'resume', label: 'Resume', icon: FileUp },
    { id: 'seo', label: 'SEO Settings', icon: Search },
    { id: 'settings', label: 'Settings', icon: Settings2 },
  ] as const;

  return (
    <nav className="flex flex-col gap-1.5 p-4">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeSection === item.id;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelectSection(item.id)}
            className={cn(
              'flex items-center gap-3 w-full py-2.5 px-4 rounded-xl text-left text-sm font-medium transition-all cursor-pointer focus:outline-none focus:bg-accent-light',
              isActive
                ? 'bg-accent-light text-accent-primary border-l-4 border-accent-primary pl-3'
                : 'text-text-secondary hover:bg-bg-primary hover:text-text-primary'
            )}
          >
            <Icon className="w-4 h-4 shrink-0" />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default AdminNav;
