import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

export default function CurriculumJourney({ modules = [] }) {
  const total = modules.length > 0 ? modules.length : 5;
  const [activeIndex, setActiveIndex] = useState(0);
  const [markerPos, setMarkerPos] = useState({ x: 130, y: 70 });
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const autoPlayTimerRef = useRef(null);
  const mapContainerRef = useRef(null);
  const lastScrollTime = useRef(0);

  // Compute waypoint coordinates on the SVG viewBox (500 x 660)
  const getWaypointCoords = useCallback((count) => {
    if (count <= 1) return [{ x: 250, y: 330, index: 0 }];
    const coords = [];
    const topY = 70;
    const bottomY = 590;
    const stepY = (bottomY - topY) / (count - 1);

    for (let i = 0; i < count; i++) {
      let x = 250;
      if (i === 0) {
        x = 130;
      } else if (i === count - 1) {
        x = count % 2 === 1 ? 250 : 370;
      } else {
        x = i % 2 === 1 ? 370 : 130;
      }
      const y = topY + i * stepY;
      coords.push({ x, y, index: i });
    }
    return coords;
  }, []);

  const waypointCoords = getWaypointCoords(total);

  // Generate smooth SVG path d attribute
  const generatePathD = useCallback((coords) => {
    if (coords.length < 2) return '';
    let d = `M ${coords[0].x},${coords[0].y}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const p1 = coords[i];
      const p2 = coords[i + 1];
      const midY = (p1.y + p2.y) / 2;
      d += ` C ${p1.x},${midY} ${p2.x},${midY} ${p2.x},${p2.y}`;
    }
    return d;
  }, []);

  const pathD = generatePathD(waypointCoords);

  // Update marker position when activeIndex changes
  useEffect(() => {
    const target = waypointCoords[activeIndex] || waypointCoords[0];
    if (target) {
      setMarkerPos({ x: target.x, y: target.y });
    }
  }, [activeIndex, waypointCoords]);

  // Navigate to previous / next module
  const goToNext = useCallback(() => {
    setActiveIndex((prev) => (prev < total - 1 ? prev + 1 : 0));
  }, [total]);

  const goToPrev = useCallback(() => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : total - 1));
  }, [total]);

  const selectModule = (idx) => {
    if (idx >= 0 && idx < total) {
      setActiveIndex(idx);
      setIsAutoPlaying(false);
    }
  };

  // Wheel scroll handler on the waypoint roadmap box
  useEffect(() => {
    const el = mapContainerRef.current;
    if (!el) return;

    let accumulatedDelta = 0;
    let wheelTimeout = null;

    const onWheel = (e) => {
      const isScrollingDown = e.deltaY > 0;
      const isScrollingUp = e.deltaY < 0;

      // Intercept scroll if we can advance forward or backward between modules
      const canMoveForward = isScrollingDown && activeIndex < total - 1;
      const canMoveBackward = isScrollingUp && activeIndex > 0;

      if (canMoveForward || canMoveBackward) {
        e.preventDefault();
        e.stopPropagation();

        accumulatedDelta += e.deltaY;
        const now = Date.now();

        if (Math.abs(accumulatedDelta) >= 28 && now - lastScrollTime.current > 180) {
          if (accumulatedDelta > 0 && activeIndex < total - 1) {
            // Step forward to next module
            setActiveIndex((prev) => prev + 1);
          } else if (accumulatedDelta < 0 && activeIndex > 0) {
            // Step back to previous module
            setActiveIndex((prev) => prev - 1);
          }
          accumulatedDelta = 0;
          lastScrollTime.current = now;
        }

        clearTimeout(wheelTimeout);
        wheelTimeout = setTimeout(() => {
          accumulatedDelta = 0;
        }, 150);
      }
      // When at Module 5 and scrolling down (or Module 1 and scrolling up),
      // we allow normal page scrolling so the user continues down or up the page.
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', onWheel);
      clearTimeout(wheelTimeout);
    };
  }, [activeIndex, total]);

  // Auto-play tour effect
  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayTimerRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % total);
      }, 3500);
    } else {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    }
    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [isAutoPlaying, total]);

  // Active module data
  const currentMod = modules[activeIndex] || {
    title: `Module ${activeIndex + 1}: Core Concepts`,
    topics: ['Fundamentals & Architecture', 'Hands-on Implementation', 'Testing & Optimization', 'Industry Best Practices']
  };

  return (
    <section 
      className="curriculum-journey-section py-20 bg-white relative overflow-hidden border-y border-slate-200 select-none"
    >
      {/* Background Decorative Gradients */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#01155C_1.5px,transparent_1.5px)] [background-size:24px_24px]" />
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-[#FC5302]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-[#0054FF]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-slate-100 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="h-2 w-2 rounded-full bg-[#FC5302]" />
              <span className="text-xs font-black tracking-[0.25em] uppercase text-[#FC5302]">
                Comprehensive Syllabus
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#01155C] tracking-tight font-display">
              Course Structure & <span className="bg-gradient-to-r from-[#FC5302] to-amber-500 bg-clip-text text-transparent">Curriculum</span>
            </h2>
            <p className="text-slate-500 mt-2 text-sm sm:text-base max-w-xl">
              Explore each module in the complete training syllabus. Click or scroll on the roadmap to preview detailed topics, practical chapters, and key skills.
            </p>
          </div>

          {/* Quick Module Selector Pills & Auto-Play */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
              {Array.from({ length: total }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => selectModule(idx)}
                  className={cn(
                    "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all",
                    activeIndex === idx
                      ? "bg-[#01155C] text-white shadow-md shadow-[#01155C]/20 scale-105"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                  )}
                  title={`View Module ${idx + 1}`}
                >
                  Module {idx + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className={cn(
                "px-4 py-2 rounded-2xl text-xs font-extrabold border transition-all flex items-center gap-1.5",
                isAutoPlaying
                  ? "bg-[#FC5302] text-white border-[#FC5302] shadow-lg shadow-[#FC5302]/30 animate-pulse"
                  : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-sm"
              )}
            >
              <span>{isAutoPlaying ? '⏸ Pause Preview' : '▶ Auto Preview'}</span>
            </button>
          </div>
        </div>

        {/* Main Grid: Left Module Detail Card + Right Interactive Roadmap */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* ========================================================
              LEFT COLUMN: Module Detail Showcase
              ======================================================== */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-[#01155C]/5 p-6 sm:p-8 relative overflow-hidden flex flex-col min-h-[480px]"
              >
                {/* Top Accent Line */}
                <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#FC5302] via-[#0054FF] to-[#01155C]" />
                
                {/* Module Badge & Index */}
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="px-3.5 py-1 rounded-full bg-[#01155C] text-white text-xs font-black tracking-wider uppercase">
                      Module {String(activeIndex + 1).padStart(2, '0')}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
                      Part {activeIndex + 1} of {total}
                    </span>
                  </div>

                  <span className="text-xs font-bold text-[#FC5302]">
                    Core Syllabus
                  </span>
                </div>

                {/* Module Title */}
                <h3 className="text-2xl sm:text-3xl font-black text-[#01155C] mb-4 font-display leading-tight">
                  {currentMod.title}
                </h3>

                {/* Badges / Information Stats */}
                <div className="grid grid-cols-3 gap-3 mb-6 pb-6 border-b border-slate-100 text-center">
                  <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Topics</span>
                    <span className="text-sm sm:text-base font-extrabold text-[#01155C]">
                      {currentMod.topics ? currentMod.topics.length : 4} Chapters
                    </span>
                  </div>
                  <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Stage</span>
                    <span className="text-sm sm:text-base font-extrabold text-[#01155C]">
                      {activeIndex === 0 ? 'Foundational' : activeIndex === total - 1 ? 'Capstone Project' : 'Advanced Core'}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Delivery</span>
                    <span className="text-sm sm:text-base font-extrabold text-[#0054FF]">Practical & Live</span>
                  </div>
                </div>

                {/* Topics / Chapters List */}
                <div className="flex-1 space-y-2.5 overflow-y-auto pr-1 mb-6 max-h-[220px]">
                  {currentMod.topics && currentMod.topics.map((topic, tIdx) => (
                    <div 
                      key={tIdx} 
                      className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/90 hover:bg-orange-50/60 border border-slate-100 hover:border-orange-200 transition-all group"
                    >
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[11px] font-bold text-slate-500 group-hover:border-[#FC5302] group-hover:text-[#FC5302] transition-colors shadow-sm">
                        {tIdx + 1}
                      </div>
                      <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 leading-snug">
                        {topic}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Bottom Navigation Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 gap-3">
                  <button
                    onClick={goToPrev}
                    disabled={activeIndex === 0}
                    className={cn(
                      "px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all border",
                      activeIndex === 0
                        ? "opacity-30 cursor-not-allowed border-slate-200 text-slate-400"
                        : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    )}
                  >
                    <span>←</span>
                    <span>Previous</span>
                  </button>

                  <div className="text-xs font-bold text-slate-400">
                    Module {activeIndex + 1} of {total}
                  </div>

                  <button
                    onClick={goToNext}
                    disabled={activeIndex === total - 1}
                    className={cn(
                      "px-5 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-md",
                      activeIndex === total - 1
                        ? "opacity-30 cursor-not-allowed bg-slate-200 text-slate-500 shadow-none"
                        : "bg-[#FC5302] text-white hover:bg-orange-600 shadow-orange-500/20 hover:scale-105"
                    )}
                  >
                    <span>Next Module</span>
                    <span>→</span>
                  </button>
                </div>

              </motion.div>
            </AnimatePresence>

          </div>


          {/* ========================================================
              RIGHT COLUMN: Interactive SVG Waypoint Roadmap
              ======================================================== */}
          <div className="lg:col-span-6 flex items-center justify-center relative">
            
            <div 
              ref={mapContainerRef}
              className="w-full max-w-[480px] bg-slate-50/90 rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-sm relative overflow-hidden transition-all hover:border-slate-300 hover:shadow-md"
            >
              
              {/* Roadmap Header Hint */}
              <div className="flex items-center justify-between mb-2 px-2 text-[11px] font-bold text-slate-500">
                <span className="flex items-center gap-1.5 text-[#01155C]">
                  <svg className="w-3.5 h-3.5 text-[#FC5302]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  Interactive Learning Journey
                </span>
                <span className="text-slate-400">Scroll or click (1-{total})</span>
              </div>

              {/* SVG Roadmap Canvas */}
              <div className="relative w-full aspect-[500/660]">
                <svg 
                  className="w-full h-full overflow-visible" 
                  viewBox="0 0 500 660"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <defs>
                    <linearGradient id="journeyGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FC5302" />
                      <stop offset="50%" stopColor="#0054FF" />
                      <stop offset="100%" stopColor="#01155C" />
                    </linearGradient>

                    <filter id="nodeShadow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.12" />
                    </filter>
                    
                    <filter id="markerGlow" x="-50%" y="-50%" width="200%" height="200%">
                      <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#FC5302" floodOpacity="0.6" />
                    </filter>
                  </defs>

                  {/* 1. Track Line */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#CBD5E1"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray="8 8"
                  />

                  {/* 2. Interactive SVG Waypoint Nodes */}
                  {waypointCoords.map((coord, idx) => {
                    const isCurrent = idx === activeIndex;
                    const isHovered = hoveredIndex === idx;
                    const m = modules[idx] || { title: `Module ${idx + 1}` };

                    return (
                      <g 
                        key={idx} 
                        className="cursor-pointer"
                        onClick={() => selectModule(idx)}
                        onMouseEnter={() => setHoveredIndex(idx)}
                        onMouseLeave={() => setHoveredIndex(null)}
                      >
                        {/* Static Stable Outer Node Ring */}
                        <circle
                          cx={coord.x}
                          cy={coord.y}
                          r={isCurrent ? 24 : 20}
                          fill={isCurrent ? "#FC5302" : "#FFFFFF"}
                          stroke={isCurrent ? "#FFFFFF" : isHovered ? "#FC5302" : "#01155C"}
                          strokeWidth={isCurrent ? 4 : 2.5}
                          filter="url(#nodeShadow)"
                          style={{ transition: 'stroke 0.2s ease, fill 0.2s ease, r 0.2s ease' }}
                        />

                        {/* Node Number Label */}
                        <text
                          x={coord.x}
                          y={coord.y + 4.5}
                          textAnchor="middle"
                          fill={isCurrent ? "#FFFFFF" : isHovered ? "#FC5302" : "#01155C"}
                          fontSize={isCurrent ? "13" : "11"}
                          fontWeight="900"
                          fontFamily="sans-serif"
                          className="pointer-events-none select-none"
                          style={{ transition: 'fill 0.2s ease' }}
                        >
                          {idx + 1}
                        </text>

                        {/* Side Label Badge */}
                        <g 
                          transform={`translate(${coord.x > 250 ? coord.x - 145 : coord.x + 30}, ${coord.y - 14})`}
                          className="pointer-events-none"
                        >
                          <rect
                            x="0"
                            y="0"
                            width="118"
                            height="32"
                            rx="8"
                            fill={isCurrent ? "#01155C" : isHovered ? "#F8FAFC" : "#FFFFFF"}
                            stroke={isCurrent ? "#01155C" : isHovered ? "#FC5302" : "#E2E8F0"}
                            strokeWidth="1.5"
                            filter="url(#nodeShadow)"
                            style={{ transition: 'stroke 0.2s ease, fill 0.2s ease' }}
                          />
                          <text
                            x="8"
                            y="12"
                            fill={isCurrent ? "#FC5302" : "#64748B"}
                            fontSize="8"
                            fontWeight="800"
                            letterSpacing="0.5"
                          >
                            MODULE {idx + 1}
                          </text>
                          <text
                            x="8"
                            y="23"
                            fill={isCurrent ? "#FFFFFF" : "#0F172A"}
                            fontSize="9"
                            fontWeight="700"
                          >
                            {m.title.length > 18 ? m.title.substring(0, 16) + '…' : m.title}
                          </text>
                        </g>
                      </g>
                    );
                  })}

                  {/* 3. The Animated Moving Spark / Marker Point */}
                  <motion.g
                    animate={{ x: markerPos.x, y: markerPos.y }}
                    transition={{
                      type: 'spring',
                      stiffness: 140,
                      damping: 18,
                      mass: 0.7
                    }}
                  >
                    {/* Glowing outer aura */}
                    <circle
                      r="14"
                      fill="url(#journeyGlow)"
                      filter="url(#markerGlow)"
                      opacity="0.85"
                    />
                    {/* Inner core */}
                    <circle
                      r="6"
                      fill="#FFFFFF"
                    />
                    <circle
                      r="3"
                      fill="#FC5302"
                    />
                  </motion.g>
                </svg>
              </div>

              {/* Bottom Exploration Guide Bar */}
              <div className="mt-3 pt-3 border-t border-slate-200/80 flex items-center justify-between text-[11px] font-semibold text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#FC5302]" />
                  <span>Selected: Module {activeIndex + 1}</span>
                </span>
                <span className="text-slate-400">
                  {activeIndex + 1} of {total} Modules
                </span>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
