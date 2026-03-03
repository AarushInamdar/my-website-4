'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOSStore } from '@/store/useOSStore';

interface SearchResult {
  title: string;
  type: 'app' | 'command' | 'file';
  action: () => void;
  subtitle?: string;
}

export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const openWindow = useOSStore(state => state.openWindow);

  // Toggle with CMD+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        setQuery('');
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const allResults: SearchResult[] = [
    {
      title: 'Terminal',
      type: 'app',
      action: () => openWindow({ id: 'terminal', title: 'Terminal', icon: '>_', position: { x: 100, y: 100 }, size: { width: 700, height: 500 }, isMinimized: false }),
    },
    {
      title: 'Neural Engine',
      type: 'app',
      action: () => openWindow({ id: 'neural', title: 'Neural Engine', icon: 'AI', position: { x: window.innerWidth / 2 - 400, y: window.innerHeight / 2 - 300 }, size: { width: 800, height: 600 }, isMinimized: false }),
    },
    {
      title: 'ask-gemini <query>',
      subtitle: 'Query the Neural Engine AI',
      type: 'command',
      action: () => openWindow({ id: 'terminal', title: 'Terminal', icon: '>_', position: { x: 100, y: 100 }, size: { width: 700, height: 500 }, isMinimized: false }),
    },
    {
      title: 'ping <skill>',
      subtitle: 'Check skill network telemetry',
      type: 'command',
      action: () => openWindow({ id: 'terminal', title: 'Terminal', icon: '>_', position: { x: 100, y: 100 }, size: { width: 700, height: 500 }, isMinimized: false }),
    },
    {
      title: '/home/projects/CheckSplit',
      subtitle: 'CoreML Bill Splitting App',
      type: 'file',
      action: () => openWindow({ id: 'terminal', title: 'Terminal', icon: '>_', position: { x: 100, y: 100 }, size: { width: 700, height: 500 }, isMinimized: false }),
    },
    {
      title: '/home/projects/NetAudit',
      subtitle: 'Web Accessibility Auditor',
      type: 'file',
      action: () => openWindow({ id: 'terminal', title: 'Terminal', icon: '>_', position: { x: 100, y: 100 }, size: { width: 700, height: 500 }, isMinimized: false }),
    }
  ];

  const filteredResults = query
    ? allResults.filter(r => r.title.toLowerCase().includes(query.toLowerCase()) || r.subtitle?.toLowerCase().includes(query.toLowerCase()))
    : allResults.slice(0, 5); // Show top 5 by default

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9000] pointer-events-auto"
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-1/4 left-1/2 -translate-x-1/2 w-full max-w-lg bg-[#111]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-[9001] pointer-events-auto overflow-hidden flex flex-col font-mono"
          >
            {/* Search Input */}
            <div className="flex items-center px-4 py-3 border-b border-white/10">
              <span className="text-white/40 mr-3 text-lg">⌬</span>
              <input
                ref={inputRef}
                type="text"
                placeholder="Search OS (Apps, Commands, Projects)..."
                className="flex-1 bg-transparent text-white placeholder-white/30 focus:outline-none text-lg"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && filteredResults.length > 0) {
                    filteredResults[0].action();
                    setIsOpen(false);
                  }
                }}
              />
              <div className="text-[10px] text-white/30 border border-white/10 rounded px-1.5 py-0.5 ml-2">ESC</div>
            </div>

            {/* Results List */}
            <div className="max-h-[300px] overflow-y-auto p-2">
              {filteredResults.length === 0 ? (
                <div className="p-4 text-center text-white/40 text-sm">
                  No results found for "{query}"
                </div>
              ) : (
                filteredResults.map((result, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      result.action();
                      setIsOpen(false);
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-white/5 flex items-center justify-between group transition-colors"
                  >
                    <div className="flex flex-col">
                      <span className="text-white/90 text-[13px]">{result.title}</span>
                      {result.subtitle && (
                        <span className="text-white/40 text-[10px] uppercase tracking-wider">{result.subtitle}</span>
                      )}
                    </div>
                    <span className="text-[10px] tracking-widest uppercase text-white/20 group-hover:text-neon-cyan/80">
                      {result.type}
                    </span>
                  </button>
                ))
              )}
            </div>
            
            {/* Footer */}
            <div className="bg-black/40 px-4 py-2 text-[10px] text-white/30 text-right tracking-widest border-t border-white/5">
              GLOBAL_SEARCH_INDEX
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
