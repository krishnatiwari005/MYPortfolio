// @ts-nocheck
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { supabase } from '@/lib/supabase/client';
import { SeoSettings } from '@/types';
import toast from '@/components/ui/toast';
import Input, { Textarea } from '../ui/input';
import Button from '../ui/button';
import TagInput from '../shared/tag-input';
import FileUpload from '../shared/file-upload';
import Skeleton from '../ui/skeleton';
import { useEffect } from 'react';

export const SeoManager = () => {
  const queryClient = useQueryClient();

  // Fetch SEO Settings
  const { data: seo, isLoading } = useQuery<SeoSettings | null>({
    queryKey: ['admin-seo'],
    queryFn: async () => {
      const { data, error } = await supabase.from('seo_settings').select('*').eq('id', true).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const { register, handleSubmit, control, setValue, watch, reset } = useForm<Partial<SeoSettings>>({
    defaultValues: {
      portfolio_title: '',
      meta_description: '',
      keywords: [],
      og_title: '',
      og_description: '',
      og_image_url: '',
      twitter_image_url: '',
      favicon_url: '',
      analytics_id: '',
      robots_txt: 'User-agent: *\nAllow: /\nDisallow: /admin',
    },
  });

  useEffect(() => {
    if (seo) {
      reset(seo);
    }
  }, [seo, reset]);

  const watchDesc = watch('meta_description') ?? '';
  const watchFavicon = watch('favicon_url');
  const watchOgImage = watch('og_image_url');
  const watchTwitterImage = watch('twitter_image_url');

  const saveMutation = useMutation({
    mutationFn: async (formData: Partial<SeoSettings>) => {
      const { error: upsertError } = await supabase.from('seo_settings').upsert({
        id: true,
        ...formData,
        updated_at: new Date().toISOString(),
      });
      if (upsertError) throw upsertError;

      await supabase.from('activity_log').insert({
        entity_type: 'seo_settings',
        entity_id: 'true',
        action: 'UPDATE',
        description: `Updated SEO meta settings and title tags`,
      });

      // Call revalidation path API
      await fetch('/api/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paths: ['/'] }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-seo'] });
      toast.success('SEO settings saved successfully');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to save SEO settings');
    },
  });

  if (isLoading) {
    return <div className="space-y-6 animate-pulse"><Skeleton className="h-40 w-full" /></div>;
  }

  return (
    <form id="admin-active-form" onSubmit={handleSubmit((data) => saveMutation.mutate(data))} className="space-y-6">
      <div>
        <h2 className="text-xl font-bold font-display text-text-primary">SEO Settings</h2>
        <p className="text-xs text-text-tertiary">Configure website page metadata and indexers</p>
      </div>

      <div className="space-y-4">
        {/* Title */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-text-secondary">Portfolio Title</label>
          <Input {...register('portfolio_title', { required: true })} placeholder="e.g. Jane Doe | Principal Engineer" />
        </div>

        {/* Description */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-text-secondary">Meta Description</label>
            <span className={watchDesc.length > 160 ? 'text-xs font-semibold text-error' : 'text-xs text-text-tertiary'}>
              {watchDesc.length}/160 chars
            </span>
          </div>
          <Textarea
            {...register('meta_description', { required: true, maxLength: 160 })}
            placeholder="A compelling, search-optimized snippet explaining your background..."
          />
        </div>

        {/* Keywords */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-text-secondary">Search Keywords</label>
          <Controller
            name="keywords"
            control={control}
            render={({ field }) => (
              <TagInput
                tags={field.value ?? []}
                onChange={field.onChange}
                placeholder="e.g. software engineer, react, web performance"
              />
            )}
          />
        </div>

        {/* Analytics ID */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-text-secondary">Google Analytics ID (G-XXXXXX)</label>
          <Input {...register('analytics_id')} placeholder="e.g. G-H27BHS8278" />
        </div>

        {/* Favicon Upload */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-text-secondary">Favicon Icon (.ico/png)</label>
          <FileUpload
            folder="seo/favicons"
            accept="image/*"
            value={watchFavicon}
            onUploadComplete={(url) => setValue('favicon_url', url)}
          />
        </div>

        {/* Social Meta Cards */}
        <div className="space-y-4 pt-2 border-t border-border-subtle">
          <span className="text-xs font-bold uppercase text-text-tertiary tracking-wider">Social Share Open Graph</span>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-secondary">OG Display Title</label>
            <Input {...register('og_title')} placeholder="OpenGraph social card title" />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-secondary">OG Description</label>
            <Textarea {...register('og_description')} placeholder="OpenGraph card snippet description..." />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-text-secondary">OG Card Share Image</label>
            <FileUpload
              folder="seo/og_images"
              accept="image/*"
              value={watchOgImage}
              onUploadComplete={(url) => setValue('og_image_url', url)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-text-secondary">Twitter Card Share Image</label>
            <FileUpload
              folder="seo/twitter_images"
              accept="image/*"
              value={watchTwitterImage}
              onUploadComplete={(url) => setValue('twitter_image_url', url)}
            />
          </div>
        </div>

        {/* Robots.txt */}
        <div className="space-y-1 pt-2 border-t border-border-subtle">
          <label className="text-xs font-semibold text-text-secondary">Robots Rules (robots.txt)</label>
          <Textarea {...register('robots_txt')} className="font-mono text-xs h-24" />
        </div>
      </div>

      <div className="pt-4 flex items-center justify-end">
        <Button type="submit" disabled={saveMutation.isPending} className="w-full justify-center">
          {saveMutation.isPending ? 'Saving...' : 'Save SEO'}
        </Button>
      </div>
    </form>
  );
};

export default SeoManager;
