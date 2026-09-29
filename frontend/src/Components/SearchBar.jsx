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
        <div className="relative flex items-center rounded-2xl bg-white border border-canvas-border group-focus-within:border-brand group-focus-within:ring-4 group-focus-within:ring-brand/10 shadow-card transition-all duration-300">
          {/* Leading Search Icon */}
          <div className="pl-3.5 sm:pl-5 pr-2 sm:pr-3 text-ink-muted group-focus-within:text-brand transition-colors shrink-0">
            <Search className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>

          {/* Search Input */}
          <input
            ref={inputRef}
            type="text"
            value={movieName}
            onChange={(e) => setMovieName(e.target.value)}
            disabled={loading}
            placeholder="Search movie title (e.g. Avatar)..."
            autoComplete="off"
            className="w-full py-3.5 sm:py-5 bg-transparent text-ink-primary placeholder-ink-faint text-sm sm:text-lg font-medium focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed min-w-0"
            aria-label="Movie Title Search"
          />

          {/* Clear Button */}
          {movieName && !loading && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 sm:p-2 mr-1 sm:mr-2 text-ink-muted hover:text-ink-primary rounded-full hover:bg-canvas-subtle transition-colors shrink-0"
              aria-label="Clear Search Input"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Submit Button */}
          <div className="pr-2 sm:pr-3 shrink-0">
            <button
              type="submit"
              disabled={loading}
              className="px-3.5 sm:px-7 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-brand via-brand-blue to-brand-violet hover:from-brand-hover hover:to-brand-violetHover text-white font-bold text-xs sm:text-sm tracking-wider uppercase shadow-md shadow-brand/25 hover:shadow-lg hover:shadow-brand/35 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 sm:gap-2"
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
        <span className="text-ink-muted flex items-center gap-1 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-brand" />
          Popular:
        </span>
        {SUGGESTIONS.map((title) => (
          <button
            key={title}
            onClick={() => handleSuggestionClick(title)}
            disabled={loading}
            className="px-3 py-1 rounded-full bg-white hover:bg-brand-light border border-canvas-border hover:border-brand/40 text-ink-secondary hover:text-brand font-medium transition-all duration-150 shadow-2xs active:scale-95 disabled:opacity-50"
          >
            {title}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SearchBar;
