'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useOSStore } from '@/store/useOSStore';

type AccentColor = 'cyan' | 'purple' | 'green' | 'amber';
type WallpaperOption = 'default' | 'matrix' | 'aurora' | 'minimal';

export default function SystemPreferences() {
  const [accent, setAccent] = useState<AccentColor>('cyan');
  
  // Zustand Store
  const wallpaper = useOSStore((s) => s.wallpaper);
  const setWallpaper = useOSStore((s) => s.setWallpaper);
  const dockMagnification = useOSStore((s) => s.dockMagnification);
  const setDockMagnification = useOSStore((s) => s.setDockMagnification);
  const crtEnabled = useOSStore((s) => s.crtEnabled);
  const setCrtEnabled = useOSStore((s) => s.setCrtEnabled);
  const terminalOpacity = useOSStore((s) => s.terminalOpacity);
  const setTerminalOpacity = useOSStore((s) => s.setTerminalOpacity);

  const accentColors: { id: AccentColor; color: string; label: string }[] = [
    { id: 'cyan', color: '#00F5FF', label: 'Cyan' },
    { id: 'purple', color: '#A855F7', label: 'Purple' },
    { id: 'green', color: '#22C55E', label: 'Green' },
    { id: 'amber', color: '#FFAA00', label: 'Amber' },
  ];

  const wallpapers: { id: WallpaperOption; label: string; preview: string }[] = [
    { id: 'default', label: 'Motherboard', preview: 'radial-gradient(ellipse, #0d1b2a, #0a0a0a)' },
    { id: 'matrix', label: 'Matrix', preview: 'linear-gradient(180deg, #001a00, #000a00)' },
    { id: 'aurora', label: 'Aurora', preview: 'linear-gradient(135deg, #0d1b2a, #1a0a2e, #0a1a1a)' },
    { id: 'minimal', label: 'Void', preview: '#000000' },
  ];

  const applyAccent = useCallback((id: AccentColor) => {
    setAccent(id);
    const color = accentColors.find((c) => c.id === id)?.color || '#00F5FF';
    document.documentElement.style.setProperty('--color-neon-cyan', color);
  }, []);

  return (
    <div className="w-full h-full overflow-y-auto p-5 font-mono text-sm" style={{ scrollbarWidth: 'none' }}>
      <h2 className="text-white/80 text-base font-bold mb-5 tracking-wider">
        ⚙ SYSTEM PREFERENCES
      </h2>

      {/* ─── Accent Color ─── */}
      <section className="mb-6">
        <h3 className="text-white/50 text-xs tracking-widest mb-3 uppercase">
          Accent Color
        </h3>
        <div className="flex gap-3">
          {accentColors.map((c) => (
            <button
              key={c.id}
              onClick={() => applyAccent(c.id)}
              className="flex flex-col items-center gap-1.5"
            >
              <div
                className="w-8 h-8 rounded-full transition-all"
                style={{
                  backgroundColor: c.color,
                  boxShadow: accent === c.id ? `0 0 20px ${c.color}88, 0 0 40px ${c.color}44` : 'none',
                  border: accent === c.id ? '2px solid white' : '2px solid transparent',
                }}
              />
              <span className="text-[10px] text-white/40">{c.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ─── Wallpaper ─── */}
      <section className="mb-6">
        <h3 className="text-white/50 text-xs tracking-widest mb-3 uppercase">
          Wallpaper
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {wallpapers.map((w) => (
            <button
              key={w.id}
              onClick={() => setWallpaper(w.id)}
              className="rounded-lg overflow-hidden transition-all"
              style={{
                border: wallpaper === w.id ? '2px solid rgba(0,245,255,0.5)' : '2px solid rgba(255,255,255,0.05)',
              }}
            >
              <div
                className="h-14 flex items-end p-1.5"
                style={{ background: w.preview }}
              >
                <span className="text-[9px] text-white/50">{w.label}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ─── Toggle Settings ─── */}
      <section className="mb-6 space-y-3">
        <h3 className="text-white/50 text-xs tracking-widest mb-3 uppercase">
          Display
        </h3>

        {/* Dock Magnification */}
        <div className="flex items-center justify-between">
          <span className="text-white/60 text-xs">Dock Magnification</span>
          <button
            onClick={() => setDockMagnification(!dockMagnification)}
            className="relative w-10 h-5 rounded-full transition-colors"
            style={{
              backgroundColor: dockMagnification ? 'rgba(0,245,255,0.4)' : 'rgba(255,255,255,0.1)',
            }}
          >
            <motion.div
              className="absolute top-0.5 w-4 h-4 rounded-full bg-white"
              animate={{ left: dockMagnification ? 22 : 2 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            />
          </button>
        </div>

        {/* CRT Scanlines */}
        <div className="flex items-center justify-between">
          <span className="text-white/60 text-xs">CRT Scanlines</span>
          <button
            onClick={() => setCrtEnabled(!crtEnabled)}
            className="relative w-10 h-5 rounded-full transition-colors"
            style={{
              backgroundColor: crtEnabled ? 'rgba(0,245,255,0.4)' : 'rgba(255,255,255,0.1)',
            }}
          >
            <motion.div
              className="absolute top-0.5 w-4 h-4 rounded-full bg-white"
              animate={{ left: crtEnabled ? 22 : 2 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            />
          </button>
        </div>

        {/* Terminal Opacity */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-white/60 text-xs">Terminal Opacity</span>
            <span className="text-white/30 text-xs">{Math.round(terminalOpacity * 100)}%</span>
          </div>
          <input
            type="range"
            min={40}
            max={100}
            value={terminalOpacity * 100}
            onChange={(e) => setTerminalOpacity(Number(e.target.value) / 100)}
            className="w-full h-1 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, rgba(0,245,255,0.5) ${((terminalOpacity * 100) - 40) * (100 / 60)}%, rgba(255,255,255,0.1) ${((terminalOpacity * 100) - 40) * (100 / 60)}%)`,
            }}
          />
        </div>
      </section>

      {/* ─── System Info ─── */}
      <section className="pt-4 border-t border-white/5">
        <h3 className="text-white/50 text-xs tracking-widest mb-3 uppercase">
          About This System
        </h3>
        <div className="space-y-1.5 text-xs text-white/30">
          <p><span className="text-white/50">OS:</span> Kernel v1.0</p>
          <p><span className="text-white/50">Chip:</span> Adobe C++ Core</p>
          <p><span className="text-white/50">Memory:</span> CS + BizAdmin + SwiftUI (12 GB)</p>
          <p><span className="text-white/50">GPU:</span> Apple UI Engine</p>
          <p><span className="text-white/50">Neural:</span> Series.so NPU (Gemini)</p>
          <p><span className="text-white/50">Built by:</span> Aarush Inamdar</p>
        </div>
      </section>
    </div>
  );
}
