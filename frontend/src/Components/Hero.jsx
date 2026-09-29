import React from 'react';
import { motion } from 'framer-motion';
import { Clapperboard, Sparkles, Database, Layers } from 'lucide-react';
import SearchBar from './SearchBar';

function Hero({ movieName, setMovieName, onSearch, loading }) {
  return (
    <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
      {/* Background Ambient Glows & Grid Texture */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Top radial gradient aura */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-amber-500/10 via-cinema-700/20 to-transparent blur-3xl rounded-full" />
        
        {/* Subtle grid background */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #E5A65E 1px, transparent 0)`,
            backgroundSize: '36px 36px',
          }}
        />
        
        {/* Bottom fade to canvas */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-cinema-950 to-transparent" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Eyebrow Badge */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cinema-850/90 border border-cinema-700/70 text-xs font-semibold text-cinema-accent shadow-inner mb-6"
        >
          <Clapperboard className="w-3.5 h-3.5 text-cinema-accent" />
          <span>Content-Based Cinema Recommendation</span>
          <span className="w-1 h-1 rounded-full bg-cinema-accent" />
          <span className="text-slate-400 font-normal">4,800+ Titles</span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1, ease: 'easeOut' }}
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] font-sans"
        >
          Discover Films Through{' '}
          <span className="bg-gradient-to-r from-cinema-accent via-amber-200 to-amber-500 bg-clip-text text-transparent">
            Deep Content Similarity
          </span>
        </motion.h1>

        {/* Hero Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.2, ease: 'easeOut' }}
          className="mt-5 max-w-2xl mx-auto text-base sm:text-lg text-slate-300/90 leading-relaxed font-normal"
        >
          Input any movie you love. Our CountVectorizer and cosine-similarity algorithms evaluate thematic keywords, plot overviews, genres, cast, and directors to curate matching cinema.
        </motion.p>

        {/* Embedded Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
          className="mt-8 sm:mt-10"
        >
          <SearchBar
            movieName={movieName}
            setMovieName={setMovieName}
            onSearch={onSearch}
            loading={loading}
          />
        </motion.div>

        {/* Feature Stat Pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mt-12 pt-8 border-t border-cinema-800/60 max-w-3xl mx-auto grid grid-cols-3 gap-4 text-center"
        >
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-cinema-accent text-sm font-bold">
              <Database className="w-4 h-4 text-cinema-accent" />
              <span>4,803 Movies</span>
            </div>
            <span className="text-xs text-slate-400 mt-0.5">Indexed in MongoDB Atlas</span>
          </div>

          <div className="flex flex-col items-center border-x border-cinema-800/80">
            <div className="flex items-center gap-1.5 text-cinema-accent text-sm font-bold">
              <Layers className="w-4 h-4 text-cinema-accent" />
              <span>5,000 Features</span>
            </div>
            <span className="text-xs text-slate-400 mt-0.5">Stemmed Vector Matrix</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-cinema-accent text-sm font-bold">
              <Sparkles className="w-4 h-4 text-cinema-accent" />
              <span>Cosine Metric</span>
            </div>
            <span className="text-xs text-slate-400 mt-0.5">Angular Proximity Scoring</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;
