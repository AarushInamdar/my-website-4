'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AppWrapper from './AppWrapper';

const MOCK_PROFILES = [
  { id: 1, name: 'Elena R.', role: 'Senior AI Researcher', tags: ['LLM Optimization', 'PyTorch', 'Distributed Systems'], match: 98 },
  { id: 2, name: 'David K.', role: 'Machine Learning Engineer', tags: ['TensorRT', 'CUDA', 'Computer Vision'], match: 85 },
  { id: 3, name: 'Sarah J.', role: 'Data Scientist', tags: ['NLP', 'Transformers', 'Python'], match: 72 },
];

export default function SeriesApp() {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<typeof MOCK_PROFILES | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsSearching(true);
    setResults(null);
    
    // Simulate Gemini API latency
    setTimeout(() => {
      setIsSearching(false);
      setResults(MOCK_PROFILES);
    }, 1800);
  };

  return (
    <AppWrapper
      title="Series.so // Discovery"
      subtitle="AI Talent Sourcing & Enterprise Matching"
      brandColor="#ff00ff"
    >
      <div className="h-full flex flex-col bg-[#0A0A0A] text-white p-6 font-sans antialiased">
        
        {/* ─── Search Input ─── */}
        <form onSubmit={handleSearch} className="relative mb-8">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/40">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search talent profiles via NLP prompt..."
            className="w-full bg-white/10 border border-white/20 rounded-xl py-3 pl-12 pr-24 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all shadow-sm backdrop-blur-md"
          />
          <button 
            type="submit" 
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 text-white/90 border border-white/10 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-white hover:text-black transition-colors"
          >
            Generate
          </button>
        </form>

        {/* ─── Loading State ─── */}
        {isSearching && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="w-8 h-8 rounded-full border-t-2 border-r-2 border-[#ff00ff]"
            />
            <div className="text-sm text-white/60">
              <p className="font-semibold text-white/80">Querying Gemini 1.5 Pro</p>
              <p className="text-xs mt-1">Extracting semantic tags & analyzing vector embeddings...</p>
            </div>
          </div>
        )}

        {/* ─── Results State ─── */}
        <AnimatePresence>
          {results && !isSearching && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-3"
            >
              <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Synthesized Matches</h3>
              {results.map((profile, i) => (
                <motion.div 
                  key={profile.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-[#111] border border-[#222] rounded-xl p-4 flex flex-col gap-3 hover:border-[#444] transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-sm">{profile.name}</h4>
                      <p className="text-xs text-white/50">{profile.role}</p>
                    </div>
                    <div className="text-xs font-mono text-[#ff00ff] bg-[#ff00ff]/10 px-2 py-1 rounded-md">
                      {profile.match}% Match
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-1">
                    {profile.tags.map((tag, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-1 rounded-full bg-white/5 border border-white/10 text-white/70">
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* ─── Empty State ─── */}
        {!isSearching && !results && (
          <div className="flex-1 flex flex-col items-center justify-center opacity-30 text-center px-4">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
            <p className="text-sm">Initiate an NLP search to source elite engineering talent.</p>
          </div>
        )}

      </div>
    </AppWrapper>
  );
}
