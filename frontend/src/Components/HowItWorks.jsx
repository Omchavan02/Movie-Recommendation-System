import React from 'react';
import { motion } from 'framer-motion';
import { Search, Binary, Target, Database, Server, Cpu } from 'lucide-react';

const STEPS = [
  {
    icon: Search,
    step: '01',
    title: 'Input & Title Resolution',
    description:
      'Search any title from our catalog. Express normalizes and executes case-insensitive query lookup against 4,803 TMDB records stored in MongoDB Atlas.',
  },
  {
    icon: Binary,
    step: '02',
    title: 'Content Vectorization',
    description:
      'Movie metadata—including plot overviews, genres, keywords, top cast, and director—is tokenized, stemmed with PorterStemmer, and transformed via CountVectorizer into a 5,000-dimensional bag-of-words matrix.',
  },
  {
    icon: Target,
    step: '03',
    title: 'Cosine Similarity Ranking',
    description:
      'The Django ML service calculates the angular cosine distance between the target film and all 4,800+ films in vector space, surfacing the highest-affinity recommendations.',
  },
];

const ARCH_STACK = [
  {
    icon: Server,
    name: 'Express Gateway',
    role: 'API Orchestrator',
    description: 'Handles client traffic, input sanitization, MongoDB metadata queries, and Django ML dispatch.',
  },
  {
    icon: Cpu,
    name: 'Django ML Service',
    role: 'Recommendation Compute',
    description: 'Gunicorn-backed Python service computing cosine similarity rankings across pre-trained matrices.',
  },
  {
    icon: Database,
    name: 'MongoDB Atlas',
    role: 'Document Persistence',
    description: 'Cloud replica-set storing 4,803 movie documents with full metadata, runtimes, and taglines.',
  },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-cinema-900/50 border-t border-cinema-800/80 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cinema-850 border border-cinema-700 text-xs font-semibold text-cinema-accent mb-3">
            <span>ALGORITHMIC PIPELINE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How The Recommendation Engine Works
          </h2>
          <p className="mt-3 text-base text-slate-400">
            A deterministic, content-based filtering pipeline that evaluates linguistic and stylistic proximity across thousands of films.
          </p>
        </div>

        {/* 3 Step Pipeline Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {STEPS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.12 }}
                className="relative p-6 sm:p-8 rounded-2xl bg-cinema-900 border border-cinema-700/60 hover:border-cinema-accent/40 shadow-xl transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-cinema-800/80 border border-cinema-700 flex items-center justify-center group-hover:scale-105 group-hover:border-cinema-accent/40 transition-all">
                    <Icon className="w-6 h-6 text-cinema-accent" />
                  </div>
                  <span className="text-3xl font-black text-cinema-700 group-hover:text-cinema-accent/30 transition-colors font-mono">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2.5">{item.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{item.description}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Architecture Grid */}
        <div id="engine-details" className="pt-12 border-t border-cinema-800/80 scroll-mt-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h3 className="text-2xl font-bold text-white tracking-tight">
              End-to-End System Architecture
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              Decoupled, microservice-inspired architecture separating API routing, machine learning compute, and database persistence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ARCH_STACK.map((tech, idx) => {
              const Icon = tech.icon;
              return (
                <div
                  key={tech.name}
                  className="p-6 rounded-xl bg-cinema-850/60 border border-cinema-700/50 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-cinema-800 text-cinema-accent">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-white leading-tight">{tech.name}</h4>
                        <span className="text-xs text-cinema-accent font-mono">{tech.role}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed mt-2">{tech.description}</p>
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
