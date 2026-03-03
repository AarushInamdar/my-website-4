export default function AboutSystem() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-[#0a0a0a] font-mono text-sm text-center">
      <div 
        className="w-32 h-32 rounded-full mb-6 overflow-hidden border-2 border-neon-cyan/50 shadow-[0_0_30px_rgba(0,245,255,0.2)]"
      >
        <img 
          src="/assets/Aarush%20Inamdar.webp" 
          alt="Aarush Inamdar" 
          className="w-full h-full object-cover"
        />
      </div>
      
      <h2 className="text-xl font-bold text-white/90 mb-1 tracking-wider">
        Aarush Inamdar
      </h2>
      <div className="text-neon-cyan/70 text-xs tracking-widest uppercase mb-6">
        Software Engineer · Systems & AI
      </div>

      <div className="space-y-4 text-white/60 text-xs leading-relaxed max-w-[280px]">
        <p>
          I'm a dual-degree CS and Business Admin student at UC Irvine, passionate about 
          high-performance rendering pipelines, low-level systems, and AI engineering.
        </p>
        <p>
          This Web-OS portfolio is built with Next.js, React Three Fiber, and Tailwind CSS, 
          showcasing a 3D intersection of my experiences.
        </p>
      </div>

      <div className="mt-8 text-[10px] text-white/20 tracking-widest uppercase">
        Kernel Version 1.0.0 (aarch64)
      </div>
    </div>
  );
}
