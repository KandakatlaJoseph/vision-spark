import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function AboutScrollReveal({ onOpenEnquiry }) {
  const sectionRef = useRef(null);

  // Track scroll progress through this section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Transform scroll progress to fill percentage (0% to 100%)
  const wipeProgress = useTransform(scrollYProgress, [0.2, 0.7], [0, 100]);
  const [fillPercent, setFillPercent] = useState(0);

  useEffect(() => {
    const unsubscribe = wipeProgress.on('change', (v) => {
      setFillPercent(Math.max(0, Math.min(100, v)));
    });
    return () => unsubscribe();
  }, [wipeProgress]);

  // Compute diagonal clip path for the text reveal (Pleiades style)
  // Polygon with a diagonal slant angle
  const clipPathString = `polygon(0% 0%, ${fillPercent * 1.25}% 0%, ${Math.max(0, fillPercent * 1.25 - 20)}% 100%, 0% 100%)`;

  return (
    <section 
      ref={sectionRef} 
      className="relative bg-[#050B20] text-white overflow-hidden border-t border-slate-800 select-none py-20 lg:py-28"
    >


      {/* Cyberpunk Technical Grid Background */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] [background-size:40px_40px]" />
      
      {/* Atmospheric Radial Glow Blobs */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-[#FC5302]/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#0054FF]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Corner Technical Crosshairs (+) */}
      <div className="absolute top-16 left-6 text-white/20 font-mono text-sm pointer-events-none">+</div>
      <div className="absolute top-16 right-6 text-white/20 font-mono text-sm pointer-events-none">+</div>
      <div className="absolute bottom-6 left-6 text-white/20 font-mono text-sm pointer-events-none">+</div>
      <div className="absolute bottom-6 right-6 text-white/20 font-mono text-sm pointer-events-none">+</div>

      <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-8">
        
        {/* Main Content: Centered Giant Reveal Typography & Mission */}
        <div className="flex flex-col items-center justify-center text-center max-w-5xl mx-auto">
          
          {/* Tag Badge */}
          <div className="flex items-center gap-2 mb-4">
            <span className="h-2 w-2 rounded-full bg-[#FC5302] animate-ping" />
            <span className="text-xs font-black tracking-[0.25em] uppercase text-[#FC5302]">
              Our Identity & Mission
            </span>
          </div>

          {/* ── THE PLEIADES-STYLE DUAL-LAYER SCROLL REVEAL TEXT ── */}
          <div className="relative mb-8 select-none font-display w-full flex flex-col items-center">
            
            {/* Layer 1: Hollow Outlined Text (Always visible behind) */}
            <div 
              className="text-6xl sm:text-8xl lg:text-[100px] xl:text-[112px] font-black uppercase leading-[0.9] tracking-tighter"
              style={{
                WebkitTextStroke: '1.5px rgba(255, 255, 255, 0.22)',
                color: 'transparent'
              }}
            >
              <div>ABOUT</div>
              <div>VISION SPARK</div>
            </div>

            {/* Layer 2: Solid Dynamic Color Fill (Revealed via diagonal wipe) */}
            <div 
              className="absolute inset-0 text-6xl sm:text-8xl lg:text-[100px] xl:text-[112px] font-black uppercase leading-[0.9] tracking-tighter pointer-events-none transition-all duration-75 flex flex-col items-center"
              style={{
                clipPath: clipPathString,
                WebkitClipPath: clipPathString
              }}
            >
              {/* Top line: Solid Crisp White */}
              <div className="text-white drop-shadow-[0_4px_24px_rgba(255,255,255,0.2)]">
                ABOUT
              </div>
              {/* Bottom line: Solid Vibrant Orange Fire */}
              <div className="text-[#FC5302] drop-shadow-[0_4px_30px_rgba(252,83,2,0.45)]">
                VISION SPARK
              </div>
            </div>

          </div>

          {/* High-Impact Description Paragraphs (Pleiades Typography Style) */}
          <div className="space-y-4 text-slate-300 text-base sm:text-lg max-w-3xl font-medium leading-relaxed">
            <p className="text-xl sm:text-2xl font-bold text-white leading-snug">
              Andhra Pradesh's Premier Tech Finishing School & Career Innovation Hub.
            </p>
            <p>
              Uniting ambitious engineering students and freshers across the region on one dynamic platform. Practical Full-Stack Development, AI & Machine Learning, Cloud & DevOps, Career Sprints, and Real-World Capstones—
            </p>
            <p className="text-[#FC5302] font-black text-lg sm:text-xl pt-2">
              An immersive blend of practical learning, industry mentorship, and extreme career transformation.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-10">
            <button
              onClick={() => onOpenEnquiry && onOpenEnquiry('', 'demo')}
              className="px-8 py-4 bg-[#FC5302] hover:bg-orange-600 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-[#FC5302]/30 hover:-translate-y-0.5 transition-all flex items-center gap-2"
            >
              <span>Experience Our Training</span>
              <span>⚡</span>
            </button>

            <button
              onClick={() => onOpenEnquiry && onOpenEnquiry('', 'enquiry')}
              className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/20 hover:border-white/40 font-bold text-sm rounded-2xl transition-all"
            >
              Speak with Career Mentor
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
