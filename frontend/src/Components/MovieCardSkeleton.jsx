import React from 'react';

function MovieCardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden bg-cinema-900 border border-cinema-700/50 shadow-lg animate-pulse flex flex-col h-full">
      {/* Poster Skeleton */}
      <div className="relative aspect-[16/10] sm:aspect-[3/2] bg-cinema-800/80 flex items-center justify-center overflow-hidden">
        <div className="w-12 h-12 rounded-full bg-cinema-700/60" />
        <div className="absolute top-3 left-3 w-16 h-5 rounded-md bg-cinema-700/80" />
        <div className="absolute top-3 right-3 w-20 h-5 rounded-md bg-cinema-700/80" />
      </div>

      {/* Content Skeleton */}
      <div className="p-5 flex flex-col flex-grow justify-between gap-4">
        <div>
          <div className="h-6 w-3/4 rounded-md bg-cinema-700/80 mb-2" />
          <div className="h-4 w-1/2 rounded-md bg-cinema-800/80 mb-4" />
          <div className="space-y-2">
            <div className="h-3 w-full rounded bg-cinema-800/60" />
            <div className="h-3 w-5/6 rounded bg-cinema-800/60" />
            <div className="h-3 w-4/6 rounded bg-cinema-800/60" />
          </div>
        </div>

        <div className="pt-3 border-t border-cinema-800/80 flex justify-between items-center">
          <div className="h-4 w-24 rounded bg-cinema-800" />
          <div className="h-4 w-16 rounded bg-cinema-800" />
        </div>
      </div>
    </div>
  );
}

export default MovieCardSkeleton;
