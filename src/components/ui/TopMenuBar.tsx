'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { useOSStore } from '@/store/useOSStore';
import { resetCamera } from '../3d/Environment';

export default function TopMenuBar() {
  const [time, setTime] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Live clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-7 z-[1000] flex items-center justify-between px-4 glass-surface"
      initial={{ y: -28 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut', delay: 0.3 }}
    >
      {/* ─── Left: Kernel Menu ─── */}
      <div className="flex items-center gap-4" ref={dropdownRef}>
        {/* Logo / Kernel button */}
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-1.5 text-xs font-semibold text-white/90 hover:text-neon-cyan transition-colors duration-200"
          id="kernel-menu-button"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-neon-cyan"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
          </svg>
          <span className="font-mono tracking-wider">Kernel</span>
        </button>

        {/* Dropdown */}
        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              className="absolute top-7 left-2 w-48 glass-surface rounded-lg py-1 shadow-2xl border border-glass-border"
              initial={{ opacity: 0, y: -5, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -5, scale: 0.95 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              id="kernel-dropdown"
            >
              <DropdownItem
                label="About This System"
                onClick={() => {
                  useOSStore.getState().openWindow({
                    id: 'about',
                    title: 'About This System',
                    icon: 'ℹ️',
                    isMinimized: false,
                    position: { x: window.innerWidth / 2 - 175, y: window.innerHeight / 2 - 250 },
                    size: { width: 350, height: 500 },
                  });
                  setIsDropdownOpen(false);
                }}
              />
              <div className="h-px bg-glass-border my-1" />
              <DropdownItem
                label="System Preferences..."
                onClick={() => {
                  useOSStore.getState().openWindow({
                    id: 'preferences',
                    title: 'System Preferences',
                    icon: '⚙',
                    isMinimized: false,
                    position: { x: window.innerWidth / 2 - 200, y: window.innerHeight / 2 - 250 },
                    size: { width: 400, height: 500 },
                  });
                  setIsDropdownOpen(false);
                }}
              />
              <DropdownItem label="Force Quit..." onClick={() => window.close()} />
              <div className="h-px bg-glass-border my-1" />
              <DropdownItem
                label="Lock Screen"
                onClick={() => {
                  useOSStore.getState().lockScreen();
                  setIsDropdownOpen(false);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ─── Right: Status Icons ─── */}
      <div className="flex items-center gap-3 text-xs font-mono text-white/70">
        {/* Reset View Button */}
        <button
          onClick={resetCamera}
          className="opacity-60 hover:opacity-100 hover:text-neon-cyan transition-colors"
          title="Reset 3D View"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
        </button>

        {/* Wi-Fi */}
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="opacity-60"
        >
          <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" />
        </svg>

        {/* Battery */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] tracking-wider">100%</span>
          <svg
            width="18"
            height="10"
            viewBox="0 0 25 12"
            className="opacity-60"
          >
            <rect
              x="0.5"
              y="0.5"
              width="20"
              height="11"
              rx="2"
              ry="2"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
            <rect x="21" y="3.5" width="3" height="5" rx="1" fill="currentColor" />
            <rect
              x="2"
              y="2"
              width="17"
              height="8"
              rx="1"
              fill="#22C55E"
            />
          </svg>
        </div>

        {/* Time */}
        <span className="tracking-wider min-w-[65px] text-right">{time}</span>
      </div>
    </motion.div>
  );
}

/* ─── Dropdown Item ─── */
function DropdownItem({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <button
      className="w-full px-3 py-1 text-left text-xs text-white/80 hover:bg-neon-cyan/10 hover:text-neon-cyan transition-colors duration-150 font-mono"
      onClick={onClick}
    >
      {label}
    </button>
  );
}
