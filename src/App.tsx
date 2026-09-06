import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, animate } from 'motion/react';
import { Instagram, ArrowUpRight } from 'lucide-react';
import { AmbientBackground } from './components/AmbientBackground';
import { HangingLamp } from './components/HangingLamp';
import { VideoSpace } from './components/VideoSpace';
import { WoodenNavbar } from './components/WoodenNavbar';
import { MinionCursor } from './components/MinionCursor';

export default function App() {
  const [isLightOn, setIsLightOn] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isNavbarHovered, setIsNavbarHovered] = useState(false);
  const [isDraggingText, setIsDraggingText] = useState(false);
  const [topConstraint, setTopConstraint] = useState(0);
  const [videoBounds, setVideoBounds] = useState<{ minX: number; maxX: number } | null>(null);

  const videoContainerRef = useRef<HTMLDivElement>(null);
  const heroBoxRef = useRef<HTMLDivElement>(null);

  // Motion values for explicit snap-back on release
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);

  const toggleLight = () => {
    setIsLightOn((prev) => !prev);
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  // Dynamically calculate the upward drag limit so text can NEVER cross into the video area,
  // and compute video horizontal bounds so lamp sliding along ceiling never exceeds the video edges.
  useEffect(() => {
    const updateBoundaries = () => {
      if (videoContainerRef.current) {
        const videoRect = videoContainerRef.current.getBoundingClientRect();
        
        // Horizontal bounds for the lamp: strictly constrained within the video footprint
        const minX = Math.round(videoRect.left + 60);
        const maxX = Math.round(videoRect.right - 60);
        if (maxX > minX) {
          setVideoBounds({ minX, maxX });
        }

        if (heroBoxRef.current) {
          const heroRect = heroBoxRef.current.getBoundingClientRect();
          // Distance from hero top to video bottom
          // When hero is dragged upward, it stops 6px before the video area
          const gap = Math.max(0, heroRect.top - videoRect.bottom - 6);
          setTopConstraint(-gap);
        }
      }
    };

    updateBoundaries();
    window.addEventListener('resize', updateBoundaries);
    const timer = setTimeout(updateBoundaries, 350);

    return () => {
      window.removeEventListener('resize', updateBoundaries);
      clearTimeout(timer);
    };
  }, []);

  const handleDragStart = () => {
    setIsDraggingText(true);
  };

  const handleDragEnd = () => {
    setIsDraggingText(false);
    // Smoothly spring back to exact origin position (0, 0)
    animate(dragX, 0, { type: 'spring', stiffness: 450, damping: 25 });
    animate(dragY, 0, { type: 'spring', stiffness: 450, damping: 25 });
  };

  return (
    <main 
      className="relative h-screen max-h-screen w-full flex flex-col items-center justify-center px-4 sm:px-8 py-2 overflow-hidden select-none font-brutal bg-[#F3F3F3] text-[#1A1A1A]"
    >
      {/* Custom Minion Cursor Character Follower (Windows default cursor hidden globally) */}
      <MinionCursor isDraggingText={isDraggingText} />

      {/* Clean Solid Background matching the video tone seamlessly */}
      <AmbientBackground />

      {/* Interactive Hanging Ceiling Lamp:
          - Bounded strictly within video left/right limits
          - Freezes when lamp is OFF, when user is dragging text, or when hovering navbar
      */}
      <HangingLamp 
        isLightOn={isLightOn} 
        onToggle={toggleLight}
        isDraggingText={isDraggingText}
        videoBounds={videoBounds}
        isNavbarHovered={isNavbarHovered}
      />

      {/* Main Center Stage (Video, Hero Texts, and Instagram Button):
          - Positioned comfortably BELOW the hanging ceiling lamp (pt-20 sm:pt-24 md:pt-28)
          - Video and text receive direct illumination from the spotlight beam from above
          - Completely unaffected by navbar open/close actions (never shifts up or down)
          - z-10 so the spotlight light beam (z-25) shines directly in front of the video and texts
      */}
      <div className="z-10 w-full max-w-2xl flex flex-col items-center justify-center my-auto -translate-y-[20px] pt-20 sm:pt-24 md:pt-28 pb-16 sm:pb-20 px-2 sm:px-4">
        
        {/* Video Area: Infinite Loop & Continuous Autoplay with Real Sound */}
        <div 
          ref={videoContainerRef} 
          className="w-full flex items-center justify-center shrink-0 min-h-0 mb-1.5 sm:mb-2"
        >
          <VideoSpace isMuted={isMuted} onMuteChange={setIsMuted} />
        </div>

        {/* Draggable Hero Text Container:
            - Snaps back to original position (0, 0) on release
            - Cannot enter video area (hard stop at video edge, top: topConstraint, dragElastic.top: 0)
            - Freezes lamp tracking while being dragged
            - Bounces back automatically with spring physics
        */}
        <motion.div 
          ref={heroBoxRef}
          id="draggable-hero-box"
          drag
          dragSnapToOrigin={true}
          style={{ x: dragX, y: dragY }}
          dragConstraints={{
            top: topConstraint, // Hard stop right before the video area
            bottom: 240,
            left: -280,
            right: 280,
          }}
          dragElastic={{
            top: 0, // ZERO elasticity going up: strictly impossible to cross into video!
            bottom: 0.35,
            left: 0.35,
            right: 0.35,
          }}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          initial={{ opacity: 0, y: 15, rotate: -2 }}
          animate={{ opacity: 1, rotate: -2 }}
          whileDrag={{ scale: 1.03, rotate: -4.5, cursor: 'grabbing' }}
          whileHover={{ scale: 1.015, rotate: -2.5 }}
          className="w-full flex flex-col items-center text-center shrink-0 max-w-2xl px-4 py-2 select-none pointer-events-auto"
        >
          {/* Status / Drag Hint Badge */}
          <div className="mb-2">
            <span 
              className="inline-flex items-center gap-1.5 px-3 py-1 font-mono-brutal text-[11px] sm:text-xs font-bold uppercase tracking-wider border-2 border-black bg-black text-[#FFE500] shadow-[2px_2px_0px_0px_#000000]"
            >
              <span>[ ✦ TARIK SAYA // DRAG ME ]</span>
            </span>
          </div>

          {/* Large Yellow Brutalist Headline with Stylish Italic & Angle */}
          <h1
            id="main-headline"
            className="font-display font-black text-3xl sm:text-5xl md:text-6xl tracking-tight leading-none uppercase text-[#FFE500] italic my-1 drop-shadow-[2px_2px_0px_#000000] sm:drop-shadow-[4px_4px_0px_#000000]"
            style={{
              WebkitTextStroke: '2px #000000',
              paintOrder: 'stroke fill',
            }}
          >
            SEDANG DIBANGUN.
          </h1>

          {/* Subtitle Description */}
          <p 
            id="main-description"
            className="font-brutal text-xs sm:text-sm md:text-base font-medium max-w-lg mt-1.5 text-neutral-700 leading-relaxed"
          >
            Kami sedang menyusun dan mengembangkan website ini secara bertahap. Harap bersabar, pengalaman baru akan segera hadir.
          </p>

          {/* Visit My Instagram Link */}
          <motion.a
            id="visit-instagram-link"
            href="https://instagram.com/afganalfananyy"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="mt-4 px-5 py-2.5 font-mono-brutal text-xs sm:text-sm font-bold tracking-wider uppercase border-2 border-black bg-black text-[#FFE500] hover:bg-[#FFE500] hover:text-black shadow-[3px_3px_0px_0px_#000000] hover:shadow-[5px_5px_0px_0px_#000000] transition-all flex items-center gap-2 cursor-pointer"
          >
            <Instagram className="w-4 h-4" />
            <span>VISIT MY INSTAGRAM</span>
            <ArrowUpRight className="w-4 h-4" />
          </motion.a>
        </motion.div>

      </div>

      {/* Bottom Fixed Wooden Navbar:
          - Suspended flush at the bottom floor edge
          - Completely independent of the center stage (no layout shift)
          - Slides down out of screen when hidden, with a bottom unhide tab
      */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 flex justify-center pointer-events-none pb-0">
        <div className="pointer-events-auto w-full max-w-lg sm:max-w-xl md:max-w-2xl flex justify-center">
          <WoodenNavbar 
            isMuted={isMuted} 
            onToggleMute={toggleMute} 
            onHoverChange={setIsNavbarHovered}
          />
        </div>
      </footer>
    </main>
  );
}
