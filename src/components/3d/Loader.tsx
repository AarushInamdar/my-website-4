'use client';

import { Html, useProgress } from '@react-three/drei';

export default function Loader() {
  const { progress } = useProgress();

  return (
    <Html center>
      <div className="flex flex-col items-center gap-4 font-mono text-neon-cyan">
        {/* BIOS text */}
        <div className="text-xs tracking-[0.3em] uppercase opacity-60">
          System BIOS v4.2.1
        </div>

        {/* Main title */}
        <div className="text-lg tracking-widest text-glow-cyan">
          INITIALIZING KERNEL...
        </div>

        {/* Progress bar container */}
        <div className="w-64 h-1.5 bg-kernel-gray border border-glass-border rounded-sm overflow-hidden">
          <div
            className="h-full bg-neon-cyan transition-all duration-300 ease-out"
            style={{
              width: `${progress}%`,
              boxShadow: '0 0 12px rgba(0, 245, 255, 0.6)',
            }}
          />
        </div>

        {/* Progress text */}
        <div className="text-xs tracking-widest opacity-50">
          {progress.toFixed(0)}% — Loading Modules
        </div>
      </div>
    </Html>
  );
}
