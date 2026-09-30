import React from 'react';
import { ArrowUp, Compass, Sparkles, Cpu, Search, Database, Layers, CheckCircle2 } from 'lucide-react';
import cinemaLogo from '../assets/hero-images/cinema logo.jpg';

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-300 pt-16 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800/80">
          {/* Column 1: Brand & Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md border border-slate-700/80 shrink-0 bg-slate-900 ring-1 ring-white/10">
                <img
                  src={cinemaLogo}
                  alt="CineMatch Logo"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold tracking-tight text-white font-sans">
                    Cine<span className="text-brand-light">Match</span>
                  </span>
                  <span className="text-[10px] tracking-wider font-semibold uppercase px-2 py-0.5 rounded-full bg-brand/20 text-brand-light border border-brand/40">
                    ML
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">
                  Content-Based Cinema Engine
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Intelligent movie discovery powered by Natural Language Processing and cosine similarity across 4,800+ cinema titles.
            </p>

            <div className="pt-2 flex items-center gap-2 text-[11px] text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Full-Stack ML Pipeline Active</span>
            </div>
          </div>

          {/* Column 2: Quick Navigation */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Explore & Discover
            </h3>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('discover-catalog')}
                  className="text-slate-300 hover:text-white transition-colors flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none rounded py-0.5"
                >
                  <Compass className="w-3.5 h-3.5 text-brand-light shrink-0" />
                  <span>Movie Catalog</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('how-it-works')}
                  className="text-slate-300 hover:text-white transition-colors flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none rounded py-0.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-brand-violet shrink-0" />
                  <span>How It Works</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('engine-details')}
                  className="text-slate-300 hover:text-white transition-colors flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none rounded py-0.5"
                >
                  <Cpu className="w-3.5 h-3.5 text-accent-cyan shrink-0" />
                  <span>System Architecture</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('hero-search')}
                  className="text-slate-300 hover:text-white transition-colors flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none rounded py-0.5"
                >
                  <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Search Titles</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Verified Technology Stack */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Architecture & Stack
            </h3>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center justify-between">
                <span className="text-slate-400">Frontend</span>
                <span className="font-semibold text-slate-200">React 18 · Tailwind</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-slate-400">API Layer</span>
                <span className="font-semibold text-slate-200">Node · Express REST</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-slate-400">Database</span>
                <span className="font-semibold text-slate-200">MongoDB Atlas (4.8k)</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-slate-400">ML Service</span>
                <span className="font-semibold text-slate-200">Django · Python</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-slate-400">Animation</span>
                <span className="font-semibold text-slate-200">Framer Motion</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Recommendation Engine Specs */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              ML Model Specifications
            </h3>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-brand-light shrink-0" />
                <span className="text-slate-400">Vector Model:</span>
                <span className="font-semibold text-slate-200">CountVectorizer</span>
              </li>
              <li className="flex items-center gap-2">
                <Database className="w-3.5 h-3.5 text-brand-violet shrink-0" />
                <span className="text-slate-400">Dimensions:</span>
                <span className="font-semibold text-slate-200">5,000 Features</span>
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-accent-cyan shrink-0" />
                <span className="text-slate-400">Metric:</span>
                <span className="font-semibold text-slate-200">Cosine Similarity</span>
              </li>
              <li className="text-[11px] text-slate-400 leading-relaxed pt-1">
                Factual content similarity computed across combined genres, plot keywords, overview, cast, and directors.
              </li>
            </ul>
          </div>
        </div>

        {/* Legal, TMDB Attribution, and Back-to-Top Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          {/* TMDB Legal Notice */}
          <div className="max-w-2xl text-center md:text-left space-y-1">
            <p className="text-slate-300">
              This product uses the TMDB API but is not endorsed or certified by TMDB.
            </p>
            <p className="text-[11px] text-slate-500">
              © {new Date().getFullYear()} CineMatch Discovery System. Built for Big Data Analytics. All movie metadata and poster artwork are provided by TMDB.
            </p>
          </div>

          {/* Back to top button */}
          <div className="shrink-0">
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-slate-200 hover:text-white hover:border-brand/50 shadow-sm transition-all duration-200 text-xs font-semibold focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none"
              aria-label="Scroll back to top of the page"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5 text-brand-light" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
