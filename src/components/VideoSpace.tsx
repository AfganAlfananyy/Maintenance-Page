import React, { useRef, useEffect } from 'react';
import { motion } from 'motion/react';

interface VideoSpaceProps {
  isMuted: boolean;
  onMuteChange?: (muted: boolean) => void;
}

export const VideoSpace: React.FC<VideoSpaceProps> = ({
  isMuted,
  onMuteChange,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Sync isMuted prop to video element directly
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = isMuted;
    if (!isMuted) {
      video.volume = 1.0;
      video.play().catch(() => {});
    }
  }, [isMuted]);

  // Robust Autoplay and Continuous Loop
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.volume = 1.0;
    video.muted = isMuted;

    // Start playback immediately
    const startPlay = () => {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // If browser blocks unmuted playback before user gesture,
          // temporarily mute to ensure video visually plays without interruption
          video.muted = true;
          onMuteChange?.(true);
          video.play().catch(() => {});
        });
      }
    };

    startPlay();

    // Auto-unmute on first user gesture anywhere if user hasn't toggled yet
    const handleFirstGesture = () => {
      if (videoRef.current) {
        videoRef.current.muted = isMuted;
        videoRef.current.volume = 1.0;
        videoRef.current.play().catch(() => {});
      }
    };

    window.addEventListener('click', handleFirstGesture, { passive: true, once: true });
    window.addEventListener('touchstart', handleFirstGesture, { passive: true, once: true });
    window.addEventListener('keydown', handleFirstGesture, { passive: true, once: true });

    // Handle loop fallback and visibility
    const handleEnded = () => {
      video.currentTime = 0;
      video.play().catch(() => {});
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && videoRef.current && videoRef.current.paused) {
        videoRef.current.play().catch(() => {});
      }
    };

    video.addEventListener('ended', handleEnded);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      video.removeEventListener('ended', handleEnded);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
    };
  }, []);

  return (
    <motion.div
      id="video-space-container"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10 w-full flex items-center justify-center overflow-hidden min-h-0 select-none"
    >
      {/* Seamless Borderless Video Container matching Wooden Navbar Width */}
      <div 
        id="video-player-inner-frame"
        className="relative w-full max-w-lg sm:max-w-xl md:max-w-2xl aspect-video max-h-[28vh] sm:max-h-[32vh] md:max-h-[34vh] flex items-center justify-center overflow-hidden bg-transparent"
      >
        <video
          ref={videoRef}
          src="/assets/hero.mp4"
          autoPlay
          loop
          playsInline
          muted={isMuted}
          controls={false}
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
          aria-label="Video footage hero dengan suara asli"
          className="w-full h-full object-contain select-none border-0 outline-none block bg-transparent"
        >
          <source src="/assets/hero.mp4" type="video/mp4" />
          <source src="/public/assets/hero.mp4" type="video/mp4" />
        </video>
      </div>
    </motion.div>
  );
};
