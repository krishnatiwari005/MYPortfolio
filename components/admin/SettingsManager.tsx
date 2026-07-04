// @ts-nocheck
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { supabase } from '@/lib/supabase/client';
import { Settings } from '@/types';
import toast from '@/components/ui/toast';
import Input, { Textarea } from '../ui/input';
import Select from '../ui/select';
import Toggle from '../ui/toggle';
import Button from '../ui/button';
import ConfirmDialog from '../ui/confirm-dialog';
import Skeleton from '../ui/skeleton';
import { Download, Upload, AlertTriangle, RefreshCw } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

export const SettingsManager = () => {
  const queryClient = useQueryClient();
  const [importConfirmOpen, setImportConfirmOpen] = useState(false);
  const [importData, setImportData] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch settings record
  const { data: settings, isLoading } = useQuery<Settings | null>({
    queryKey: ['admin-settings'],
    queryFn: async () => {
      const { data, error } = await supabase.from('settings').select('*').eq('id', true).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const { register, handleSubmit, setValue, watch, reset } = useForm<Partial<Settings>>({
    defaultValues: {
      accent_color: '#4F46E5',
      animation_intensity: 'normal',
      portfolio_visible: true,
      available_for_work: true,
      show_availability_badge: true,
      maintenance_mode: false,
      maintenance_message: 'Under maintenance. Check back soon.',
    },
  });

  useEffect(() => {
    if (settings) {
      reset(settings);
    }
  }, [settings, reset]);

  const watchAccentColor = watch('accent_color');
  const watchMaintenance = watch('maintenance_mode') ?? false;
  const watchVisible = watch('portfolio_visible') ?? true;
  const watchAvailable = watch('available_for_work') ?? true;
  const watchShowBadge = watch('show_availability_badge') ?? true;

  // Real-time CSS Variable update on change
  useEffect(() => {
    if (watchAccentColor) {
      document.documentElement.style.setProperty('--color-accent-primary', watchAccentColor);
    }
  }, [watchAccentColor]);

  // Mutations
  const saveMutation = useMutation({
    mutationFn: async (formData: Partial<Settings>) => {
      const { error: upsertError } = await supabase.from('settings').upsert({
        id: true,
        ...formData,
        last_updated_at: new Date().toISOString(),
      });
      if (upsertError) throw upsertError;

      // Log activity
      await supabase.from('activity_log').insert({
        entity_type: 'settings',
        entity_id: 'true',
        action: 'UPDATE',
        description: `Updated global settings: Visible=${formData.portfolio_visible}, Accent=${formData.accent_color}`,
      });

      // Call revalidation path API
      await fetch('/api/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paths: ['/'] }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
      toast.success('Global settings updated successfully');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to update settings');
    },
  });

  // Export all DB tables to single JSON
  const handleExport = async () => {
    const loader = toast.info('Exporting data...');
    try {
      const [hero, about, skills, experience, projects, certificates, resume, seo_settings, settings_tbl] = await Promise.all([
        supabase.from('hero').select('*'),
        supabase.from('about').select('*'),
        supabase.from('skills').select('*'),
        supabase.from('experience').select('*'),
        supabase.from('projects').select('*'),
        supabase.from('certificates').select('*'),
        supabase.from('resume').select('*'),
        supabase.from('seo_settings').select('*'),
        supabase.from('settings').select('*'),
      ]);

      const dataPackage = {
        exported_at: new Date().toISOString(),
        hero: hero.data?.[0] || null,
        about: about.data?.[0] || null,
        skills: skills.data ?? [],
        experience: experience.data ?? [],
        projects: projects.data ?? [],
        certificates: certificates.data ?? [],
        resume: resume.data?.[0] || null,
        seo_settings: seo_settings.data?.[0] || null,
        settings: settings_tbl.data?.[0] || null,
      };

      const blob = new Blob([JSON.stringify(dataPackage, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `portfolio-backup-${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success('Backup export completed');
    } catch (err) {
      console.error(err);
      toast.error('Failed to export backup');
    }
  };

  // Import Handler
  const handleImportSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (!parsed.hero || !parsed.settings) {
          toast.error('Invalid backup file format');
          return;
        }
        setImportData(parsed);
        setImportConfirmOpen(true);
      } catch (err) {
        toast.error('Failed to read JSON backup file');
      }
    };
    reader.readAsText(file);
  };

  const importMutation = useMutation({
    mutationFn: async () => {
      if (!importData) return;

      const deleteAndInsert = async (table: string, data: any) => {
        if (!data) return;
        await supabase.from(table).delete().neq('id', 'xxxxxxx' as any); // wipe
        const arrayData = Array.isArray(data) ? data : [data];
        if (arrayData.length > 0) {
          const { error } = await supabase.from(table).insert(arrayData);
          if (error) throw error;
        }
      };

      // Sequentially clear and write tables
      await deleteAndInsert('hero', importData.hero);
      await deleteAndInsert('about', importData.about);
      await deleteAndInsert('skills', importData.skills);
      await deleteAndInsert('experience', importData.experience);
      await deleteAndInsert('projects', importData.projects);
      await deleteAndInsert('certificates', importData.certificates);
      await deleteAndInsert('resume', importData.resume);
      await deleteAndInsert('seo_settings', importData.seo_settings);
      await deleteAndInsert('settings', importData.settings);

      // Log import activity
      await supabase.from('activity_log').insert({
        entity_type: 'settings',
        entity_id: 'true',
        action: 'RESTORE',
        description: `Imported full database restore package`,
      });

      // Call revalidate Path
      await fetch('/api/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paths: ['/'] }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      toast.success('Database restore completed successfully');
      setImportConfirmOpen(false);
      setImportData(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    },
    onError: (err: any) => {
      toast.error(err.message || 'Import failed');
    },
  });

  if (isLoading) {
    return <div className="space-y-6 animate-pulse"><Skeleton className="h-40 w-full" /></div>;
  }

  return (
    <div className="space-y-6">
      <form id="admin-active-form" onSubmit={handleSubmit((data) => saveMutation.mutate(data))} className="space-y-6">
        <div>
          <h2 className="text-xl font-bold font-display text-text-primary">System Settings</h2>
          <p className="text-xs text-text-tertiary">Configure theme colors, visibility and backup tools</p>
        </div>

        {/* Accent Color picker */}
        <div className="space-y-2 p-4 bg-white border border-border-default rounded-2xl shadow-sm">
          <label className="text-xs font-semibold text-text-primary block">Accent Highlight Color</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              {...register('accent_color')}
              className="w-12 h-10 border-0 rounded-lg cursor-pointer bg-transparent"
            />
            <Input
              type="text"
              {...register('accent_color')}
              placeholder="#4F46E5"
              className="font-mono text-xs max-w-[120px]"
            />
            <div className="text-[11px] text-text-tertiary">Preview matches brand elements</div>
          </div>
        </div>

        {/* Toggles */}
        <div className="space-y-3 p-4 bg-white border border-border-default rounded-2xl shadow-sm">
          <div className="flex items-center justify-between py-1.5">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-text-primary">Portfolio Visbility</span>
              <p className="text-[11px] text-text-tertiary">Make public page active</p>
            </div>
            <Toggle checked={watchVisible} onChange={(v) => setValue('portfolio_visible', v)} />
          </div>

          <div className="flex items-center justify-between py-1.5 border-t border-border-subtle">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-text-primary">Available for Hire</span>
              <p className="text-[11px] text-text-tertiary">Promote hiring triggers</p>
            </div>
            <Toggle checked={watchAvailable} onChange={(v) => setValue('available_for_work', v)} />
          </div>

          <div className="flex items-center justify-between py-1.5 border-t border-border-subtle">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-text-primary">Show Availability Badge</span>
              <p className="text-[11px] text-text-tertiary">Pulse indicator in cards</p>
            </div>
            <Toggle checked={watchShowBadge} onChange={(v) => setValue('show_availability_badge', v)} />
          </div>

          <div className="flex items-center justify-between py-1.5 border-t border-border-subtle">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-text-primary text-error">Maintenance Mode</span>
              <p className="text-[11px] text-text-tertiary">Swap site to maintenance card</p>
            </div>
            <Toggle checked={watchMaintenance} onChange={(v) => setValue('maintenance_mode', v)} />
          </div>

          {watchMaintenance && (
            <div className="space-y-1 mt-3 animate-enter">
              <label className="text-[11px] font-semibold text-text-tertiary">Maintenance Card Message</label>
              <Textarea {...register('maintenance_message')} />
            </div>
          )}
        </div>

        {/* Animation speeds */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-text-secondary">Animation Speeds</label>
          <Select {...register('animation_intensity')}>
            <option value="none">None (Reduced Motion)</option>
            <option value="slow">Slow Drift Transitions</option>
            <option value="normal">Spring Micro-Animations (Recommended)</option>
          </Select>
        </div>

        <div className="pt-2 flex items-center justify-end border-b border-border-subtle pb-4">
          <Button type="submit" disabled={saveMutation.isPending} className="w-full justify-center">
            {saveMutation.isPending ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </form>

      {/* JSON Import/Export Backup Utilities */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold font-display text-text-primary">Backup & Restore</h3>
        <p className="text-xs text-text-tertiary leading-relaxed">
          Export all database data to a backup JSON file or import a previous state.
        </p>

        <div className="flex gap-2">
          <Button variant="secondary" size="sm" className="flex items-center gap-1.5" onClick={handleExport}>
            <Download className="w-4 h-4" /> Export Backup
          </Button>
          <label className="inline-flex items-center justify-center font-medium rounded-xl transition-colors cursor-pointer bg-white text-text-primary border border-border-default text-xs py-2 px-3 hover:bg-bg-primary shadow-sm gap-1.5">
            <Upload className="w-4 h-4" /> Import Restore
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              className="hidden"
              onChange={handleImportSelect}
            />
          </label>
        </div>
      </div>

      <ConfirmDialog
        isOpen={importConfirmOpen}
        onClose={() => setImportConfirmOpen(false)}
        onConfirm={() => importMutation.mutate()}
        title="Import Full Restore Backup"
        description="WARNING: This will overwrite ALL existing records and skills, projects, settings inside your portfolio database. This process cannot be undone."
      />
    </div>
  );
};

export default SettingsManager;
