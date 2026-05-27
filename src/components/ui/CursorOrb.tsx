import React, { useEffect, useRef, useState } from 'react';

const CursorOrb: React.FC = () => {
  const orbRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(true);
  
  useEffect(() => {
    // Check if mobile on mount and resize
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile || !orbRef.current) return;

    let orbX = 0;
    let orbY = 0;
    let mouseX = 0;
    let mouseY = 0;
    const lerpFactor = 0.15;
    let animationFrameId: number;

    // Linear interpolation function
    const lerp = (start: number, end: number, t: number) => {
      return start + (end - start) * t;
    };

    // Track mouse position
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    // Animation loop
    const animateOrb = () => {
      if (!orbRef.current) return;
      
      orbX = lerp(orbX, mouseX, lerpFactor);
      orbY = lerp(orbY, mouseY, lerpFactor);

      orbRef.current.style.left = (orbX - 75) + 'px';
      orbRef.current.style.top = (orbY - 75) + 'px';

      animationFrameId = requestAnimationFrame(animateOrb);
    };

    document.addEventListener('mousemove', handleMouseMove);
    animationFrameId = requestAnimationFrame(animateOrb);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isMobile]);

  if (isMobile) return null;

  return <div ref={orbRef} className="cursor-orb" />;
};

export default CursorOrb;
