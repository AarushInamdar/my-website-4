'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LOCK_PASSWORD = 'HelloWorld!';

export default function LockScreen({ onUnlock }: { onUnlock: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    inputRef.current?.focus();
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (password === LOCK_PASSWORD) {
        onUnlock();
      } else {
        setError(true);
        setPassword('');
        setTimeout(() => setError(false), 1500);
      }
    },
    [password, onUnlock]
  );

  const formattedTime = time.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: false,
  });

  const formattedDate = time.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <motion.div
      className="fixed inset-0 z-[10000] overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        background: 'linear-gradient(160deg, #0d1b2e 0%, #1a0b30 45%, #0a1622 100%)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
      }}
    >
      {/* ─── Ambient background orbs — macOS Sonoma-style color wash ─── */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute rounded-full"
          style={{
            width: 700,
            height: 700,
            background: 'radial-gradient(circle, rgba(56,101,212,0.35) 0%, transparent 65%)',
            top: '-20%',
            left: '-15%',
            filter: 'blur(100px)',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 500,
            height: 500,
            background: 'radial-gradient(circle, rgba(120,50,220,0.28) 0%, transparent 65%)',
            bottom: '-12%',
            right: '-8%',
            filter: 'blur(120px)',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 350,
            height: 350,
            background: 'radial-gradient(circle, rgba(14,165,233,0.2) 0%, transparent 65%)',
            bottom: '25%',
            left: '8%',
            filter: 'blur(90px)',
          }}
        />
      </div>

      {/* ─── Time & Date — macOS top-center position ─── */}
      <motion.div
        className="absolute top-10 left-0 right-0 flex flex-col items-center pointer-events-none select-none"
        initial={{ y: -12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.7, ease: 'easeOut' }}
      >
        <div
          className="leading-none tracking-tight tabular-nums"
          style={{ fontSize: 72, fontWeight: 200, color: 'rgba(255,255,255,0.92)', letterSpacing: '-0.02em' }}
        >
          {formattedTime}
        </div>
        <div
          className="mt-2"
          style={{ fontSize: 15, fontWeight: 400, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.01em' }}
        >
          {formattedDate}
        </div>
      </motion.div>

      {/* ─── Login card — vertical center ─── */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">

        {/* Avatar */}
        <motion.div
          className="mb-4"
          initial={{ scale: 0.82, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center relative"
            style={{
              background: 'linear-gradient(145deg, rgba(56,101,212,0.55), rgba(120,50,220,0.55))',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '2px solid rgba(255,255,255,0.2)',
              boxShadow: '0 8px 40px rgba(56,101,212,0.35), 0 0 0 6px rgba(255,255,255,0.04)',
            }}
          >
            <span style={{ fontSize: 26, fontWeight: 600, color: 'rgba(255,255,255,0.92)' }}>
              AI
            </span>
          </div>
        </motion.div>

        {/* User name */}
        <motion.p
          className="mb-7 select-none"
          style={{ fontSize: 17, fontWeight: 600, color: 'rgba(255,255,255,0.9)', letterSpacing: '-0.01em' }}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
        >
          Aarush Inamdar
        </motion.p>

        {/* ─── Password input ─── */}
        <motion.form
          onSubmit={handleSubmit}
          className="flex flex-col items-center gap-3"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.42, duration: 0.5 }}
        >
          <motion.div
            animate={error ? { x: [-7, 7, -7, 7, -3, 3, 0] } : {}}
            transition={{ duration: 0.45 }}
          >
            <div
              className="relative flex items-center"
              style={{
                width: 240,
                background: 'rgba(255,255,255,0.13)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderRadius: 999,
                border: error
                  ? '1px solid rgba(255,95,87,0.65)'
                  : '1px solid rgba(255,255,255,0.22)',
                boxShadow: error
                  ? '0 0 0 3px rgba(255,95,87,0.18), 0 4px 20px rgba(0,0,0,0.3)'
                  : '0 4px 20px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.12)',
                transition: 'all 0.2s ease',
              }}
            >
              <input
                ref={inputRef}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                className="flex-1 bg-transparent outline-none text-center"
                style={{
                  padding: '10px 20px',
                  fontSize: 14,
                  color: 'rgba(255,255,255,0.88)',
                  caretColor: 'rgba(255,255,255,0.7)',
                }}
                autoComplete="off"
              />
              <button
                type="submit"
                className="absolute right-1 flex items-center justify-center rounded-full transition-all duration-150"
                style={{
                  width: 32,
                  height: 32,
                  background: password
                    ? 'rgba(255,255,255,0.92)'
                    : 'rgba(255,255,255,0.14)',
                }}
              >
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M3 8h10M9 4l4 4-4 4"
                    stroke={password ? '#111' : 'rgba(255,255,255,0.5)'}
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </motion.div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{ fontSize: 12, color: '#ff6b6b', marginTop: -4 }}
              >
                Password Incorrect
              </motion.p>
            )}
          </AnimatePresence>

          {/* Hint */}
          <button
            type="button"
            onClick={() => setShowHint(!showHint)}
            className="transition-colors mt-1"
            style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)' }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.color = 'rgba(255,255,255,0.5)')}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.color = 'rgba(255,255,255,0.28)')}
          >
            {showHint ? 'Hide Hint' : 'Password Hint'}
          </button>

          <AnimatePresence>
            {showHint && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-center"
                style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', maxWidth: 200 }}
              >
                A classic programmer greeting — camelCase, with feeling!
              </motion.p>
            )}
          </AnimatePresence>
        </motion.form>
      </div>

      {/* ─── Bottom label ─── */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center pointer-events-none select-none">
        <p
          className="tracking-widest uppercase"
          style={{ fontSize: 11, color: 'rgba(255,255,255,0.13)', letterSpacing: '0.15em' }}
        >
          Kernel OS · Locked
        </p>
      </div>
    </motion.div>
  );
}
