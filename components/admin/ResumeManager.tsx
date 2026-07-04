// @ts-nocheck
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';
import { Resume } from '@/types';
import toast from '@/components/ui/toast';
import { FileText, FileUp, Download, Trash2, Eye, Loader2 } from 'lucide-react';
import Button from '../ui/button';
import ConfirmDialog from '../ui/confirm-dialog';
import Skeleton from '../ui/skeleton';
import { useState } from 'react';
import { formatBytes, formatDate } from '@/lib/utils';

export const ResumeManager = () => {
  const queryClient = useQueryClient();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Fetch resume record
  const { data: resume, isLoading } = useQuery<Resume | null>({
    queryKey: ['admin-resume'],
    queryFn: async () => {
      const { data, error } = await supabase.from('resume').select('*').eq('id', true).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      setIsUploading(true);
      try {
        const ext = file.name.split('.').pop();
        const path = `resumes/resume-${Date.now()}.${ext}`;

        // Upload new file
        const { error: uploadError } = await supabase.storage
          .from('portfolio-assets')
          .upload(path, file, { cacheControl: '3600', upsert: true });
        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('portfolio-assets')
          .getPublicUrl(path);

        // Upsert DB record
        const { error: dbError } = await supabase.from('resume').upsert({
          id: true,
          file_url: publicUrl,
          original_filename: file.name,
          file_size: file.size.toString(),
          uploaded_at: new Date().toISOString(),
        });
        if (dbError) throw dbError;

        await supabase.from('activity_log').insert({
          entity_type: 'resume',
          entity_id: 'true',
          action: 'UPDATE',
          description: `Uploaded new resume PDF: ${file.name}`,
        });

        await fetch('/api/revalidate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paths: ['/'] }),
        });
      } finally {
        setIsUploading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-resume'] });
      toast.success('Resume uploaded successfully');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to upload resume');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!resume) return;

      // Extract filename from URL to remove from storage
      if (resume.file_url.includes('/portfolio-assets/')) {
        const path = resume.file_url.split('/portfolio-assets/')[1];
        await supabase.storage.from('portfolio-assets').remove([path]);
      }

      const { error } = await supabase.from('resume').delete().eq('id', true);
      if (error) throw error;

      await supabase.from('activity_log').insert({
        entity_type: 'resume',
        entity_id: 'true',
        action: 'DELETE',
        description: `Deleted resume: ${resume.original_filename}`,
      });

      await fetch('/api/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paths: ['/'] }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-resume'] });
      toast.success('Resume deleted successfully');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to delete resume');
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadMutation.mutate(e.target.files[0]);
    }
  };

  if (isLoading) {
    return <div className="space-y-6 animate-pulse"><Skeleton className="h-40 w-full" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold font-display text-text-primary">Resume Manager</h2>
        <p className="text-xs text-text-tertiary">Upload and replace the public CV/resume document</p>
      </div>

      {resume ? (
        <div className="p-6 bg-white border border-border-default rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-50 text-red-500 rounded-2xl shrink-0">
              <FileText className="w-8 h-8" />
            </div>
            <div className="overflow-hidden flex-1">
              <h3 className="text-sm font-bold text-text-primary truncate">{resume.original_filename}</h3>
              <p className="text-xs text-text-tertiary">
                {formatBytes(resume.file_size)} • Uploaded {formatDate(resume.uploaded_at)}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-2 border-t border-border-subtle">
            <Button
              variant="secondary"
              size="sm"
              className="flex items-center gap-1.5"
              onClick={() => window.open('/resume', '_blank')}
            >
              <Eye className="w-4 h-4" /> View Standalone
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="flex items-center gap-1.5"
              onClick={() => window.open(resume.file_url, '_blank')}
            >
              <Download className="w-4 h-4" /> Download
            </Button>
            <Button
              variant="danger"
              size="sm"
              className="flex items-center gap-1.5"
              onClick={() => setDeleteConfirmOpen(true)}
            >
              <Trash2 className="w-4 h-4" /> Delete
            </Button>
          </div>

          {/* Replace form */}
          <div className="pt-2">
            <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent-primary hover:text-accent-hover cursor-pointer">
              <FileUp className="w-4 h-4" /> Replace PDF Document
              <input
                type="file"
                accept=".pdf"
                className="hidden"
                disabled={isUploading}
                onChange={handleFileChange}
              />
            </label>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-border-default rounded-2xl p-12 text-center bg-white/40">
          {isUploading ? (
            <div className="space-y-2">
              <Loader2 className="w-8 h-8 text-accent-primary animate-spin mx-auto" />
              <p className="text-sm font-semibold text-text-secondary">Uploading PDF...</p>
            </div>
          ) : (
            <>
              <div className="p-4 bg-accent-light text-accent-primary rounded-2xl mb-4">
                <FileUp className="w-8 h-8" />
              </div>
              <h3 className="text-sm font-bold text-text-primary mb-1">No Resume Uploaded</h3>
              <p className="text-xs text-text-tertiary mb-5 max-w-xs leading-relaxed">
                Add a PDF resume document to make it downloadable from the main portfolio page.
              </p>
              <label className="inline-flex items-center justify-center font-medium rounded-xl transition-colors cursor-pointer bg-accent-primary text-white text-xs py-2.5 px-5 hover:opacity-95">
                Upload Resume PDF
                <input
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </>
          )}
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={() => deleteMutation.mutate()}
        title="Delete Resume"
        description="Are you sure you want to remove the resume? This will remove the document download links from your portfolio."
      />
    </div>
  );
};

export default ResumeManager;
