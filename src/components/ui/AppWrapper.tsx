'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface AppWrapperProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  brandColor?: string;
}

export default function AppWrapper({
  title,
  subtitle,
  children,
  brandColor = '#00F5FF',
}: AppWrapperProps) {
  return (
    <div className="w-full h-full flex flex-col font-mono relative overflow-hidden text-white/90">
      {/* ─── Header ─── */}
      <div 
        className="shrink-0 px-5 py-4 border-b border-glass-border flex flex-col justify-center"
        style={{
          background: `linear-gradient(to right, rgba(255,255,255,0.02), transparent)`,
        }}
      >
        <motion.h1 
          className="text-lg font-bold tracking-tight"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          style={{ color: brandColor }}
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p 
            className="text-xs text-white/50 tracking-wide mt-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {subtitle}
          </motion.p>
        )}
      </div>

      {/* ─── Scrollable Content Area ─── */}
      <div 
        className="flex-1 overflow-y-auto overflow-x-hidden relative px-4 md:px-6 pb-6 pt-4"
        style={{ scrollbarWidth: 'none' }}
      >
        {children}
      </div>
    </div>
  );
}
