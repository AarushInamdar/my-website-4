'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AppWrapper from './AppWrapper';

export default function AdobeApp() {
  const [activeTab, setActiveTab] = useState<number | null>(0);
  const [isOptimized, setIsOptimized] = useState(false);

  const accordionData = [
    {
      title: 'UI Component Testing',
      content: 'Optimized memory management and event handling routines in C++, yielding an 8% performance boost for real-time rendering.',
    },
    {
      title: 'Desktop App Architecture',
      content: 'Architected and implemented a new Accordion Menu component, auto-evolving with updates via C++ skinning programs.',
    },
    {
      title: 'Graphics Engine Suite',
      content: 'Developed custom brush displayers for the internal graphics engine to expand the component suite.',
    },
    {
      title: 'Premiere Pro Debugging',
      content: 'Diagnosed and resolved a critical keystroke recording bug, improving input reliability in complex UI workflows.',
    },
  ];

  const handleTabClick = (index: number) => {
    setActiveTab(activeTab === index ? null : index);
    setIsOptimized(true); // Trigger performance graph change
  };

  return (
    <AppWrapper
      title="Adobe.exe // Profiler"
      subtitle="C++ Architecture & Core UI Rendering Systems"
      brandColor="#FF3B3F"
    >
      <div className="flex flex-col md:flex-row h-full w-full p-4 gap-4">
        {/* ─── Left Pane: Accordion Menu ─── */}
        <div className="w-full md:w-1/2 flex flex-col gap-3">
          <h3 className="text-white/40 text-xs tracking-widest uppercase mb-2">Systems Analysis</h3>
          {accordionData.map((item, index) => (
            <div 
              key={index}
              className="border border-white/5 rounded-lg overflow-hidden bg-white/[0.02]"
            >
              <button
                onClick={() => handleTabClick(index)}
                className="w-full text-left px-4 py-3 text-sm font-semibold flex items-center justify-between hover:bg-white/[0.04] transition-colors"
                style={{ color: activeTab === index ? '#FF3B3F' : '#ffffff80' }}
              >
                {item.title}
                <motion.span
                  animate={{ rotate: activeTab === index ? 180 : 0 }}
                  className="text-white/30 text-xs"
                >
                  ▼
                </motion.span>
              </button>
              <AnimatePresence>
                {activeTab === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-4 pb-3 text-xs text-white/50 leading-relaxed"
                  >
                    {item.content}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* ─── Right Pane: Performance Graph ─── */}
        <div className="w-full md:w-1/2 flex flex-col pt-7 md:pt-0 gap-3">
          <h3 className="text-white/40 text-xs tracking-widest uppercase mb-2">Real-Time Telemetry</h3>
          
          <div className="flex-1 border border-white/5 rounded-lg bg-black/40 p-4 relative overflow-hidden flex flex-col justify-end">
            {/* Background grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px]" />
            
            {/* KPI Overlay */}
            <motion.div 
              className="absolute top-4 right-4 text-right"
              animate={{ color: isOptimized ? '#22C55E' : '#FF3B3F' }}
            >
              <div className="text-3xl font-bold font-mono">
                {isOptimized ? '+8%' : '-2%'}
              </div>
              <div className="text-[10px] tracking-wider uppercase opacity-60">
                {isOptimized ? 'Optimized' : 'Threshold'}
              </div>
            </motion.div>

            {/* Mock Line Graph */}
            <div className="w-full h-32 flex items-end justify-between gap-1 z-10">
              {[...Array(24)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-full rounded-t-sm"
                  style={{
                    backgroundColor: isOptimized && i > 12 ? 'rgba(255,59,63,0.8)' : 'rgba(255,255,255,0.1)',
                  }}
                  initial={{ height: '20%' }}
                  animate={{ 
                    height: isOptimized && i > 12 
                      ? `${40 + Math.random() * 40}%` 
                      : `${20 + Math.random() * 20}%` 
                  }}
                  transition={{ duration: 0.5, delay: i * 0.02 }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppWrapper>
  );
}
