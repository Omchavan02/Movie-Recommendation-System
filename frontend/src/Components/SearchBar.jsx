import React, { useRef } from 'react';
import { Search, Loader2, X, Sparkles } from 'lucide-react';

const SUGGESTIONS = [
  'Avatar',
  'The Dark Knight',
  'Inception',
  'Interstellar',
  'Spider-Man',
  'The Avengers',
  'Pulp Fiction',
  'Gladiator'
];

function SearchBar({ movieName, setMovieName, onSearch, loading }) {
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch();
  };

  const handleSuggestionClick = (title) => {
    setMovieName(title);
    if (onSearch) {
      // Trigger search on next tick after state updates
      setTimeout(() => onSearch(title), 50);
    }
  };

  const handleClear = () => {
    setMovieName('');
    if (inputRef.current) inputRef.current.focus();
  };

  return (
    <div className="w-full max-w-3xl mx-auto" id="hero-search">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="relative flex items-center rounded-2xl bg-cinema-900/90 backdrop-blur-xl border border-cinema-700/80 group-focus-within:border-cinema-accent shadow-2xl shadow-black/60 group-focus-within:shadow-cinema-amberGlow transition-all duration-300">
          {/* Leading Search Icon */}
          <div className="pl-5 pr-3 text-slate-400 group-focus-within:text-cinema-accent transition-colors">
            <Search className="w-6 h-6" />
          </div>

          {/* Search Input */}
          <input
            ref={inputRef}
            type="text"
            value={movieName}
            onChange={(e) => setMovieName(e.target.value)}
            disabled={loading}
            placeholder="Search any movie title (e.g. Avatar, Inception)..."
            autoComplete="off"
            className="w-full py-4 sm:py-5 bg-transparent text-white placeholder-slate-400 text-base sm:text-lg font-medium focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Movie Title Search"
          />

          {/* Clear Button */}
          {movieName && !loading && (
            <button
              type="button"
              onClick={handleClear}
              className="p-2 mr-2 text-slate-400 hover:text-white rounded-full hover:bg-cinema-800 transition-colors"
              aria-label="Clear Search Input"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Submit Button */}
          <div className="pr-3">
            <button
              type="submit"
              disabled={loading}
              className="px-5 sm:px-7 py-3 rounded-xl bg-gradient-to-r from-cinema-accent to-amber-600 hover:from-cinema-accentHover hover:to-amber-500 text-cinema-950 font-bold text-xs sm:text-sm tracking-wider uppercase shadow-lg shadow-cinema-accent/20 hover:shadow-cinema-accent/35 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Searching</span>
                </>
              ) : (
                <>
                  <span>Recommend</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Suggested Quick Picks */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
        <span className="text-slate-400 flex items-center gap-1 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-cinema-accent" />
          Popular:
        </span>
        {SUGGESTIONS.map((title) => (
          <button
            key={title}
            onClick={() => handleSuggestionClick(title)}
            disabled={loading}
            className="px-2.5 py-1 rounded-full bg-cinema-850 hover:bg-cinema-800 border border-cinema-700/60 hover:border-cinema-accent/50 text-slate-300 hover:text-cinema-accent transition-all duration-150 disabled:opacity-50 active:scale-95"
          >
            {title}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SearchBar;
