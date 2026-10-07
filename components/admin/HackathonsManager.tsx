// @ts-nocheck
'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { supabase } from '@/lib/supabase/client';
import { Hackathon } from '@/types';
import toast from '@/components/ui/toast';
import { Plus, GripVertical, Edit2, Trash2, Trophy, ExternalLink, GitBranch, Globe, Image as ImageIcon, X } from 'lucide-react';
import Button from '../ui/button';
import Input from '../ui/input';
import Modal from '../ui/modal';
import ConfirmDialog from '../ui/confirm-dialog';
import FileUpload from '../shared/file-upload';
import Skeleton from '../ui/skeleton';
import { revalidatePortfolio } from '@/lib/utils';

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

interface HackItemProps {
  hack: Hackathon;
  onEdit: (hack: Hackathon) => void;
  onDelete: (hack: Hackathon) => void;
}

const SortableHackItem = ({ hack, onEdit, onDelete }: HackItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: hack.id });

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
      className="flex items-center justify-between p-3.5 bg-[#001a33] border border-border-default rounded-xl hover:border-accent-primary/40 transition-colors shadow-sm"
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
        {hack.thumbnail_url ? (
          <img src={hack.thumbnail_url} alt={hack.title} className="w-10 h-10 rounded-lg object-cover border border-border-subtle shrink-0" />
        ) : (
          <div className="w-10 h-10 rounded-lg border border-border-subtle bg-purple-50 flex items-center justify-center shrink-0">
            <Trophy className="w-5 h-5 text-purple-500" />
          </div>
        )}
        <div className="overflow-hidden">
          <h4 className="text-sm font-semibold text-text-primary truncate">{hack.title}</h4>
          <p className="text-[11px] text-text-tertiary">
            {hack.project_name ? `${hack.project_name} · ` : ''}{hack.organization} • {hack.date}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0 ml-2">
        {hack.certificate_url && (
          <a href={hack.certificate_url} target="_blank" rel="noopener noreferrer"
            className="p-1.5 text-text-secondary hover:text-amber-500 hover:bg-amber-50 rounded-lg" title="View Certificate">
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
        {hack.github_url && (
          <a href={hack.github_url} target="_blank" rel="noopener noreferrer"
            className="p-1.5 text-text-secondary hover:text-text-primary hover:bg-bg-primary rounded-lg" title="GitHub">
            <GitBranch className="w-3.5 h-3.5" />
          </a>
        )}
        {hack.project_url && (
          <a href={hack.project_url} target="_blank" rel="noopener noreferrer"
            className="p-1.5 text-text-secondary hover:text-accent-primary hover:bg-accent-light rounded-lg" title="Project">
            <Globe className="w-3.5 h-3.5" />
          </a>
        )}
        <button
          type="button"
          onClick={() => onEdit(hack)}
          className="p-1.5 text-text-secondary hover:text-accent-primary hover:bg-accent-light rounded-lg cursor-pointer"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => onDelete(hack)}
          className="p-1.5 text-text-secondary hover:text-error hover:bg-error/10 rounded-lg cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

// Gallery image component
const GalleryImageItem = ({ url, onRemove }: { url: string; onRemove: () => void }) => (
  <div className="relative group rounded-lg overflow-hidden border border-border-subtle aspect-video bg-bg-primary">
    <img src={url} alt="Gallery" className="w-full h-full object-cover" />
    <button
      type="button"
      onClick={onRemove}
      className="absolute top-1 right-1 p-1 bg-black/70 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
    >
      <X className="w-3 h-3" />
    </button>
  </div>
);

export const HackathonsManager = () => {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteHack, setDeleteHack] = useState<Hackathon | null>(null);
  const [editingHack, setEditingHack] = useState<Hackathon | null>(null);
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);

  const { data: hackathons = [], isLoading } = useQuery<Hackathon[]>({
    queryKey: ['admin-hackathons'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hackathons')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const { register, handleSubmit, reset, setValue, watch } = useForm<Partial<Hackathon>>({
    defaultValues: {
      title: '',
      organization: '',
      date: '',
      project_name: '',
      description: '',
      project_url: '',
      github_url: '',
      certificate_url: '',
      thumbnail_url: '',
      gallery_urls: [],
    },
  });

  const watchCertUrl = watch('certificate_url');
  const watchThumbUrl = watch('thumbnail_url');

  const sensors = useSensors(useSensor(PointerSensor));

  const saveMutation = useMutation({
    mutationFn: async (formData: Partial<Hackathon>) => {
      const isNew = !editingHack;
      const payload = {
        ...formData,
        gallery_urls: galleryUrls,
        display_order: editingHack?.display_order ?? hackathons.length,
        ...(editingHack ? { id: editingHack.id } : {}),
      };

      const { data, error } = await supabase.from('hackathons').upsert(payload).select().single();
      if (error) throw error;

      await supabase.from('activity_log').insert({
        entity_type: 'hackathons',
        entity_id: data.id,
        action: isNew ? 'INSERT' : 'UPDATE',
        description: `${isNew ? 'Added' : 'Updated'} hackathon: ${formData.title}`,
      });

      await revalidatePortfolio(['/']);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-hackathons'] });
      setModalOpen(false);
      setEditingHack(null);
      setGalleryUrls([]);
      reset({ title: '', organization: '', date: '', project_name: '', description: '', project_url: '', github_url: '', certificate_url: '', thumbnail_url: '', gallery_urls: [] });
      toast.success('Hackathon saved successfully');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to save hackathon');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (hack: Hackathon) => {
      const { error } = await supabase.from('hackathons').delete().eq('id', hack.id);
      if (error) throw error;

      await supabase.from('activity_log').insert({
        entity_type: 'hackathons',
        entity_id: hack.id,
        action: 'DELETE',
        description: `Deleted hackathon: ${hack.title}`,
      });

      await revalidatePortfolio(['/']);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-hackathons'] });
      toast.success('Hackathon deleted successfully');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to delete hackathon');
    },
  });

  const orderMutation = useMutation({
    mutationFn: async (list: Hackathon[]) => {
      const updates = list.map((hack, index) =>
        supabase.from('hackathons').update({ display_order: index }).eq('id', hack.id)
      );
      await Promise.all(updates);
      await revalidatePortfolio(['/']);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-hackathons'] }),
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = hackathons.findIndex((h) => h.id === active.id);
    const newIndex = hackathons.findIndex((h) => h.id === over.id);
    const reordered = [...hackathons];
    const [removed] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, removed);
    queryClient.setQueryData(['admin-hackathons'], reordered);
    orderMutation.mutate(reordered);
  };

  const handleEditClick = (hack: Hackathon) => {
    setEditingHack(hack);
    setGalleryUrls(hack.gallery_urls || []);
    reset(hack);
    setModalOpen(true);
  };

  const handleAddClick = () => {
    setEditingHack(null);
    setGalleryUrls([]);
    reset({ title: '', organization: '', date: '', project_name: '', description: '', project_url: '', github_url: '', certificate_url: '', thumbnail_url: '', gallery_urls: [] });
    setModalOpen(true);
  };

  if (isLoading) {
    return <div className="space-y-4 animate-pulse"><Skeleton className="h-10 w-full" /><Skeleton className="h-48 w-full" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold font-display text-text-primary">Hackathons</h2>
          <p className="text-xs text-text-tertiary">Add hackathon achievements with certificate, project details, links, and gallery images</p>
        </div>
        <Button onClick={handleAddClick} size="sm" className="flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> Add Hackathon
        </Button>
      </div>

      {hackathons.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-border-default rounded-2xl bg-bg-primary/50 text-text-tertiary text-xs">
          No hackathons added yet. Click &quot;Add Hackathon&quot; to begin.
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={hackathons.map((h) => h.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {hackathons.map((hack) => (
                <SortableHackItem
                  key={hack.id}
                  hack={hack}
                  onEdit={handleEditClick}
                  onDelete={(h) => setDeleteHack(h)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Modal Form */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingHack ? 'Edit Hackathon' : 'Add New Hackathon'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmit((data) => saveMutation.mutate(data))} className="space-y-5">
          
          {/* ── SECTION 1: Certificate ── */}
          <div className="pb-3 border-b border-border-subtle">
            <p className="text-xs font-bold uppercase tracking-widest text-accent-primary mb-3">① Certificate</p>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary">Certificate Image (shown on card front)</label>
              <FileUpload
                folder="hackathons/certs"
                accept="image/*"
                value={watchCertUrl}
                onUploadComplete={(url) => setValue('certificate_url', url)}
              />
            </div>
          </div>

          {/* ── SECTION 2: Hackathon Info ── */}
          <div className="pb-3 border-b border-border-subtle space-y-4">
            <p className="text-xs font-bold uppercase tracking-widest text-accent-primary">② Hackathon Info</p>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary">Hackathon / Award Title *</label>
              <Input {...register('title', { required: true })} placeholder="e.g. 1st Place — Smart India Hackathon 2024" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-secondary">Organization / Host *</label>
                <Input {...register('organization', { required: true })} placeholder="e.g. IIT Bombay" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-secondary">Date *</label>
                <Input {...register('date', { required: true })} placeholder="e.g. Dec 2024" />
              </div>
            </div>
          </div>

          {/* ── SECTION 3: Project Details ── */}
          <div className="pb-3 border-b border-border-subtle space-y-4">
            <p className="text-xs font-bold uppercase tracking-widest text-accent-primary">③ Project Details</p>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary">Project Name</label>
              <Input {...register('project_name')} placeholder="e.g. EcoTrack — Carbon Footprint Monitor" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary">Project Description / Problem it Solves</label>
              <textarea
                {...register('description')}
                placeholder="Describe what the project does and the problem it solves..."
                rows={4}
                className="w-full px-3 py-2 rounded-lg border border-border-default bg-bg-primary text-text-primary text-sm placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary/40 resize-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary">Project Thumbnail / Main Photo</label>
              <FileUpload
                folder="hackathons/thumbnails"
                accept="image/*"
                value={watchThumbUrl}
                onUploadComplete={(url) => setValue('thumbnail_url', url)}
              />
            </div>
          </div>

          {/* ── SECTION 4: Links ── */}
          <div className="pb-3 border-b border-border-subtle space-y-4">
            <p className="text-xs font-bold uppercase tracking-widest text-accent-primary">④ Links</p>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" /> Live / Deployed URL
              </label>
              <Input {...register('project_url')} placeholder="https://my-hackathon-project.vercel.app" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary flex items-center gap-1.5">
                <GitBranch className="w-3.5 h-3.5" /> GitHub Repository URL
              </label>
              <Input {...register('github_url')} placeholder="https://github.com/username/repo" />
            </div>
          </div>

          {/* ── SECTION 5: Gallery ── */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-accent-primary">⑤ Project Gallery</p>
            {galleryUrls.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {galleryUrls.map((url, idx) => (
                  <GalleryImageItem
                    key={idx}
                    url={url}
                    onRemove={() => setGalleryUrls((prev) => prev.filter((_, i) => i !== idx))}
                  />
                ))}
              </div>
            )}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5" /> Add Gallery Image
              </label>
              <FileUpload
                folder="hackathons/gallery"
                accept="image/*"
                value=""
                onUploadComplete={(url) => setGalleryUrls((prev) => [...prev, url])}
              />
              <p className="text-[10px] text-text-tertiary">Upload multiple images one by one. They will appear in a gallery inside the details panel.</p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border-subtle">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)} size="sm">
              Cancel
            </Button>
            <Button type="submit" disabled={saveMutation.isPending} size="sm">
              {saveMutation.isPending ? 'Saving...' : 'Save Hackathon'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={!!deleteHack}
        onClose={() => setDeleteHack(null)}
        onConfirm={() => deleteHack && deleteMutation.mutate(deleteHack)}
        title="Delete Hackathon"
        description={`Are you sure you want to delete "${deleteHack?.title}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default HackathonsManager;
