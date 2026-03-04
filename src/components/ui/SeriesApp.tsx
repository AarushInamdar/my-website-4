'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_PROFILES = [
  {
    id: 1,
    name: 'Elena R.',
    title: 'Senior AI Researcher',
    company: 'DeepMind',
    yoe: '8 yrs',
    tags: ['LLM Optimization', 'PyTorch', 'Distributed Systems'],
    match: 98,
    availability: 'Open to offers',
    avatar: 'ER',
  },
  {
    id: 2,
    name: 'David K.',
    title: 'ML Infrastructure Engineer',
    company: 'NVIDIA',
    yoe: '5 yrs',
    tags: ['TensorRT', 'CUDA', 'Computer Vision'],
    match: 85,
    availability: 'Actively looking',
    avatar: 'DK',
  },
  {
    id: 3,
    name: 'Sarah J.',
    title: 'Data Scientist',
    company: 'Meta AI',
    yoe: '4 yrs',
    tags: ['NLP', 'Transformers', 'Python'],
    match: 72,
    availability: 'Casually exploring',
    avatar: 'SJ',
  },
];

const matchColor = (score: number) =>
  score >= 90 ? '#22c55e' : score >= 75 ? '#3b82f6' : '#f59e0b';

const FILTERS = ['All', 'ML/AI', 'Backend', 'Data', 'Research'];

export default function SeriesApp() {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<typeof MOCK_PROFILES | null>(null);
  const [activeFilter, setActiveFilter] = useState('All');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsSearching(true);
    setResults(null);
    setTimeout(() => {
      setIsSearching(false);
      setResults(MOCK_PROFILES);
    }, 1600);
  };

  return (
    <div
      className="h-full flex flex-col overflow-hidden"
      style={{
        background: '#09090b',
        color: 'white',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Inter", sans-serif',
      }}
    >
      {/* ─── Header ─── */}
      <div className="shrink-0 px-5 pt-4 pb-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div
              className="w-6 h-6 rounded-md flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #a855f7, #7c3aed)' }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <span className="text-sm font-semibold tracking-tight" style={{ color: 'rgba(255,255,255,0.9)' }}>
              Series Discovery
            </span>
            <span
              className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
              style={{ background: 'rgba(168,85,247,0.15)', color: '#c084fc', border: '1px solid rgba(168,85,247,0.25)' }}
            >
              AI
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px]" style={{ color: 'rgba(255,255,255,0.35)' }}>
            <span>2,847 profiles</span>
            <div className="w-1 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.2)' }} />
            <span style={{ color: 'rgba(74,222,128,0.7)' }}>● Live</span>
          </div>
        </div>

        {/* Search bar */}
        <form onSubmit={handleSearch}>
          <div className="flex items-center gap-2">
            <div
              className="flex-1 flex items-center gap-3 px-4 py-2.5 rounded-xl"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.09)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0" style={{ color: 'rgba(255,255,255,0.3)' }}>
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`e.g. "ML engineer, RAG pipelines, 5+ yrs exp"`}
                className="flex-1 bg-transparent text-sm outline-none min-w-0"
                style={{ color: 'rgba(255,255,255,0.8)', caretColor: '#a855f7' }}
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="shrink-0 transition-colors"
                  style={{ color: 'rgba(255,255,255,0.3)' }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            <button
              type="submit"
              disabled={!query.trim() || isSearching}
              className="shrink-0 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{
                background: query.trim() ? 'linear-gradient(135deg, #a855f7, #7c3aed)' : 'rgba(255,255,255,0.07)',
                color: query.trim() ? 'white' : 'rgba(255,255,255,0.3)',
                border: '1px solid rgba(255,255,255,0.08)',
                cursor: query.trim() ? 'pointer' : 'default',
              }}
            >
              {isSearching ? '...' : 'Generate'}
            </button>
          </div>
        </form>
      </div>

      {/* ─── Filter chips ─── */}
      <div className="shrink-0 flex items-center gap-2 px-5 py-2.5 border-b" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className="px-3 py-1 rounded-full text-[11px] font-medium transition-all"
            style={{
              background: activeFilter === f ? 'rgba(168,85,247,0.2)' : 'rgba(255,255,255,0.04)',
              color: activeFilter === f ? '#d8b4fe' : 'rgba(255,255,255,0.4)',
              border: `1px solid ${activeFilter === f ? 'rgba(168,85,247,0.3)' : 'rgba(255,255,255,0.06)'}`,
            }}
          >
            {f}
          </button>
        ))}
        <div className="ml-auto text-[10px]" style={{ color: 'rgba(255,255,255,0.2)' }}>
          Powered by Gemini
        </div>
      </div>

      {/* ─── Content ─── */}
      <div className="flex-1 overflow-y-auto px-5 py-4">

        {/* Loading */}
        {isSearching && (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="relative w-10 h-10">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                className="absolute inset-0 rounded-full"
                style={{ borderTop: '2px solid #a855f7', borderRight: '2px solid #a855f7', borderBottom: '2px solid transparent', borderLeft: '2px solid transparent' }}
              />
              <div className="absolute inset-2 rounded-full" style={{ background: 'rgba(168,85,247,0.1)' }} />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
                Synthesizing candidates
              </p>
              <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>
                Analyzing embeddings · Ranking by fit score
              </p>
            </div>
          </div>
        )}

        {/* Results */}
        <AnimatePresence>
          {results && !isSearching && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  {results.length} synthesized matches
                </span>
                <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.05)' }} />
                <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.25)' }}>
                  sorted by relevance
                </span>
              </div>

              <div className="flex flex-col gap-3">
                {results.map((profile, i) => (
                  <motion.div
                    key={profile.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.09 }}
                    className="rounded-xl p-4 cursor-pointer transition-all duration-200"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(168,85,247,0.3)';
                      (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.05)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.07)';
                      (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.03)';
                    }}
                  >
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-[11px] font-bold shrink-0"
                        style={{
                          background: 'linear-gradient(135deg, rgba(168,85,247,0.25), rgba(124,58,237,0.25))',
                          border: '1px solid rgba(168,85,247,0.2)',
                        }}
                      >
                        {profile.avatar}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <span className="text-sm font-semibold truncate" style={{ color: 'rgba(255,255,255,0.9)' }}>
                            {profile.name}
                          </span>
                          <div
                            className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full"
                            style={{
                              background: `${matchColor(profile.match)}18`,
                              color: matchColor(profile.match),
                              border: `1px solid ${matchColor(profile.match)}35`,
                            }}
                          >
                            {profile.match}% fit
                          </div>
                        </div>
                        <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.45)' }}>
                          {profile.title} · {profile.company} · {profile.yoe}
                        </p>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {profile.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] px-2 py-0.5 rounded-md"
                              style={{
                                background: 'rgba(255,255,255,0.05)',
                                color: 'rgba(255,255,255,0.5)',
                                border: '1px solid rgba(255,255,255,0.07)',
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
                        {profile.availability}
                      </span>
                      <button
                        className="text-[10px] font-medium transition-colors"
                        style={{ color: 'rgba(192,132,252,0.7)' }}
                        onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#c084fc')}
                        onMouseLeave={(e) => ((e.target as HTMLElement).style.color = 'rgba(192,132,252,0.7)')}
                      >
                        View Profile →
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state */}
        {!isSearching && !results && (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)' }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(168,85,247,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Describe your ideal candidate
              </p>
              <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.25)' }}>
                AI will synthesize and rank matching profiles
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
