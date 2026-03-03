'use client';

import { useRef } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  MotionValue,
} from 'framer-motion';
import { useOSStore } from '@/store/useOSStore';

/* ─── Dock item data ─── */
const DOCK_ITEMS = [
  {
    id: 'adobe',
    label: 'Adobe.exe',
    icon: 'Adobe',
    color: '#FF3B3F',
    bgGradient: 'from-red-600 to-red-900',
  },
  {
    id: 'apple',
    label: 'Apple_Files',
    icon: 'Apple',
    color: '#E2E8F0', // Slightly off-white to allow for a brighter glow effect
    glowColor: '#ffffff', // Explicit glow color
    bgGradient: 'from-gray-600 to-gray-900',
  },
  {
    id: 'trl11',
    label: 'TRL11.sys',
    icon: 'TRL11',
    color: '#FFAA00',
    bgGradient: 'from-amber-600 to-amber-900',
  },
  {
    id: 'sap',
    label: 'SAP_Bridge',
    icon: 'SAP',
    color: '#3B82F6',
    bgGradient: 'from-blue-600 to-blue-900',
  },
  {
    id: 'series',
    label: 'Series.so',
    icon: 'Series',
    color: '#A855F7',
    bgGradient: 'from-purple-600 to-purple-900',
  },
  {
    id: 'terminal',
    label: 'Terminal',
    icon: '>_',
    color: '#22C55E',
    bgGradient: 'from-green-700 to-green-950',
  },
  {
    id: 'neural',
    label: 'Neural Engine',
    icon: 'AI',
    color: '#FF00FF',
    glowColor: '#FF66FF',
    bgGradient: 'from-fuchsia-600 to-fuchsia-900',
  },
];

/* ─── Single Dock Icon with Magnification ─── */
function DockIcon({
  item,
  mouseX,
}: {
  item: (typeof DOCK_ITEMS)[0];
  mouseX: MotionValue<number>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const openWindow = useOSStore((state) => state.openWindow);
  const activeWindows = useOSStore((state) => state.activeWindows);
  const dockMagnification = useOSStore((state) => state.dockMagnification);
  const isActive = activeWindows.some((w) => w.id === item.id);

  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? {
      x: 0,
      width: 0,
    };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-150, 0, 150], [48, 72, 48]);
  const width = useSpring(widthSync, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const handleClick = () => {
    openWindow({
      id: item.id,
      title: item.label,
      icon: item.icon,
      isMinimized: false,
      position: { x: 100 + Math.random() * 200, y: 80 + Math.random() * 100 },
      size: { width: 680, height: 440 },
    });
  };

  return (
    <motion.div
      ref={ref}
      style={{ width, height: width }}
      className="relative group cursor-pointer"
      onClick={handleClick}
      whileTap={{ scale: 0.85 }}
    >
      {/* Tooltip */}
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md glass-surface text-[10px] font-mono text-white/80 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        {item.label}
      </div>

      {/* Icon */}
      <motion.div
        className={`w-full h-full rounded-xl bg-gradient-to-br ${item.bgGradient} flex items-center justify-center shadow-lg border border-white/10 relative overflow-hidden`}
        style={{
          boxShadow: `0 4px 15px ${item.glowColor || item.color}44, inset 0 1px 0 rgba(255,255,255,0.1)`,
        }}
        whileHover={{
          boxShadow: `0 0 30px ${item.glowColor || item.color}99, 0 0 15px ${item.glowColor || item.color}66, inset 0 1px 0 rgba(255,255,255,0.2)`,
          scale: 1.05,
        }}
      >
        <span
          className="text-white font-bold select-none leading-none text-center relative z-10 drop-shadow-md"
          style={{
            fontSize: '0.45em',
            textShadow: `0 0 12px ${item.glowColor || item.color}`,
            letterSpacing: '0.02em',
          }}
        >
          {item.icon}
        </span>
        {/* Inner ambient glow */}
        <div 
          className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at center, ${item.glowColor || item.color}44 0%, transparent 70%)`
          }}
        />
      </motion.div>

      {/* Active dot indicator — shows when window is open */}
      <div
        className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full transition-opacity ${
          isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}
        style={{
          backgroundColor: item.color,
          boxShadow: isActive ? `0 0 8px ${item.glowColor || item.color}, 0 0 4px ${item.glowColor || item.color}` : 'none',
        }}
      />
    </motion.div>
  );
}

/* ─── Main Dock ─── */
export default function Dock() {
  const mouseX = useMotionValue(Infinity);

  return (
    <motion.div
      className="fixed bottom-3 left-1/2 -translate-x-1/2 z-[1000]"
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: 0.6,
        ease: 'easeOut',
        delay: 0.5,
      }}
    >
      <motion.div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="flex items-end gap-2 px-3 py-2 rounded-2xl glass-surface glow-border-cyan"
        id="system-dock"
      >
        {DOCK_ITEMS.map((item) => (
          <DockIcon key={item.id} item={item} mouseX={mouseX} />
        ))}
      </motion.div>
    </motion.div>
  );
}
