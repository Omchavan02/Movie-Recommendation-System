import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import {
  Compass,
  Search,
  X,
  SlidersHorizontal,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Film,
  AlertCircle,
  RefreshCw,
  Star,
  Calendar,
  ArrowUpDown
} from 'lucide-react';
import MovieCard from './MovieCard';
import MovieCardSkeleton from './MovieCardSkeleton';

const API_BASE_URL = (process.env.REACT_APP_API_URL || 'http://127.0.0.1:3050').replace(/\/+$/, '');

const FALLBACK_GENRES = [
  'Action', 'Adventure', 'Animation', 'Comedy', 'Crime',
  'Documentary', 'Drama', 'Family', 'Fantasy', 'History',
  'Horror', 'Music', 'Mystery', 'Romance', 'Science Fiction',
  'TV Movie', 'Thriller', 'War', 'Western'
];

const YEAR_RANGES = [
  { label: 'All Years', value: 'all' },
  { label: '2015 – 2017 (Latest)', value: '2015-2017', minYear: 2015, maxYear: 2017 },
  { label: '2010 – 2014', value: '2010-2014', minYear: 2010, maxYear: 2014 },
  { label: '2000 – 2009', value: '2000-2009', minYear: 2000, maxYear: 2009 },
  { label: '1990 – 1999', value: '1990-1999', minYear: 1990, maxYear: 1999 },
  { label: '1980 – 1989', value: '1980-1989', minYear: 1980, maxYear: 1989 },
  { label: 'Classic (Pre-1980)', value: 'pre-1980', minYear: 1900, maxYear: 1979 },
];

const RATING_OPTIONS = [
  { label: 'Any Rating', value: '' },
  { label: '★ 8.0+ Acclaimed', value: '8.0' },
  { label: '★ 7.5+ Great', value: '7.5' },
  { label: '★ 7.0+ Good', value: '7.0' },
  { label: '★ 6.0+ Above Avg', value: '6.0' },
];

const SORT_OPTIONS = [
  { label: 'Most Popular', value: 'popularity_desc' },
  { label: 'Highest Rated', value: 'rating_desc' },
  { label: 'Newest First', value: 'year_desc' },
  { label: 'Oldest First', value: 'year_asc' },
  { label: 'Title (A–Z)', value: 'title_asc' },
  { label: 'Title (Z–A)', value: 'title_desc' },
];

