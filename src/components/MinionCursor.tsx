import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';

interface MinionCursorProps {
  isDraggingText?: boolean;
}

export const MinionCursor: React.FC<MinionCursorProps> = ({ isDraggingText = false }) => {
  const [pos, setPos] = useState({ x: -100, y: -100, angle: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isHoveringClickable, setIsHoveringClickable] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const mousePosRef = useRef({ x: -100, y: -100, prevX: -100 });
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    // Detect touch-only screen so we don't show cursor follower on touch-only phones
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
      setIsTouchDevice(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current.prevX = mousePosRef.current.x;
      mousePosRef.current.x = e.clientX;
      mousePosRef.current.y = e.clientY;
      setIsVisible(true);

      // Check if hovering clickable elements
      const target = e.target as HTMLElement | null;
      if (target) {
        const isClickable =
          target.tagName === 'BUTTON' ||
          target.tagName === 'A' ||
          target.closest('button') !== null ||
          target.closest('a') !== null ||
          target.getAttribute('role') === 'button' ||
          target.classList.contains('cursor-pointer') ||
          target.classList.contains('cursor-grab');
        setIsHoveringClickable(Boolean(isClickable));
      }
    };

    const handleMouseDown = () => setIsPressed(true);
    const handleMouseUp = () => setIsPressed(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    let currentX = window.innerWidth / 2;
    let currentY = window.innerHeight / 2;
    let currentAngle = 0;

    const loop = () => {
      const targetX = mousePosRef.current.x;
      const targetY = mousePosRef.current.y;

      if (targetX > -50 && targetY > -50) {
        const dx = targetX - currentX;
        const dy = targetY - currentY;

        currentX += dx * 0.32;
        currentY += dy * 0.32;

        // Minion tilts playfully in movement direction
        const targetAngle = Math.max(-20, Math.min(20, dx * 0.45));
        currentAngle += (targetAngle - currentAngle) * 0.2;

        setPos({
          x: currentX,
          y: currentY,
          angle: currentAngle,
        });
      }

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  if (isTouchDevice || !isVisible) return null;

  return (
    <div
      className="pointer-events-none fixed top-0 left-0 z-[99999] select-none will-change-transform"
      style={{
        transform: `translate3d(${pos.x - 18}px, ${pos.y - 20}px, 0px)`,
      }}
      aria-hidden="true"
    >
      <motion.div
        animate={{
          rotate: pos.angle,
          scale: isPressed ? 0.88 : isDraggingText ? 1.12 : isHoveringClickable ? 1.15 : 1,
          scaleY: isPressed ? 0.78 : 1,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 22 }}
        className="relative w-9 h-10 filter drop-shadow-[2px_3px_0px_rgba(0,0,0,0.85)]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="36"
          height="40"
          viewBox="0 0 36 40"
          className="w-full h-full block"
        >
          {/* Hair Sprouts */}
          <path
            d="M18 5 V1 M15 5.5 L13 2.5 M21 5.5 L23 2.5"
            stroke="#1A1A1A"
            strokeWidth="1.6"
            strokeLinecap="round"
          />

          {/* Yellow Capsule Body */}
          <rect
            x="6"
            y="5"
            width="24"
            height="30"
            rx="12"
            fill="#FFE500"
            stroke="#1A1A1A"
            strokeWidth="2"
          />

          {/* Goggle Black Strap */}
          <rect x="5" y="12" width="26" height="4.5" fill="#1A1A1A" rx="1" />

          {/* Goggle Silver Metallic Ring */}
          <circle cx="18" cy="14.2" r="7.5" fill="#CFD8DC" stroke="#263238" strokeWidth="2" />

          {/* Eye White */}
          <circle cx="18" cy="14.2" r="5" fill="#FFFFFF" />

          {/* Iris & Pupil (Subtly follows cursor movement) */}
          <circle
            cx={18 + Math.max(-1.5, Math.min(1.5, pos.angle * 0.1))}
            cy="14.2"
            r="2.5"
            fill="#795548"
          />
          <circle
            cx={18.2 + Math.max(-1.5, Math.min(1.5, pos.angle * 0.1))}
            cy="14.2"
            r="1.4"
            fill="#1A1A1A"
          />
          <circle
            cx={17.6 + Math.max(-1.5, Math.min(1.5, pos.angle * 0.1))}
            cy="13.4"
            r="0.8"
            fill="#FFFFFF"
          />

          {/* Cute Expression Mouth */}
          {isDraggingText ? (
            <ellipse cx="18" cy="23.5" rx="3" ry="2.2" fill="#880E4F" stroke="#1A1A1A" strokeWidth="1.2" />
          ) : isHoveringClickable ? (
            <path
              d="M13 21.5 Q18 26.5 23 21.5 Z"
              fill="#D81B60"
              stroke="#1A1A1A"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          ) : (
            <path
              d="M13.5 22 Q18 25.5 22.5 22"
              fill="none"
              stroke="#1A1A1A"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          )}

          {/* Blue Denim Overalls Pants */}
          <path
            d="M6 26 H30 V31 C30 34.5 26.5 35 24 35 H12 C9.5 35 6 34.5 6 31 Z"
            fill="#2563EB"
            stroke="#1A1A1A"
            strokeWidth="1.8"
          />
          <rect x="11" y="24" width="14" height="6" fill="#2563EB" />

          {/* Overall Straps */}
          <path
            d="M8 25 L12 28 M28 25 L24 28"
            stroke="#1D4ED8"
            strokeWidth="2.6"
            strokeLinecap="round"
          />

          {/* Fastener Buttons */}
          <circle cx="12" cy="27.8" r="1" fill="#1A1A1A" />
          <circle cx="24" cy="27.8" r="1" fill="#1A1A1A" />

          {/* Front Pocket Logo */}
          <rect
            x="15"
            y="27.5"
            width="6"
            height="4.5"
            rx="1"
            fill="#1D4ED8"
            stroke="#1A1A1A"
            strokeWidth="0.8"
          />
        </svg>

        {/* Small pointer indicator tip so user always knows the exact click coordinate */}
        <div className="absolute -top-1 left-4 w-1.5 h-1.5 bg-[#FFE500] border border-black rounded-full shadow-xs" />
      </motion.div>
    </div>
  );
};
