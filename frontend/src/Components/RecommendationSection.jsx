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
  onRetry
}, ref) => {
  // If no search has occurred yet, don't display section
  if (!hasSearched && !loading && !error) {
    return null;
  }

  return (
    <section ref={ref} id="recommendations" className="py-12 sm:py-16 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Loading State */}
        {loading && (
          <div>
            <div className="flex flex-col items-center text-center mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cinema-800/80 border border-cinema-700 text-xs font-semibold text-cinema-accent mb-3 animate-pulse">
                <Sparkles className="w-3.5 h-3.5 text-cinema-accent" />
                <span>Computing Cosine Similarities</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Analyzing Characteristics for "{searchedTitle}"...
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                Vectorizing plot overviews, genres, cast, and directors across 4,800+ films...
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <MovieCardSkeleton key={i} />
              ))}
            </div>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto p-6 sm:p-8 rounded-2xl bg-cinema-900/95 border border-cinema-crimson/40 shadow-2xl text-center"
          >
            <div className="w-12 h-12 rounded-full bg-cinema-crimson/15 border border-cinema-crimson/30 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6 text-cinema-crimson" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Movie Lookup Error</h3>
            <p className="text-sm text-slate-300 mb-6 leading-relaxed">
              {error}
            </p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cinema-800 hover:bg-cinema-700 border border-cinema-700 text-xs font-semibold uppercase tracking-wider text-slate-200 hover:text-white transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5 text-cinema-accent" />
                <span>Try Another Search</span>
              </button>
            )}
          </motion.div>
        )}

        {/* Empty Result State */}
        {!loading && !error && hasSearched && recommendations.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto p-8 rounded-2xl bg-cinema-900/90 border border-cinema-700/60 shadow-xl text-center"
          >
            <div className="w-12 h-12 rounded-full bg-cinema-800 border border-cinema-700 flex items-center justify-center mx-auto mb-4">
              <Film className="w-6 h-6 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">No Recommendations Found</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              We couldn't compute close similarity matches for "{searchedTitle}". Try searching for popular titles like Inception, The Dark Knight, or Avatar.
            </p>
          </motion.div>
        )}

        {/* Success / Recommendations Grid */}
        {!loading && !error && recommendations.length > 0 && (
          <div>
            {/* Results Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-cinema-800"
            >
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-cinema-800/90 border border-cinema-700/80 text-xs font-semibold text-cinema-accent mb-2">
                  <Sparkles className="w-3 h-3 text-cinema-accent" />
                  <span>RECOMMENDATION RESULTS</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Because you liked{' '}
                  <span className="text-cinema-accent font-serif italic font-normal">
                    "{searchedTitle}"
                  </span>
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  Top {recommendations.length} content-similar titles ranked by angular cosine distance
                </p>
              </div>

              <div className="text-xs text-slate-400 font-medium">
                Showing <span className="text-white font-bold">{recommendations.length}</span> films
              </div>
            </motion.div>

            {/* Movie Cards Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((movie, index) => (
                <MovieCard
                  key={movie._id || movie.id || index}
                  movie={movie}
                  index={index}
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