function DiscoverSection({ onSelectMovie }) {
  // Read initial query params
  const initialParams = new URLSearchParams(window.location.search);
  const [search, setSearch] = useState(initialParams.get('catalog_search') || '');
  const [debouncedSearch, setDebouncedSearch] = useState(initialParams.get('catalog_search') || '');
  const [genre, setGenre] = useState(initialParams.get('genre') || 'all');
  const [minRating, setMinRating] = useState(initialParams.get('minRating') || '');
  const [yearRange, setYearRange] = useState(initialParams.get('yearRange') || 'all');
  const [sort, setSort] = useState(initialParams.get('sort') || 'popularity_desc');
  const [page, setPage] = useState(parseInt(initialParams.get('page'), 10) || 1);

  const [genresList, setGenresList] = useState(FALLBACK_GENRES);
  const [movies, setMovies] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 24,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const searchInputRef = useRef(null);
  const sectionRef = useRef(null);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset page on new search
    }, 350);
    return () => clearTimeout(handler);
  }, [search]);

  // Load dynamic genres from backend on mount
  useEffect(() => {
    let isMounted = true;
    axios.get(`${API_BASE_URL}/api/genres`)
      .then(res => {
        if (isMounted && Array.isArray(res.data) && res.data.length > 0) {
          setGenresList(res.data);
        }
      })
      .catch(() => {
        // Silently use FALLBACK_GENRES
      });
    return () => { isMounted = false; };
  }, []);

  // Sync URL query params with discovery state
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (debouncedSearch) params.set('catalog_search', debouncedSearch);
    else params.delete('catalog_search');

    if (genre && genre !== 'all') params.set('genre', genre);
    else params.delete('genre');

    if (minRating) params.set('minRating', minRating);
    else params.delete('minRating');

    if (yearRange && yearRange !== 'all') params.set('yearRange', yearRange);
    else params.delete('yearRange');

    if (sort && sort !== 'popularity_desc') params.set('sort', sort);
    else params.delete('sort');

    if (page > 1) params.set('page', String(page));
    else params.delete('page');

    const newQuery = params.toString();
    const newRelativePathQuery = window.location.pathname + (newQuery ? `?${newQuery}` : '');
    window.history.replaceState(null, '', newRelativePathQuery);
  }, [debouncedSearch, genre, minRating, yearRange, sort, page]);

  // Fetch catalog movies
  const fetchCatalog = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = {
        page,
        limit: 24,
        sort,
      };

      if (debouncedSearch && debouncedSearch.trim()) {
        params.search = debouncedSearch.trim();
      }

      if (genre && genre !== 'all') {
        params.genre = genre;
      }

      if (minRating) {
        params.minRating = minRating;
      }

      const selectedRange = YEAR_RANGES.find(r => r.value === yearRange);
      if (selectedRange && selectedRange.minYear && selectedRange.maxYear) {
        params.minYear = selectedRange.minYear;
        params.maxYear = selectedRange.maxYear;
      }

      const res = await axios.get(`${API_BASE_URL}/api/movies`, { params });

      if (res.data && Array.isArray(res.data.movies)) {
        setMovies(res.data.movies);
        setPagination(res.data.pagination || {
          page: 1,
          limit: 24,
          total: res.data.movies.length,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false
        });
      } else {
        setMovies([]);
      }
    } catch (err) {
      console.error('Catalog fetch error:', err);
      if (err.response) {
        setError(err.response.data?.error || 'Failed to load movie catalog. Please try again.');
      } else if (err.request) {
        setError('Cannot connect to the movie catalog API. Please verify the backend is running.');
      } else {
        setError('An unexpected error occurred while loading movies.');
      }
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }, [page, sort, debouncedSearch, genre, minRating, yearRange]);

  useEffect(() => {
    fetchCatalog();
  }, [fetchCatalog]);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages || newPage === page) return;
    setPage(newPage);
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setGenre('all');
    setMinRating('');
    setYearRange('all');
    setSort('popularity_desc');
    setPage(1);
    if (searchInputRef.current) searchInputRef.current.focus();
  };

  const hasActiveFilters = Boolean(
    debouncedSearch ||
    (genre && genre !== 'all') ||
    minRating ||
    (yearRange && yearRange !== 'all') ||
    sort !== 'popularity_desc'
  );

  return (
    <section ref={sectionRef} id="discover-catalog" className="py-16 sm:py-20 bg-canvas-subtle/50 border-t border-canvas-border scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-canvas-border">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-light border border-brand/20 text-xs font-semibold text-brand mb-2.5 shadow-2xs">
              <Compass className="w-3.5 h-3.5 text-brand" />
              <span>CATALOG EXPLORER</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-ink-primary tracking-tight">
              Discover Movies
            </h2>
            <p className="mt-2 text-sm sm:text-base text-ink-secondary max-w-2xl leading-relaxed">
              Explore 4,800+ films from our complete dataset. Search, filter by genre or rating, and select any movie to generate instant content recommendations.
            </p>
          </div>

          {/* Quick Counter */}
          <div className="flex items-center gap-2 self-start md:self-end">
            <div className="text-xs font-medium px-3.5 py-2 rounded-xl bg-white border border-canvas-border shadow-xs flex items-center gap-2 text-ink-secondary">
              <Film className="w-3.5 h-3.5 text-brand" />
              <span>
                Catalog: <strong className="text-ink-primary">{pagination.total.toLocaleString()}</strong> movies
              </span>
            </div>
          </div>
        </div>

        {/* Controls Toolbar: Search & Filters */}
        <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-white border border-canvas-border shadow-card space-y-4">
          
          {/* Top Row: Live Search Input */}
          <div className="relative flex items-center rounded-xl bg-canvas-subtle border border-canvas-border focus-within:border-brand focus-within:bg-white focus-within:ring-2 focus-within:ring-brand/10 transition-all duration-200">
            <div className="pl-3.5 sm:pl-4 pr-2 text-ink-muted shrink-0">
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search movie catalog by title (e.g. Inception, Avatar, Dark Knight)..."
              className="w-full py-3 bg-transparent text-sm sm:text-base text-ink-primary placeholder-ink-faint font-medium focus:outline-none min-w-0"
              aria-label="Filter catalog by movie title"
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  if (searchInputRef.current) searchInputRef.current.focus();
                }}
                className="p-1.5 mr-2.5 text-ink-muted hover:text-ink-primary rounded-full hover:bg-slate-200 transition-colors"
                aria-label="Clear catalog search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Bottom Row: Filter Dropdowns & Sort */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
            
            {/* Genre Filter */}
            <div>
              <label htmlFor="filter-genre" className="block text-[11px] font-bold uppercase tracking-wider text-ink-muted mb-1">
                Genre
              </label>
              <div className="relative">
                <select
                  id="filter-genre"
                  value={genre}
                  onChange={(e) => {
                    setGenre(e.target.value);
                    setPage(1);
                  }}
                  className="w-full appearance-none px-3 py-2 pr-8 rounded-lg bg-canvas-subtle border border-canvas-border hover:border-slate-300 focus:border-brand focus:ring-1 focus:ring-brand/20 text-xs sm:text-sm font-semibold text-ink-primary cursor-pointer transition-colors"
                >
                  <option value="all">All Genres</option>
                  {genresList.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
                <SlidersHorizontal className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-muted pointer-events-none" />
              </div>
            </div>

            {/* Min Rating Filter */}
            <div>
              <label htmlFor="filter-rating" className="block text-[11px] font-bold uppercase tracking-wider text-ink-muted mb-1">
                Min Rating
              </label>
              <div className="relative">
                <select
                  id="filter-rating"
                  value={minRating}
                  onChange={(e) => {
                    setMinRating(e.target.value);
                    setPage(1);
                  }}
                  className="w-full appearance-none px-3 py-2 pr-8 rounded-lg bg-canvas-subtle border border-canvas-border hover:border-slate-300 focus:border-brand focus:ring-1 focus:ring-brand/20 text-xs sm:text-sm font-semibold text-ink-primary cursor-pointer transition-colors"
                >
                  {RATING_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <Star className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-amber-500 pointer-events-none" />
              </div>
            </div>

            {/* Year Range Filter */}
            <div>
              <label htmlFor="filter-year" className="block text-[11px] font-bold uppercase tracking-wider text-ink-muted mb-1">
                Release Period
              </label>
              <div className="relative">
                <select
                  id="filter-year"
                  value={yearRange}
                  onChange={(e) => {
                    setYearRange(e.target.value);
                    setPage(1);
                  }}
                  className="w-full appearance-none px-3 py-2 pr-8 rounded-lg bg-canvas-subtle border border-canvas-border hover:border-slate-300 focus:border-brand focus:ring-1 focus:ring-brand/20 text-xs sm:text-sm font-semibold text-ink-primary cursor-pointer transition-colors"
                >
                  {YEAR_RANGES.map((yr) => (
                    <option key={yr.value} value={yr.value}>{yr.label}</option>
                  ))}
                </select>
                <Calendar className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand pointer-events-none" />
              </div>
            </div>

            {/* Sort Order */}
            <div>
              <label htmlFor="filter-sort" className="block text-[11px] font-bold uppercase tracking-wider text-ink-muted mb-1">
                Sort Order
              </label>
              <div className="relative">
                <select
                  id="filter-sort"
                  value={sort}
                  onChange={(e) => {
                    setSort(e.target.value);
                    setPage(1);
                  }}
                  className="w-full appearance-none px-3 py-2 pr-8 rounded-lg bg-canvas-subtle border border-canvas-border hover:border-slate-300 focus:border-brand focus:ring-1 focus:ring-brand/20 text-xs sm:text-sm font-semibold text-ink-primary cursor-pointer transition-colors"
                >
                  {SORT_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
                <ArrowUpDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-muted pointer-events-none" />
              </div>
            </div>

            {/* Reset Action */}
            <div className="col-span-2 sm:col-span-2 lg:col-span-1 flex flex-col justify-end">
              <button
                type="button"
                onClick={handleResetFilters}
                disabled={!hasActiveFilters}
                className="w-full py-2 px-3 rounded-lg bg-canvas-subtle hover:bg-slate-200 border border-canvas-border text-xs font-semibold text-ink-secondary hover:text-ink-primary transition-colors flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed h-[38px]"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            </div>

          </div>

          {/* Active Filter Indicators */}
          {hasActiveFilters && (
            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs border-t border-canvas-borderLight">
              <span className="text-ink-muted font-medium">Active filters:</span>
              {debouncedSearch && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-brand-light text-brand font-medium border border-brand/20">
                  Search: "{debouncedSearch}"
                  <button type="button" onClick={() => setSearch('')} className="hover:text-brand-hover">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {genre !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-brand-light text-brand font-medium border border-brand/20">
                  Genre: {genre}
                  <button type="button" onClick={() => setGenre('all')} className="hover:text-brand-hover">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {minRating && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 font-medium border border-amber-200">
                  Rating: ★ {minRating}+
                  <button type="button" onClick={() => setMinRating('')} className="hover:text-amber-900">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {yearRange !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium border border-slate-300">
                  Years: {YEAR_RANGES.find(r => r.value === yearRange)?.label || yearRange}
                  <button type="button" onClick={() => setYearRange('all')} className="hover:text-slate-900">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {sort !== 'popularity_desc' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 font-medium border border-purple-200">
                  Sort: {SORT_OPTIONS.find(s => s.value === sort)?.label}
                  <button type="button" onClick={() => setSort('popularity_desc')} className="hover:text-purple-900">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}

        </div>

        {/* Results Info Bar */}
        <div className="flex items-center justify-between text-xs text-ink-muted mb-6 px-1">
          <div>
            {!loading && !error && pagination.total > 0 && (
              <span>
                Showing <strong className="text-ink-primary">{(pagination.page - 1) * pagination.limit + 1}</strong> –{' '}
                <strong className="text-ink-primary">{Math.min(pagination.page * pagination.limit, pagination.total)}</strong> of{' '}
                <strong className="text-brand font-bold">{pagination.total.toLocaleString()}</strong> titles
              </span>
            )}
            {loading && <span>Updating catalog...</span>}
          </div>

          <div>
            {!loading && pagination.totalPages > 1 && (
              <span>Page {pagination.page} of {pagination.totalPages}</span>
            )}
          </div>
        </div>

        {/* Loading State: Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="p-8 rounded-2xl bg-white border border-accent-coral/30 shadow-card text-center max-w-xl mx-auto my-8">
            <div className="w-12 h-12 rounded-full bg-accent-coralLight border border-accent-coral/30 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6 text-accent-coral" />
            </div>
            <h3 className="text-lg font-bold text-ink-primary mb-2">Catalog Unavailable</h3>
            <p className="text-sm text-ink-secondary mb-6 leading-relaxed">
              {error}
            </p>
            <button
              type="button"
              onClick={fetchCatalog}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand text-white font-semibold text-xs tracking-wider uppercase shadow-sm hover:bg-brand-hover transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Catalog Query</span>
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && movies.length === 0 && (
          <div className="p-10 rounded-2xl bg-white border border-canvas-border shadow-card text-center max-w-xl mx-auto my-8">
            <div className="w-14 h-14 rounded-2xl bg-canvas-subtle border border-slate-200 flex items-center justify-center mx-auto mb-4 text-ink-muted">
              <Film className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-ink-primary mb-2">No Movies Found</h3>
            <p className="text-sm text-ink-muted mb-6 leading-relaxed">
              No films matched your active filter criteria. Try broadening your search or resetting filters to view all 4,800+ titles.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand text-white font-semibold text-xs tracking-wider uppercase shadow-sm hover:bg-brand-hover transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>
        )}

        {/* Success Grid: Movie Cards */}
        {!loading && !error && movies.length > 0 && (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {movies.map((movie, index) => (
                <MovieCard
                  key={movie._id || movie.id || index}
                  movie={movie}
                  index={index}
                  isRecommendation={false}
                  onSelect={onSelectMovie}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-canvas-border">
                <div className="text-xs text-ink-muted">
                  Page <strong className="text-ink-primary">{pagination.page}</strong> of <strong className="text-ink-primary">{pagination.totalPages}</strong>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={!pagination.hasPrevPage}
                    className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-white border border-canvas-border text-xs font-semibold text-ink-primary hover:bg-canvas-subtle transition-colors shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Previous Page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>

                  {/* Smart page indicators */}
                  <div className="hidden sm:flex items-center gap-1">
                    {pagination.page > 2 && (
                      <button
                        type="button"
                        onClick={() => handlePageChange(1)}
                        className="w-8 h-8 rounded-lg text-xs font-semibold text-ink-secondary hover:bg-canvas-subtle"
                      >
                        1
                      </button>
                    )}
                    {pagination.page > 3 && <span className="text-ink-muted px-1 text-xs">…</span>}

                    {pagination.hasPrevPage && (
                      <button
                        type="button"
                        onClick={() => handlePageChange(pagination.page - 1)}
                        className="w-8 h-8 rounded-lg text-xs font-semibold text-ink-secondary hover:bg-canvas-subtle"
                      >
                        {pagination.page - 1}
                      </button>
                    )}

                    <button
                      type="button"
                      disabled
                      className="w-8 h-8 rounded-lg bg-brand text-white font-bold text-xs shadow-xs"
                    >
                      {pagination.page}
                    </button>

                    {pagination.hasNextPage && (
                      <button
                        type="button"
                        onClick={() => handlePageChange(pagination.page + 1)}
                        className="w-8 h-8 rounded-lg text-xs font-semibold text-ink-secondary hover:bg-canvas-subtle"
                      >
                        {pagination.page + 1}
                      </button>
                    )}

                    {pagination.page < pagination.totalPages - 2 && <span className="text-ink-muted px-1 text-xs">…</span>}
                    {pagination.page < pagination.totalPages - 1 && (
                      <button
                        type="button"
                        onClick={() => handlePageChange(pagination.totalPages)}
                        className="w-8 h-8 rounded-lg text-xs font-semibold text-ink-secondary hover:bg-canvas-subtle"
                      >
                        {pagination.totalPages}
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={!pagination.hasNextPage}
                    className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-white border border-canvas-border text-xs font-semibold text-ink-primary hover:bg-canvas-subtle transition-colors shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Next Page"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  );
}

export default DiscoverSection;
