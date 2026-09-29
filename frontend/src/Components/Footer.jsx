import React from 'react';
import { Film, ArrowUp } from 'lucide-react';

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-cinema-950 border-t border-cinema-800/80 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-cinema-800/60">
          {/* Brand info */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cinema-850 border border-cinema-700 flex items-center justify-center">
              <Film className="w-5 h-5 text-cinema-accent" />
            </div>
            <div>
              <span className="text-lg font-bold text-white tracking-tight">
                Cine<span className="text-cinema-accent">Match</span>
              </span>
              <p className="text-xs text-slate-400">
                Content-Based Movie Recommendation Engine
              </p>
            </div>
          </div>

          {/* Nav links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-slate-300">
            <button
              onClick={() => scrollTo('hero-search')}
              className="hover:text-cinema-accent transition-colors"
            >
              Discover
            </button>
            <button
              onClick={() => scrollTo('how-it-works')}
              className="hover:text-cinema-accent transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollTo('engine-details')}
              className="hover:text-cinema-accent transition-colors"
            >
              Architecture
            </button>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1 text-cinema-accent hover:text-cinema-accentHover transition-colors font-semibold"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>
            © {new Date().getFullYear()} CineMatch Discovery System. Content metadata sourced from TMDB dataset.
          </p>
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 rounded bg-cinema-900 border border-cinema-800 text-slate-400">React</span>
            <span className="px-2 py-0.5 rounded bg-cinema-900 border border-cinema-800 text-slate-400">Express</span>
            <span className="px-2 py-0.5 rounded bg-cinema-900 border border-cinema-800 text-slate-400">MongoDB Atlas</span>
            <span className="px-2 py-0.5 rounded bg-cinema-900 border border-cinema-800 text-slate-400">Django ML</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
