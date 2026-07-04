// @ts-nocheck
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { supabase } from '@/lib/supabase/client';
import { About } from '@/types';
import toast from '@/components/ui/toast';
import Input from '../ui/input';
import Button from '../ui/button';
import RichTextEditor from '../shared/rich-text-editor';
import Skeleton from '../ui/skeleton';
import { useEffect } from 'react';

export const AboutManager = () => {
  const queryClient = useQueryClient();

  // Fetch About Data
  const { data: about, isLoading } = useQuery({
    queryKey: ['admin-about'],
    queryFn: async () => {
      const { data, error } = await supabase.from('about').select('*').eq('id', true).maybeSingle();
      if (error) throw error;
      return data as About;
    },
  });

  const { register, handleSubmit, control, reset } = useForm<Partial<About>>({
    defaultValues: {
      bio: '',
      education: '',
      location: '',
      current_position: '',
      years_experience: '',
      career_interests: '',
    },
  });

  useEffect(() => {
    if (about) {
      reset(about);
    }
  }, [about, reset]);

  // Save changes mutation
  const saveMutation = useMutation({
    mutationFn: async (formData: Partial<About>) => {
      const { error: upsertError } = await supabase.from('about').upsert({
        id: true,
        ...formData,
        updated_at: new Date().toISOString(),
      });

      if (upsertError) throw upsertError;

      // Log activity
      await supabase.from('activity_log').insert({
        entity_type: 'about',
        entity_id: 'true',
        action: 'UPDATE',
        description: `Updated About Me section and quick metrics`,
      });

      // Call revalidation path API
      await fetch('/api/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paths: ['/'] }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-about'] });
      toast.success('About section updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update details');
    },
  });

  if (isLoading) {
    return <div className="space-y-6 animate-pulse"><Skeleton className="h-60 w-full" /><Skeleton className="h-10 w-full" /></div>;
  }

  return (
    <form id="admin-active-form" onSubmit={handleSubmit((data) => saveMutation.mutate(data))} className="space-y-6">
      <div>
        <h2 className="text-xl font-bold font-display text-text-primary">About Section Manager</h2>
        <p className="text-xs text-text-tertiary">Edit profile bio and key summary details</p>
      </div>

      {/* TipTap Rich Text Bio */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-text-secondary">Bio Narrative (Rich Text)</label>
        <Controller
          name="bio"
          control={control}
          render={({ field }) => (
            <RichTextEditor
              value={field.value ?? ''}
              onChange={field.onChange}
              placeholder="Tell visitors about your background, experience and philosophy..."
            />
          )}
        />
      </div>

      {/* Quick metrics / Info Cards */}
      <div className="space-y-4 pt-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-text-tertiary">Info Grid Elements</h3>

        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-secondary">Education</label>
            <Input {...register('education')} placeholder="e.g. M.S. Computer Science, Stanford" />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-secondary">Location</label>
            <Input {...register('location')} placeholder="e.g. London, UK" />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-secondary">Current Role</label>
            <Input {...register('current_position')} placeholder="e.g. Tech Lead at Google" />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-secondary">Years of Experience</label>
            <Input {...register('years_experience')} placeholder="e.g. 8+ Years" />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-secondary">Career Interests</label>
            <Input {...register('career_interests')} placeholder="e.g. Web3, Serverless Architectures, ML" />
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

export default AboutManager;
