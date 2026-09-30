import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Calendar, Clock, Film, ExternalLink, ChevronDown, ChevronUp, Star, Sparkles } from 'lucide-react';
import { getTmdbImageUrl } from '../utils/tmdb';

function MovieCard({ movie, index, onSelect, onRecommend, isRecommendation = true }) {
  const [expanded, setExpanded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const releaseYear = (movie.release_date && typeof movie.release_date === 'string')
    ? movie.release_date.slice(0, 4)
    : null;

  const releaseDateFormatted = (movie.release_date && typeof movie.release_date === 'string')
    ? movie.release_date.slice(0, 10)
    : 'N/A';

  const runtimeText = movie.runtime ? `${movie.runtime} min` : null;

  const posterUrl = getTmdbImageUrl(movie.poster_path, 'w500');
  const fallbackBackdropUrl = getTmdbImageUrl(movie.backdrop_path, 'w780');
  const displayImage = posterUrl || fallbackBackdropUrl;

  // Reset image error state whenever movie identity or displayImage changes
  useEffect(() => {
    setImgError(false);
  }, [movie?._id, movie?.id, displayImage]);

  const hasValidHomepage = movie.homepage &&
    typeof movie.homepage === 'string' &&
    /^https?:\/\//i.test(movie.homepage.trim());

  const genresList = Array.isArray(movie.genres) ? movie.genres : [];

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
      animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: shouldReduceMotion ? 0 : index * 0.07, ease: 'easeOut' }}
      whileHover={shouldReduceMotion ? undefined : { y: -5, transition: { duration: 0.2 } }}
      className="group relative flex flex-col h-full rounded-2xl overflow-hidden bg-white border border-canvas-border hover:border-brand/40 shadow-card hover:shadow-card-hover transition-all duration-300"
    >
      {/* Cinematic Poster Frame */}
      <div
        role={onSelect ? 'button' : undefined}
        tabIndex={onSelect ? 0 : undefined}
        aria-label={onSelect ? `View details for ${movie.title || 'Movie'}` : undefined}
        onClick={onSelect ? () => onSelect(movie) : undefined}
        onKeyDown={onSelect ? (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect(movie);
          }
        } : undefined}
        className={`relative aspect-[16/10] sm:aspect-[3/2] bg-slate-900 overflow-hidden flex items-center justify-center border-b border-canvas-borderLight focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none ${onSelect ? 'cursor-pointer' : ''}`}
      >
        {displayImage && !imgError ? (
          <img
            src={displayImage}
            alt={movie.title || 'Movie Poster'}
            loading="lazy"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          /* Graceful CineMatch Fallback Placeholder */
          <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-slate-50 via-canvas-muted to-brand-light/30">
            <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-center justify-center mb-2 group-hover:scale-105 group-hover:border-brand/30 transition-all duration-300">
              <Film className="w-7 h-7 text-brand group-hover:text-brand-violet transition-colors" />
            </div>
            <span className="text-[11px] font-medium text-ink-muted">Cinema Catalog</span>
          </div>
        )}

        {/* Ambient Dark Gradient for Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/95 backdrop-blur-md border border-slate-200/90 text-xs font-bold text-ink-primary shadow-2xs">
          {typeof movie.vote_average === 'number' && movie.vote_average > 0 ? (
            <>
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{movie.vote_average.toFixed(1)}</span>
            </>
          ) : (
            <>
              <Star className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-ink-muted">NR</span>
            </>
          )}
        </div>

        {releaseYear && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/95 backdrop-blur-md border border-slate-200/90 text-xs font-semibold text-ink-primary shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-brand" />
            <span>{releaseYear}</span>
          </div>
        )}

        {/* Bottom Badges */}
        {isRecommendation ? (
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-950/85 backdrop-blur-md text-[11px] font-bold text-white shadow-2xs border border-white/20">
            <span className="text-brand-light font-extrabold tracking-wider">#{String(index + 1).padStart(2, '0')}</span>
            <span className="text-white/80 font-medium">Rank</span>
          </div>
        ) : (onRecommend || onSelect) ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onRecommend) onRecommend(movie.title);
              else if (onSelect) onSelect(movie);
            }}
            className="absolute bottom-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/95 hover:bg-white backdrop-blur-md text-[11px] font-bold text-brand shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer"
            aria-label={`Get recommendations for ${movie.title}`}
          >
            <Sparkles className="w-3 h-3 text-brand" />
            <span>Recommend</span>
          </button>
        ) : null}

        {runtimeText && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[11px] font-medium text-white shadow-2xs">
            <Clock className="w-3 h-3 text-white/90" />
            <span>{runtimeText}</span>
          </div>
        )}
      </div>

      {/* Card Content Area */}
      <div className="p-5 sm:p-6 flex flex-col flex-grow justify-between gap-4">
        <div>
          {/* Movie Title */}
          <h3
            onClick={onSelect ? () => onSelect(movie) : undefined}
            className={`text-lg sm:text-xl font-bold text-ink-primary tracking-tight leading-snug group-hover:text-brand transition-colors line-clamp-1 ${onSelect ? 'cursor-pointer' : ''}`}
            title={movie.title || 'Untitled Movie'}
          >
            {movie.title || 'Untitled Movie'}
          </h3>

          {/* Tagline */}
          {movie.tagline ? (
            <p className="mt-1 text-xs sm:text-sm text-brand-violet italic font-medium leading-relaxed line-clamp-1">
              "{movie.tagline}"
            </p>
          ) : (
            <p className="mt-1 text-xs text-ink-faint italic">No tagline recorded</p>
          )}

          {/* Genre Badges */}
          {genresList.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {genresList.slice(0, 3).map((genre) => (
                <span
                  key={genre}
                  className="px-2 py-0.5 rounded-md bg-canvas-subtle border border-canvas-border text-[11px] font-medium text-ink-secondary"
                >
                  {genre}
                </span>
              ))}
            </div>
          )}

          {/* Plot Overview */}
          {movie.overview && (
            <div className="mt-3 text-xs sm:text-sm text-ink-secondary leading-relaxed">
              <p>
                {expanded ? movie.overview : `${movie.overview.slice(0, 130)}${movie.overview.length > 130 ? '...' : ''}`}
              </p>
              {movie.overview.length > 130 && (
                <button
                  type="button"
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

          <div className="flex items-center gap-3">
            {isRecommendation ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onSelect) onSelect(movie);
                }}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-brand hover:text-brand-hover hover:underline transition-colors cursor-pointer"
                title={`View movie details for ${movie.title}`}
              >
                <span>Details &rarr;</span>
              </button>
            ) : (onRecommend || onSelect) ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onRecommend) onRecommend(movie.title);
                  else if (onSelect) onSelect(movie);
                }}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-brand hover:text-brand-hover hover:underline transition-colors"
                title={`Find recommendations similar to ${movie.title}`}
              >
                <Sparkles className="w-3 h-3 text-brand" />
                <span>Similar</span>
              </button>
            ) : null}

            {hasValidHomepage ? (
              <a
                href={movie.homepage.trim()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 text-ink-secondary hover:text-brand font-semibold transition-colors"
              >
                <span>Site</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            ) : (
              <span className="text-[11px] text-ink-faint font-mono">ID: {movie.id}</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default MovieCard;
