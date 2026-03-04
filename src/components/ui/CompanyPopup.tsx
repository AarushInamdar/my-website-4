'use client';

import { useOSStore } from '@/store/useOSStore';
import { motion, AnimatePresence } from 'framer-motion';

const COMPANY_CONTENT = {
  apple: {
    title: 'Apple',
    text: 'My first ever SWE internship. It meant a lot to me because my manager gave me a chance and took me under his wing, and also I learned a lot about the basics of software development in the industry.',
    color: '#E2E8F0',
    glow: '#ffffff',
  },
  trl11: {
    title: 'TRL11',
    text: 'My first ever startup internship where I got a really hands on experience in a way faster environment and got the chance to wear multiple hats.',
    color: '#FFAA00',
    glow: '#FFAA00',
  },
  sap: {
    title: 'SAP',
    text: 'An amazing E2E experience with a lot of role emphasis on quality and process management.',
    color: '#3B82F6',
    glow: '#3B82F6',
  },
  adobe: {
    title: 'Adobe',
    text: 'A balanced mix of everything that allowed me to apply all that I learned.',
    color: '#FF3B3F',
    glow: '#FF3B3F',
  },
  series: {
    title: 'Series.so',
    text: 'A startup leadership role where I had to push the needle as the technical lead on the B2B app that I made and architected from ground up, as my biggest project ever.',
    color: '#A855F7',
    glow: '#A855F7',
  }
};

export default function CompanyPopup() {
  const selectedCompany = useOSStore(s => s.selectedCompany);
  const setSelectedCompany = useOSStore(s => s.setSelectedCompany);

  // Still render inside AnimatePresence if none selected to allow exit animations
  if (!selectedCompany || !COMPANY_CONTENT[selectedCompany as keyof typeof COMPANY_CONTENT]) return null;

  const content = COMPANY_CONTENT[selectedCompany as keyof typeof COMPANY_CONTENT];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[1000] flex items-center justify-center pointer-events-auto bg-black/40 backdrop-blur-md"
        onClick={() => setSelectedCompany(null)}
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative max-w-2xl w-full mx-4 mb-8 p-12 md:p-16 rounded-2xl border border-white/10 bg-black/80 overflow-hidden shadow-2xl flex flex-col items-center"
          onClick={e => e.stopPropagation()}
          style={{
            boxShadow: `0 0 50px ${content.color}33, inset 0 0 20px ${content.color}22`
          }}
        >
          {/* Matrix style grid background */}
          <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-screen" style={{
             backgroundImage: 'linear-gradient(transparent 95%, rgba(0,255,65,0.4) 100%), linear-gradient(90deg, transparent 95%, rgba(0,255,65,0.4) 100%)',
             backgroundSize: '20px 20px'
          }} />

          {/* Vertical Matrix scanner */}
          <motion.div 
            className="absolute top-0 left-0 right-0 h-32 pointer-events-none opacity-20"
            style={{
              background: `linear-gradient(to bottom, transparent, ${content.color}, transparent)`,
            }}
            animate={{
              y: ['-100%', '300%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          
          {/* Content */}
          <div className="relative z-10 flex flex-col items-center text-center gap-4">
            <h2 
              className="text-3xl md:text-4xl font-bold tracking-tight mb-2"
              style={{ 
                color: content.color, 
                textShadow: `0 0 15px ${content.glow}`
              }}
            >
              Log // {content.title}
            </h2>
            <div className="w-16 h-1 rounded-full mb-4" style={{ backgroundColor: content.color, boxShadow: `0 0 10px ${content.glow}` }} />
            
            <p className="text-white/90 text-lg md:text-xl leading-relaxed font-mono mt-4 px-6 md:px-12">
              <span className="text-neon-cyan mr-3 opacity-70">&gt;</span>
              {content.text}
              <span className="animate-cursor-blink ml-1 text-neon-cyan opacity-70">_</span>
            </p>
          </div>
        </motion.div>

        {/* Close hint (Moved outside modal box) */}
        <div className="absolute bottom-10 left-0 right-0 text-center text-[10px] text-white/50 uppercase tracking-widest pointer-events-none">
          Click anywhere to close
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
