'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AppWrapper from './AppWrapper';

export default function TRL11App() {
  const [temp, setTemp] = useState(65);
  const [load, setLoad] = useState(33);

  useEffect(() => {
    const interval = setInterval(() => {
      // Fluctuate temp around 65-72C
      setTemp(65 + Math.random() * 7);
      // Fluctuate load around 30-38%
      setLoad(30 + Math.random() * 8);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <AppWrapper
      title="TRL11 // Embedded Systems"
      subtitle="SQLite Data Bus & Thermal Throttling"
      brandColor="#FFAA00"
    >
      <div className="p-5 h-full flex flex-col gap-6 text-green-500 font-mono tracking-tighter bg-[#050505]">
        
        {/* ─── Top Stats ─── */}
        <div className="grid grid-cols-2 gap-4">
          <div className="border border-green-500/20 bg-green-500/5 p-3 rounded-lg flex flex-col justify-between">
            <span className="text-[10px] uppercase opacity-60">Core Temp</span>
            <div className="text-2xl font-bold">{temp.toFixed(1)}°C</div>
            <div className="w-full h-1 bg-green-500/20 mt-2">
              <motion.div 
                className="h-full bg-green-500" 
                animate={{ width: `${temp}%` }} 
                transition={{ duration: 0.8 }}
              />
            </div>
          </div>
          
          <div className="border border-amber-500/20 bg-amber-500/5 p-3 rounded-lg flex flex-col justify-between text-amber-500">
            <span className="text-[10px] uppercase opacity-60">System Stability</span>
            <div className="text-2xl font-bold">{load.toFixed(1)}%</div>
            <div className="w-full h-1 bg-amber-500/20 mt-2">
              <motion.div 
                className="h-full bg-amber-500" 
                animate={{ width: `${load}%` }} 
                transition={{ duration: 0.8 }}
              />
            </div>
          </div>
        </div>

        {/* ─── Engineering Subroutines ─── */}
        <div className="flex-1 border border-green-500/20 rounded-lg p-3 flex flex-col relative overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
          <div className="absolute top-0 left-0 w-full h-full bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(34,197,94,0.05)_3px,rgba(34,197,94,0.05)_3px)] pointer-events-none z-0" />
          <h3 className="text-[10px] uppercase opacity-60 mb-3 border-b border-green-500/20 pb-1 relative z-10">Engineering Subroutines</h3>
          
          <div className="flex flex-col gap-4 text-[11px] leading-relaxed opacity-90 relative z-10">
            {[
              "Architected a scalable database migration framework for SQLite and NoSQL schemas, enabling seamless version incrementation and decrementation and enhancing data consistency and schema deployment across devices via SQLAlchemy and FastAPI endpoints.",
              "Created a 15% increase in data retrieval speed and system reliability by restructuring NVIDIA Jetson disk operations to incorporate a RAID configuration storage, custom power modes and automated backups, improving data redundancy and boosting performance main drive ops.",
              "Enabled real-time TCP/IP network camera browsing, temperature monitoring, and memory optimization, leveraging zeroconf and jtop on restful APIs, leading to a 33% greater cpu system stability via efficient throttling and memory management based on performance tracking.",
              "Augmented custom Power Management Unit (PMU) Utility by implementing C++ functions and creating Python bindings, improving power management efficiency by 20% and enhancing cross-language integration within embedded systems of SAVER and NVIDIA Jetson."
            ].map((text, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.15 }}
                className="flex gap-2"
              >
                <span className="text-amber-500 shrink-0">&gt;</span>
                <span>{text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </AppWrapper>
  );
}
