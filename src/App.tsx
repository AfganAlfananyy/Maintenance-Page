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
      className="relative h-screen max-h-screen w-full flex flex-col items-center justify-center px-4 sm:px-8 py-2 overflow-hidden select-none font-brutal bg-[#f2f2f2] text-[#1A1A1A]"
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
          {/* Status / Drag Hint Badge with inviting idle drag animation */}
          <motion.div 
            className="mb-2"
            animate={
              isDraggingText
                ? { scale: 1.05 }
                : {
                    x: [0, -6, 6, -4, 4, 0],
                    rotate: [0, -2, 2, -1.5, 1.5, 0],
                  }
            }
            transition={
              isDraggingText
                ? { duration: 0.2 }
                : {
                    repeat: Infinity,
                    repeatDelay: 2.2,
                    duration: 1.1,
                    ease: 'easeInOut',
                  }
            }
          >
            <span 
              className="inline-flex items-center gap-1.5 px-3.5 py-1 font-mono-brutal text-[11px] sm:text-xs font-bold uppercase tracking-wider border-2 border-black bg-black text-[#FFE500] shadow-[2px_2px_0px_0px_#000000] cursor-grab active:cursor-grabbing"
            >
              <span>[ TARIK SAYA ]</span>
            </span>
          </motion.div>

          {/* Large Yellow Brutalist Headline with Stylish Italic, Angle, and subtle drag invitation sway */}
          <motion.h1
            id="main-headline"
            animate={
              isDraggingText
                ? {}
                : {
                    x: [0, -3.5, 3.5, -2, 2, 0],
                    rotate: [-2, -2.8, -1.2, -2.4, -2],
                  }
            }
            transition={{
              repeat: Infinity,
              repeatDelay: 2.2,
              duration: 1.1,
              ease: 'easeInOut',
            }}
            className="font-display font-black text-3xl sm:text-5xl md:text-6xl tracking-tight leading-none uppercase text-[#FFE500] italic my-1 drop-shadow-[2px_2px_0px_#000000] sm:drop-shadow-[4px_4px_0px_#000000] cursor-grab active:cursor-grabbing"
            style={{
              WebkitTextStroke: '2px #000000',
              paintOrder: 'stroke fill',
            }}
          >
            SEDANG DIBANGUN.
          </motion.h1>

          {/* Subtitle Description with matching drag invitation wiggle */}
          <motion.p 
            id="main-description"
            animate={
              isDraggingText
                ? {}
                : {
                    x: [0, -3, 3, -2, 2, 0],
                    rotate: [0, -1, 1, -0.8, 0.8, 0],
                  }
            }
            transition={{
              repeat: Infinity,
              repeatDelay: 2.2,
              duration: 1.1,
              ease: 'easeInOut',
            }}
            className="font-brutal text-xs sm:text-sm md:text-base font-medium max-w-lg mt-1.5 text-neutral-700 leading-relaxed cursor-grab active:cursor-grabbing"
          >
            Kami sedang menyusun dan mengembangkan website ini secara bertahap. Harap bersabar, pengalaman baru akan segera hadir.
          </motion.p>

          {/* Visit My Instagram Link with matching drag invitation wiggle */}
          <motion.a
            id="visit-instagram-link"
            href="https://instagram.com/afganalfananyy"
            target="_blank"
            rel="noopener noreferrer"
            animate={
              isDraggingText
                ? {}
                : {
                    x: [0, -4, 4, -2.5, 2.5, 0],
                    rotate: [0, -1.5, 1.5, -1, 1, 0],
                  }
            }
            transition={{
              repeat: Infinity,
              repeatDelay: 2.2,
              duration: 1.1,
              ease: 'easeInOut',
            }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="mt-4 px-5 py-2.5 font-mono-brutal text-xs sm:text-sm font-bold tracking-wider uppercase border-2 border-black bg-black text-[#FFE500] hover:bg-[#FFE500] hover:text-black shadow-[3px_3px_0px_0px_#000000] hover:shadow-[5px_5px_0px_0px_#000000] transition-all flex items-center gap-2 cursor-pointer select-none"
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
