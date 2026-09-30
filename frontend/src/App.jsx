import React, { useState, useRef, useEffect, useCallback } from 'react';
import axios from 'axios';
import { AlertCircle, RotateCcw } from 'lucide-react';
import Navbar from './Components/Navbar';
import Hero from './Components/Hero';
import MovieDetailSection from './Components/MovieDetailSection';
import MovieDetailSkeleton from './Components/MovieDetailSkeleton';
import RecommendationSection from './Components/RecommendationSection';
import DiscoverSection from './Components/DiscoverSection';
import HowItWorks from './Components/HowItWorks';
import Footer from './Components/Footer';

const API_BASE_URL = (process.env.REACT_APP_API_URL || 'http://127.0.0.1:3050').replace(/\/+$/, '');

function App() {
  const [movieName, setMovieName] = useState('');

  // Movie Detail State (Phase 4)
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState(null);

  // Recommendations State (ML)
  const [searchedTitle, setSearchedTitle] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [recLoading, setRecLoading] = useState(false);
  const [recError, setRecError] = useState(null);
  const [hasRequestedRecs, setHasRequestedRecs] = useState(false);

  const recommendationsRef = useRef(null);

  // Explicit ML Recommendation Request
  const handleFindSimilar = useCallback(async (targetTitle) => {
    const query = (typeof targetTitle === 'string' ? targetTitle : movieName).trim();
    if (!query) return;

    setSearchedTitle(query);
    setRecLoading(true);
    setRecError(null);
    setHasRequestedRecs(true);

    // Smoothly scroll down to recommendations area
    setTimeout(() => {
      const recEl = document.getElementById('recommendations');
      if (recEl) {
        recEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);

    try {
      const encoded = encodeURIComponent(query);
      const response = await axios.get(`${API_BASE_URL}/api/movies/${encoded}`);

      if (Array.isArray(response.data)) {
        setRecommendations(response.data);
      } else {
        setRecommendations([]);
      }
    } catch (err) {
      console.error('Recommendation fetch error:', err);
      setRecommendations([]);

      if (err.response) {
        if (err.response.status === 404) {
          setRecError(
            `Movie "${query}" was not found in our catalog of 4,800+ titles. Please verify spelling or select another title.`
          );
        } else if (err.response.status === 500 || err.response.status === 502) {
          setRecError('The recommendation engine encountered a processing error. Please try again in a few moments.');
        } else {
          setRecError(err.response.data?.error || 'Failed to retrieve recommendations. Please try again.');
        }
      } else if (err.request) {
        setRecError('Cannot connect to the recommendation backend. Please verify the service is running.');
      } else {
        setRecError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setRecLoading(false);
    }
  }, [movieName]);

  // Open Movie Detail View (Does NOT trigger ML recommendation request automatically)
  const handleSelectMovie = useCallback(async (movieOrTitle) => {
    setDetailError(null);
    // Clear previous recommendations for prior selection
    setRecommendations([]);
    setHasRequestedRecs(false);

    if (movieOrTitle && typeof movieOrTitle === 'object' && movieOrTitle.title) {
      // In-memory movie document from catalog
      setSelectedMovie(movieOrTitle);
      setMovieName(movieOrTitle.title);
      setDetailLoading(false);

      // Synchronize ?movie= URL parameter
      const params = new URLSearchParams(window.location.search);
      params.set('movie', movieOrTitle.title);
      const newQuery = params.toString();
      window.history.pushState(null, '', window.location.pathname + (newQuery ? `?${newQuery}` : ''));

      // Smoothly scroll to detail view
      setTimeout(() => {
        const detailEl = document.getElementById('movie-detail');
        if (detailEl) {
          detailEl.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      return;
    }

    const titleQuery = (typeof movieOrTitle === 'string' ? movieOrTitle : movieName).trim();
    if (!titleQuery) return;

    setMovieName(titleQuery);
    setDetailLoading(true);

    // Synchronize ?movie= URL parameter
    const params = new URLSearchParams(window.location.search);
    params.set('movie', titleQuery);
    const newQuery = params.toString();
    window.history.pushState(null, '', window.location.pathname + (newQuery ? `?${newQuery}` : ''));

    setTimeout(() => {
      const detailEl = document.getElementById('movie-detail-container');
      if (detailEl) {
        detailEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);

    try {
      const encoded = encodeURIComponent(titleQuery);
      const response = await axios.get(`${API_BASE_URL}/api/movie/details/${encoded}`);

      if (response.data && response.data.title) {
        setSelectedMovie(response.data);
      } else {
        setDetailError(`Movie "${titleQuery}" was not found in our catalog of 4,800+ titles.`);
      }
    } catch (err) {
      console.error('Movie detail fetch error:', err);
      if (err.response && err.response.status === 404) {
        setDetailError(`Movie "${titleQuery}" was not found in the catalog. Please check your spelling or choose from the catalog.`);
      } else {
        setDetailError('Failed to load movie details. Please ensure the backend server is reachable.');
      }
      setSelectedMovie(null);
    } finally {
      setDetailLoading(false);
    }
  }, [movieName]);

  // Handle Hero Search submission (computes recommendations directly)
  const handleHeroSearch = (overrideTitle) => {
    const rawQuery = typeof overrideTitle === 'string' ? overrideTitle : movieName;
    const query = rawQuery.trim();
    if (!query) return;

    handleSelectMovie(query);
    handleFindSimilar(query);
  };

  // Close Movie Detail View
  const handleCloseDetail = () => {
    setSelectedMovie(null);
    setDetailError(null);
    setRecommendations([]);
    setHasRequestedRecs(false);

    // Clean up ?movie= query parameter
    const params = new URLSearchParams(window.location.search);
    params.delete('movie');
    const newQuery = params.toString();
    window.history.pushState(null, '', window.location.pathname + (newQuery ? `?${newQuery}` : ''));
  };

  // On mount check: ?movie= or ?search= in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const movieParam = params.get('movie');
    const searchParam = params.get('search');

    if (movieParam && movieParam.trim()) {
      // ?movie= deep-link: opens Movie Detail experience first without triggering recommendations
      handleSelectMovie(movieParam.trim());
    } else if (searchParam && searchParam.trim()) {
      handleHeroSearch(searchParam.trim());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const focusSearch = () => {
    const searchEl = document.getElementById('hero-search');
    if (searchEl) {
      searchEl.scrollIntoView({ behavior: 'smooth' });
      const input = searchEl.querySelector('input');
      if (input) input.focus();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink-primary font-sans selection:bg-brand-light selection:text-brand overflow-x-hidden">
      {/* Top Fixed Navbar */}
      <Navbar onSearchClick={focusSearch} />

      {/* Main Content Area */}
      <main className="flex-grow">
        {/* Cinematic Hero & Integrated Search */}
        <Hero
          movieName={movieName}
          setMovieName={setMovieName}
          onSearch={handleHeroSearch}
          loading={recLoading || detailLoading}
        />

        {/* Phase 4 Movie Detail Container */}
        <div id="movie-detail-container">
          {detailLoading && <MovieDetailSkeleton />}

          {!detailLoading && detailError && (
            <div className="max-w-2xl mx-auto my-8 p-8 rounded-2xl bg-white border border-accent-coral/30 shadow-card text-center">
              <div className="w-12 h-12 rounded-full bg-accent-coralLight border border-accent-coral/30 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-6 h-6 text-accent-coral" />
              </div>
              <h3 className="text-xl font-bold text-ink-primary mb-2">Movie Lookup Notice</h3>
              <p className="text-sm text-ink-secondary mb-6 leading-relaxed">
                {detailError}
              </p>
              <button
                type="button"
                onClick={handleCloseDetail}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand text-white text-xs font-semibold uppercase tracking-wider shadow-sm hover:bg-brand-hover transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Return to Catalog</span>
              </button>
            </div>
          )}

          {!detailLoading && !detailError && selectedMovie && (
            <MovieDetailSection
              movie={selectedMovie}
              onFindSimilar={handleFindSimilar}
              onClose={handleCloseDetail}
              recLoading={recLoading}
            />
          )}
        </div>

        {/* Results Section */}
        <RecommendationSection
          ref={recommendationsRef}
          searchedTitle={searchedTitle}
          recommendations={recommendations}
          loading={recLoading}
          error={recError}
          hasSearched={hasRequestedRecs}
          onRetry={() => handleFindSimilar(searchedTitle)}
          onSelectMovie={handleSelectMovie}
        />

        {/* Full-Catalog Movie Discovery Experience */}
        <DiscoverSection
          onSelectMovie={handleSelectMovie}
          onRecommendMovie={(title) => {
            handleSelectMovie(title);
            handleFindSimilar(title);
          }}
        />

        {/* Explanatory Pipeline & Architecture */}
        <HowItWorks />
      </main>

      {/* Minimal Clean Footer */}
      <Footer />
    </div>
  );
}

export default App;
