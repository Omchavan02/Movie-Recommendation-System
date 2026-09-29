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
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: 'easeOut' }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="group relative flex flex-col h-full rounded-2xl overflow-hidden bg-cinema-900/90 border border-cinema-700/60 hover:border-cinema-accent/60 shadow-xl shadow-black/40 hover:shadow-2xl hover:shadow-cinema-amberGlow transition-colors duration-300"
    >
      {/* Cinematic Poster Header */}
      <div className="relative aspect-[16/10] sm:aspect-[3/2] bg-gradient-to-br from-cinema-800 via-cinema-850 to-cinema-950 overflow-hidden flex items-center justify-center p-6 border-b border-cinema-800/80">
        {/* Subtle background ambient radial glow */}
        <div className="absolute inset-0 bg-radial-gradient from-cinema-accent/10 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Decorative film reel icon */}
        <div className="w-16 h-16 rounded-2xl bg-cinema-800/80 border border-cinema-700 flex items-center justify-center shadow-inner group-hover:scale-110 group-hover:border-cinema-accent/40 transition-all duration-300">
          <Film className="w-8 h-8 text-cinema-accent/80 group-hover:text-cinema-accent transition-colors" />
        </div>

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-cinema-950/85 backdrop-blur-md border border-cinema-700/70 text-xs font-semibold text-slate-200">
          <Calendar className="w-3.5 h-3.5 text-cinema-accent" />
          <span>{releaseYear || 'Cinema'}</span>
        </div>

        {runtimeText && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-cinema-950/85 backdrop-blur-md border border-cinema-700/70 text-xs font-medium text-slate-300">
            <Clock className="w-3.5 h-3.5 text-cinema-accent" />
            <span>{runtimeText}</span>
          </div>
        )}

        {/* Bottom subtle gradient shadow on image area */}
        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-cinema-900 to-transparent" />
      </div>

      {/* Card Content */}
      <div className="p-5 sm:p-6 flex flex-col flex-grow justify-between gap-4">
        <div>
          {/* Title */}
          <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug group-hover:text-cinema-accent transition-colors">
            {movie.title || 'Untitled Movie'}
          </h3>

          {/* Tagline */}
          {movie.tagline ? (
            <p className="mt-1.5 text-xs sm:text-sm text-cinema-accent/90 italic font-medium leading-relaxed">
              "{movie.tagline}"
            </p>
          ) : (
            <p className="mt-1.5 text-xs text-slate-500 italic">No tagline registered</p>
          )}

          {/* Plot Overview */}
          {movie.overview && (
            <div className="mt-3 text-xs sm:text-sm text-slate-300/90 leading-relaxed">
              <p>
                {expanded ? movie.overview : `${movie.overview.slice(0, 140)}${movie.overview.length > 140 ? '...' : ''}`}
              </p>
              {movie.overview.length > 140 && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="mt-1 text-[11px] font-semibold text-cinema-accent hover:underline flex items-center gap-0.5 focus:outline-none"
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

        {/* Card Footer Metadata */}
        <div className="pt-3 border-t border-cinema-800/90 flex items-center justify-between text-xs text-slate-400">
          <div>
            <span className="text-slate-500 font-medium">Release:</span>{' '}
            <span className="text-slate-300 font-semibold">{releaseDateFormatted}</span>
          </div>

          {movie.homepage ? (
            <a
              href={movie.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-cinema-accent hover:text-cinema-accentHover hover:underline font-medium"
            >
              <span>Official Site</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          ) : (
            <span className="text-[11px] text-slate-600 font-mono">ID: {movie.id}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default MovieCard;
