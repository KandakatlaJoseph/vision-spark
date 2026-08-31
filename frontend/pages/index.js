import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

import EnquiryModal from '../components/EnquiryModal';
import ChooseYourPath from '../components/ChooseYourPath';
import WheelCarousel from '../components/WheelCarousel';
import AboutScrollReveal from '../components/AboutScrollReveal';
import { COURSES, COMPANY_INFO } from '../lib/coursesData';
import { cn } from '../lib/utils';


export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('enquiry');
  const [selectedCourse, setSelectedCourse] = useState('');

  const heroTextRef = useRef(null);
  const graphContainerRef = useRef(null);
  const graphPathRef = useRef(null);

  const openEnquiryModal = (courseTitle = '', mode = 'enquiry') => {
    setSelectedCourse(courseTitle);
    setModalMode(mode);
    setModalOpen(true);
  };

  // GSAP Registration & Scroll Animations
  useEffect(() => {
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      
      // Delay to ensure DOM (and SVG) is fully rendered before calculating lengths and widths
      const timer = setTimeout(() => {
        let ctx = gsap.context(() => {
          
          // --- 1. HERO ANIMATIONS (3D Tilt & Marquee) ---
          const handleMouseMove = (e) => {
            if (!heroTextRef.current) return;
            const { clientX, clientY } = e;
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            
            const rotateX = ((clientY - centerY) / centerY) * -15;
            const rotateY = ((clientX - centerX) / centerX) * 15;
            
            gsap.to(heroTextRef.current, {
              rotateX,
              rotateY,
              transformPerspective: 1000,
              ease: "power2.out",
              duration: 0.5
            });
          };
          
          window.addEventListener('mousemove', handleMouseMove);

          gsap.to('.marquee-text', {
            xPercent: -50,
            repeat: -1,
            duration: 30,
            ease: "linear",
          });

          // --- 2. CAREER GRAPH ANIMATION ---
          if (graphContainerRef.current && graphPathRef.current) {
            const path = graphPathRef.current;
            // Fallback length if getTotalLength fails
            const length = path.getTotalLength() || 1500; 
            
            gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
            gsap.set('.milestone-node', { scale: 0, opacity: 0 });
            
            const graphTl = gsap.timeline({
              scrollTrigger: {
                trigger: graphContainerRef.current,
                start: "center center",
                end: "+=150%", 
                pin: true,
                scrub: 1,
                pinSpacing: true, // explicitly ensure spacing
              }
            });

            // Draw the path
            graphTl.to(path, { strokeDashoffset: 0, ease: "none", duration: 10 });

            // Pop up nodes at specific times in the timeline (15%, 50%, 90%)
            graphTl.to('.milestone-node:nth-child(1)', { scale: 1, opacity: 1, ease: "back.out(1.7)", duration: 1 }, 1.5);
            graphTl.to('.milestone-node:nth-child(2)', { scale: 1, opacity: 1, ease: "back.out(1.7)", duration: 1 }, 5);
            graphTl.to('.milestone-node:nth-child(3)', { scale: 1, opacity: 1, ease: "back.out(1.7)", duration: 1 }, 9);
          }

          // --- 3. STAGGERED COURSES GRID ---
          gsap.from('.course-card', {
            scrollTrigger: {
              trigger: '.courses-section',
              start: 'top 75%',
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out"
          });

          // --- 4. SCROLL-LINKED FEATURE SWAP ---
          const featureTexts = gsap.utils.toArray('.feature-text');
          
          // Use GSAP Pinning instead of CSS sticky (bypasses overflow-hidden issues)
          ScrollTrigger.matchMedia({
            "(min-width: 1024px)": function() {
              ScrollTrigger.create({
                trigger: ".feature-display",
                start: "top 128px", // top-32 in tailwind
                endTrigger: ".feature-swap-section",
                end: "bottom bottom",
                pin: true,
                pinSpacing: false,
              });
            }
          });

          featureTexts.forEach((text, i) => {
            ScrollTrigger.create({
              trigger: text,
              start: "top center",
              end: "bottom center",
              onEnter: () => activateFeature(i + 1),
              onEnterBack: () => activateFeature(i + 1),
            });
          });

          function activateFeature(index) {
            // Highlight active text block
            gsap.to('.feature-text', { opacity: 0.3, duration: 0.4 });
            gsap.to(`.feature-text-${index}`, { opacity: 1, duration: 0.4 });

            // Hide all graphics
            gsap.to('.feature-graphic', { 
              opacity: 0, 
              y: 20, 
              duration: 0.4, 
              ease: "power2.inOut" 
            });
            
            // Show active graphic
            gsap.to(`.feature-graphic-${index}`, { 
              opacity: 1, 
              y: 0, 
              duration: 0.5, 
              ease: "power2.out", 
              delay: 0.1 
            });
          }

          // --- 5. FOOTER TEXT HIGHLIGHT ANIMATION ---
          const footerTl = gsap.timeline({
            scrollTrigger: {
              trigger: ".footer-highlight-section",
              start: "top 60%",
              end: "bottom 80%",
              scrub: 1,
            }
          });

          // Animate the colorful fill over the gray text
          footerTl.to(".footer-fill", {
            width: "100%",
            ease: "none",
            stagger: 0.5
          });

          // Button fades in last
          footerTl.fromTo(".footer-cta-btn",
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: "back.out(1.5)" },
            "+=0.2"
          );

          // Force GSAP to recalculate everything once it's all setup
          ScrollTrigger.refresh();

          return () => window.removeEventListener('mousemove', handleMouseMove);
        }); // end gsap.context

        return () => ctx.revert();
      }, 100); // 100ms delay to let the browser paint SVG and layouts

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col overflow-x-hidden selection:bg-vsOrange selection:text-white">
      
      {/* =========================================================================
          1. GSAP HERO SECTION (Light Theme + 3D Tilt + Marquee)
          ========================================================================= */}
      <section className="relative min-h-screen flex items-center justify-center pb-36 overflow-hidden bg-white">
        
        {/* Infinite Marquee Background */}
        <div className="absolute top-[2%] inset-x-0 overflow-hidden opacity-5 pointer-events-none select-none z-0">
          <div className="marquee-text whitespace-nowrap text-[15vw] font-black tracking-tighter">
            AI &bull; WEB DEV &bull; PYTHON &bull; CLOUD &bull; INTERNSHIPS &bull; AI &bull; WEB DEV &bull; PYTHON &bull; CLOUD &bull; INTERNSHIPS &bull;
          </div>
        </div>
        <div className="absolute bottom-[5%] inset-x-0 overflow-hidden opacity-5 pointer-events-none select-none z-0">
          <div className="marquee-text whitespace-nowrap text-[15vw] font-black tracking-tighter" style={{ animationDirection: 'reverse' }}>
            CAREERS &bull; JOBS &bull; PROJECTS &bull; TRAINING &bull; CAREERS &bull; JOBS &bull; PROJECTS &bull; TRAINING &bull;
          </div>
        </div>
        
        {/* Subtle Grid */}
        <div className="absolute inset-0 z-0 opacity-40 bg-[radial-gradient(#e5e7eb_2px,transparent_2px)] [background-size:24px_24px]" />

        <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-20 flex flex-col items-center text-center">
          

          {/* 3D Tilt Container */}
          <div ref={heroTextRef} className="will-change-transform">
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-[1.05] mb-8 font-display drop-shadow-xl">
              <span className="text-[#01155C] block">Build Skills.</span>
              <span className="bg-gradient-to-r from-vsOrange to-amber-500 bg-clip-text text-transparent block transform-gpu translate-z-10">Build Careers.</span>
              <span className="text-[#0054FF] block">Build the Future.</span>
            </h1>
          </div>

          <p className="text-lg sm:text-xl text-slate-600 mb-12 max-w-2xl leading-relaxed font-medium">
            We transform beginners into highly-paid software engineers through 100% practical training, real-world projects, and extreme career focus.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link href="/courses">
              <button className="w-full sm:w-auto px-10 py-5 bg-vsNavy rounded-2xl font-bold text-white shadow-2xl hover:bg-vsOrange hover:shadow-orange-500/30 hover:-translate-y-1 transition-all flex items-center justify-center gap-3">
                <span>Explore Our Courses</span>
                <span>→</span>
              </button>
            </Link>
            
            <button 
              onClick={() => openEnquiryModal('', 'demo')}
              className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-white border-2 border-slate-200 text-slate-700 font-bold hover:border-vsBlue hover:text-vsBlue hover:-translate-y-1 transition-all shadow-sm"
            >
              Book a Free Demo
            </button>
          </div>
        </div>

        {/* ── Diagonal ribbon strips at hero bottom (campus-connect inspired criss-cross tape) ── */}
        {/* Strip 1: Pure White ribbon (slanted -2.8deg, crosses under with crisp navy text and silver sparkle stars) */}
        <div
          className="absolute inset-x-[-12%] overflow-hidden select-none pointer-events-none bg-white border-y border-slate-200/90 shadow-[0_8px_24px_rgba(0,0,0,0.06)]"
          style={{ bottom: '58px', transform: 'rotate(-2.8deg)', height: '52px', zIndex: 5 }}
        >
          <div className="relative h-full flex items-center overflow-hidden">
            <div className="ribbon-track">
              {[...Array(4)].map((_, rep) => (
                <span key={rep} className="flex items-center">
                  {['TRANSFORMING FRESHERS TO ENGINEERS', 'INDUSTRY-LED EXCELLENCE', 'PRACTICAL INNOVATION', 'CAREER FINISHING SCHOOL'].map((tag, i) => (
                    <span key={i} className="flex items-center whitespace-nowrap">
                      <span className="text-[13px] font-black tracking-[0.24em] uppercase text-[#01155C]">
                        {tag}
                      </span>
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-slate-300 mx-5 shrink-0">
                        <path d="M12 0L14.4 9.6L24 12L14.4 14.4L12 24L9.6 14.4L0 12L9.6 9.6L12 0Z" />
                      </svg>
                    </span>
                  ))}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Strip 2: Deep Obsidian Navy ribbon (slanted +1.8deg, crosses OVER the white ribbon with rich 3D drop shadow) */}
        <div
          className="absolute inset-x-[-12%] overflow-hidden select-none pointer-events-none bg-[#050B20] border-y border-slate-900 shadow-[0_16px_36px_rgba(1,21,92,0.45),0_6px_16px_rgba(0,0,0,0.35)]"
          style={{ bottom: '16px', transform: 'rotate(1.8deg)', height: '52px', zIndex: 6 }}
        >
          <div className="relative h-full flex items-center overflow-hidden">
            <div className="ribbon-track-reverse">
              {[...Array(4)].map((_, rep) => (
                <span key={rep} className="flex items-center">
                  {['PYTHON FULL STACK', 'AI & ML', 'DATA SCIENCE', 'GENERATIVE AI', 'CLOUD & DEVOPS', 'CYBER SECURITY', 'PLACEMENT SUPPORT', 'INDUSTRY INTERNSHIPS'].map((tag, i) => (
                    <span key={i} className="flex items-center whitespace-nowrap">
                      <span className="text-[13px] font-black tracking-[0.24em] uppercase text-white">
                        {tag}
                      </span>
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-slate-400 mx-5 shrink-0">
                        <path d="M12 0L14.4 9.6L24 12L14.4 14.4L12 24L9.6 14.4L0 12L9.6 9.6L12 0Z" />
                      </svg>
                    </span>
                  ))}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          1B. ABOUT VISION SPARK – Pleiades-Inspired Scrubbed Split-Text Reveal
          ========================================================================= */}
      <AboutScrollReveal onOpenEnquiry={openEnquiryModal} />

      {/* =========================================================================
          1C. CHOOSE YOUR PATH – Accordion Panels (campus-connect inspired)
          ========================================================================= */}
      <ChooseYourPath openEnquiry={openEnquiryModal} />

      {/* =========================================================================
          2. GSAP PINNED SCROLL GRAPH (Career Focus Animation)
          ========================================================================= */}
      <section ref={graphContainerRef} className="py-20 bg-slate-50 relative border-y border-slate-200">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-vsNavy font-display tracking-tight mb-4">
              Focus On Your Career
            </h2>
            <p className="text-lg text-slate-600 font-medium">
              Don't just learn syntax. Watch your career grow as you progress.
            </p>
          </div>

          {/* Shorter Graph Container (400px height) */}
          <div className="relative w-full max-w-4xl mx-auto h-[400px]">
            
            {/* Grid Background */}
            <div className="absolute inset-0 border-l-2 border-b-2 border-slate-200 flex flex-col justify-between pt-5 pl-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-full border-t border-slate-200 border-dashed h-0 relative">
                  <span className="absolute -left-12 -top-3 text-xs text-slate-400 font-mono font-bold">Lvl {4 - i}</span>
                </div>
              ))}
              <div className="absolute -bottom-8 right-0 text-xs text-slate-400 font-mono font-bold">Time (Months) →</div>
            </div>

            {/* SVG Graph Path */}
            <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 1000 400">
              <path 
                ref={graphPathRef}
                d="M 0 400 C 300 400, 400 200, 600 200 C 800 200, 800 50, 1000 0" 
                fill="none" 
                stroke="url(#graph-gradient)" 
                strokeWidth="10"
                strokeLinecap="round"
                className="drop-shadow-[0_10px_20px_rgba(0,84,255,0.4)]"
              />
              <defs>
                <linearGradient id="graph-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FC5302" />
                  <stop offset="50%" stopColor="#0054FF" />
                  <stop offset="100%" stopColor="#01155C" />
                </linearGradient>
              </defs>
            </svg>

            {/* Interactive Graph Nodes */}
            <div className="absolute inset-0 w-full h-full pointer-events-none">
              
              <div className="milestone-node absolute left-[15%] bottom-[10%] -translate-x-1/2 translate-y-1/2 flex flex-col items-center">
                <div className="w-5 h-5 rounded-full bg-vsOrange border-4 border-white shadow-lg" />
                <div className="mt-3 p-3 rounded-xl bg-white border border-slate-200 text-center shadow-xl min-w-[180px]">
                  <h4 className="text-vsNavy font-bold text-sm">1. Master the Stack</h4>
                </div>
              </div>

              <div className="milestone-node absolute left-[50%] top-[50%] -translate-x-1/2 translate-y-1/2 flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-vsBlue border-4 border-white shadow-lg" />
                <div className="mt-3 p-3 rounded-xl bg-white border border-slate-200 text-center shadow-xl min-w-[200px]">
                  <h4 className="text-vsNavy font-bold text-sm">2. Practical Projects</h4>
                </div>
              </div>

              <div className="milestone-node absolute left-[90%] top-[0%] -translate-x-1/2 translate-y-1/2 flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-[#01155C] border-4 border-white shadow-lg" />
                <div className="mt-3 p-4 rounded-xl bg-vsNavy text-center shadow-2xl min-w-[220px]">
                  <h4 className="text-white font-extrabold text-sm mb-1">3. Job Ready</h4>
                  <p className="text-xs text-slate-300">Mentorship & Placement</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. WHEEL CAROUSEL (Courses)
          ========================================================================= */}
      <WheelCarousel courses={COURSES} onEnquire={openEnquiryModal} />

      {/* =========================================================================
          4. SCROLL-LINKED FEATURE SWAP (Why Choose Us)
          ========================================================================= */}
      <section className="py-32 bg-slate-50 border-t border-slate-200 feature-swap-section relative">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24 max-w-3xl mx-auto">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-vsNavy font-display tracking-tight">
              The Vision Spark Advantage
            </h2>
            <p className="mt-4 text-slate-600 text-lg">Experience the next level of technology education.</p>
          </div>

          <div className="flex flex-col lg:flex-row items-start gap-16 relative">
            
            {/* Left Column: Pinned Display Canvas */}
            <div className="feature-display w-full lg:w-1/2 h-[500px] bg-white rounded-[2rem] shadow-2xl border border-slate-200 overflow-hidden flex items-center justify-center p-8 relative z-20">
              
              {/* Graphic 1: Practical Code Terminal */}
              <div className="feature-graphic feature-graphic-1 absolute inset-0 flex items-center justify-center bg-gradient-to-br from-vsOrange/10 to-transparent p-10 opacity-100">
                <div className="w-full h-full max-h-[300px] bg-slate-900 rounded-2xl shadow-xl flex flex-col overflow-hidden border border-slate-700">
                  <div className="h-8 bg-slate-800 flex items-center px-4 gap-2 border-b border-slate-700">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <div className="p-6 font-mono text-sm sm:text-base text-emerald-400 flex-1 flex flex-col justify-center">
                    <p className="mb-2"><span className="text-pink-500">import</span> React <span className="text-pink-500">from</span> 'react';</p>
                    <p className="mb-2"><span className="text-blue-400">const</span> App = () ={'>'} {'{'}</p>
                    <p className="mb-2 ml-4 sm:ml-8"><span className="text-pink-500">return</span> (</p>
                    <p className="mb-2 ml-8 sm:ml-16 text-yellow-300">{'<ProductionReady />'}</p>
                    <p className="mb-2 ml-4 sm:ml-8">);</p>
                    <p>{'}'}</p>
                  </div>
                </div>
              </div>

              {/* Graphic 2: Industry Mentors - Code Review UI */}
              <div className="feature-graphic feature-graphic-2 absolute inset-0 flex items-center justify-center bg-gradient-to-bl from-vsBlue/5 to-transparent opacity-0 translate-y-10">
                <div className="relative w-full max-w-[340px]">
                  
                  {/* The Code Editor Background */}
                  <div className="w-full h-48 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col">
                    <div className="h-8 bg-slate-100 flex items-center px-4 border-b border-slate-200 gap-2">
                      <div className="w-3 h-3 rounded-full bg-slate-300" />
                      <div className="w-3 h-3 rounded-full bg-slate-300" />
                    </div>
                    <div className="p-4 font-mono text-xs text-slate-500">
                      <p className="mb-2"><span className="text-blue-600">function</span> <span className="text-purple-600">optimizeQuery</span>(data) {'{'}</p>
                      <p className="mb-2 ml-4 bg-red-50 text-red-600 line-through">return data.map(x ={'>'} x * 2);</p>
                      <p className="mb-2 ml-4 bg-green-50 text-green-600">+ return data.reduce(...);</p>
                      <p>{'}'}</p>
                    </div>
                  </div>

                  {/* The Mentor Review Comment */}
                  <div className="absolute -bottom-6 -right-6 md:-right-10 bg-white rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] border border-slate-100 p-4 w-64 flex gap-4 items-start z-10 animate-[bounce_3s_infinite]">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-vsBlue to-cyan-400 shrink-0 border-2 border-white shadow-md flex items-center justify-center text-white font-bold text-xs">SA</div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <p className="font-bold text-sm text-vsNavy">Senior Architect</p>
                        <p className="text-[10px] text-slate-400">Just now</p>
                      </div>
                      <p className="text-xs text-slate-600">Much better! This reduces time complexity from O(n²) to O(n). Approved. 👍</p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Graphic 3: Placement Prep - Offer UI */}
              <div className="feature-graphic feature-graphic-3 absolute inset-0 flex items-center justify-center bg-gradient-to-tr from-emerald-500/5 to-transparent opacity-0 translate-y-10">
                <div className="relative w-full max-w-[320px]">
                  
                  {/* The Interview Dashboard */}
                  <div className="w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="font-bold text-vsNavy">Interview Status</h4>
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">PASSED</span>
                    </div>

                    <div className="space-y-4">
                      {/* Skill Bar 1 */}
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-semibold text-slate-600">Data Structures</span>
                          <span className="text-emerald-600 font-bold">100%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="w-full h-full bg-emerald-500 rounded-full" />
                        </div>
                      </div>

                      {/* Skill Bar 2 */}
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-semibold text-slate-600">System Design</span>
                          <span className="text-emerald-600 font-bold">95%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="w-[95%] h-full bg-emerald-500 rounded-full" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* The Floating Offer Badge */}
                  <div className="absolute -top-8 -left-8 md:-left-12 bg-vsNavy text-white rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.2)] border border-slate-700 p-4 flex items-center gap-4 z-10 animate-[bounce_4s_infinite_reverse]">
                    <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-xl shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.5)]">🎉</div>
                    <div>
                      <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider mb-1">Offer Extended</p>
                      <p className="font-bold text-sm">Software Engineer II</p>
                      <p className="text-xs text-slate-400 mt-1">₹12,00,000 LPA</p>
                    </div>
                  </div>

                </div>
              </div>

            </div>

            {/* Right Column: Scrollable Text Blocks */}
            <div className="feature-text-container w-full lg:w-1/2 flex flex-col py-10 lg:py-[20vh]">
              
              <div className="feature-text feature-text-1 lg:min-h-[50vh] flex flex-col justify-center mb-16 lg:mb-0">
                <div className="w-16 h-16 rounded-2xl bg-vsOrange/10 flex items-center justify-center text-3xl mb-6">🛠️</div>
                <h3 className="text-3xl sm:text-4xl font-bold text-vsNavy mb-6">100% Practical</h3>
                <p className="text-slate-600 leading-relaxed text-lg sm:text-xl">Stop watching tutorials. Learn by building actual production projects every single day in a simulated tech environment. We prioritize writing code over watching lectures.</p>
              </div>

              <div className="feature-text feature-text-2 lg:min-h-[50vh] flex flex-col justify-center mb-16 lg:mb-0 opacity-30">
                <div className="w-16 h-16 rounded-2xl bg-vsBlue/10 flex items-center justify-center text-3xl mb-6">👨‍💻</div>
                <h3 className="text-3xl sm:text-4xl font-bold text-vsNavy mb-6">Industry Mentors</h3>
                <p className="text-slate-600 leading-relaxed text-lg sm:text-xl">Work directly with seasoned software architects who bring real tech stack expertise to your code reviews. Learn the best practices used in top tier product companies.</p>
              </div>

              <div className="feature-text feature-text-3 lg:min-h-[50vh] flex flex-col justify-center opacity-30">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center text-3xl mb-6">💼</div>
                <h3 className="text-3xl sm:text-4xl font-bold text-vsNavy mb-6">Placement Prep</h3>
                <p className="text-slate-600 leading-relaxed text-lg sm:text-xl">Comprehensive training covering Aptitude, Logical Reasoning, and extremely rigorous Mock Interviews. We prepare you to clear any technical interview with confidence.</p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* FINAL CONTACT CTA BAR (Light Theme Text Highlight) */}
      <section className="bg-white footer-highlight-section min-h-screen flex flex-col justify-center items-center py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        
        <div className="max-w-[1440px] mx-auto px-4 text-center relative z-10 w-full">
          <h2 className="text-[12vw] sm:text-[9vw] lg:text-[7.5vw] font-black leading-tight tracking-tighter text-slate-200 uppercase font-display flex flex-wrap justify-center gap-x-4 sm:gap-x-8">
            <span className="relative inline-block">
              EDUCATOR.
              <span className="footer-fill absolute top-0 left-0 w-0 overflow-hidden text-transparent bg-clip-text bg-gradient-to-r from-vsOrange to-vsBlue whitespace-nowrap">
                EDUCATOR.
              </span>
            </span>
            <span className="relative inline-block">
              COACH.
              <span className="footer-fill absolute top-0 left-0 w-0 overflow-hidden text-transparent bg-clip-text bg-gradient-to-r from-vsBlue to-emerald-500 whitespace-nowrap">
                COACH.
              </span>
            </span>
            <span className="relative inline-block">
              MENTOR.
              <span className="footer-fill absolute top-0 left-0 w-0 overflow-hidden text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-amber-500 whitespace-nowrap">
                MENTOR.
              </span>
            </span>
            <span className="relative inline-block">
              CONSULTANT.
              <span className="footer-fill absolute top-0 left-0 w-0 overflow-hidden text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-vsOrange whitespace-nowrap">
                CONSULTANT.
              </span>
            </span>
          </h2>
          
          <div className="footer-cta-btn mt-24">
            <a
              href={`tel:${COMPANY_INFO.phoneClean}`}
              className="inline-flex items-center gap-4 px-10 py-5 rounded-full bg-vsNavy text-white font-black text-lg sm:text-xl shadow-2xl hover:scale-105 hover:bg-vsOrange transition-all duration-300"
            >
              <span>📞</span>
              <span>Call Us Now ({COMPANY_INFO.phone})</span>
            </a>
          </div>
        </div>
      </section>

      <EnquiryModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        courseTitle={selectedCourse}
        mode={modalMode}
      />
    </div>
  );
}
