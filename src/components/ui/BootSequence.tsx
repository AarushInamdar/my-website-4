'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOSStore } from '@/store/useOSStore';

const BOOT_LOGS = [
  { text: 'POST: Power-On Self-Test — OK', delay: 200 },
  { text: 'BIOS v4.2.1 — Aarush.Kernel initialized', delay: 400 },
  { text: '──────────────────────────────────────', delay: 100 },
  { text: '[OK] Initializing Dual Degree: CS & Business Admin...', delay: 500 },
  { text: '[OK] Allocating Memory: Data Structures, Algorithms, OS Theory...', delay: 400 },
  { text: '[OK] Loading Adobe Graphics Engine (C++ / TRL11)...', delay: 600 },
  { text: '[OK] Configuring Performance Pipeline: 40% latency reduction achieved', delay: 500 },
  { text: '[OK] Mounting Apple Geofencing Module (SwiftUI / CoreLocation)...', delay: 550 },
  { text: '[OK] Compiling React Frontend Service (Next.js / TypeScript)...', delay: 450 },
  { text: '[OK] Connecting Series.so Neural Engine (FastAPI / Gemini API)...', delay: 500 },
  { text: '[OK] Initializing RAG Pipeline: 92% retrieval accuracy...', delay: 400 },
  { text: '──────────────────────────────────────', delay: 100 },
  { text: '[OK] All system modules loaded successfully.', delay: 300 },
  { text: '[OK] Kernel Online. Welcome, Aarush.', delay: 600 },
];

export default function BootSequence() {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [isComplete, setIsComplete] = useState(false);
  const boot = useOSStore((state) => state.boot);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const showNextLine = (index: number) => {
      if (index >= BOOT_LOGS.length) {
        // All lines shown, wait then transition
        timeout = setTimeout(() => {
          setIsComplete(true);
          setTimeout(() => boot(), 800);
        }, 1000);
        return;
      }

      timeout = setTimeout(() => {
        setVisibleLines(index + 1);
        showNextLine(index + 1);
      }, BOOT_LOGS[index].delay);
    };

    // Start after a brief initial delay
    timeout = setTimeout(() => showNextLine(0), 500);

    return () => clearTimeout(timeout);
  }, [boot]);

  // Auto-scroll
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [visibleLines]);

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-kernel-black flex items-center justify-center scanline-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          {/* CRT effect overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,245,255,0.03) 2px, rgba(0,245,255,0.03) 4px)',
            }}
          />

          <div className="w-full max-w-2xl px-8">
            {/* Header */}
            <div className="mb-6 pb-4 border-b border-glass-border">
              <div className="font-mono text-neon-cyan text-xs tracking-[0.25em] uppercase opacity-60">
                Aarush Inamdar — System Kernel v1.0
              </div>
            </div>

            {/* Log lines */}
            <div
              ref={containerRef}
              className="font-mono text-sm leading-relaxed max-h-[60vh] overflow-y-auto"
              style={{ scrollbarWidth: 'none' }}
            >
              {BOOT_LOGS.slice(0, visibleLines).map((log, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className={`py-0.5 ${
                    log.text.startsWith('[OK]')
                      ? 'text-neon-cyan'
                      : log.text.startsWith('──')
                      ? 'text-white/20'
                      : 'text-white/60'
                  }`}
                >
                  {log.text}
                </motion.div>
              ))}

              {/* Blinking cursor */}
              {visibleLines > 0 && visibleLines < BOOT_LOGS.length && (
                <span className="inline-block w-2 h-4 bg-neon-cyan animate-cursor-blink ml-1" />
              )}
            </div>

            {/* Progress bar */}
            <div className="mt-8 pt-4 border-t border-glass-border">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs text-white/40 tracking-wider">
                  BOOT PROGRESS
                </span>
                <span className="font-mono text-xs text-neon-cyan">
                  {Math.round((visibleLines / BOOT_LOGS.length) * 100)}%
                </span>
              </div>
              <div className="w-full h-1 bg-kernel-gray rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-neon-cyan rounded-full"
                  style={{
                    boxShadow: '0 0 12px rgba(0, 245, 255, 0.5)',
                  }}
                  initial={{ width: '0%' }}
                  animate={{
                    width: `${(visibleLines / BOOT_LOGS.length) * 100}%`,
                  }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
