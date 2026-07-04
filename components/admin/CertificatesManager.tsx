// @ts-nocheck
'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { supabase } from '@/lib/supabase/client';
import { Certificate } from '@/types';
import toast from '@/components/ui/toast';
import { Plus, GripVertical, Edit2, Trash2, Globe, Award } from 'lucide-react';
import Button from '../ui/button';
import Input from '../ui/input';
import Modal from '../ui/modal';
import ConfirmDialog from '../ui/confirm-dialog';
import FileUpload from '../shared/file-upload';
import Skeleton from '../ui/skeleton';

// Dnd Kit Imports
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface CertItemProps {
  cert: Certificate;
  onEdit: (cert: Certificate) => void;
  onDelete: (cert: Certificate) => void;
}

const SortableCertItem = ({ cert, onEdit, onDelete }: CertItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: cert.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 20 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between p-3.5 bg-white border border-border-default rounded-xl hover:border-accent-primary/40 transition-colors shadow-sm"
    >
      <div className="flex items-center gap-3 overflow-hidden">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="p-1 hover:bg-bg-primary text-text-tertiary rounded cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="w-4 h-4" />
        </button>
        <div className="w-10 h-10 rounded-lg border border-border-subtle bg-bg-primary flex items-center justify-center p-1.5 shrink-0 overflow-hidden">
          {cert.preview_image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cert.preview_image_url} alt={cert.title} className="w-full h-full object-contain" />
          ) : (
            <Award className="w-5 h-5 text-text-tertiary" />
          )}
        </div>
        <div className="overflow-hidden">
          <h4 className="text-sm font-semibold text-text-primary truncate">{cert.title}</h4>
          <p className="text-[11px] text-text-tertiary">
            {cert.issuer} • {cert.issue_date}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={() => onEdit(cert)}
          className="p-1.5 text-text-secondary hover:text-accent-primary hover:bg-accent-light rounded-lg cursor-pointer"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => onDelete(cert)}
          className="p-1.5 text-text-secondary hover:text-error hover:bg-error/10 rounded-lg cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export const CertificatesManager = () => {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteCert, setDeleteCert] = useState<Certificate | null>(null);
  const [editingCert, setEditingCert] = useState<Certificate | null>(null);

  // Fetch certificates
  const { data: certificates = [], isLoading } = useQuery<Certificate[]>({
    queryKey: ['admin-certificates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const { register, handleSubmit, setValue, watch, reset } = useForm<Partial<Certificate>>({
    defaultValues: {
      title: '',
      issuer: '',
      issue_date: '',
      credential_url: '',
      preview_image_url: '',
      pdf_url: '',
    },
  });

  const watchPreview = watch('preview_image_url');
  const watchPdf = watch('pdf_url');

  const sensors = useSensors(useSensor(PointerSensor));

  // Mutations
  const saveMutation = useMutation({
    mutationFn: async (formData: Partial<Certificate>) => {
      let isNew = !editingCert;
      let payload = {
        ...formData,
        display_order: editingCert?.display_order ?? certificates.length,
      };

      if (editingCert) {
        payload = { ...payload, id: editingCert.id } as any;
      }

      const { data, error } = await supabase.from('certificates').upsert(payload).select().single();
      if (error) throw error;

      await supabase.from('activity_log').insert({
        entity_type: 'certificates',
        entity_id: data.id,
        action: isNew ? 'INSERT' : 'UPDATE',
        description: `${isNew ? 'Added' : 'Updated'} certificate: ${formData.title}`,
      });

      await fetch('/api/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paths: ['/'] }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-certificates'] });
      setModalOpen(false);
      setEditingCert(null);
      reset({ title: '', issuer: '', issue_date: '', credential_url: '', preview_image_url: '', pdf_url: '' });
      toast.success('Certificate saved successfully');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to save certificate');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (cert: Certificate) => {
      // Remove preview image if any
      if (cert.preview_image_url?.includes('/portfolio-assets/')) {
        const path = cert.preview_image_url.split('/portfolio-assets/')[1];
        await supabase.storage.from('portfolio-assets').remove([path]);
      }
      // Remove PDF file if any
      if (cert.pdf_url?.includes('/portfolio-assets/')) {
        const path = cert.pdf_url.split('/portfolio-assets/')[1];
        await supabase.storage.from('portfolio-assets').remove([path]);
      }

      const { error } = await supabase.from('certificates').delete().eq('id', cert.id);
      if (error) throw error;

      await supabase.from('activity_log').insert({
        entity_type: 'certificates',
        entity_id: cert.id,
        action: 'DELETE',
        description: `Deleted certificate: ${cert.title}`,
      });

      await fetch('/api/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paths: ['/'] }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-certificates'] });
      toast.success('Certificate deleted successfully');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to delete certificate');
    },
  });

  const orderMutation = useMutation({
    mutationFn: async (list: Certificate[]) => {
      const updates = list.map((cert, index) =>
        supabase.from('certificates').update({ display_order: index }).eq('id', cert.id)
      );
      await Promise.all(updates);

      await fetch('/api/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paths: ['/'] }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-certificates'] });
    },
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = certificates.findIndex((c) => c.id === active.id);
    const newIndex = certificates.findIndex((c) => c.id === over.id);

    const reordered = [...certificates];
    const [removed] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, removed);

    queryClient.setQueryData(['admin-certificates'], reordered);
    orderMutation.mutate(reordered);
  };

  const handleEditClick = (cert: Certificate) => {
    setEditingCert(cert);
    reset(cert);
    setModalOpen(true);
  };

  const handleAddClick = () => {
    setEditingCert(null);
    reset({ title: '', issuer: '', issue_date: '', credential_url: '', preview_image_url: '', pdf_url: '' });
    setModalOpen(true);
  };

  if (isLoading) {
    return <div className="space-y-6 animate-pulse"><Skeleton className="h-10 w-full" /><Skeleton className="h-60 w-full" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold font-display text-text-primary">Certificates</h2>
          <p className="text-xs text-text-tertiary">Organize developer credentials and badges</p>
        </div>
        <Button onClick={handleAddClick} size="sm" className="flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> Add Certificate
        </Button>
      </div>

      {certificates.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-border-default rounded-2xl bg-bg-primary/50 text-text-tertiary text-xs">
          No certificates added yet. Click &quot;Add Certificate&quot; to begin.
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={certificates.map((c) => c.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {certificates.map((cert) => (
                <SortableCertItem
                  key={cert.id}
                  cert={cert}
                  onEdit={handleEditClick}
                  onDelete={(c) => setDeleteCert(c)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Modal Details */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCert ? 'Edit Certificate' : 'Add New Certificate'}
      >
        <form onSubmit={handleSubmit((data) => saveMutation.mutate(data))} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-secondary">Certificate Title</label>
            <Input {...register('title', { required: true })} placeholder="e.g. AWS Certified Solutions Architect" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary">Issuer</label>
              <Input {...register('issuer', { required: true })} placeholder="e.g. Amazon Web Services" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary">Issue Date</label>
              <Input {...register('issue_date', { required: true })} placeholder="e.g. Nov 2024" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-secondary">Credential Link URL</label>
            <Input {...register('credential_url')} placeholder="e.g. https://credly.com/..." />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-text-secondary">Preview Image (Credential Logo)</label>
            <FileUpload
              folder="certs/previews"
              accept="image/*"
              value={watchPreview}
              onUploadComplete={(url) => setValue('preview_image_url', url)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-text-secondary">Credential PDF file</label>
            <FileUpload
              folder="certs/pdfs"
              accept=".pdf"
              value={watchPdf}
              onUploadComplete={(url) => setValue('pdf_url', url)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border-subtle">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)} size="sm">
              Cancel
            </Button>
            <Button type="submit" disabled={saveMutation.isPending} size="sm">
              {saveMutation.isPending ? 'Saving...' : 'Save Certificate'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirmation delete */}
      <ConfirmDialog
        isOpen={!!deleteCert}
        onClose={() => setDeleteCert(null)}
        onConfirm={() => deleteCert && deleteMutation.mutate(deleteCert)} // wait, deleteMutation needs cert!
        title="Delete Certificate"
        description={`Are you sure you want to delete ${deleteCert?.title}? This action cannot be undone.`}
      />
    </div>
  );
};

export default CertificatesManager;
