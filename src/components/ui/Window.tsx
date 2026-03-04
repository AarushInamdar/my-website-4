'use client';

import { useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useOSStore } from '@/store/useOSStore';

interface WindowProps {
  id: string;
  title: string;
  icon: string;
  zIndex: number;
  initialPosition: { x: number; y: number };
  initialSize: { width: number; height: number };
  children: React.ReactNode;
}

export default function Window({
  id,
  title,
  icon,
  zIndex,
  initialPosition,
  initialSize,
  children,
}: WindowProps) {
  const closeWindow = useOSStore((s) => s.closeWindow);
  const minimizeWindow = useOSStore((s) => s.minimizeWindow);
  const focusWindow = useOSStore((s) => s.focusWindow);
  const terminalOpacity = useOSStore((s) => s.terminalOpacity);
  const [size, setSize] = useState(initialSize);
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, px: 0, py: 0 });
  const resizeStartRef = useRef({ x: 0, y: 0, w: 0, h: 0 });

  const handleMouseDown = useCallback(() => {
    focusWindow(id);
  }, [id, focusWindow]);

  /* ─── Drag by title bar ─── */
  const handleDragStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);
      focusWindow(id);
      dragStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        px: position.x,
        py: position.y,
      };

      const handleDragMove = (ev: MouseEvent) => {
        const dx = ev.clientX - dragStartRef.current.x;
        const dy = ev.clientY - dragStartRef.current.y;
        setPosition({
          x: dragStartRef.current.px + dx,
          y: dragStartRef.current.py + dy,
        });
      };

      const handleDragEnd = () => {
        setIsDragging(false);
        window.removeEventListener('mousemove', handleDragMove);
        window.removeEventListener('mouseup', handleDragEnd);
      };

      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('mouseup', handleDragEnd);
    },
    [id, position, focusWindow]
  );

  /* ─── Resize from corner ─── */
  const handleResizeStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsResizing(true);
      resizeStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        w: size.width,
        h: size.height,
      };

      const handleResizeMove = (ev: MouseEvent) => {
        const dx = ev.clientX - resizeStartRef.current.x;
        const dy = ev.clientY - resizeStartRef.current.y;
        setSize({
          width: Math.max(400, resizeStartRef.current.w + dx),
          height: Math.max(250, resizeStartRef.current.h + dy),
        });
      };

      const handleResizeEnd = () => {
        setIsResizing(false);
        window.removeEventListener('mousemove', handleResizeMove);
        window.removeEventListener('mouseup', handleResizeEnd);
      };

      window.addEventListener('mousemove', handleResizeMove);
      window.addEventListener('mouseup', handleResizeEnd);
    },
    [size]
  );

  return (
    <motion.div
      className="absolute"
      style={{
        zIndex,
        width: size.width,
        height: size.height,
        left: position.x,
        top: position.y,
        userSelect: isDragging || isResizing ? 'none' : 'auto',
      }}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      onMouseDown={handleMouseDown}
    >
      <div
        className="w-full h-full flex flex-col rounded-xl overflow-hidden border border-glass-border transition-all duration-300"
        style={{
          background: `rgba(10, 10, 10, ${terminalOpacity})`,
          backdropFilter: `blur(${Math.round(terminalOpacity * 30)}px)`,
          WebkitBackdropFilter: `blur(${Math.round(terminalOpacity * 30)}px)`,
          boxShadow:
            '0 25px 60px rgba(0,0,0,0.6), 0 0 1px rgba(0,245,255,0.15), inset 0 1px 0 rgba(255,255,255,0.04)',
        }}
      >
        {/* ─── Title Bar (drag handle) ─── */}
        <div
          className="flex items-center h-8 pl-[10px] pr-3 bg-white/[0.03] border-b border-glass-border cursor-grab active:cursor-grabbing select-none shrink-0"
          onMouseDown={handleDragStart}
        >
          {/* Traffic lights — macOS-accurate 10px from left, 8px gap */}
          <div className="flex items-center gap-2 mr-3">
            <button
              onClick={(e) => { e.stopPropagation(); closeWindow(id); }}
              onMouseDown={(e) => e.stopPropagation()}
              className="w-3 h-3 rounded-full bg-[#FF5F57] hover:brightness-110 transition-all group"
              aria-label="Close"
            >
              <span className="hidden group-hover:block text-[8px] text-black/60 text-center leading-3">
                ✕
              </span>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); minimizeWindow(id); }}
              onMouseDown={(e) => e.stopPropagation()}
              className="w-3 h-3 rounded-full bg-[#FEBC2E] hover:brightness-110 transition-all group"
              aria-label="Minimize"
            >
              <span className="hidden group-hover:block text-[8px] text-black/60 text-center leading-3">
                −
              </span>
            </button>
            <div className="w-3 h-3 rounded-full bg-[#28C840] hover:brightness-110 transition-all" />
          </div>

          {/* Title */}
          <div className="flex-1 text-center text-[11px] font-bold text-white/50 tracking-wider truncate">
            {title}
          </div>

          {/* Spacer for centering */}
          <div className="w-12" />
        </div>

        {/* ─── Content ─── */}
        <div className="flex-1 overflow-hidden">{children}</div>

        {/* ─── Resize Handle ─── */}
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-10"
          onMouseDown={handleResizeStart}
          style={{
            background:
              'linear-gradient(135deg, transparent 50%, rgba(0,245,255,0.2) 50%)',
          }}
        />
      </div>
    </motion.div>
  );
}
