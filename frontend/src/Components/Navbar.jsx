import React, { useState, useEffect } from 'react';
import { Compass, Cpu, Menu, X, Sparkles, Search } from 'lucide-react';
import cinemaLogo from '../assets/hero-images/cinema logo.jpg';

function Navbar({ onSearchClick }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pt-3 sm:pt-4 transition-all duration-300 pointer-events-none">
      <div
        className={`pointer-events-auto w-[94%] max-w-[1560px] mx-auto rounded-2xl transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-md py-2.5 px-4 sm:px-6'
            : 'bg-white/90 backdrop-blur-md border border-canvas-border shadow-sm py-3 px-4 sm:px-6'
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Official CineMatch Brand Logo */}
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 cursor-pointer group text-left focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none rounded-xl p-1 -m-1"
            aria-label="CineMatch Home - Scroll to top"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden shadow-xs border border-slate-200/80 group-hover:scale-105 group-hover:shadow-md transition-all duration-200 shrink-0 bg-slate-900">
              <img
                src={cinemaLogo}
                alt="CineMatch Logo"
                className="w-full h-full object-cover object-center"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-ink-primary font-sans">
                  Cine<span className="text-brand">Match</span>
                </span>
                <span className="text-[10px] tracking-wider font-semibold uppercase px-2 py-0.5 rounded-full bg-brand-light text-brand border border-brand/20">
                  ML
                </span>
              </div>
              <p className="hidden sm:block text-[11px] text-ink-muted font-medium tracking-wide">
                Content-Based Recommendation Engine
              </p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            <button
              type="button"
              onClick={() => scrollTo('discover-catalog')}
              className="text-[16px] font-semibold text-ink-secondary hover:text-brand transition-colors flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none rounded-lg px-2 py-1 cursor-pointer"
            >
              <Compass className="w-[18px] h-[18px] text-brand" />
              Discover
            </button>
            <button
              type="button"
              onClick={() => scrollTo('how-it-works')}
              className="text-[16px] font-semibold text-ink-secondary hover:text-brand transition-colors flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none rounded-lg px-2 py-1 cursor-pointer"
            >
              <Sparkles className="w-[18px] h-[18px] text-brand-violet" />
              How It Works
            </button>
            <button
              type="button"
              onClick={() => scrollTo('engine-details')}
              className="text-[16px] font-semibold text-ink-secondary hover:text-brand transition-colors flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none rounded-lg px-2 py-1 cursor-pointer"
            >
              <Cpu className="w-[18px] h-[18px] text-accent-cyan" />
              Architecture
            </button>
          </nav>

          {/* Right Actions: Status & Search CTA */}
          <div className="hidden md:flex items-center gap-3">
            {/* Status Pill */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100/90 border border-slate-200/80 text-[11px] font-semibold tracking-wider text-slate-600 uppercase select-none">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
              <span>ML Engine Active</span>
            </div>

            {/* Factual Catalog Pill */}
            <div className="hidden xl:flex items-center px-3 py-1.5 rounded-full bg-slate-100/70 border border-slate-200/60 text-[11px] font-semibold tracking-wider text-slate-500 uppercase select-none">
              4,800+ TITLES
            </div>

            <button
              type="button"
              onClick={onSearchClick || (() => scrollTo('hero-search'))}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand text-white font-semibold text-xs tracking-wider uppercase hover:bg-brand-hover hover:shadow-md hover:shadow-brand/25 transition-all duration-200 active:scale-95 focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search Movies</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-ink-secondary hover:text-ink-primary hover:bg-canvas-subtle focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none"
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-4 pb-2 mt-3 border-t border-canvas-border">
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => scrollTo('discover-catalog')}
                className="text-left text-sm font-semibold text-ink-secondary hover:text-brand py-2 px-3 rounded-lg hover:bg-canvas-subtle transition-colors flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none"
              >
                <Compass className="w-4 h-4 text-brand" />
                Discover
              </button>
              <button
                type="button"
                onClick={() => scrollTo('how-it-works')}
                className="text-left text-sm font-semibold text-ink-secondary hover:text-brand py-2 px-3 rounded-lg hover:bg-canvas-subtle transition-colors flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none"
              >
                <Sparkles className="w-4 h-4 text-brand-violet" />
                How It Works
              </button>
              <button
                type="button"
                onClick={() => scrollTo('engine-details')}
                className="text-left text-sm font-semibold text-ink-secondary hover:text-brand py-2 px-3 rounded-lg hover:bg-canvas-subtle transition-colors flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none"
              >
                <Cpu className="w-4 h-4 text-accent-cyan" />
                Architecture
              </button>
              <div className="pt-2 border-t border-canvas-border">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onSearchClick) onSearchClick();
                    else scrollTo('hero-search');
                  }}
                  className="w-full py-2.5 rounded-xl bg-brand text-white font-bold text-xs uppercase tracking-wider text-center shadow-xs hover:bg-brand-hover transition-colors flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Search Movies</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;
