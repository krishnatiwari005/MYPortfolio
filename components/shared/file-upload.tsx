'use client';

import { useState, useRef } from 'react';
import { UploadCloud, File, Image, X, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import toast from '@/components/ui/toast';
import { cn } from '@/lib/utils';

export interface FileUploadProps {
  onUploadComplete: (url: string) => void;
  value?: string | null;
  folder?: string;
  accept?: string;
  maxSizeMB?: number;
}

export const FileUpload = ({
  onUploadComplete,
  value,
  folder = 'general',
  accept = 'image/*',
  maxSizeMB = 5,
}: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`File size exceeds the ${maxSizeMB}MB limit`);
      return;
    }

    setIsUploading(true);
    setProgress(0);

    try {
      const ext = file.name.split('.').pop();
      const filename = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`;

      const { data, error } = await supabase.storage
        .from('portfolio-assets')
        .upload(filename, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) {
        throw error;
      }

      // Retrieve public URL
      const { data: { publicUrl } } = supabase.storage
        .from('portfolio-assets')
        .getPublicUrl(filename);

      onUploadComplete(publicUrl);
      toast.success('File uploaded successfully');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'File upload failed');
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files[0]);
    }
  };

  return (
    <div className="w-full">
      {value ? (
        <div className="relative flex items-center justify-between p-4 border border-border-default bg-white rounded-xl">
          <div className="flex items-center gap-3 overflow-hidden">
            {accept.startsWith('image/') ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={value}
                alt="Upload preview"
                className="w-12 h-12 object-cover rounded-lg border border-border-subtle"
              />
            ) : (
              <div className="p-3 bg-accent-light text-accent-primary rounded-lg">
                <File className="w-6 h-6" />
              </div>
            )}
            <div className="overflow-hidden">
              <p className="text-xs text-text-tertiary truncate max-w-[200px]">{value}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onUploadComplete('')}
            className="p-1 text-text-tertiary hover:text-error hover:bg-error/10 rounded-full cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            'flex flex-col items-center justify-center border-2 border-dashed border-border-default rounded-xl p-6 cursor-pointer bg-white/40 hover:bg-white/70 transition-all text-center',
            isDragging && 'border-accent-primary bg-accent-light/10',
            isUploading && 'pointer-events-none opacity-80'
          )}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept={accept}
            className="hidden"
          />

          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 text-accent-primary animate-spin" />
              <p className="text-sm font-medium text-text-secondary">Uploading...</p>
            </div>
          ) : (
            <>
              <div className="p-3 bg-bg-primary text-text-tertiary rounded-xl mb-3">
                <UploadCloud className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-text-secondary">
                Drag & drop or <span className="text-accent-primary">browse</span>
              </p>
              <p className="text-xs text-text-tertiary mt-1">
                Supports images or documents up to {maxSizeMB}MB
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
