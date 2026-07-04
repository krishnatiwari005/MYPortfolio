// @ts-nocheck
'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { supabase } from '@/lib/supabase/client';
import { Skill } from '@/types';
import toast from '@/components/ui/toast';
import { Plus, GripVertical, Edit2, Trash2, Globe } from 'lucide-react';
import Button from '../ui/button';
import Input from '../ui/input';
import Select from '../ui/select';
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

interface SkillItemProps {
  skill: Skill;
  onEdit: (skill: Skill) => void;
  onDelete: (skill: Skill) => void;
}

// Sortable Skill Item Component
const SortableSkillItem = ({ skill, onEdit, onDelete }: SkillItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: skill.id,
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
          {skill.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={skill.logo_url} alt={skill.name} className="w-full h-full object-contain" />
          ) : (
            <Globe className="w-5 h-5 text-text-tertiary" />
          )}
        </div>
        <div className="overflow-hidden">
          <h4 className="text-sm font-semibold text-text-primary truncate">{skill.name}</h4>
          <p className="text-[11px] text-text-tertiary">
            {skill.category} • {skill.years} yrs • {skill.proficiency}%
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={() => onEdit(skill)}
          className="p-1.5 text-text-secondary hover:text-accent-primary hover:bg-accent-light rounded-lg cursor-pointer"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => onDelete(skill)}
          className="p-1.5 text-text-secondary hover:text-error hover:bg-error/10 rounded-lg cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export const SkillsManager = () => {
  const queryClient = useQueryClient();
  const [activeCategory, setActiveCategory] = useState<'All' | string>('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteSkill, setDeleteSkill] = useState<Skill | null>(null);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

  // TanStack Query to fetch skills
  const { data: skills = [], isLoading } = useQuery<Skill[]>({
    queryKey: ['admin-skills'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  // Form setup
  const { register, handleSubmit, setValue, watch, reset } = useForm<Partial<Skill>>({
    defaultValues: {
      name: '',
      category: 'Frontend',
      logo_url: '',
      years: 1,
      proficiency: 80,
    },
  });

  const watchLogo = watch('logo_url');

  // Sensors for Drag
  const sensors = useSensors(useSensor(PointerSensor));

  // Mutations
  const saveMutation = useMutation({
    mutationFn: async (formData: Partial<Skill>) => {
      let isNew = !editingSkill;
      let payload = {
        ...formData,
        display_order: editingSkill?.display_order ?? skills.length,
      };

      if (editingSkill) {
        payload = { ...payload, id: editingSkill.id } as any;
      }

      const { data, error } = await supabase.from('skills').upsert(payload).select().single();
      if (error) throw error;

      await supabase.from('activity_log').insert({
        entity_type: 'skills',
        entity_id: data.id,
        action: isNew ? 'INSERT' : 'UPDATE',
        description: `${isNew ? 'Added' : 'Updated'} Skill: ${formData.name}`,
      });

      await fetch('/api/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paths: ['/'] }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-skills'] });
      setModalOpen(false);
      setEditingSkill(null);
      reset({ name: '', category: 'Frontend', logo_url: '', years: 1, proficiency: 80 });
      toast.success('Skill saved successfully');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to save skill');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (skill: Skill) => {
      // If logo is present in storage, try deleting it (optional, but clean)
      if (skill.logo_url?.includes('/portfolio-assets/')) {
        const path = skill.logo_url.split('/portfolio-assets/')[1];
        await supabase.storage.from('portfolio-assets').remove([path]);
      }

      const { error } = await supabase.from('skills').delete().eq('id', skill.id);
      if (error) throw error;

      await supabase.from('activity_log').insert({
        entity_type: 'skills',
        entity_id: skill.id,
        action: 'DELETE',
        description: `Deleted Skill: ${skill.name}`,
      });

      await fetch('/api/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paths: ['/'] }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-skills'] });
      toast.success('Skill deleted successfully');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to delete skill');
    },
  });

  const orderMutation = useMutation({
    mutationFn: async (orderedList: Skill[]) => {
      const updates = orderedList.map((skill, index) =>
        supabase.from('skills').update({ display_order: index }).eq('id', skill.id)
      );
      await Promise.all(updates);

      await fetch('/api/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paths: ['/'] }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-skills'] });
    },
  });

  // Reorder Handler
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = skills.findIndex((s) => s.id === active.id);
    const newIndex = skills.findIndex((s) => s.id === over.id);

    const reordered = [...skills];
    const [removed] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, removed);

    // Optimistic Update
    queryClient.setQueryData(['admin-skills'], reordered);
    orderMutation.mutate(reordered);
  };

  const handleEditClick = (skill: Skill) => {
    setEditingSkill(skill);
    reset(skill);
    setModalOpen(true);
  };

  const handleAddClick = () => {
    setEditingSkill(null);
    reset({ name: '', category: 'Frontend', logo_url: '', years: 1, proficiency: 80 });
    setModalOpen(true);
  };

  const categories = ['All', 'Frontend', 'Backend', 'DevOps', 'Mobile', 'Tools', 'Management'];
  const filteredSkills = activeCategory === 'All'
    ? skills
    : skills.filter((s) => s.category.toLowerCase() === activeCategory.toLowerCase());

  if (isLoading) {
    return <div className="space-y-6 animate-pulse"><Skeleton className="h-10 w-full" /><Skeleton className="h-60 w-full" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold font-display text-text-primary">Skills Manager</h2>
          <p className="text-xs text-text-tertiary">Organize developer skills and categories</p>
        </div>
        <Button onClick={handleAddClick} size="sm" className="flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> Add Skill
        </Button>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar border-b border-border-subtle">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
              activeCategory === cat
                ? 'bg-accent-primary text-white shadow-sm'
                : 'bg-white border border-border-default text-text-secondary hover:bg-bg-primary'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Sortable drag drop contexts */}
      {filteredSkills.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-border-default rounded-2xl bg-bg-primary/50 text-text-tertiary text-xs">
          No skills added yet in this category. Click &quot;Add Skill&quot; to begin.
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={filteredSkills.map((s) => s.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {filteredSkills.map((skill) => (
                <SortableSkillItem
                  key={skill.id}
                  skill={skill}
                  onEdit={handleEditClick}
                  onDelete={(s) => setDeleteSkill(s)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingSkill ? 'Edit Skill Details' : 'Add New Skill'}
      >
        <form onSubmit={handleSubmit((data) => saveMutation.mutate(data))} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-secondary">Skill Name</label>
            <Input {...register('name', { required: true })} placeholder="e.g. Next.js, Go, Docker" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary">Category</label>
              <Select {...register('category')}>
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="DevOps">DevOps</option>
                <option value="Mobile">Mobile</option>
                <option value="Tools">Tools</option>
                <option value="Management">Management</option>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary">Years of Experience</label>
              <Input
                type="number"
                step="0.1"
                {...register('years', { valueAsNumber: true })}
                placeholder="e.g. 3.5"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-secondary">Proficiency ({watch('proficiency')}%)</label>
            <input
              type="range"
              min="0"
              max="100"
              {...register('proficiency', { valueAsNumber: true })}
              className="w-full accent-accent-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-text-secondary">Logo Image</label>
            <FileUpload
              folder="logos"
              accept="image/*"
              value={watchLogo}
              onUploadComplete={(url) => setValue('logo_url', url)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)} size="sm">
              Cancel
            </Button>
            <Button type="submit" disabled={saveMutation.isPending} size="sm">
              {saveMutation.isPending ? 'Saving...' : 'Save Skill'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirmation delete */}
      <ConfirmDialog
        isOpen={!!deleteSkill}
        onClose={() => setDeleteSkill(null)}
        onConfirm={() => deleteSkill && deleteMutation.mutate(deleteSkill)}
        title="Delete Skill"
        description={`Are you sure you want to delete ${deleteSkill?.name}? This action cannot be undone.`}
      />
    </div>
  );
};

export default SkillsManager;
