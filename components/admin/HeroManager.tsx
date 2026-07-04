// @ts-nocheck
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { supabase } from '@/lib/supabase/client';
import { Hero } from '@/types';
import toast from '@/components/ui/toast';
import Input from '../ui/input';
import Toggle from '../ui/toggle';
import Button from '../ui/button';
import FileUpload from '../shared/file-upload';
import Skeleton from '../ui/skeleton';
import { Globe, GitBranch, Link2, MessageCircle, Mail, Code } from 'lucide-react';
import { useEffect } from 'react';

export const HeroManager = () => {
  const queryClient = useQueryClient();

  // Fetch Hero Data
  const { data: hero, isLoading } = useQuery({
    queryKey: ['admin-hero'],
    queryFn: async () => {
      const { data, error } = await supabase.from('hero').select('*').eq('id', true).maybeSingle();
      if (error) throw error;
      return data as Hero;
    },
  });

  const { register, handleSubmit, setValue, watch, reset } = useForm<Partial<Hero>>({
    defaultValues: {
      name: '',
      role: '',
      tagline: '',
      photo_url: '',
      available: true,
      availability_label: 'Available for work',
      github_url: '',
      linkedin_url: '',
      twitter_url: '',
      email: '',
      leetcode_url: '',
      portfolio_url: '',
      stat_1_label: '',
      stat_1_value: '',
      stat_2_label: '',
      stat_2_value: '',
      stat_3_label: '',
      stat_3_value: '',
      stat_4_label: '',
      stat_4_value: '',
    },
  });

  useEffect(() => {
    if (hero) {
      reset(hero);
    }
  }, [hero, reset]);

  const watchPhoto = watch('photo_url');
  const watchAvailable = watch('available') ?? true;

  // Save changes mutation
  const saveMutation = useMutation({
    mutationFn: async (formData: Partial<Hero>) => {
      // Log activity
      const { error: upsertError } = await supabase.from('hero').upsert({
        id: true,
        ...formData,
        updated_at: new Date().toISOString(),
      });

      if (upsertError) throw upsertError;

      // Log to activity log
      await supabase.from('activity_log').insert({
        entity_type: 'hero',
        entity_id: 'true',
        action: 'UPDATE',
        description: `Updated Hero settings for ${formData.name}`,
      });

      // Call revalidation path API
      await fetch('/api/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paths: ['/'] }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-hero'] });
      toast.success('Hero settings updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update hero settings');
    },
  });

  if (isLoading) {
    return <div className="space-y-6 animate-pulse"><Skeleton className="h-40 w-full" /><Skeleton className="h-10 w-full" /></div>;
  }

  return (
    <form id="admin-active-form" onSubmit={handleSubmit((data) => saveMutation.mutate(data))} className="space-y-6">
      <div>
        <h2 className="text-xl font-bold font-display text-text-primary">Hero Section Manager</h2>
        <p className="text-xs text-text-tertiary">Edit main hero info and stats grid</p>
      </div>

      {/* Photo Upload Zone */}
      <div className="flex flex-col items-center justify-center p-4 bg-bg-primary rounded-2xl border border-border-subtle">
        <span className="text-xs font-semibold text-text-secondary mb-3">Profile Photo</span>
        <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-accent-primary shadow-sm mb-4 relative bg-white flex items-center justify-center">
          {watchPhoto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={watchPhoto} alt="Hero avatar" className="w-full h-full object-cover" />
          ) : (
            <Globe className="w-12 h-12 text-text-tertiary" />
          )}
        </div>
        <div className="w-full max-w-[280px]">
          <FileUpload
            folder="hero"
            accept="image/*"
            value={watchPhoto}
            onUploadComplete={(url) => setValue('photo_url', url, { shouldDirty: true })}
          />
        </div>
      </div>

      {/* Main Info */}
      <div className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-text-secondary">Name</label>
          <Input {...register('name')} placeholder="Your Full Name" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-text-secondary">Role Title</label>
          <Input {...register('role')} placeholder="e.g. Senior Software Engineer" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-text-secondary">Tagline</label>
          <Input {...register('tagline')} placeholder="Short bio hook" />
        </div>
      </div>

      {/* Availability Toggle */}
      <div className="p-4 bg-bg-primary rounded-xl border border-border-subtle flex items-center justify-between">
        <div className="space-y-0.5">
          <label className="text-xs font-semibold text-text-primary">Available for Work</label>
          <p className="text-[11px] text-text-tertiary">Toggle status pill visibility</p>
        </div>
        <div className="flex items-center gap-3">
          <Input
            {...register('availability_label')}
            placeholder="Availability label"
            className="w-40 text-xs h-8"
          />
          <Toggle
            checked={watchAvailable}
            onChange={(val) => setValue('available', val, { shouldDirty: true })}
          />
        </div>
      </div>

      {/* Social Links */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-text-tertiary">Social Links</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-text-tertiary shrink-0" />
            <Input {...register('github_url')} placeholder="GitHub profile URL" className="text-xs" />
          </div>
          <div className="flex items-center gap-2">
            <Link2 className="w-4 h-4 text-text-tertiary shrink-0" />
            <Input {...register('linkedin_url')} placeholder="LinkedIn profile URL" className="text-xs" />
          </div>
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-text-tertiary shrink-0" />
            <Input {...register('twitter_url')} placeholder="Twitter profile URL" className="text-xs" />
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-text-tertiary shrink-0" />
            <Input {...register('email')} placeholder="Email address" className="text-xs" />
          </div>
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-text-tertiary shrink-0" />
            <Input {...register('leetcode_url')} placeholder="LeetCode profile URL" className="text-xs" />
          </div>
        </div>
      </div>

      {/* Stats pairs (2x2 grid in UI) */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-text-tertiary">Stats Grid Metrics</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2 border border-border-subtle p-3 rounded-xl bg-bg-primary/50">
            <span className="text-[11px] font-bold text-text-tertiary">Metric 1</span>
            <Input {...register('stat_1_value')} placeholder="Value (e.g. 5+)" className="h-8 text-xs" />
            <Input {...register('stat_1_label')} placeholder="Label (e.g. Experience)" className="h-8 text-xs" />
          </div>
          <div className="space-y-2 border border-border-subtle p-3 rounded-xl bg-bg-primary/50">
            <span className="text-[11px] font-bold text-text-tertiary">Metric 2</span>
            <Input {...register('stat_2_value')} placeholder="Value (e.g. 100K+)" className="h-8 text-xs" />
            <Input {...register('stat_2_label')} placeholder="Label (e.g. Lines of code)" className="h-8 text-xs" />
          </div>
          <div className="space-y-2 border border-border-subtle p-3 rounded-xl bg-bg-primary/50">
            <span className="text-[11px] font-bold text-text-tertiary">Metric 3</span>
            <Input {...register('stat_3_value')} placeholder="Value (e.g. 10+)" className="h-8 text-xs" />
            <Input {...register('stat_3_label')} placeholder="Label (e.g. Projects)" className="h-8 text-xs" />
          </div>
          <div className="space-y-2 border border-border-subtle p-3 rounded-xl bg-bg-primary/50">
            <span className="text-[11px] font-bold text-text-tertiary">Metric 4</span>
            <Input {...register('stat_4_value')} placeholder="Value (e.g. A+)" className="h-8 text-xs" />
            <Input {...register('stat_4_label')} placeholder="Label (e.g. Grade)" className="h-8 text-xs" />
          </div>
        </div>
      </div>

      <div className="pt-4 flex items-center justify-end">
        <Button type="submit" disabled={saveMutation.isPending} className="w-full justify-center">
          {saveMutation.isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
};

export default HeroManager;
