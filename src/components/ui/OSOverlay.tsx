'use client';

import { useOSStore } from '@/store/useOSStore';
import { AnimatePresence, motion } from 'framer-motion';
import TopMenuBar from './TopMenuBar';
import Dock from './Dock';
import BootSequence from './BootSequence';
import Window from './Window';
import Terminal from './Terminal';
import NeuralEngine from './NeuralEngine';
import SystemPreferences from './SystemPreferences';
import LockScreen from './LockScreen';
import AboutSystem from './AboutSystem';
import GlobalSearch from './GlobalSearch';

/* ─── Map window IDs to their content component ─── */
function WindowContent({ id }: { id: string }) {
  switch (id) {
    case 'terminal':
      return <Terminal />;
    case 'neural':
      return <NeuralEngine />;
    case 'preferences':
      return <SystemPreferences />;
    case 'about':
      return <AboutSystem />;
    default:
      return (
        <div className="flex items-center justify-center h-full font-mono text-white/30 text-sm">
          <p>Application "{id}" — Coming Soon</p>
        </div>
      );
  }
}

export default function OSOverlay() {
  const systemStatus = useOSStore((state) => state.systemStatus);
  const activeWindows = useOSStore((state) => state.activeWindows);
  const wallpaper = useOSStore((state) => state.wallpaper);
  const crtEnabled = useOSStore((state) => state.crtEnabled);

  return (
    <div className="fixed inset-0 pointer-events-none z-[500]">
      {/* ─── Wallpaper Overlays (Behind Windows) ─── */}
      <AnimatePresence>
        {wallpaper === 'aurora' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="fixed inset-0 pointer-events-none -z-10 bg-[linear-gradient(135deg,#0d1b2a,#1a0a2e,#0a1a1a)] bg-[length:400%_400%] animate-aurora"
          />
        )}
        {wallpaper === 'matrix' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="fixed inset-0 pointer-events-none -z-10 matrix-bg opacity-40"
          />
        )}
      </AnimatePresence>

      {/* ─── CRT Scanlines Overlay (On top of everything) ─── */}
      <AnimatePresence>
        {crtEnabled && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-[900] mix-blend-overlay opacity-30 crt-scanlines"
          />
        )}
      </AnimatePresence>
      {/* Boot Sequence */}
      {systemStatus === 'Booting' && (
        <div className="pointer-events-auto">
          <BootSequence />
        </div>
      )}

      {/* Online UI */}
      {systemStatus === 'Online' && (
        <>
          <div className="pointer-events-auto">
            <TopMenuBar />
          </div>

          <GlobalSearch />

          {/* Active Windows */}
          <AnimatePresence>
            {activeWindows
              .filter((w) => !w.isMinimized)
              .map((win) => (
                <div key={win.id} className="pointer-events-auto">
                  <Window
                    id={win.id}
                    title={win.title}
                    icon={win.icon}
                    zIndex={win.zIndex}
                    initialPosition={win.position}
                    initialSize={win.size}
                  >
                    <WindowContent id={win.id} />
                  </Window>
                </div>
              ))}
          </AnimatePresence>

          <div className="pointer-events-auto">
            <Dock />
          </div>
        </>
      )}

      {/* Power Off */}
      {systemStatus === 'Power_Off' && (
        <div className="fixed inset-0 bg-black z-[9999] pointer-events-auto" />
      )}

      {/* Lock Screen */}
      <AnimatePresence>
        {systemStatus === 'Locked' && (
          <div className="pointer-events-auto">
            <LockScreen onUnlock={() => useOSStore.getState().unlockScreen()} />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
