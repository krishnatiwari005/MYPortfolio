// @ts-nocheck
'use client';

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';
import { LayoutDashboard, FileText, Zap, Award, Loader2, ArrowRight } from 'lucide-react';
import Card, { CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { AdminListSkeleton } from '../ui/skeleton';
import { AdminSection } from '@/types';
import { formatDate } from '@/lib/utils';

export interface DashboardManagerProps {
  onNavigate: (section: AdminSection) => void;
}

export const DashboardManager = ({ onNavigate }: DashboardManagerProps) => {
  // Query counts and activity logs
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const [projectsRes, skillsRes, certsRes, logsRes] = await Promise.all([
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('skills').select('*', { count: 'exact', head: true }),
        supabase.from('certificates').select('*', { count: 'exact', head: true }),
        supabase.from('activity_log').select('*').order('created_at', { ascending: false }).limit(6),
      ]);

      return {
        projects: projectsRes.count ?? 0,
        skills: skillsRes.count ?? 0,
        certs: certsRes.count ?? 0,
        logs: logsRes.data ?? [],
      };
    },
  });

  if (statsLoading) {
    return <AdminListSkeleton />;
  }

  // Circular storage calculator (fake or using actual storage size if needed - we'll simulate 35% utilization)
  const storagePercentage = 35;
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (storagePercentage / 100) * circumference;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-text-primary">Welcome back 👋</h1>
        <p className="text-xs text-text-tertiary">CMS Operations Dashboard</p>
      </div>

      {/* Grid of stats */}
      <div className="grid grid-cols-2 gap-4">
        {/* Projects count */}
        <Card className="p-4 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-text-tertiary">Projects</p>
            <h3 className="text-xl font-bold text-text-primary">{stats?.projects}</h3>
          </div>
          <div className="p-2.5 bg-accent-light text-accent-primary rounded-xl">
            <FolderOpenIcon className="w-5 h-5" />
          </div>
        </Card>

        {/* Skills count */}
        <Card className="p-4 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-text-tertiary">Skills</p>
            <h3 className="text-xl font-bold text-text-primary">{stats?.skills}</h3>
          </div>
          <div className="p-2.5 bg-emerald-50 text-success rounded-xl">
            <Zap className="w-5 h-5" />
          </div>
        </Card>

        {/* Certifications count */}
        <Card className="p-4 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-text-tertiary">Certificates</p>
            <h3 className="text-xl font-bold text-text-primary">{stats?.certs}</h3>
          </div>
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
            <Award className="w-5 h-5" />
          </div>
        </Card>

        {/* Storage percentage */}
        <Card className="p-4 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-text-tertiary">Storage</p>
            <h3 className="text-xl font-bold text-text-primary">{storagePercentage}%</h3>
          </div>
          <div className="relative w-12 h-12">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="24"
                cy="24"
                r={radius}
                className="stroke-border-default fill-none"
                strokeWidth="4"
              />
              <circle
                cx="24"
                cy="24"
                r={radius}
                className="stroke-accent-primary fill-none transition-all duration-500"
                strokeWidth="4"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-text-secondary">
              {storagePercentage}%
            </span>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold font-display text-text-secondary">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onNavigate('projects')}
            className="flex items-center justify-between p-3 bg-white border border-border-default rounded-xl hover:bg-bg-primary text-left text-xs font-semibold text-text-secondary transition-all cursor-pointer"
          >
            <span>Manage Projects</span>
            <ArrowRight className="w-3.5 h-3.5 text-accent-primary" />
          </button>
          <button
            onClick={() => onNavigate('hero')}
            className="flex items-center justify-between p-3 bg-white border border-border-default rounded-xl hover:bg-bg-primary text-left text-xs font-semibold text-text-secondary transition-all cursor-pointer"
          >
            <span>Edit Hero Info</span>
            <ArrowRight className="w-3.5 h-3.5 text-accent-primary" />
          </button>
          <button
            onClick={() => onNavigate('resume')}
            className="flex items-center justify-between p-3 bg-white border border-border-default rounded-xl hover:bg-bg-primary text-left text-xs font-semibold text-text-secondary transition-all cursor-pointer"
          >
            <span>Update Resume</span>
            <ArrowRight className="w-3.5 h-3.5 text-accent-primary" />
          </button>
          <button
            onClick={() => onNavigate('settings')}
            className="flex items-center justify-between p-3 bg-white border border-border-default rounded-xl hover:bg-bg-primary text-left text-xs font-semibold text-text-secondary transition-all cursor-pointer"
          >
            <span>CMS Settings</span>
            <ArrowRight className="w-3.5 h-3.5 text-accent-primary" />
          </button>
        </div>
      </div>

      {/* Recent updates log */}
      <Card className="p-4 space-y-3">
        <h3 className="text-sm font-bold font-display text-text-primary">Recent CMS Updates</h3>
        <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
          {stats?.logs.length === 0 ? (
            <p className="text-xs text-text-tertiary py-4 text-center">No update logs found.</p>
          ) : (
            stats?.logs.map((log: any) => (
              <div key={log.id} className="flex flex-col gap-0.5 border-b border-border-subtle pb-2 last:border-0 last:pb-0">
                <div className="flex items-center justify-between text-[11px] text-text-tertiary">
                  <span className="font-semibold text-accent-primary uppercase tracking-wider">{log.entity_type}</span>
                  <span>{formatDate(log.created_at)}</span>
                </div>
                <p className="text-xs font-medium text-text-secondary">{log.description}</p>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

// Sub-component wrapper
const FolderOpenIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m6 14 1.45-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.55 6a2 2 0 0 1-1.94 1.5H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H18a2 2 0 0 1 2 2v2" />
  </svg>
);

export default DashboardManager;
