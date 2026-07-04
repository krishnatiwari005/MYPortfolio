// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { supabase } from '@/lib/supabase/client';
import { Project } from '@/types';
import toast from '@/components/ui/toast';
import { Plus, GripVertical, Edit2, Trash2, Globe, ArrowLeft, Eye, Star, Copy, Image as ImageIcon } from 'lucide-react';
import Button from '../ui/button';
import Input from '../ui/input';
import Select from '../ui/select';
import Toggle from '../ui/toggle';
import ConfirmDialog from '../ui/confirm-dialog';
import FileUpload from '../shared/file-upload';
import RichTextEditor from '../shared/rich-text-editor';
import TagInput from '../shared/tag-input';
import Skeleton from '../ui/skeleton';
import { slugify } from '@/lib/utils';

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

interface SortableProjectItemProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDuplicate: (project: Project) => void;
  onDelete: (project: Project) => void;
}

const SortableProjectItem = ({ project, onEdit, onDuplicate, onDelete }: SortableProjectItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: project.id,
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
      className="flex items-center justify-between p-3 bg-white border border-border-default rounded-2xl hover:border-accent-primary/40 transition-colors shadow-sm"
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
        <div className="w-14 h-10 rounded-lg border border-border-subtle bg-bg-primary flex items-center justify-center shrink-0 overflow-hidden relative">
          {project.thumbnail_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={project.thumbnail_url} alt={project.title} className="w-full h-full object-cover" />
          ) : (
            <ImageIcon className="w-5 h-5 text-text-tertiary" />
          )}
          {project.is_featured && (
            <div className="absolute top-0.5 right-0.5 bg-amber-500 text-white p-0.5 rounded-full shadow-sm">
              <Star className="w-2 h-2 fill-white stroke-none" />
            </div>
          )}
        </div>
        <div className="overflow-hidden">
          <h4 className="text-sm font-semibold text-text-primary truncate">{project.title}</h4>
          <p className="text-[10px] text-text-tertiary">
            {project.category} • {project.status}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={() => onEdit(project)}
          title="Edit"
          className="p-1.5 text-text-secondary hover:text-accent-primary hover:bg-accent-light rounded-lg cursor-pointer"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => onDuplicate(project)}
          title="Duplicate"
          className="p-1.5 text-text-secondary hover:text-accent-primary hover:bg-accent-light rounded-lg cursor-pointer"
        >
          <Copy className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => onDelete(project)}
          title="Delete"
          className="p-1.5 text-text-secondary hover:text-error hover:bg-error/10 rounded-lg cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export const ProjectsManager = () => {
  const queryClient = useQueryClient();
  const [view, setView] = useState<'list' | 'form'>('list');
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleteProject, setDeleteProject] = useState<Project | null>(null);

  // Fetch projects
  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ['admin-projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const { register, handleSubmit, control, setValue, watch, reset } = useForm<Partial<Project>>({
    defaultValues: {
      title: '',
      slug: '',
      short_description: '',
      description: '',
      problem_statement: '',
      solution: '',
      architecture: '',
      key_features: '',
      challenges: '',
      tech_stack: [],
      github_url: '',
      demo_url: '',
      thumbnail_url: '',
      gallery_urls: [],
      category: 'Frontend',
      status: 'Completed',
      is_featured: false,
      project_date: '2024',
    },
  });

  const watchThumbnail = watch('thumbnail_url');
  const watchGallery = watch('gallery_urls') ?? [];
  const watchFeatured = watch('is_featured') ?? false;

  const sensors = useSensors(useSensor(PointerSensor));

  // Auto-slugify
  const watchTitle = watch('title');
  useEffect(() => {
    if (watchTitle && !editingProject) {
      setValue('slug', slugify(watchTitle));
    }
  }, [watchTitle, editingProject, setValue]);

  // Mutations
  const saveMutation = useMutation({
    mutationFn: async (formData: Partial<Project>) => {
      let isNew = !editingProject;
      let payload = {
        ...formData,
        display_order: editingProject?.display_order ?? projects.length,
      };

      if (editingProject) {
        payload = { ...payload, id: editingProject.id } as any;
      }

      const { data, error } = await supabase.from('projects').upsert(payload).select().single();
      if (error) throw error;

      await supabase.from('activity_log').insert({
        entity_type: 'projects',
        entity_id: data.id,
        action: isNew ? 'INSERT' : 'UPDATE',
        description: `${isNew ? 'Added' : 'Updated'} Project: ${formData.title}`,
      });

      await fetch('/api/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paths: ['/'] }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      toast.success('Project details saved successfully');
      setView('list');
      setEditingProject(null);
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to save project');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (proj: Project) => {
      const { error } = await supabase.from('projects').delete().eq('id', proj.id);
      if (error) throw error;

      await supabase.from('activity_log').insert({
        entity_type: 'projects',
        entity_id: proj.id,
        action: 'DELETE',
        description: `Deleted Project: ${proj.title}`,
      });

      await fetch('/api/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paths: ['/'] }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      toast.success('Project deleted successfully');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to delete project');
    },
  });

  const orderMutation = useMutation({
    mutationFn: async (list: Project[]) => {
      const updates = list.map((proj, idx) =>
        supabase.from('projects').update({ display_order: idx }).eq('id', proj.id)
      );
      await Promise.all(updates);

      await fetch('/api/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paths: ['/'] }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
    },
  });

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;

    const oldIdx = projects.findIndex((p) => p.id === active.id);
    const newIdx = projects.findIndex((p) => p.id === over.id);

    const reordered = [...projects];
    const [removed] = reordered.splice(oldIdx, 1);
    reordered.splice(newIdx, 0, removed);

    queryClient.setQueryData(['admin-projects'], reordered);
    orderMutation.mutate(reordered);
  };

  const handleEditClick = (proj: Project) => {
    setEditingProject(proj);
    reset(proj);
    setView('form');
  };

  const handleDuplicateClick = (proj: Project) => {
    setEditingProject(null);
    reset({
      ...proj,
      id: undefined as any,
      title: `${proj.title} (Copy)`,
      slug: `${proj.slug}-copy`,
      is_featured: false,
    });
    setView('form');
  };

  const handleAddClick = () => {
    setEditingProject(null);
    reset({
      title: '',
      slug: '',
      short_description: '',
      description: '',
      problem_statement: '',
      solution: '',
      architecture: '',
      key_features: '',
      challenges: '',
      tech_stack: [],
      github_url: '',
      demo_url: '',
      thumbnail_url: '',
      gallery_urls: [],
      category: 'Frontend',
      status: 'Completed',
      is_featured: false,
      project_date: '2024',
    });
    setView('form');
  };

  const addGalleryImage = (url: string) => {
    if (url) {
      setValue('gallery_urls', [...watchGallery, url]);
    }
  };

  const removeGalleryImage = (idxToRemove: number) => {
    setValue('gallery_urls', watchGallery.filter((_, i) => i !== idxToRemove));
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
              <h2 className="text-xl font-bold font-display text-text-primary">Projects Manager</h2>
              <p className="text-xs text-text-tertiary">Edit featured work showcases and galleries</p>
            </div>
            <Button onClick={handleAddClick} size="sm" className="flex items-center gap-1.5">
              <Plus className="w-4 h-4" /> Add Project
            </Button>
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-border-default rounded-2xl bg-bg-primary/50 text-text-tertiary text-xs">
              No projects added yet. Click &quot;Add Project&quot; to begin.
            </div>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={projects.map((p) => p.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                  {projects.map((proj) => (
                    <SortableProjectItem
                      key={proj.id}
                      project={proj}
                      onEdit={handleEditClick}
                      onDuplicate={handleDuplicateClick}
                      onDelete={(p) => setDeleteProject(p)}
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
              {editingProject ? 'Edit Project' : 'New Project'}
            </h2>
          </div>

          {/* Form details */}
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary">Project Title</label>
              <Input {...register('title', { required: true })} placeholder="e.g. SaaS Admin Panel" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-secondary">Slug</label>
                <Input {...register('slug', { required: true })} placeholder="auto-slug-hash" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-secondary">Date / Year</label>
                <Input {...register('project_date', { required: true })} placeholder="e.g. Dec 2024" />
              </div>
            </div>

            {/* Featured toggle & Status details */}
            <div className="grid grid-cols-2 gap-4 p-4 border border-border-default bg-bg-primary/50 rounded-xl">
              <div className="space-y-1 select-none flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-text-primary">Featured Project</span>
                  <p className="text-[10px] text-text-tertiary">Promote to top of list</p>
                </div>
                <Toggle
                  checked={watchFeatured}
                  onChange={(val) => setValue('is_featured', val)}
                />
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-text-secondary">Status</span>
                <Select {...register('status')}>
                  <option value="Completed">Completed</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Maintenance">Maintenance</option>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-secondary">Category</label>
                <Select {...register('category')}>
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Full Stack">Full Stack</option>
                  <option value="DevOps">DevOps</option>
                  <option value="Mobile">Mobile</option>
                </Select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-secondary">Demo Links</label>
                <Input {...register('demo_url')} placeholder="Live Demo Link URL" className="text-xs" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary">GitHub Link URL</label>
              <Input {...register('github_url')} placeholder="GitHub Repo Link URL" className="text-xs" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary">Short Summary Description</label>
              <Input {...register('short_description', { required: true })} placeholder="1-sentence description" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-text-secondary">Thumbnail Image</label>
              <FileUpload
                folder="projects/thumbnails"
                accept="image/*"
                value={watchThumbnail}
                onUploadComplete={(url) => setValue('thumbnail_url', url)}
              />
            </div>

            {/* TipTap Rich editor blocks */}
            <div className="space-y-4 pt-2 border-t border-border-subtle">
              <span className="text-xs font-bold uppercase text-text-tertiary tracking-wider">Detailed Narratives</span>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-secondary">Description (Rich HTML)</label>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <RichTextEditor value={field.value ?? ''} onChange={field.onChange} />
                  )}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-secondary">Problem Statement (Rich HTML)</label>
                <Controller
                  name="problem_statement"
                  control={control}
                  render={({ field }) => (
                    <RichTextEditor value={field.value ?? ''} onChange={field.onChange} />
                  )}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-secondary">Solution Description (Rich HTML)</label>
                <Controller
                  name="solution"
                  control={control}
                  render={({ field }) => (
                    <RichTextEditor value={field.value ?? ''} onChange={field.onChange} />
                  )}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-secondary">Architecture Details (Rich HTML)</label>
                <Controller
                  name="architecture"
                  control={control}
                  render={({ field }) => (
                    <RichTextEditor value={field.value ?? ''} onChange={field.onChange} />
                  )}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-secondary">Key Features (Rich HTML)</label>
                <Controller
                  name="key_features"
                  control={control}
                  render={({ field }) => (
                    <RichTextEditor value={field.value ?? ''} onChange={field.onChange} />
                  )}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-secondary">Challenges Faced (Rich HTML)</label>
                <Controller
                  name="challenges"
                  control={control}
                  render={({ field }) => (
                    <RichTextEditor value={field.value ?? ''} onChange={field.onChange} />
                  )}
                />
              </div>
            </div>

            {/* Tech Stack List */}
            <div className="space-y-1 pt-2 border-t border-border-subtle">
              <label className="text-xs font-semibold text-text-secondary">Project Tech Stack</label>
              <Controller
                name="tech_stack"
                control={control}
                render={({ field }) => (
                  <TagInput
                    tags={field.value ?? []}
                    onChange={field.onChange}
                    placeholder="e.g. Next.js, Prisma, Tailwind"
                  />
                )}
              />
            </div>

            {/* Multi Image Gallery */}
            <div className="space-y-3 pt-2 border-t border-border-subtle">
              <span className="text-xs font-bold text-text-secondary">Image Showcase Gallery</span>
              <FileUpload
                folder="projects/gallery"
                accept="image/*"
                onUploadComplete={addGalleryImage}
              />

              {watchGallery.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-2 border border-border-default p-2 rounded-xl bg-bg-primary/50">
                  {watchGallery.map((url, idx) => (
                    <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border border-border-subtle bg-white">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(idx)}
                        className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border-subtle">
            <Button type="button" variant="ghost" onClick={() => setView('list')} size="sm">
              Cancel
            </Button>
            <Button type="submit" disabled={saveMutation.isPending} size="sm">
              {saveMutation.isPending ? 'Saving...' : 'Save Project'}
            </Button>
          </div>
        </form>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteProject}
        onClose={() => setDeleteProject(null)}
        onConfirm={() => deleteProject && deleteMutation.mutate(deleteProject)}
        title="Delete Project"
        description={`Are you sure you want to delete project: ${deleteProject?.title}? This action cannot be undone.`}
      />
    </div>
  );
};

export default ProjectsManager;
