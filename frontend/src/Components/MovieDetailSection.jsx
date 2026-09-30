import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Star,
  Calendar,
  Clock,
  TrendingUp,
  Sparkles,
  ExternalLink,
  X,
  Film,
  Loader2
} from 'lucide-react';
import { getTmdbImageUrl } from '../utils/tmdb';

function MovieDetailSection({
  movie,
  onFindSimilar,
  onClose,
  recLoading = false
}) {
  const [posterError, setPosterError] = useState(false);
  const [backdropError, setBackdropError] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Reset image error states whenever movie identity changes
  useEffect(() => {
    setPosterError(false);
    setBackdropError(false);
  }, [movie?.id, movie?.title]);

  if (!movie) return null;

  const backdropUrl = getTmdbImageUrl(movie.backdrop_path, 'w1280');
  const posterUrl = getTmdbImageUrl(movie.poster_path, 'w500');

  // Format runtime to "Xh Ym"
  const formattedRuntime = movie.runtime
    ? movie.runtime >= 60
      ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
      : `${movie.runtime}m`
    : null;

  // Release year and full formatted date
  const releaseYear = movie.release_date && typeof movie.release_date === 'string'
    ? movie.release_date.slice(0, 4)
    : null;

  const releaseDateFormatted = movie.release_date && typeof movie.release_date === 'string'
    ? movie.release_date.slice(0, 10)
    : null;

  // Validate homepage URL
  const hasValidHomepage = movie.homepage &&
    typeof movie.homepage === 'string' &&
    /^https?:\/\//i.test(movie.homepage.trim());

  const genresList = Array.isArray(movie.genres) ? movie.genres : [];

  return (
    <section id="movie-detail" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 scroll-mt-24">
      <motion.div
        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
        animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
        transition={{ duration: shouldReduceMotion ? 0.2 : 0.45, ease: 'easeOut' }}
        className="relative rounded-3xl overflow-hidden bg-white border border-canvas-border shadow-card"
      >
        {/* Backdrop Banner Area */}
        <div className="relative h-64 sm:h-80 md:h-[420px] w-full bg-slate-900 overflow-hidden">
          {backdropUrl && !backdropError ? (
            <img
              src={backdropUrl}
              alt={`${movie.title || 'Movie'} Backdrop`}
              onError={() => setBackdropError(true)}
              className="w-full h-full object-cover object-center filter brightness-90"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-800 flex items-center justify-center">
              <Film className="w-16 h-16 text-slate-700/60" />
            </div>
          )}

          {/* Cinematic Dark Gradient Overlays for High Legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/30" />

          {/* Close Action in Top Right */}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white/90 hover:text-white backdrop-blur-md border border-white/20 transition-all hover:scale-105 active:scale-95 shadow-md focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
              aria-label="Close Movie Detail"
              title="Close and return to catalog"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          {/* Quick Header in Backdrop (on mobile/medium) */}
          <div className="absolute bottom-6 left-6 right-6 z-10 hidden md:block">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-brand-light/90 text-brand backdrop-blur-md border border-brand/20">
                Featured Selection
              </span>
              {genresList.slice(0, 3).map((g) => (
                <span
                  key={g}
                  className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-white/20 text-white backdrop-blur-md border border-white/20"
                >
                  {g}
                </span>
              ))}
            </div>
            <h1 className="text-3xl lg:text-5xl font-black text-white tracking-tight drop-shadow-md line-clamp-2">
              {movie.title || 'Untitled Movie'}
            </h1>
          </div>
        </div>

        {/* Content Body Area */}
        <div className="p-6 sm:p-10 relative z-10 bg-white">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            
            {/* Poster Frame (Floating above backdrop seam) */}
            <div className="w-44 sm:w-56 md:w-64 -mt-24 sm:-mt-32 md:-mt-40 relative z-20 shrink-0 mx-auto md:mx-0">
              <div className="aspect-[2/3] rounded-2xl overflow-hidden bg-slate-900 shadow-2xl border-4 border-white">
                {posterUrl && !posterError ? (
                  <img
                    src={posterUrl}
                    alt={movie.title || 'Poster'}
                    onError={() => setPosterError(true)}
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-slate-100 text-ink-muted">
                    <Film className="w-12 h-12 text-brand mb-2" />
                    <span className="text-xs font-medium">No Poster Available</span>
                  </div>
                )}
              </div>
            </div>

            {/* Movie Info & Actions */}
            <div className="flex-grow w-full">
              
              {/* Mobile Title (visible only on small screens) */}
              <div className="md:hidden mb-4 text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-primary tracking-tight">
                  {movie.title || 'Untitled Movie'}
                </h1>
              </div>

              {/* Tagline */}
              {movie.tagline && (
                <p className="text-base sm:text-lg text-brand-violet italic font-medium leading-relaxed mb-4">
                  "{movie.tagline}"
                </p>
              )}

              {/* Key Badges Row */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-6">
                {/* Rating Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-xs sm:text-sm font-bold text-amber-800 shadow-2xs">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>{typeof movie.vote_average === 'number' && movie.vote_average > 0 ? movie.vote_average.toFixed(1) : 'NR'}</span>
                  <span className="text-[10px] text-amber-600/80 font-normal">/ 10</span>
                </div>

                {/* Release Year */}
                {releaseYear && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-canvas-subtle border border-canvas-border text-xs sm:text-sm font-semibold text-ink-primary shadow-2xs">
                    <Calendar className="w-4 h-4 text-brand" />
                    <span>{releaseYear}</span>
                  </div>
                )}

                {/* Runtime */}
                {formattedRuntime && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-canvas-subtle border border-canvas-border text-xs sm:text-sm font-semibold text-ink-primary shadow-2xs">
                    <Clock className="w-4 h-4 text-ink-muted" />
                    <span>{formattedRuntime}</span>
                  </div>
                )}

                {/* Popularity Metric */}
                {typeof movie.popularity === 'number' && movie.popularity > 0 && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-canvas-subtle border border-canvas-border text-xs sm:text-sm font-medium text-ink-secondary shadow-2xs">
                    <TrendingUp className="w-4 h-4 text-brand-violet" />
                    <span>Popularity: {movie.popularity.toFixed(1)}</span>
                  </div>
                )}
              </div>

              {/* Genres List */}
              {genresList.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {genresList.map((genre) => (
                    <span
                      key={genre}
                      className="px-3 py-1 rounded-lg bg-canvas-subtle border border-canvas-border text-xs font-semibold text-ink-secondary"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              )}

              {/* Plot Overview */}
              <div className="mb-8">
                <h2 className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-2">
                  Plot Overview
                </h2>
                <p className="text-sm sm:text-base text-ink-secondary leading-relaxed font-normal">
                  {movie.overview && movie.overview.trim()
                    ? movie.overview
                    : 'Overview unavailable for this title.'}
                </p>
              </div>

              {/* Extended Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-canvas-subtle/80 border border-canvas-border mb-8 text-xs">
                <div>
                  <span className="text-ink-muted block font-medium">Release Date</span>
                  <strong className="text-ink-primary font-semibold">{releaseDateFormatted || 'N/A'}</strong>
                </div>
                <div>
                  <span className="text-ink-muted block font-medium">Runtime</span>
                  <strong className="text-ink-primary font-semibold">{movie.runtime ? `${movie.runtime} minutes` : 'N/A'}</strong>
                </div>
                <div>
                  <span className="text-ink-muted block font-medium">Catalog ID</span>
                  <strong className="text-ink-primary font-mono">{movie.id || 'N/A'}</strong>
                </div>
              </div>

              {/* Interactive Actions CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-canvas-borderLight">
                {/* Primary Recommendation CTA */}
                <button
                  type="button"
                  onClick={() => onFindSimilar && onFindSimilar(movie.title)}
                  disabled={recLoading}
                  aria-busy={recLoading}
                  aria-label="Find similar movies using content recommendation"
                  className="px-6 sm:px-8 py-3.5 rounded-xl bg-gradient-to-r from-brand via-brand-blue to-brand-violet hover:from-brand-hover hover:to-brand-violetHover text-white font-bold text-xs sm:text-sm tracking-wider uppercase shadow-md shadow-brand/25 hover:shadow-lg hover:shadow-brand/35 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none"
                >
                  {recLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Finding Similar Movies...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-white" />
                      <span>Find Similar Movies</span>
                    </>
                  )}
                </button>

                {/* Official Site CTA */}
                {hasValidHomepage && (
                  <a
                    href={movie.homepage.trim()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-canvas-border hover:border-slate-300 text-xs sm:text-sm font-semibold text-ink-primary transition-all flex items-center gap-2 shadow-2xs focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none"
                  >
                    <span>Official Site</span>
                    <ExternalLink className="w-4 h-4 text-brand" />
                  </a>
                )}
              </div>

            </div>

          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default MovieDetailSection;
