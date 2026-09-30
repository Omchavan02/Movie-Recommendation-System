import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

// Audited 6 cleanest, most cinematic hero images
import imgCinemaScreen from '../assets/hero-images/cinema-screen.jpg';
import imgFilmProjector from '../assets/hero-images/film-projector.jpg';
import imgCinematicCity from '../assets/hero-images/cinematic-city.jpg';
import imgDeepSpace from '../assets/hero-images/deep-space.jpg';
import imgCinematicLandscape from '../assets/hero-images/cinematic-landscape.jpg';
import imgMansoura from '../assets/hero-images/Mansoura.jpg';

const HERO_SLIDES = [
  {
    src: imgCinemaScreen,
    alt: 'Theatrical screening hall with clapperboard and bright screen',
    eyebrow: 'CINEMATIC DISCOVERY',
    titleLead: 'Cinema, ',
    titleAccent: 'Reimagined.',
    description: 'Explore films through content similarity.',
    meta: ['CONTENT SIMILARITY', '4,800+ TITLES'],
  },
  {
    src: imgFilmProjector,
    alt: 'Vintage 35mm film projector casting warm projection beam',
    eyebrow: 'CONTENT-BASED DISCOVERY',
    titleLead: 'Every Story ',
    titleAccent: 'Connects.',
    description: 'Find movies through shared themes, genres and metadata.',
    meta: ['COUNT VECTORIZER', 'COSINE SIMILARITY'],
  },
  {
    src: imgCinematicCity,
    alt: 'Cinematic catalog poster grid displaying diverse film genres',
    eyebrow: 'MOVIE DISCOVERY',
    titleLead: 'Find Your ',
    titleAccent: 'Next Film.',
    description: 'Search a movie and explore its closest content-based matches.',
    meta: ['6 RECOMMENDATIONS', 'CONTENT MODEL'],
  },
  {
    src: imgDeepSpace,
    alt: 'Nocturnal river scene with lantern reflections and starry swirls',
    eyebrow: 'THE RECOMMENDATION ENGINE',
    titleLead: 'From Content ',
    titleAccent: 'to Cinema.',
    description: 'Movie metadata becomes measurable similarity.',
    meta: ['TEXT FEATURES', 'COSINE SIMILARITY'],
  },
  {
    src: imgCinematicLandscape,
    alt: 'Cinematic fantasy montage with vintage parchment and castle',
    eyebrow: 'EXPLORE THE CATALOG',
    titleLead: 'Thousands of ',
    titleAccent: 'Stories.',
    description: 'Browse a catalog of 4,800+ movie titles.',
    meta: ['MOVIE CATALOG', 'DISCOVERY'],
  },
  {
    src: imgMansoura,
    alt: 'Stylized graphic novel film-noir montage',
    eyebrow: 'CINEMATCH',
    titleLead: 'Discover What ',
    titleAccent: 'Matches.',
    description: 'Turn one movie into your next watchlist.',
    meta: ['CONTENT-BASED', 'RECOMMENDATIONS'],
  },
];

function CinematicSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const timerRef = useRef(null);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 3000);
  }, []);

  // Automatic slideshow cycling every 3 seconds (3000ms)
  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resetTimer]);

  const handleSelectSlide = (idx) => {
    setCurrentSlide(idx);
    resetTimer();
  };

  // Framer Motion animation variants
  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
        delayChildren: shouldReduceMotion ? 0 : 0.05,
      },
    },
    exit: {
      opacity: 0,
      transition: { duration: shouldReduceMotion ? 0 : 0.2, ease: 'easeOut' },
    },
  };

  const eyebrowVariants = {
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 12 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: shouldReduceMotion ? 0.05 : 0.35, ease: 'easeOut' },
    },
  };

  const titleVariants = {
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 18 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: shouldReduceMotion ? 0.05 : 0.45, ease: 'easeOut' },
    },
  };

  const descVariants = {
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 12 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: shouldReduceMotion ? 0.05 : 0.4, ease: 'easeOut' },
    },
  };

  const metaVariants = {
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 8 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: shouldReduceMotion ? 0.05 : 0.35, ease: 'easeOut' },
    },
  };

  return (
    <section
      aria-label="Cinematic Film Showcase"
      className="relative w-[94%] max-w-[1560px] mx-auto pt-24 sm:pt-28 mb-10 sm:mb-14 md:mb-16"
    >
      <div className="relative w-full h-[280px] sm:h-[380px] md:h-[480px] lg:h-[540px] xl:h-[580px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-canvas-border bg-slate-950">
        {/* Slideshow Image Stack */}
        {HERO_SLIDES.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentSlide ? 'opacity-100 z-0' : 'opacity-0 pointer-events-none'
            }`}
            aria-hidden={idx !== currentSlide}
          >
            <img
              src={slide.src}
              alt={slide.alt}
              className={`w-full h-full object-cover object-center ${
                shouldReduceMotion ? '' : 'transition-transform duration-[4000ms] ease-out'
              } ${idx === currentSlide && !shouldReduceMotion ? 'scale-105' : 'scale-100'}`}
              loading={idx === 0 ? 'eager' : 'lazy'}
            />
          </div>
        ))}

        {/* Cinematic Vignette & Bottom/Left Readability Layers */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/45 to-transparent pointer-events-none z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/25 to-transparent pointer-events-none z-10" />
        <div
          className="absolute inset-0 pointer-events-none z-10 opacity-70"
          style={{
            background: 'radial-gradient(circle at 10% 90%, rgba(99, 102, 241, 0.20) 0%, transparent 45%)',
          }}
        />

        {/* Slide-Specific Tasteful Storytelling Content with Framer Motion */}
        <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 md:bottom-10 md:left-10 lg:bottom-14 lg:left-14 max-w-2xl z-20 pointer-events-none text-left">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              variants={containerVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {/* Eyebrow Badge */}
              <motion.div
                variants={eyebrowVariants}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 border border-white/15 backdrop-blur-md mb-2.5 sm:mb-3 shadow-lg"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse shadow-[0_0_8px_rgba(129,140,248,0.8)]"
                />
                <span className="text-[10px] sm:text-xs font-semibold tracking-[0.16em] uppercase text-indigo-200 font-mono">
                  {HERO_SLIDES[currentSlide].eyebrow}
                </span>
              </motion.div>

              {/* Main Slide Title */}
              <motion.h2
                variants={titleVariants}
                className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08] drop-shadow-md font-sans"
              >
                {HERO_SLIDES[currentSlide].titleLead}
                <span className="bg-gradient-to-r from-indigo-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                  {HERO_SLIDES[currentSlide].titleAccent}
                </span>
              </motion.h2>

              {/* Description */}
              <motion.p
                variants={descVariants}
                className="mt-2 sm:mt-3 text-sm sm:text-base md:text-lg text-white/80 font-medium leading-relaxed drop-shadow-md max-w-lg"
              >
                {HERO_SLIDES[currentSlide].description}
              </motion.p>

              {/* Production Metadata Line */}
              <motion.div
                variants={metaVariants}
                className="mt-2.5 sm:mt-3.5 flex items-center gap-2 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-white/55 font-mono"
              >
                <span>{HERO_SLIDES[currentSlide].meta[0]}</span>
                <span className="text-white/40">•</span>
                <span>{HERO_SLIDES[currentSlide].meta[1]}</span>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Pagination Indicator Controls */}
        <div
          className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 flex items-center gap-1.5 sm:gap-2 z-30 px-3.5 py-2 rounded-full bg-slate-950/70 backdrop-blur-md border border-white/15 shadow-xl"
          aria-label="Slideshow Navigation"
        >
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectSlide(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none cursor-pointer ${
                idx === currentSlide
                  ? 'w-7 bg-brand shadow-xs shadow-brand/50'
                  : 'w-2 bg-white/40 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
              aria-current={idx === currentSlide ? 'true' : 'false'}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default CinematicSlider;
