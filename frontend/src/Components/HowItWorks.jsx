import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Search, Binary, Target, Database, Server, Cpu, Layers } from 'lucide-react';

const STEPS = [
  {
    icon: Search,
    step: '01',
    title: 'Input & Title Resolution',
    description:
      'Search any title from our catalog. Express normalizes and executes case-insensitive query lookup against 4,803 TMDB records stored in MongoDB Atlas.',
    accent: 'text-brand',
    bgAccent: 'bg-brand-light',
  },
  {
    icon: Binary,
    step: '02',
    title: 'Content Vectorization',
    description:
      'Movie metadata—including plot overviews, genres, keywords, top cast, and director—is tokenized, stemmed with PorterStemmer, and transformed via CountVectorizer into a 5,000-dimensional feature matrix.',
    accent: 'text-brand-violet',
    bgAccent: 'bg-brand-violetLight',
  },
  {
    icon: Target,
    step: '03',
    title: 'Cosine Similarity Scoring',
    description:
      'The Django ML service calculates the cosine similarity between the target film and all 4,800+ films in vector space, surfacing the highest-affinity recommendations.',
    accent: 'text-accent-coral',
    bgAccent: 'bg-accent-coralLight',
  },
];

const ARCH_STACK = [
  {
    icon: Layers,
    name: 'React Client',
    role: 'Presentation Tier',
    description: 'Responsive user interface with Framer Motion, instant input validation, and real-time recommendation display.',
    tag: 'Vercel CDN',
  },
  {
    icon: Server,
    name: 'Express Gateway',
    role: 'API Orchestrator',
    description: 'Handles client traffic, input sanitization, MongoDB document queries, and Django ML dispatch.',
    tag: 'Node.js',
  },
  {
    icon: Database,
    name: 'MongoDB Atlas',
    role: 'Document Persistence',
    description: 'Managed replica set storing 4,803 movie documents with complete metadata, taglines, and runtimes.',
    tag: 'Database',
  },
  {
    icon: Cpu,
    name: 'Django ML Service',
    role: 'Recommendation Engine',
    description: 'Gunicorn-backed Python service evaluating pre-computed CountVectorizer cosine similarity matrices.',
    tag: 'Python / ML',
  },
];

function HowItWorks() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="how-it-works" className="py-20 bg-white border-t border-canvas-border scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-light border border-brand/20 text-xs font-semibold text-brand mb-3">
            <span>ALGORITHMIC PIPELINE</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-ink-primary tracking-tight">
            How The Recommendation Engine Works
          </h2>
          <p className="mt-3 text-base text-ink-secondary leading-relaxed">
            A deterministic, content-based filtering pipeline that evaluates linguistic and stylistic similarity across thousands of films.
          </p>
        </div>

        {/* 3 Step Pipeline Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {STEPS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.step}
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
                whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: shouldReduceMotion ? 0.2 : 0.4, delay: shouldReduceMotion ? 0 : idx * 0.12 }}
                className="relative p-6 sm:p-8 rounded-2xl bg-canvas-subtle/60 border border-canvas-border hover:border-brand/30 shadow-xs hover:shadow-card transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-12 h-12 rounded-xl ${item.bgAccent} border border-slate-200/80 flex items-center justify-center group-hover:scale-105 transition-all`}>
                    <Icon className={`w-6 h-6 ${item.accent}`} />
                  </div>
                  <span className="text-3xl font-black text-slate-300 group-hover:text-brand/30 transition-colors font-mono">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-ink-primary mb-2.5">{item.title}</h3>
                <p className="text-sm text-ink-secondary leading-relaxed">{item.description}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Architecture Grid */}
        <div id="engine-details" className="pt-12 border-t border-canvas-border scroll-mt-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-violetLight border border-brand-violet/20 text-xs font-semibold text-brand-violet mb-3">
              <span>SYSTEM ARCHITECTURE</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-ink-primary tracking-tight">
              Verified Full-Stack Architecture
            </h3>
            <p className="mt-2 text-sm text-ink-muted leading-relaxed">
              Decoupled services separating client presentation, API gateway orchestration, cloud database storage, and dedicated machine learning compute.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ARCH_STACK.map((tech, idx) => {
              const Icon = tech.icon;
              return (
                <div
                  key={tech.name}
                  className="p-6 rounded-2xl bg-white border border-canvas-border shadow-xs hover:shadow-card hover:border-brand/30 transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div className="p-2.5 rounded-xl bg-canvas-subtle border border-slate-200 text-brand">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-semibold font-mono uppercase px-2 py-0.5 rounded bg-brand-light text-brand border border-brand/20">
                        {tech.tag}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-ink-primary leading-tight">{tech.name}</h4>
                    <span className="text-xs text-brand font-semibold">{tech.role}</span>
                    <p className="text-xs text-ink-secondary leading-relaxed mt-2.5">{tech.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}

export default HowItWorks;
