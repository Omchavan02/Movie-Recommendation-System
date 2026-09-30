import React from 'react';

function MovieDetailSkeleton() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      <div className="relative rounded-3xl overflow-hidden bg-white border border-canvas-border shadow-card">
        {/* Backdrop Skeleton Banner */}
        <div className="h-64 sm:h-80 md:h-96 w-full bg-slate-200" />

        {/* Content Skeleton Area */}
        <div className="p-6 sm:p-10 -mt-24 sm:-mt-32 relative z-10">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Poster Skeleton */}
            <div className="w-48 sm:w-56 md:w-64 aspect-[2/3] rounded-2xl bg-slate-300 shrink-0 shadow-lg border-4 border-white" />

            {/* Info Skeleton */}
            <div className="flex-grow w-full space-y-4 pt-4 sm:pt-16">
              <div className="h-8 sm:h-10 w-3/4 rounded-lg bg-slate-200" />
              <div className="h-5 w-1/2 rounded bg-slate-100" />

              <div className="flex flex-wrap gap-2 pt-2">
                <div className="h-6 w-16 rounded-md bg-slate-200" />
                <div className="h-6 w-20 rounded-md bg-slate-200" />
                <div className="h-6 w-24 rounded-md bg-slate-200" />
              </div>

              <div className="space-y-2 pt-4">
                <div className="h-4 w-full rounded bg-slate-100" />
                <div className="h-4 w-5/6 rounded bg-slate-100" />
                <div className="h-4 w-4/6 rounded bg-slate-100" />
              </div>

              <div className="flex gap-4 pt-4">
                <div className="h-12 w-48 rounded-xl bg-slate-300" />
                <div className="h-12 w-32 rounded-xl bg-slate-200" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetailSkeleton;
