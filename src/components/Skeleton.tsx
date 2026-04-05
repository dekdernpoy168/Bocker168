import React from 'react';

export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse bg-zinc-800 rounded ${className}`} />
);

export const ArticleCardSkeleton: React.FC = () => (
  <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-3xl overflow-hidden flex flex-col h-full">
    <div className="h-56 bg-zinc-800 animate-pulse" />
    <div className="p-6 flex flex-col flex-1 space-y-4">
      <div className="flex gap-4">
        <Skeleton className="w-20 h-6 rounded-full" />
        <Skeleton className="w-24 h-6 rounded-full" />
      </div>
      <Skeleton className="w-full h-8" />
      <Skeleton className="w-3/4 h-8" />
      <div className="space-y-2 pt-4">
        <Skeleton className="w-full h-4" />
        <Skeleton className="w-full h-4" />
        <Skeleton className="w-1/2 h-4" />
      </div>
      <div className="mt-auto pt-6 border-t border-zinc-800 flex justify-between items-center">
        <Skeleton className="w-24 h-4" />
        <Skeleton className="w-20 h-4" />
      </div>
    </div>
  </div>
);

export const ArticleDetailSkeleton: React.FC = () => (
  <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-3xl overflow-hidden">
    <div className="p-8 md:p-12 space-y-8">
      <div className="flex items-center gap-4">
        <Skeleton className="w-20 h-6 rounded-full" />
        <Skeleton className="w-32 h-6 rounded-full" />
      </div>
      
      <div className="space-y-4">
        <Skeleton className="w-full h-12" />
        <Skeleton className="w-3/4 h-12" />
      </div>
      
      <div className="space-y-6 pt-8">
        <Skeleton className="w-full h-4" />
        <Skeleton className="w-full h-4" />
        <Skeleton className="w-full h-4" />
        <Skeleton className="w-5/6 h-4" />
        <Skeleton className="w-full h-4" />
        <Skeleton className="w-full h-4" />
        <Skeleton className="w-2/3 h-4" />
      </div>
      
      <div className="pt-12">
        <Skeleton className="w-full h-64 rounded-2xl" />
      </div>
      
      <div className="space-y-6 pt-8">
        <Skeleton className="w-full h-4" />
        <Skeleton className="w-full h-4" />
        <Skeleton className="w-3/4 h-4" />
      </div>
    </div>
  </div>
);

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <div className="divide-y divide-zinc-800">
    {[...Array(rows)].map((_, i) => (
      <div key={i} className="p-4 flex items-center gap-4">
        <div className="flex-1 space-y-2">
          <Skeleton className="w-3/4 h-4" />
          <Skeleton className="w-1/4 h-3" />
        </div>
        <Skeleton className="w-20 h-4 rounded-full" />
        <Skeleton className="w-24 h-4" />
        <div className="flex gap-2">
          <Skeleton className="w-8 h-8 rounded-lg" />
          <Skeleton className="w-8 h-8 rounded-lg" />
        </div>
      </div>
    ))}
  </div>
);
