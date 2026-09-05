import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Volume2, VolumeX } from 'lucide-react';

interface VideoSpaceProps {
  isMuted?: boolean;
  onMuteChange?: (muted: boolean) => void;
}

export const VideoSpace: React.FC<VideoSpaceProps> = ({
  isMuted: externalMuted,
  onMuteChange,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState<boolean>(externalMuted ?? true);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);

  // Sync external prop if provided
  useEffect(() => {
    if (externalMuted !== undefined && externalMuted !== isMuted) {
      setIsMuted(externalMuted);
      if (videoRef.current) {
        videoRef.current.muted = externalMuted;
        if (!externalMuted) {
          videoRef.current.volume = 1.0;
        }
      }
    }
  }, [externalMuted]);

  // Robust Autoplay & Audio Initialization
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Set maximum volume
    video.volume = 1.0;

    // First attempt: try playing unmuted
    video.muted = false;
    const initialPlay = video.play();

    if (initialPlay !== undefined) {
      initialPlay
        .then(() => {
          setIsMuted(false);
          setIsPlaying(true);
          onMuteChange?.(false);
        })
        .catch(() => {
          // Browser Autoplay Policy blocked audio before user gesture:
          // Immediately fall back to muted playback so visual video NEVER stops
          video.muted = true;
          setIsMuted(true);
          onMuteChange?.(true);
          video.play().then(() => setIsPlaying(true)).catch(() => {});
        });
    }

    // Auto-unmute on first user gesture anywhere on the webpage
    const handleFirstGesture = () => {
      setHasInteracted(true);
      if (videoRef.current) {
        videoRef.current.muted = false;
        videoRef.current.volume = 1.0;
        const p = videoRef.current.play();
        if (p !== undefined) {
          p.then(() => {
            setIsMuted(false);
            setIsPlaying(true);
            onMuteChange?.(false);
          }).catch(() => {});
        }
      }
    };

    window.addEventListener('click', handleFirstGesture, { passive: true, once: true });
    window.addEventListener('touchstart', handleFirstGesture, { passive: true, once: true });
    window.addEventListener('keydown', handleFirstGesture, { passive: true, once: true });

    // Ensure video resumes if tab becomes visible again
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && videoRef.current) {
        if (videoRef.current.paused) {
          videoRef.current.play().catch(() => {});
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handleToggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    const nextMuted = !video.muted;
    video.muted = nextMuted;
    if (!nextMuted) {
      video.volume = 1.0;
      video.play().catch(() => {});
    }
    setIsMuted(nextMuted);
    onMuteChange?.(nextMuted);
  };

  // Safe manual resume if user clicks directly on video area
  const handleContainerClick = () => {
    const video = videoRef.current;
    if (video && video.paused) {
      video.play().catch(() => {});
    }
  };

  return (
    <motion.div
      id="video-space-container"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10 w-full flex items-center justify-center overflow-hidden min-h-0 select-none"
      onClick={handleContainerClick}
    >
      {/* Seamless Borderless Video Container */}
      <div 
        id="video-player-inner-frame"
        className="relative w-full max-w-lg sm:max-w-xl md:max-w-2xl aspect-video max-h-[42vh] sm:max-h-[46vh] flex items-center justify-center overflow-hidden bg-transparent group"
      >
        <video
          ref={videoRef}
          src="/assets/hero.mp4"
          autoPlay
          loop
          playsInline
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

        {/* Audio Status & Interactive Sound Toggle Badge */}
        <button
          id="video-sound-toggle-btn"
          type="button"
          onClick={handleToggleSound}
          className="absolute bottom-2.5 right-2.5 z-30 pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 bg-black/90 hover:bg-black text-[#FFE500] border-2 border-black rounded-lg shadow-[3px_3px_0px_0px_#FFE500] font-mono-brutal text-[10px] sm:text-xs font-black tracking-wider transition-all select-none"
          title={isMuted ? 'Suara video dibisukan. Klik untuk mengaktifkan suara asli.' : 'Suara video asli aktif. Klik untuk membisukan.'}
          aria-label={isMuted ? 'Aktifkan suara video' : 'Bisukan suara video'}
        >
          {isMuted ? (
            <>
              <VolumeX className="w-4 h-4 text-amber-400 animate-bounce" />
              <span>[ 🔈 SUARA ASLI MATI // KLIK AKTIFKAN 🔊 ]</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4 text-[#FFE500]" />
              <span>[ 🔊 SUARA ASLI AKTIF // 100% ]</span>
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};
