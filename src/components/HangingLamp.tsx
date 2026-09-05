import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';

interface HangingLampProps {
  isLightOn: boolean;
  onToggle: () => void;
  isDraggingText?: boolean;
  videoBounds?: { minX: number; maxX: number } | null;
  lang?: 'id' | 'en';
}

export const HangingLamp: React.FC<HangingLampProps> = ({
  isLightOn,
  onToggle,
  isDraggingText = false,
  videoBounds = null,
  lang = 'id',
}) => {
  // Store mouse coordinates and lamp physics state
  const [coords, setCoords] = useState(() => ({
    mouseX: typeof window !== 'undefined' ? window.innerWidth / 2 : 600,
    mouseY: typeof window !== 'undefined' ? window.innerHeight * 0.6 : 400,
    lampX: typeof window !== 'undefined' ? window.innerWidth / 2 : 600,
    angle: 0,
    windowWidth: typeof window !== 'undefined' ? window.innerWidth : 1200,
    windowHeight: typeof window !== 'undefined' ? window.innerHeight : 800,
  }));

  const mouseRef = useRef({
    x: typeof window !== 'undefined' ? window.innerWidth / 2 : 600,
    y: typeof window !== 'undefined' ? window.innerHeight * 0.6 : 400,
  });

  const lampXRef = useRef(typeof window !== 'undefined' ? window.innerWidth / 2 : 600);
  const angleRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);

  // Keep latest flags in refs for 60fps physics loop
  const isLightOnRef = useRef(isLightOn);
  const isDraggingTextRef = useRef(isDraggingText);
  const videoBoundsRef = useRef(videoBounds);

  useEffect(() => {
    isLightOnRef.current = isLightOn;
  }, [isLightOn]);

  useEffect(() => {
    isDraggingTextRef.current = isDraggingText;
  }, [isDraggingText]);

  useEffect(() => {
    videoBoundsRef.current = videoBounds;
    // Initialize lamp inside bounds if needed
    if (videoBounds && lampXRef.current === 600) {
      lampXRef.current = (videoBounds.minX + videoBounds.maxX) / 2;
    }
  }, [videoBounds]);

  // Listen to mouse movement and window resize
  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      let clientX = 0;
      let clientY = 0;

      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      mouseRef.current.x = clientX;
      mouseRef.current.y = clientY;
    };

    const handleResize = () => {
      setCoords((prev) => ({
        ...prev,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
      }));
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    window.addEventListener('touchmove', handleMove, { passive: true });
    window.addEventListener('touchstart', handleMove, { passive: true });
    window.addEventListener('resize', handleResize);

    // Continuous physics loop
    let startTime = Date.now();
    const updatePhysics = () => {
      const now = Date.now();
      const elapsed = (now - startTime) / 1000;

      const w = window.innerWidth;
      const h = window.innerHeight;

      const bounds = videoBoundsRef.current;
      // Strict constraint: lamp ceiling position is bounded within the video area!
      // lamp must never exceed video left and right bounds
      const minX = bounds ? bounds.minX : Math.max(120, w * 0.3);
      const maxX = bounds ? bounds.maxX : Math.min(w - 120, w * 0.7);

      const canFollow = isLightOnRef.current && !isDraggingTextRef.current;

      if (canFollow) {
        // Target horizontal position strictly clamped between video left and right bounds
        const targetX = Math.max(minX, Math.min(maxX, mouseRef.current.x));

        // Smooth lerp for lamp sliding along ceiling
        const dx = targetX - lampXRef.current;
        lampXRef.current += dx * 0.08;

        // Dynamic tilt angle: tilts towards mouse movement + subtle natural breathing sway
        const velocityTilt = Math.max(-14, Math.min(14, dx * 0.13));
        const naturalSway = Math.sin(elapsed * 1.8) * 1.2;
        const targetAngle = velocityTilt + naturalSway;

        angleRef.current += (targetAngle - angleRef.current) * 0.1;
      } else {
        // When lamp is turned off OR when dragging text:
        // The lamp stays still and relaxes its tilt angle to 0
        angleRef.current += (0 - angleRef.current) * 0.08;
      }

      setCoords({
        mouseX: canFollow ? mouseRef.current.x : lampXRef.current,
        mouseY: canFollow ? mouseRef.current.y : h * 0.65,
        lampX: lampXRef.current,
        angle: angleRef.current,
        windowWidth: w,
        windowHeight: h,
      });

      animFrameRef.current = requestAnimationFrame(updatePhysics);
    };

    animFrameRef.current = requestAnimationFrame(updatePhysics);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchstart', handleMove);
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  const { mouseX, mouseY, lampX, angle, windowHeight } = coords;
  const bulbY = 110;

  return (
    <>
      {/* 1. Dynamic Conical Spotlight Beam (Connects bulb directly to the mouse floor footprint) */}
      <svg
        className="pointer-events-none fixed inset-0 w-full h-full z-15 overflow-hidden transition-opacity duration-500 ease-out"
        style={{
          opacity: isLightOn ? 1 : 0,
          filter: 'blur(8px)',
        }}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="mouseSpotlightGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFE600" stopOpacity="0.65" />
            <stop offset="25%" stopColor="#FFF280" stopOpacity="0.32" />
            <stop offset="60%" stopColor="#FFF9C4" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <polygon
          points={`${lampX - 16},${bulbY} ${lampX + 16},${bulbY} ${mouseX + 280},${windowHeight} ${mouseX - 280},${windowHeight}`}
          fill="url(#mouseSpotlightGrad)"
        />
      </svg>

      {/* 2. Interactive Spotlight Halo centered on the Mouse Cursor */}
      <div
        className="pointer-events-none fixed z-15 transition-opacity duration-500 rounded-full"
        style={{
          opacity: isLightOn ? 0.8 : 0,
          left: mouseX - 240,
          top: mouseY - 160,
          width: 480,
          height: 320,
          background:
            'radial-gradient(ellipse at center, rgba(255, 235, 80, 0.45) 0%, rgba(255, 245, 140, 0.22) 40%, rgba(255, 252, 180, 0.08) 65%, transparent 80%)',
          filter: 'blur(30px)',
          transform: 'translate3d(0, 0, 0)',
        }}
        aria-hidden="true"
      />

      {/* 3. The Hanging Lamp Body (Glides along the ceiling strictly bounded by video limits) */}
      <div
        className="fixed top-0 z-30 select-none pointer-events-none"
        style={{
          left: `${lampX}px`,
          transform: 'translateX(-50%)',
        }}
      >
        {/* Ceiling Mount Bracket */}
        <div className="w-9 h-2.5 bg-neutral-800 rounded-b-md shadow-xs mx-auto pointer-events-auto" />

        {/* Swinging Pendulum (Tilts and sways naturally based on mouse speed & angle) */}
        <div
          style={{
            transformOrigin: 'top center',
            transform: `rotate(${angle}deg)`,
            transition: 'transform 0.05s linear',
          }}
          className="flex flex-col items-center"
        >
          {/* Lamp Cable */}
          <div className="w-0.5 h-16 sm:h-20 bg-neutral-800" />

          {/* Clickable Industrial Lamp Shade & Bulb Assembly */}
          <motion.div
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onToggle}
            className="relative flex flex-col items-center cursor-pointer pointer-events-auto group"
            title={isLightOn ? 'Klik untuk mematikan cahaya lampu' : 'Klik untuk menyalakan cahaya lampu'}
            aria-label="Saklar Lampu Gantung"
          >
            {/* Lamp Cap */}
            <div
              className={`w-6 h-3 rounded-t-sm transition-colors duration-500 ${
                isLightOn ? 'bg-amber-600' : 'bg-neutral-700'
              }`}
            />

            {/* Lamp Shade Dome */}
            <div
              className={`relative w-24 sm:w-32 h-10 sm:h-12 rounded-t-full transition-all duration-500 shadow-md ${
                isLightOn
                  ? 'bg-neutral-900 border-b-2 border-amber-400 group-hover:border-yellow-300'
                  : 'bg-neutral-800 border-b-2 border-neutral-700'
              }`}
            >
              {/* Inner shade golden reflector rim */}
              <div
                className={`absolute bottom-0 inset-x-2 h-1 rounded-full transition-colors duration-500 ${
                  isLightOn ? 'bg-amber-300' : 'bg-neutral-700'
                }`}
              />
            </div>

            {/* Hanging Lightbulb */}
            <div className="relative -mt-1 flex items-center justify-center">
              <motion.div
                animate={{
                  scale: isLightOn ? [1, 1.05, 1] : 1,
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className={`w-6 h-6 rounded-full transition-all duration-500 ${
                  isLightOn
                    ? 'bg-[#FFF9CC] shadow-[0_0_24px_12px_rgba(255,230,0,0.85)]'
                    : 'bg-neutral-300 shadow-none border border-neutral-400'
                }`}
              />
            </div>

            {/* Pull Chain Switch */}
            <div className="absolute right-3 sm:right-5 top-8">
              <motion.div
                whileHover={{ y: 3 }}
                whileTap={{ y: 9 }}
                className="flex flex-col items-center"
              >
                <div className="w-px h-10 sm:h-14 bg-amber-500/80 group-hover:bg-amber-400 transition-colors" />
                <div className="w-2.5 h-3.5 rounded-b-full bg-amber-500 border border-amber-600 shadow-xs group-hover:bg-amber-400 transition-colors" />
              </motion.div>
            </div>

            {/* Interactive Hover Tooltip Hint */}
            <div className="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-40">
              <span className="px-2.5 py-1 bg-black text-[#FFE500] font-mono-brutal text-[10px] font-bold border border-black shadow-[2px_2px_0px_0px_#000000]">
                {lang === 'id'
                  ? (isLightOn ? '[ KLIK LAMPU UNTUK MATIKAN ]' : '[ KLIK LAMPU UNTUK NYALAKAN ]')
                  : (isLightOn ? '[ CLICK LAMP TO TURN OFF ]' : '[ CLICK LAMP TO TURN ON ]')}
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};
