import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Film, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

function MovieCard({ movie, index }) {
  const [expanded, setExpanded] = useState(false);

  const releaseYear = (movie.release_date && typeof movie.release_date === 'string')
    ? movie.release_date.slice(0, 4)
    : null;

  const releaseDateFormatted = (movie.release_date && typeof movie.release_date === 'string')
    ? movie.release_date.slice(0, 10)
    : 'N/A';

  const runtimeText = movie.runtime ? `${movie.runtime} min` : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.07, ease: 'easeOut' }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="group relative flex flex-col h-full rounded-2xl overflow-hidden bg-white border border-canvas-border hover:border-brand/40 shadow-card hover:shadow-card-hover transition-all duration-300"
    >
      {/* Cinematic Poster / Feature Visual Frame */}
      <div className="relative aspect-[16/10] sm:aspect-[3/2] bg-gradient-to-br from-slate-50 via-canvas-muted to-brand-light/30 overflow-hidden flex items-center justify-center p-6 border-b border-canvas-borderLight">
        {/* Subtle decorative glow */}
        <div className="absolute inset-0 bg-radial-gradient from-brand/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        
        {/* Film reel placeholder badge */}
        <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-center justify-center group-hover:scale-105 group-hover:border-brand/30 transition-all duration-300">
          <Film className="w-7 h-7 text-brand group-hover:text-brand-violet transition-colors" />
        </div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/95 backdrop-blur-md border border-slate-200/90 text-xs font-semibold text-ink-primary shadow-2xs">
          <Calendar className="w-3.5 h-3.5 text-brand" />
          <span>{releaseYear || 'Cinema'}</span>
        </div>

        {runtimeText && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/95 backdrop-blur-md border border-slate-200/90 text-xs font-medium text-ink-secondary shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-brand-violet" />
            <span>{runtimeText}</span>
          </div>
        )}
      </div>

      {/* Card Content Area */}
      <div className="p-5 sm:p-6 flex flex-col flex-grow justify-between gap-4">
        <div>
          {/* Movie Title */}
          <h3 className="text-lg sm:text-xl font-bold text-ink-primary tracking-tight leading-snug group-hover:text-brand transition-colors">
            {movie.title || 'Untitled Movie'}
          </h3>

          {/* Tagline */}
          {movie.tagline ? (
            <p className="mt-1.5 text-xs sm:text-sm text-brand-violet italic font-medium leading-relaxed">
              "{movie.tagline}"
            </p>
          ) : (
            <p className="mt-1.5 text-xs text-ink-faint italic">No tagline recorded</p>
          )}

          {/* Plot Overview */}
          {movie.overview && (
            <div className="mt-3 text-xs sm:text-sm text-ink-secondary leading-relaxed">
              <p>
                {expanded ? movie.overview : `${movie.overview.slice(0, 140)}${movie.overview.length > 140 ? '...' : ''}`}
              </p>
              {movie.overview.length > 140 && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="mt-1 text-[11px] font-semibold text-brand hover:text-brand-hover flex items-center gap-0.5 focus:outline-none"
                >
                  {expanded ? (
                    <>
                      Show less <ChevronUp className="w-3 h-3" />
                    </>
                  ) : (
                    <>
                      Read more <ChevronDown className="w-3 h-3" />
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Card Metadata Footer */}
        <div className="pt-3 border-t border-canvas-borderLight flex items-center justify-between text-xs text-ink-muted">
          <div>
            <span className="text-ink-faint font-medium">Release:</span>{' '}
            <span className="text-ink-secondary font-semibold">{releaseDateFormatted}</span>
          </div>

          {movie.homepage ? (
            <a
              href={movie.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-brand hover:text-brand-hover font-semibold transition-colors"
            >
              <span>Official Site</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          ) : (
            <span className="text-[11px] text-ink-faint font-mono">ID: {movie.id}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default MovieCard;
