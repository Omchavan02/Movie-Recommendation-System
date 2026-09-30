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
    <footer className="bg-canvas-subtle border-t border-canvas-border pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-200">
          {/* Brand info */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white border border-canvas-border shadow-xs flex items-center justify-center">
              <Film className="w-5 h-5 text-brand" />
            </div>
            <div>
              <span className="text-lg font-bold text-ink-primary tracking-tight">
                Cine<span className="text-brand">Match</span>
              </span>
              <p className="text-xs text-ink-muted">
                Content-Based Movie Recommendation Engine
              </p>
            </div>
          </div>

          {/* Nav links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-ink-secondary">
            <button
              onClick={() => scrollTo('hero-search')}
              className="hover:text-brand transition-colors focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none rounded px-1.5 py-0.5"
            >
              Discover
            </button>
            <button
              onClick={() => scrollTo('how-it-works')}
              className="hover:text-brand transition-colors focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none rounded px-1.5 py-0.5"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollTo('engine-details')}
              className="hover:text-brand transition-colors focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none rounded px-1.5 py-0.5"
            >
              Architecture
            </button>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1 text-brand hover:text-brand-hover transition-colors font-semibold focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none rounded px-1.5 py-0.5"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-ink-muted">
          <p>
            © {new Date().getFullYear()} CineMatch Discovery System. Content metadata sourced from TMDB dataset.
          </p>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-ink-secondary font-medium">React</span>
            <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-ink-secondary font-medium">Express</span>
            <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-ink-secondary font-medium">MongoDB Atlas</span>
            <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-ink-secondary font-medium">Django ML</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
