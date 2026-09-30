import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, AlertCircle, Film, RefreshCw } from 'lucide-react';
import MovieCard from './MovieCard';
import MovieCardSkeleton from './MovieCardSkeleton';

const RecommendationSection = forwardRef(({
  searchedTitle,
  recommendations,
  loading,
  error,
  hasSearched,
  onRetry,
  onSelectMovie
}, ref) => {
  // If no recommendation has been requested yet, don't display section
  if (!hasSearched && !loading && !error) {
    return null;
  }

  return (
    <section
      ref={ref}
      id="recommendations"
      className="py-12 sm:py-16 scroll-mt-24 transition-opacity duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Loading Experience */}
        {loading && (
          <div aria-live="polite">
            <div className="flex flex-col items-center text-center mb-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-light border border-brand/20 text-xs font-semibold text-brand mb-3 animate-pulse">
                <Sparkles className="w-3.5 h-3.5 text-brand" />
                <span>MORE LIKE THIS</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-ink-primary tracking-tight">
                Finding Movies Similar to "{searchedTitle}"...
              </h2>
              <p className="mt-2 text-sm text-ink-muted max-w-xl mx-auto">
                Evaluating linguistic and thematic feature vectors with content-based cosine similarity across 4,800+ films...
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <MovieCardSkeleton key={i} />
              ))}
            </div>
          </div>
        )}

        {/* Polished Error Experience */}
        {!loading && error && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-2xl mx-auto p-6 sm:p-8 rounded-2xl bg-white border border-accent-coral/30 shadow-card text-center"
          >
            <div className="w-12 h-12 rounded-full bg-accent-coralLight border border-accent-coral/30 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6 text-accent-coral" />
            </div>
            <h3 className="text-xl font-bold text-ink-primary mb-2">
              Unable to Generate Recommendations
            </h3>
            <p className="text-sm text-ink-secondary mb-6 leading-relaxed">
              {error}
            </p>
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand text-white text-xs font-semibold uppercase tracking-wider hover:bg-brand-hover shadow-sm transition-all active:scale-95 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Try Again</span>
              </button>
            )}
          </motion.div>
        )}

        {/* Empty Result Experience */}
        {!loading && !error && hasSearched && recommendations.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-2xl mx-auto p-8 rounded-2xl bg-white border border-canvas-border shadow-card text-center"
          >
            <div className="w-12 h-12 rounded-full bg-canvas-subtle border border-slate-200 flex items-center justify-center mx-auto mb-4">
              <Film className="w-6 h-6 text-ink-muted" />
            </div>
            <h3 className="text-lg font-bold text-ink-primary mb-2">No Similar Movies Were Found</h3>
            <p className="text-sm text-ink-muted max-w-md mx-auto">
              No matching content-similar titles were identified for "{searchedTitle}". Try exploring another film from the catalog.
            </p>
          </motion.div>
        )}

        {/* Success / Recommendations Grid */}
        {!loading && !error && recommendations.length > 0 && (
          <div>
            {/* Header: Contextual Source & Factual Explanation */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-5 border-b border-canvas-border"
            >
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-brand-light border border-brand/20 text-xs font-semibold text-brand mb-2.5">
                  <Sparkles className="w-3.5 h-3.5 text-brand" />
                  <span>MORE LIKE THIS</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-ink-primary tracking-tight">
                  More Like{' '}
                  <span className="text-brand font-serif italic font-semibold">
                    "{searchedTitle}"
                  </span>
                </h2>
                <p className="text-xs sm:text-sm text-ink-muted mt-1 max-w-2xl leading-relaxed">
                  Recommendations are generated using CineMatch's content-based similarity model across 4,800+ films.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-ink-secondary font-medium px-3 py-1.5 rounded-lg bg-white border border-canvas-border shadow-2xs">
                  Showing <strong className="text-brand font-bold">{recommendations.length}</strong> matches
                </span>
              </div>
            </motion.div>

            {/* Movie Cards Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((movie, index) => (
                <MovieCard
                  key={movie._id || movie.id || index}
                  movie={movie}
                  index={index}
                  onSelect={onSelectMovie}
                  isRecommendation={true}
                />
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
});

export default RecommendationSection;
