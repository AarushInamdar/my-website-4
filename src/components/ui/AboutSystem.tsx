'use client';

import { motion, Variants } from 'framer-motion';

export default function AboutSystem() {


  const textVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, duration: 0.6, ease: 'easeOut' as const },
    }),
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-[#0a0a0a] font-mono text-sm text-center relative overflow-hidden">
      {/* Dynamic Background Graphics */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_center,rgba(0,245,255,0.15)_0%,transparent_60%)]" />
      <div className="absolute inset-0 pointer-events-none opacity-5 bg-[repeating-linear-gradient(90deg,transparent,transparent_20px,rgba(255,255,255,0.1)_20px,rgba(255,255,255,0.1)_21px)]" />
      <div className="absolute inset-0 pointer-events-none opacity-5 bg-[repeating-linear-gradient(0deg,transparent,transparent_20px,rgba(255,255,255,0.1)_20px,rgba(255,255,255,0.1)_21px)]" />

      {/* Profile Image with 3D Ring Animation */}
      <motion.div className="relative w-36 h-36 mb-8 group perspective-1000">
        <motion.div
          className="absolute inset-[-4px] rounded-full border border-neon-cyan/50 opacity-50 border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute inset-[-8px] rounded-full border border-[#008FD3]/30 opacity-30 border-b-transparent mx-auto"
          animate={{ rotate: -360 }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="w-full h-full rounded-full overflow-hidden border-2 border-neon-cyan/80 relative z-10"
        >
          <img
            src="/assets/Aarush%20Inamdar.webp"
            alt="Aarush Inamdar"
            className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700 ease-out"
          />
        </motion.div>
      </motion.div>

      {/* Animated Text Content */}
      <div className="relative z-10">
        <motion.h2
          custom={1}
          variants={textVariants}
          initial="hidden"
          animate="visible"
          className="text-2xl font-black text-white mb-1 tracking-wider uppercase drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
        >
          Aarush Inamdar
        </motion.h2>

        <motion.div
          custom={2}
          variants={textVariants}
          initial="hidden"
          animate="visible"
          className="text-neon-cyan font-bold text-xs tracking-[0.3em] uppercase mb-8"
        >
          Software Engineer <span className="text-white/50 mx-1">·</span> Systems & AI
        </motion.div>

        <div className="space-y-4 text-white/80 text-xs leading-relaxed max-w-[320px] mx-auto opacity-90 drop-shadow-md">
          <motion.p
            custom={3}
            variants={textVariants}
            initial="hidden"
            animate="visible"
          >
            I'm a dual-degree CS and Business Admin student at UC Irvine, passionate about
            high-performance rendering pipelines, low-level systems, and AI engineering.
          </motion.p>
          <motion.p
            custom={4}
            variants={textVariants}
            initial="hidden"
            animate="visible"
          >
            This Web-OS portfolio is built with Next.js, React Three Fiber, and Tailwind CSS,
            showcasing a 3D intersection of my experiences.
          </motion.p>
        </div>
      </div>

      {/* Decorative Bottom Terminal Tag */}
      <motion.div
        custom={5}
        variants={textVariants}
        initial="hidden"
        animate="visible"
        className="absolute bottom-6 flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-black/50 text-[10px] text-white/40 tracking-widest uppercase font-bold"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse" />
        Kernel Version 1.0.0 (aarch64)
      </motion.div>
    </div>
  );
}
