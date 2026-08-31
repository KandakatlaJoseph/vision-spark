import { useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';

const RADIUS   = 400;   // orbit radius in px (slightly larger to fill space nicely)
const CARD_W   = 240;   // card width
const CARD_H   = 300;   // card height
const ACTIVE_ANGLE = 180; // "spotlight" angle — leftmost point (9 o'clock), directly visible

export default function WheelCarousel({ courses = [], onEnquire }) {
  const total = courses.length || 1;
  const [rotation, setRotation]     = useState(0);   // global rotation offset (degrees)
  const [hovered,  setHovered]      = useState(false);
  const velocity  = useRef(0);
  const rafRef    = useRef(null);
  const rightRef  = useRef(null);

  // ── Card geometry ──────────────────────────────────────────────────────────
  // Distribute cards evenly around 360 degrees for an infinite loop.
  const getCardAngle = (idx) => {
    const step = 360 / total;
    let deg = (ACTIVE_ANGLE + idx * step + rotation) % 360;
    if (deg < 0) deg += 360;
    return deg;
  };

  const degToRad = (d) => (d * Math.PI) / 180;

  const getCardPos = (idx) => {
    const deg = getCardAngle(idx);
    const rad = degToRad(deg);
    // x goes LEFT from center (negative cos for 90–270 range)
    const x = Math.cos(rad) * RADIUS;   
    const y = Math.sin(rad) * RADIUS;

    // Proximity to the active angle (180°) — 0..1
    const diff  = Math.abs(deg - ACTIVE_ANGLE);
    const norm  = diff > 180 ? 360 - diff : diff;          // 0..180
    // Proximity drops off over 120 degrees from the active angle
    const prox  = Math.max(0, 1 - norm / 120);  // 0..1

    return {
      x, y,
      scale:   0.6 + prox * 0.4,
      opacity: Math.max(0, 0.1 + prox * 0.9), // fade out completely when far away
      zIndex:  Math.round(prox * 20),
      prox,
      deg,
    };
  };

  // ── Inertia ────────────────────────────────────────────────────────────────
  const animateMomentum = useCallback(() => {
    if (Math.abs(velocity.current) < 0.04) { velocity.current = 0; return; }
    velocity.current *= 0.92;
    setRotation(r => r + velocity.current);
    rafRef.current = requestAnimationFrame(animateMomentum);
  }, []);

  // ── Scroll handler — ONLY fires when cursor is over the right panel ────────
  const onWheel = useCallback((e) => {
    if (!hovered) return;
    e.preventDefault();
    e.stopPropagation();
    cancelAnimationFrame(rafRef.current);
    const delta = e.deltaY * 0.06;
    velocity.current = delta;
    setRotation(r => r + delta);
  }, [hovered]);

  useEffect(() => {
    const el = rightRef.current;
    if (!el) return;
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', onWheel);
      cancelAnimationFrame(rafRef.current);
    };
  }, [onWheel]);

  // Momentum on mouse-leave
  const handleMouseLeave = () => {
    setHovered(false);
    if (Math.abs(velocity.current) > 0.1) {
      rafRef.current = requestAnimationFrame(animateMomentum);
    }
  };

  // ── Active card ────────────────────────────────────────────────────────────
  const activeIdx = courses.reduce((best, _, idx) => {
    return getCardPos(idx).prox > getCardPos(best).prox ? idx : best;
  }, 0);
  const active = courses[activeIdx] || courses[0];

  return (
    <section
      className="courses-section relative w-full bg-white border-b border-slate-100 overflow-hidden"
      style={{ minHeight: '760px' }}
    >
      {/* Faint dot grid background */}
      <div className="absolute inset-0 opacity-25 pointer-events-none bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:26px_26px]" />

      {/* Subtle gradient glow on right */}
      <div className="absolute right-0 top-0 h-full w-[40%] bg-gradient-to-l from-blue-50/60 to-transparent pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row h-full max-w-[1440px] mx-auto" style={{ minHeight: '760px' }}>

        {/* ═══════════════════════════════════
            LEFT — Text content (60% width)
            ═══════════════════════════════════ */}
        <div className="w-full lg:w-[60%] flex-shrink-0 flex flex-col justify-center px-6 sm:px-10 lg:px-16 py-20 space-y-8 z-20">

          <div>
            <span className="inline-flex items-center gap-2 text-[11px] font-extrabold tracking-[0.22em] uppercase text-[#FC5302] mb-4">
              <span className="w-6 h-px bg-[#FC5302]" />
              INDUSTRY-ALIGNED TRAINING
            </span>

            <h2 className="text-5xl xl:text-[4rem] font-black text-[#01155C] leading-[1.08] tracking-tight font-display mb-6">
              Premium<br />
              <span className="bg-gradient-to-r from-[#FC5302] to-amber-400 bg-clip-text text-transparent">
                Programs
              </span>
            </h2>

            <p className="text-slate-500 text-lg leading-relaxed max-w-lg">
              Every course is built around what employers actually hire for — live projects, real-world applications, and mentor support from day one. Master the skills that drive the modern tech industry.
            </p>
          </div>

          {/* Active course preview card */}
          {active && (
            <div
              key={activeIdx}
              className="bg-slate-50 border border-slate-200 rounded-3xl p-6 lg:p-8 space-y-4 max-w-xl transition-all duration-500 animate-fade-in-up shadow-xl shadow-slate-200/50"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold tracking-[0.18em] uppercase text-[#FC5302]">
                  {active.category}
                </span>
                <span className="text-xs font-bold text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200">
                  {active.duration}
                </span>
              </div>
              <h3 className="text-2xl font-black text-[#01155C] leading-snug">{active.title}</h3>
              <p className="text-base text-slate-600 line-clamp-2 leading-relaxed">{active.short_description}</p>
              
              <div className="flex items-center gap-4 pt-4 flex-wrap border-t border-slate-200/60 mt-4">
                <Link
                  href={`/courses/${active.slug}`}
                  className="px-6 py-3 bg-[#01155C] text-white text-sm font-bold rounded-xl hover:bg-[#FC5302] hover:-translate-y-0.5 shadow-lg shadow-[#01155C]/20 hover:shadow-[#FC5302]/30 transition-all"
                >
                  View Syllabus →
                </Link>
                <button
                  onClick={() => onEnquire && onEnquire(active.title, 'enquiry')}
                  className="px-6 py-3 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl hover:border-[#01155C] hover:text-[#01155C] hover:-translate-y-0.5 transition-all shadow-sm"
                >
                  Enquire Now
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center gap-6 pt-4">
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 text-[15px] font-bold text-[#01155C] hover:text-[#FC5302] transition-colors border-b-2 border-transparent hover:border-[#FC5302] pb-0.5"
            >
              Explore All Courses
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* ═══════════════════════════════════
            RIGHT — Wheel pinned to right wall (40% width)
            ═══════════════════════════════════ */}
        <div
          ref={rightRef}
          className="w-full lg:w-[40%] relative overflow-hidden hidden lg:block z-30"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={handleMouseLeave}
          style={{ cursor: hovered ? 'ns-resize' : 'default' }}
        >
          {/* Scroll-to-interact overlay hint (fades out on hover) */}
          <div
            className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 pointer-events-none z-40 bg-white/40 backdrop-blur-[2px]"
            style={{ opacity: hovered ? 0 : 1 }}
          >
            <div className="flex flex-col items-center justify-center gap-3 bg-white/90 px-6 py-4 rounded-2xl shadow-xl border border-slate-200/50">
              <svg className="w-8 h-8 text-[#FC5302] animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
              </svg>
              <span className="text-[11px] font-extrabold tracking-widest uppercase text-[#01155C]">Hover & Scroll to explore</span>
            </div>
          </div>

          {/*
            The circle center is anchored at the FAR RIGHT EDGE of this panel, vertically centered.
            So we absolutely position a point at (right:0, top:50%), then
            cards are drawn at negative x offsets (going left into the panel).
          */}
          <div
            className="absolute"
            style={{
              right: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 0,
              height: 0,
            }}
          >
            {/* Dashed arc guide — decorative only */}
            <svg
              className="absolute pointer-events-none"
              style={{
                right: 0,
                top: -RADIUS - CARD_H / 2 - 20,
                width: RADIUS + CARD_W + 20,
                height: (RADIUS + CARD_H / 2 + 20) * 2,
                overflow: 'visible',
              }}
              overflow="visible"
            >
              {/* Full circle guide */}
              <circle
                cx="0"
                cy={RADIUS + CARD_H / 2 + 20}
                r={RADIUS}
                fill="none"
                stroke="#01155C"
                strokeWidth="1.5"
                strokeDasharray="6 10"
                opacity="0.15"
              />
            </svg>

            {/* CARDS orbiting the right-edge center */}
            {courses.map((course, idx) => {
              const { x, y, scale, opacity, zIndex, prox, deg } = getCardPos(idx);
              const isActive = idx === activeIdx;

              // Hide cards that are completely behind the right edge (positive X means to the right of the center)
              // But we can let them naturally flow if they are in a full 360 circle.
              // Center is at right: 0. Positive X is off-screen to the right. Negative X is on-screen to the left.
              
              const cardLeft = x - CARD_W / 2;  // relative to center
              const cardTop  = y - CARD_H / 2;

              return (
                <div
                  key={course.id}
                  style={{
                    position: 'absolute',
                    right: -cardLeft - CARD_W,  // convert from "left of origin" to "right css"
                    top: cardTop,
                    width: CARD_W,
                    height: CARD_H,
                    transform: `scale(${scale})`,
                    transformOrigin: 'center center',
                    opacity: opacity,
                    zIndex,
                    pointerEvents: opacity < 0.1 ? 'none' : 'auto',
                    transition: 'transform 0.4s cubic-bezier(0.22,1,0.36,1), opacity 0.4s ease',
                    willChange: 'transform, opacity',
                  }}
                >
                  <div
                    className={`w-full h-full rounded-3xl overflow-hidden flex flex-col bg-white shadow-xl ${
                      isActive
                        ? 'ring-[3px] ring-[#FC5302] shadow-2xl shadow-[#FC5302]/25'
                        : 'border-2 border-slate-200/80 hover:border-slate-300'
                    }`}
                  >
                    {/* Image */}
                    <div className="relative flex-shrink-0 overflow-hidden" style={{ height: '55%' }}>
                      <img
                        src={course.image_url}
                        alt={course.title}
                        className="w-full h-full object-cover"
                        draggable={false}
                        style={{ pointerEvents: 'none' }}
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=80'; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#01155C]/80 via-black/20 to-transparent" />
                      <span className="absolute bottom-3 left-3 text-[10px] font-black uppercase tracking-widest text-white bg-black/30 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                        {course.category}
                      </span>
                      {isActive && (
                        <span className="absolute top-3 right-3 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FC5302] opacity-75" />
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FC5302]" />
                        </span>
                      )}
                    </div>

                    {/* Body */}
                    <div className="flex-1 p-4 flex flex-col justify-between overflow-hidden bg-white">
                      <div>
                        <h3 className="text-[14px] font-black text-[#01155C] leading-snug line-clamp-2">
                          {course.title}
                        </h3>
                        <p className="text-[11px] text-slate-500 mt-1.5 line-clamp-2 leading-relaxed font-medium">
                          {course.short_description}
                        </p>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-2">
                        <span className="text-[11px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md">
                          {course.duration}
                        </span>
                        <Link
                          href={`/courses/${course.slug}`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-[11px] font-black text-[#FC5302] hover:text-[#01155C] flex items-center gap-1 transition-colors"
                        >
                          Details <span>→</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
