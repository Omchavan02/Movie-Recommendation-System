import React, { useState, useRef } from 'react';
import axios from 'axios';
import Navbar from './Components/Navbar';
import Hero from './Components/Hero';
import RecommendationSection from './Components/RecommendationSection';
import HowItWorks from './Components/HowItWorks';
import Footer from './Components/Footer';

const API_BASE_URL = (process.env.REACT_APP_API_URL || 'http://127.0.0.1:3050').replace(/\/+$/, '');

function App() {
  const [movieName, setMovieName] = useState('');
  const [searchedTitle, setSearchedTitle] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const recommendationsRef = useRef(null);

  const handleSearch = async (overrideTitle) => {
    const rawQuery = typeof overrideTitle === 'string' ? overrideTitle : movieName;
    const query = rawQuery.trim();

    if (!query) {
      setError('Please enter a movie title.');
      setRecommendations([]);
      setHasSearched(true);
      return;
    }

    setMovieName(query);
    setSearchedTitle(query);
    setLoading(true);
    setError(null);
    setRecommendations([]);
    setHasSearched(true);

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
          setError(
            `Movie "${query}" was not found in our catalog of 4,800+ titles. Please verify spelling or try another popular film (e.g. Avatar, Inception, The Dark Knight).`
          );
        } else if (err.response.status === 500 || err.response.status === 502) {
          setError('The recommendation engine encountered a processing error. Please try again in a few moments.');
        } else {
          setError(err.response.data?.error || 'Failed to retrieve recommendations. Please try again.');
        }
      } else if (err.request) {
        setError('Cannot connect to the recommendation backend. Please verify the service is running and reachable.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

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
          onSearch={handleSearch}
          loading={loading}
        />

        {/* Results Section */}
        <RecommendationSection
          ref={recommendationsRef}
          searchedTitle={searchedTitle}
          recommendations={recommendations}
          loading={loading}
          error={error}
          hasSearched={hasSearched}
          onRetry={focusSearch}
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
