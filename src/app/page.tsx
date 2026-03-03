'use client';

import dynamic from 'next/dynamic';
import OSOverlay from '@/components/ui/OSOverlay';

// Dynamic import for the 3D environment to avoid SSR issues with Three.js
const Environment = dynamic(
  () => import('@/components/3d/Environment'),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 bg-kernel-black flex items-center justify-center">
        <div className="font-mono text-neon-cyan text-sm tracking-widest animate-pulse">
          LOADING KERNEL...
        </div>
      </div>
    ),
  }
);

export default function Home() {
  return (
    <main className="relative w-screen h-screen overflow-hidden bg-kernel-black">
      {/* 3D Scene Layer */}
      <Environment />

      {/* OS Overlay Layer */}
      <OSOverlay />
    </main>
  );
}
