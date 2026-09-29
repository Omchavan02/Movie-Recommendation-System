import React, { useState, useEffect } from 'react';
import { Film, Compass, Cpu, Menu, X, Sparkles } from 'lucide-react';

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
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-cinema-950/85 backdrop-blur-md border-b border-cinema-700/50 shadow-lg shadow-black/40 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <div
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cinema-accent via-amber-600 to-amber-700 p-0.5 shadow-md shadow-cinema-accent/20 group-hover:scale-105 transition-transform duration-200">
              <div className="w-full h-full bg-cinema-950 rounded-[10px] flex items-center justify-center">
                <Film className="w-5 h-5 text-cinema-accent" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-white font-sans">
                  Cine<span className="text-cinema-accent">Match</span>
                </span>
                <span className="text-[10px] tracking-wider font-semibold uppercase px-2 py-0.5 rounded-full bg-cinema-800 text-cinema-accent border border-cinema-700">
                  ML
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium tracking-wide">
                Content-Based Recommendation Engine
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollTo('hero-search')}
              className="text-sm font-medium text-slate-300 hover:text-cinema-accent transition-colors flex items-center gap-1.5"
            >
              <Compass className="w-4 h-4 text-cinema-accent/80" />
              Discover
            </button>
            <button
              onClick={() => scrollTo('how-it-works')}
              className="text-sm font-medium text-slate-300 hover:text-cinema-accent transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-cinema-accent/80" />
              How It Works
            </button>
            <button
              onClick={() => scrollTo('engine-details')}
              className="text-sm font-medium text-slate-300 hover:text-cinema-accent transition-colors flex items-center gap-1.5"
            >
              <Cpu className="w-4 h-4 text-cinema-accent/80" />
              Architecture
            </button>
          </nav>

          {/* CTA Action */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={onSearchClick || (() => scrollTo('hero-search'))}
              className="px-4 py-2 rounded-lg bg-cinema-accent text-cinema-950 font-semibold text-xs tracking-wider uppercase hover:bg-cinema-accentHover hover:shadow-lg hover:shadow-cinema-accent/25 transition-all duration-200 active:scale-95"
            >
              Search Movies
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-cinema-800 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-cinema-900/95 backdrop-blur-xl border-b border-cinema-700/60 px-4 pt-4 pb-6 mt-3 shadow-2xl">
          <div className="flex flex-col gap-3">
            <button
              onClick={() => scrollTo('hero-search')}
              className="text-left text-sm font-medium text-slate-200 hover:text-cinema-accent py-2 px-3 rounded-lg hover:bg-cinema-800 transition-colors flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-cinema-accent" />
              Discover
            </button>
            <button
              onClick={() => scrollTo('how-it-works')}
              className="text-left text-sm font-medium text-slate-200 hover:text-cinema-accent py-2 px-3 rounded-lg hover:bg-cinema-800 transition-colors flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-cinema-accent" />
              How It Works
            </button>
            <button
              onClick={() => scrollTo('engine-details')}
              className="text-left text-sm font-medium text-slate-200 hover:text-cinema-accent py-2 px-3 rounded-lg hover:bg-cinema-800 transition-colors flex items-center gap-2"
            >
              <Cpu className="w-4 h-4 text-cinema-accent" />
              Architecture
            </button>
            <div className="pt-2 border-t border-cinema-800">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onSearchClick) onSearchClick();
                  else scrollTo('hero-search');
                }}
                className="w-full py-2.5 rounded-lg bg-cinema-accent text-cinema-950 font-bold text-xs uppercase tracking-wider text-center"
              >
                Search Movies
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
