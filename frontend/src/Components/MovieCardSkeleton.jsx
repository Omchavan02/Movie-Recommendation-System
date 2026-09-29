import React from 'react';

function MovieCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden bg-white border border-canvas-border shadow-card animate-pulse flex flex-col h-full">
      {/* Poster Skeleton Area */}
      <div className="relative aspect-[16/10] sm:aspect-[3/2] bg-slate-100 flex items-center justify-center overflow-hidden">
        <div className="w-12 h-12 rounded-2xl bg-slate-200" />
        <div className="absolute top-3 left-3 w-16 h-5 rounded-md bg-slate-200" />
        <div className="absolute top-3 right-3 w-20 h-5 rounded-md bg-slate-200" />
      </div>

      {/* Content Skeleton */}
      <div className="p-5 sm:p-6 flex flex-col flex-grow justify-between gap-4">
        <div>
          <div className="h-6 w-3/4 rounded-md bg-slate-200 mb-2" />
          <div className="h-4 w-1/2 rounded-md bg-slate-100 mb-4" />
          <div className="space-y-2">
            <div className="h-3 w-full rounded bg-slate-100" />
            <div className="h-3 w-5/6 rounded bg-slate-100" />
            <div className="h-3 w-4/6 rounded bg-slate-100" />
          </div>
        </div>

        <div className="pt-3 border-t border-canvas-borderLight flex justify-between items-center">
          <div className="h-4 w-24 rounded bg-slate-100" />
          <div className="h-4 w-16 rounded bg-slate-100" />
        </div>
      </div>
    </div>
  );
}

export default MovieCardSkeleton;
