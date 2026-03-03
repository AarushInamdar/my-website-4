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
    hour: '2-digit',
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
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        background: 'radial-gradient(ellipse at 50% 30%, #0d1b2a 0%, #0a0a0a 70%)',
      }}
    >
      {/* Ambient glow orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute w-[500px] h-[500px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, #00F5FF 0%, transparent 70%)',
            top: '10%',
            left: '20%',
            filter: 'blur(80px)',
          }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full opacity-15"
          style={{
            background: 'radial-gradient(circle, #A855F7 0%, transparent 70%)',
            bottom: '20%',
            right: '15%',
            filter: 'blur(80px)',
          }}
        />
      </div>

      {/* Scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,245,255,0.1) 2px, rgba(0,245,255,0.1) 4px)',
        }}
      />

      {/* Time Display */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-center mb-12"
      >
        <div className="text-7xl font-thin text-white/90 tracking-widest font-mono">
          {formattedTime}
        </div>
        <div className="text-lg text-white/40 tracking-[0.3em] mt-2 font-mono">
          {formattedDate}
        </div>
      </motion.div>

      {/* User Avatar */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mb-6"
      >
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white border-2 border-white/10"
          style={{
            background: 'linear-gradient(135deg, #00F5FF33, #A855F733)',
            boxShadow: '0 0 30px rgba(0,245,255,0.15), 0 0 60px rgba(168,85,247,0.1)',
          }}
        >
          AI
        </div>
      </motion.div>

      {/* Username */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="text-white/70 text-sm font-mono tracking-widest mb-6"
      >
        AARUSH INAMDAR
      </motion.div>

      {/* Password Input */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="flex flex-col items-center gap-3"
      >
        <motion.div
          animate={error ? { x: [-8, 8, -8, 8, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="relative"
        >
          <input
            ref={inputRef}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Password"
            className="w-64 px-4 py-2.5 rounded-lg bg-white/[0.06] border text-white/80 text-sm font-mono text-center outline-none transition-all placeholder:text-white/20"
            style={{
              borderColor: error ? '#FF5F57' : 'rgba(255,255,255,0.08)',
              boxShadow: error
                ? '0 0 20px rgba(255,95,87,0.3)'
                : '0 0 20px rgba(0,245,255,0.05)',
            }}
            autoComplete="off"
          />
          {/* Unlock arrow */}
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <span className="text-white/60 text-xs">→</span>
          </button>
        </motion.div>

        {/* Error message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-[#FF5F57] text-xs font-mono"
            >
              Authentication failed
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hint toggle */}
        <button
          type="button"
          onClick={() => setShowHint(!showHint)}
          className="text-white/20 text-xs font-mono hover:text-white/40 transition-colors"
        >
          {showHint ? 'Hide Hint' : 'Show Hint'}
        </button>

        <AnimatePresence>
          {showHint && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-neon-cyan/50 text-xs font-mono text-center"
            >
              💡 A classic programmer greeting — two words, camelCase, with feeling!
            </motion.div>
          )}
        </AnimatePresence>
      </motion.form>

      {/* Bottom branding */}
      <div className="absolute bottom-8 text-white/10 text-xs font-mono tracking-widest">
        KERNEL OS v1.0 — LOCKED
      </div>
    </motion.div>
  );
}
