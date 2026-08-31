import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const followerRef = useRef(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    // Check if the device is a touch device (disable custom cursor)
    if (window.matchMedia("(pointer: coarse)").matches) {
      setIsTouchDevice(true);
      return;
    }

    // Use GSAP quickTo for zero-latency tracking
    const xToCursor = gsap.quickTo(cursorRef.current, "x", { duration: 0.1, ease: "power3" });
    const yToCursor = gsap.quickTo(cursorRef.current, "y", { duration: 0.1, ease: "power3" });
    
    // Follower has a slight delay for smooth trailing effect
    const xToFollower = gsap.quickTo(followerRef.current, "x", { duration: 0.3, ease: "power3" });
    const yToFollower = gsap.quickTo(followerRef.current, "y", { duration: 0.3, ease: "power3" });

    const handleMouseMove = (e) => {
      xToCursor(e.clientX);
      yToCursor(e.clientY);
      xToFollower(e.clientX);
      yToFollower(e.clientY);
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('cursor-pointer')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);

    // Initial positioning off-screen until first move
    gsap.set([cursorRef.current, followerRef.current], { xPercent: -50, yPercent: -50 });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  useEffect(() => {
    if (isTouchDevice) return;
    
    // Animate state changes
    if (isHovering) {
      gsap.to(cursorRef.current, { scale: 0, duration: 0.2, ease: "power2.out" });
      gsap.to(followerRef.current, { 
        scale: 1.5, 
        backgroundColor: 'rgba(252, 83, 2, 0.1)', 
        borderColor: 'rgba(252, 83, 2, 0.5)',
        duration: 0.3, 
        ease: "back.out(2)" 
      });
    } else {
      gsap.to(cursorRef.current, { scale: 1, duration: 0.2, ease: "power2.out" });
      gsap.to(followerRef.current, { 
        scale: 1, 
        backgroundColor: 'transparent', 
        borderColor: 'rgba(252, 83, 2, 1)',
        duration: 0.3, 
        ease: "power2.out" 
      });
    }
  }, [isHovering, isTouchDevice]);

  if (isTouchDevice) return null;

  return (
    <>
      {/* Outer Follower */}
      <div
        ref={followerRef}
        className="fixed top-0 left-0 w-10 h-10 border-2 border-vsOrange rounded-full pointer-events-none z-[9998]"
        style={{ transform: 'translate(-50%, -50%)' }}
      />
      
      {/* Inner Dot */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-3 h-3 bg-vsBlue rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{ transform: 'translate(-50%, -50%)' }}
      />
    </>
  );
}
