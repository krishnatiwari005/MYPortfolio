import * as React from 'react';
import { cn } from '@/lib/utils';

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-border-default/40', className)}
      {...props}
    />
  );
}

// Hero Skeleton
export function HeroSkeleton() {
  return (
    <div className="w-full min-h-[70vh] flex flex-col md:flex-row items-center gap-12 py-12">
      <div className="flex-1 space-y-6">
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-16 w-3/4 rounded-2xl" />
        <Skeleton className="h-8 w-1/2 rounded-xl" />
        <Skeleton className="h-20 w-5/6 rounded-2xl" />
        <div className="flex gap-4">
          <Skeleton className="h-10 w-32 rounded-xl" />
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
      </div>
      <div className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] rounded-3xl">
        <Skeleton className="w-full h-full rounded-3xl" />
      </div>
    </div>
  );
}

// Skill Card Skeleton
export function SkillCardSkeleton() {
  return (
    <div className="border border-border-subtle rounded-xl p-5 bg-white/60 space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-10 w-10 rounded-xl" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="h-6 w-24 rounded-md" />
      <Skeleton className="h-4 w-12 rounded-md" />
      <div className="space-y-1">
        <Skeleton className="h-1.5 w-full rounded-full" />
      </div>
    </div>
  );
}

// Project Card Skeleton
export function ProjectCardSkeleton() {
  return (
    <div className="border border-border-subtle rounded-2xl overflow-hidden bg-white/60">
      <Skeleton className="aspect-video w-full" />
      <div className="p-5 space-y-3">
        <div className="flex justify-between">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="h-6 w-32 rounded-md" />
        <Skeleton className="h-12 w-full rounded-md" />
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-5 w-12 rounded-full" />
          <Skeleton className="h-5 w-12 rounded-full" />
          <Skeleton className="h-5 w-12 rounded-full" />
        </div>
      </div>
    </div>
  );
}

// Certificate Card Skeleton
export function CertificateCardSkeleton() {
  return (
    <div className="border border-border-subtle rounded-xl overflow-hidden bg-white/60 p-4 space-y-3">
      <Skeleton className="h-32 w-full rounded-lg" />
      <Skeleton className="h-5 w-3/4 rounded-md" />
      <Skeleton className="h-3.5 w-1/2 rounded-md" />
      <Skeleton className="h-3.5 w-1/3 rounded-md" />
    </div>
  );
}

// Section Skeleton
export function SectionSkeleton({ gridCols = 3 }: { gridCols?: number }) {
  return (
    <div className="space-y-8 py-12">
      <div className="flex flex-col items-center space-y-3">
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-10 w-48 rounded-md" />
        <Skeleton className="h-4 w-64 rounded-md" />
      </div>
      <div
        className={cn('grid gap-6', {
          'grid-cols-1 md:grid-cols-2 lg:grid-cols-3': gridCols === 3,
          'grid-cols-1 md:grid-cols-2 lg:grid-cols-4': gridCols === 4,
          'grid-cols-1 md:grid-cols-2': gridCols === 2,
        })}
      >
        {Array.from({ length: 6 }).map((_, i) =>
          gridCols === 4 ? (
            <SkillCardSkeleton key={i} />
          ) : gridCols === 3 ? (
            <ProjectCardSkeleton key={i} />
          ) : (
            <CertificateCardSkeleton key={i} />
          )
        )}
      </div>
    </div>
  );
}

// Admin List Skeleton
export function AdminListSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-32 rounded-md" />
        <Skeleton className="h-10 w-24 rounded-md" />
      </div>
      <div className="border border-border-subtle rounded-2xl bg-white divide-y divide-border-subtle">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <div className="space-y-1.5">
                <Skeleton className="h-5 w-32 rounded-md" />
                <Skeleton className="h-3.5 w-48 rounded-md" />
              </div>
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-8 w-16 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default Skeleton;
