import React from 'react';
import { Clapperboard, Sparkles, Database, Layers } from 'lucide-react';
import SearchBar from './SearchBar';

function Hero({ movieName, setMovieName, onSearch, loading }) {
  return (
    <section className="relative pt-10 sm:pt-16 md:pt-20 pb-16 sm:pb-24 overflow-hidden">
      {/* Background Soft Gradients & Atmospheric Shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft abstract ambient glow */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-[850px] h-[350px] bg-gradient-to-b from-brand-light/60 via-brand-violetLight/25 to-transparent blur-3xl rounded-full" />

        {/* Subtle geometric dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        {/* Soft bottom blend to canvas */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-canvas to-transparent" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        {/* Eyebrow Badge */}
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-white border border-brand/20 text-[11px] sm:text-xs font-semibold text-brand shadow-xs mb-5 sm:mb-6">
          <Clapperboard className="w-3.5 h-3.5 text-brand shrink-0" />
          <span>Content-Based Cinema Recommendation</span>
          <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-brand" />
          <span className="hidden sm:inline-block text-ink-muted font-normal">4,800+ Titles</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-2xl sm:text-5xl lg:text-6xl font-extrabold text-ink-primary tracking-tight leading-snug sm:leading-[1.15] font-sans">
          Discover Films Through{' '}
          <span className="bg-gradient-to-r from-brand via-brand-blue to-brand-violet bg-clip-text text-transparent">
            Content Intelligence
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="mt-4 sm:mt-5 max-w-2xl mx-auto text-xs sm:text-lg text-ink-secondary leading-relaxed font-normal px-2">
          Input any movie you love. Our CountVectorizer and cosine similarity algorithms evaluate thematic keywords, plot overviews, genres, cast, and directors to curate matching cinema.
        </p>

        {/* Embedded Search Bar & Popular Suggestions */}
        <div className="mt-6 sm:mt-10">
          <SearchBar
            movieName={movieName}
            setMovieName={setMovieName}
            onSearch={onSearch}
            loading={loading}
          />
        </div>

        {/* Feature Stat Pills */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-canvas-border max-w-3xl mx-auto grid grid-cols-3 gap-1 sm:gap-4 text-center">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-brand text-xs sm:text-sm font-bold">
              <Database className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand shrink-0" />
              <span>4,803 Titles</span>
            </div>
            <span className="text-[10px] sm:text-xs text-ink-muted mt-0.5">MongoDB Atlas</span>
          </div>

          <div className="flex flex-col items-center border-x border-canvas-border px-1">
            <div className="flex items-center gap-1 text-brand-violet text-xs sm:text-sm font-bold">
              <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-violet shrink-0" />
              <span>5,000 Vectors</span>
            </div>
            <span className="text-[10px] sm:text-xs text-ink-muted mt-0.5">Feature Space</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-accent-cyan text-xs sm:text-sm font-bold">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent-cyan shrink-0" />
              <span>Cosine Metric</span>
            </div>
            <span className="text-[10px] sm:text-xs text-ink-muted mt-0.5">Similarity Engine</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
