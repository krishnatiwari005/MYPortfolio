// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { supabase } from '@/lib/supabase/client';
import { Experience } from '@/types';
import toast from '@/components/ui/toast';
import { Plus, GripVertical, Edit2, Trash2, Globe, ArrowLeft, PlusCircle } from 'lucide-react';
import Button from '../ui/button';
import Input from '../ui/input';
import Select from '../ui/select';
import Toggle from '../ui/toggle';
import ConfirmDialog from '../ui/confirm-dialog';
import FileUpload from '../shared/file-upload';
import RichTextEditor from '../shared/rich-text-editor';
import TagInput from '../shared/tag-input';
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

interface SortableExpItemProps {
  exp: Experience;
  onEdit: (exp: Experience) => void;
  onDelete: (exp: Experience) => void;
}

const SortableExpItem = ({ exp, onEdit, onDelete }: SortableExpItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: exp.id,
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
      className="flex items-center justify-between p-4 bg-white border border-border-default rounded-2xl hover:border-accent-primary/40 transition-colors shadow-sm"
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
          {exp.company_logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={exp.company_logo_url} alt={exp.company_name} className="w-full h-full object-contain" />
          ) : (
            <Globe className="w-5 h-5 text-text-tertiary" />
          )}
        </div>
        <div className="overflow-hidden">
          <h4 className="text-sm font-semibold text-text-primary truncate">{exp.role}</h4>
          <p className="text-xs text-text-secondary truncate">{exp.company_name}</p>
          <p className="text-[10px] text-text-tertiary">
            {exp.start_month} {exp.start_year} - {exp.is_current ? 'Present' : `${exp.end_month} ${exp.end_year}`}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={() => onEdit(exp)}
          className="p-1.5 text-text-secondary hover:text-accent-primary hover:bg-accent-light rounded-lg cursor-pointer"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => onDelete(exp)}
          className="p-1.5 text-text-secondary hover:text-error hover:bg-error/10 rounded-lg cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export const ExperienceManager = () => {
  const queryClient = useQueryClient();
  const [view, setView] = useState<'list' | 'form'>('list');
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [deleteExp, setDeleteExp] = useState<Experience | null>(null);

  // Fetch experiences
  const { data: experiences = [], isLoading } = useQuery<Experience[]>({
    queryKey: ['admin-experience'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('experience')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const { register, handleSubmit, control, setValue, watch, reset } = useForm<Partial<Experience>>({
    defaultValues: {
      company_name: '',
      company_logo_url: '',
      role: '',
      employment_type: 'Full-time',
      start_month: 'Jan',
      start_year: '2023',
      end_month: 'Jan',
      end_year: '2024',
      is_current: false,
      description: '',
      achievements: [],
      tech_stack: [],
      certificate_url: '',
      certificate_file_url: '',
    },
  });

  const watchLogo = watch('company_logo_url');
  const watchCertFile = watch('certificate_file_url');
  const watchIsCurrent = watch('is_current') ?? false;

  const sensors = useSensors(useSensor(PointerSensor));

  // Mutations
  const saveMutation = useMutation({
    mutationFn: async (formData: Partial<Experience>) => {
      let isNew = !editingExp;
      let payload = {
        ...formData,
        display_order: editingExp?.display_order ?? experiences.length,
      };

      if (editingExp) {
        payload = { ...payload, id: editingExp.id } as any;
      }

      const { data, error } = await supabase.from('experience').upsert(payload).select().single();
      if (error) throw error;

      await supabase.from('activity_log').insert({
        entity_type: 'experience',
        entity_id: data.id,
        action: isNew ? 'INSERT' : 'UPDATE',
        description: `${isNew ? 'Added' : 'Updated'} experience entry: ${formData.role} at ${formData.company_name}`,
      });

      await fetch('/api/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paths: ['/'] }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-experience'] });
      toast.success('Experience record saved successfully');
      setView('list');
      setEditingExp(null);
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to save record');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (exp: Experience) => {
      const { error } = await supabase.from('experience').delete().eq('id', exp.id);
      if (error) throw error;

      await supabase.from('activity_log').insert({
        entity_type: 'experience',
        entity_id: exp.id,
        action: 'DELETE',
        description: `Deleted experience record: ${exp.role} at ${exp.company_name}`,
      });

      await fetch('/api/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paths: ['/'] }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-experience'] });
      toast.success('Experience deleted successfully');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to delete record');
    },
  });

  const orderMutation = useMutation({
    mutationFn: async (list: Experience[]) => {
      const updates = list.map((exp, idx) =>
        supabase.from('experience').update({ display_order: idx }).eq('id', exp.id)
      );
      await Promise.all(updates);

      await fetch('/api/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paths: ['/'] }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-experience'] });
    },
  });

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;

    const oldIdx = experiences.findIndex((x) => x.id === active.id);
    const newIdx = experiences.findIndex((x) => x.id === over.id);

    const reordered = [...experiences];
    const [removed] = reordered.splice(oldIdx, 1);
    reordered.splice(newIdx, 0, removed);

    queryClient.setQueryData(['admin-experience'], reordered);
    orderMutation.mutate(reordered);
  };

  const handleEditClick = (exp: Experience) => {
    setEditingExp(exp);
    reset(exp);
    setView('form');
  };

  const handleAddClick = () => {
    setEditingExp(null);
    reset({
      company_name: '',
      company_logo_url: '',
      role: '',
      employment_type: 'Full-time',
      start_month: 'Jan',
      start_year: '2023',
      end_month: 'Jan',
      end_year: '2024',
      is_current: false,
      description: '',
      achievements: [],
      tech_stack: [],
      certificate_url: '',
      certificate_file_url: '',
    });
    setView('form');
  };

  if (isLoading) {
    return <div className="space-y-6 animate-pulse"><Skeleton className="h-10 w-full" /><Skeleton className="h-60 w-full" /></div>;
  }

  return (
    <div className="space-y-6">
      {view === 'list' ? (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold font-display text-text-primary">Experience Manager</h2>
              <p className="text-xs text-text-tertiary">Edit work chronology and timeline items</p>
            </div>
            <Button onClick={handleAddClick} size="sm" className="flex items-center gap-1.5">
              <Plus className="w-4 h-4" /> Add Experience
            </Button>
          </div>

          {experiences.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-border-default rounded-2xl bg-bg-primary/50 text-text-tertiary text-xs">
              No work experiences added yet. Click &quot;Add Experience&quot; to start.
            </div>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={experiences.map((e) => e.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                  {experiences.map((exp) => (
                    <SortableExpItem
                      key={exp.id}
                      exp={exp}
                      onEdit={handleEditClick}
                      onDelete={(x) => setDeleteExp(x)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </>
      ) : (
        <form onSubmit={handleSubmit((data) => saveMutation.mutate(data))} className="space-y-5">
          {/* Header */}
          <div className="flex items-center gap-2 border-b border-border-subtle pb-3">
            <button
              type="button"
              onClick={() => setView('list')}
              className="p-1 text-text-tertiary hover:text-text-primary rounded-full hover:bg-border-subtle cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold font-display text-text-primary">
              {editingExp ? 'Edit Experience' : 'New Experience'}
            </h2>
          </div>

          {/* Form details */}
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary">Company Name</label>
              <Input {...register('company_name', { required: true })} placeholder="e.g. Acme Corp" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-secondary">Role Title</label>
                <Input {...register('role', { required: true })} placeholder="e.g. Senior frontend dev" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-secondary">Employment Type</label>
                <Select {...register('employment_type')}>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Internship">Internship</option>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-text-secondary">Company Logo</label>
              <FileUpload
                folder="experience"
                accept="image/*"
                value={watchLogo}
                onUploadComplete={(url) => setValue('company_logo_url', url)}
              />
            </div>

            {/* Dates */}
            <div className="p-4 border border-border-default bg-bg-primary/50 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-text-secondary">Timeframe</span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-text-tertiary">Currently Work Here</span>
                  <Toggle
                    checked={watchIsCurrent}
                    onChange={(val) => setValue('is_current', val)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-text-tertiary">Start Date</span>
                  <div className="flex gap-2">
                    <Select {...register('start_month')}>
                      {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </Select>
                    <Input {...register('start_year')} placeholder="Year" className="w-20" />
                  </div>
                </div>

                {!watchIsCurrent && (
                  <div className="space-y-1 animate-enter">
                    <span className="text-[11px] font-semibold text-text-tertiary">End Date</span>
                    <div className="flex gap-2">
                      <Select {...register('end_month')}>
                        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m) => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </Select>
                      <Input {...register('end_year')} placeholder="Year" className="w-20" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Rich Editor */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary">Job Description (Rich HTML)</label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <RichTextEditor value={field.value ?? ''} onChange={field.onChange} />
                )}
              />
            </div>

            {/* Achievements List */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary">Key Achievements</label>
              <Controller
                name="achievements"
                control={control}
                render={({ field }) => (
                  <TagInput
                    tags={field.value ?? []}
                    onChange={field.onChange}
                    placeholder="e.g. Managed 5 engineers, Decreased compile time by 20%"
                  />
                )}
              />
            </div>

            {/* Tech Stack List */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary">Tech Stack Tags</label>
              <Controller
                name="tech_stack"
                control={control}
                render={({ field }) => (
                  <TagInput
                    tags={field.value ?? []}
                    onChange={field.onChange}
                    placeholder="e.g. React, Docker, Kubernetes"
                  />
                )}
              />
            </div>

            {/* Certificate Links */}
            <div className="space-y-3 pt-2 border-t border-border-subtle">
              <span className="text-xs font-bold text-text-secondary">Certificate / Reference Credentials</span>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-text-tertiary">Credential Link URL</label>
                <Input {...register('certificate_url')} placeholder="Verification Link URL" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-text-tertiary">Certificate Document Upload</label>
                <FileUpload
                  folder="credentials"
                  accept=".pdf,image/*"
                  value={watchCertFile}
                  onUploadComplete={(url) => setValue('certificate_file_url', url)}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border-subtle">
            <Button type="button" variant="ghost" onClick={() => setView('list')} size="sm">
              Cancel
            </Button>
            <Button type="submit" disabled={saveMutation.isPending} size="sm">
              {saveMutation.isPending ? 'Saving...' : 'Save Record'}
            </Button>
          </div>
        </form>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteExp}
        onClose={() => setDeleteExp(null)}
        onConfirm={() => deleteExp && deleteMutation.mutate(deleteExp)}
        title="Delete Experience"
        description={`Are you sure you want to delete ${deleteExp?.role} role at ${deleteExp?.company_name}? This action cannot be undone.`}
      />
    </div>
  );
};

export default ExperienceManager;
