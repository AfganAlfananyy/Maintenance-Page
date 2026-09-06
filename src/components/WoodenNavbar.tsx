import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, ChevronUp, ChevronDown } from 'lucide-react';

interface WoodenNavbarProps {
  isMuted: boolean;
  onToggleMute: () => void;
  onHoverChange: (isHovered: boolean) => void;
}

// Exactly 4 short chain links anchored to the floor (4 mata rantai pendek)
const FourShortLinksChainBottom: React.FC = () => {
  return (
    <div className="flex flex-col items-center pointer-events-none select-none z-0">
      {/* Top Eye-Bolt connecting to the wooden plank */}
      <div className="w-3.5 h-3.5 -mb-1 rounded-full border-2 border-[#120E0A] bg-gradient-to-br from-[#7D736A] to-[#332C25] flex items-center justify-center">
        <div className="w-1 h-1 bg-[#18120D] rounded-full" />
      </div>

      {/* Mata 1 (Link 1 - Sambungan Samping Atas) */}
      <div className="w-1.5 h-2.5 bg-gradient-to-r from-[#4A423A] via-[#9E9286] to-[#332C25] border border-[#120E0A] rounded-xs shadow-xs" />

      {/* Mata 2 (Link 2 - Ring Tengah) */}
      <div className="w-3.5 h-3.5 -mt-1 rounded-full border-2 border-[#120E0A] bg-gradient-to-r from-[#635A52] via-[#B8AEA2] to-[#453D36] shadow-[inset_1px_1px_1px_#E3D8CE,0_1px_2px_rgba(0,0,0,0.5)] flex items-center justify-center">
        <div className="w-1.5 h-1.5 bg-[#18120D] rounded-full" />
      </div>

      {/* Mata 3 (Link 3 - Sambungan Samping Bawah) */}
      <div className="w-1.5 h-2.5 -mt-1 bg-gradient-to-r from-[#4A423A] via-[#9E9286] to-[#332C25] border border-[#120E0A] rounded-xs shadow-xs" />

      {/* Mata 4 (Link 4 - Ring Bawah) */}
      <div className="w-3.5 h-3.5 -mt-1 rounded-full border-2 border-[#120E0A] bg-gradient-to-r from-[#635A52] via-[#B8AEA2] to-[#453D36] shadow-[inset_1px_1px_1px_#E3D8CE,0_1px_2px_rgba(0,0,0,0.5)] flex items-center justify-center">
        <div className="w-1.5 h-1.5 bg-[#18120D] rounded-full" />
      </div>

      {/* Floor Iron Anchor Bracket - sits completely flush against the bottom floor */}
      <div className="w-6 sm:w-7 h-2.5 -mt-0.5 bg-gradient-to-t from-[#18120D] to-[#362E27] border-t-2 border-x-2 border-[#100C08] rounded-t-xs shadow-xs" />
    </div>
  );
};

export const WoodenNavbar: React.FC<WoodenNavbarProps> = ({
  isMuted,
  onToggleMute,
  onHoverChange,
}) => {
  const [isHidden, setIsHidden] = useState(false);

  const toggleHide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsHidden((prev) => !prev);
  };

  return (
    <div
      id="wooden-bottom-navbar-wrapper"
      className="relative z-40 w-full max-w-lg sm:max-w-xl md:max-w-2xl px-2 sm:px-0 flex flex-col items-center select-none"
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
    >
      {/* 1. Tombol Kayu saat Bottom Navbar Tersembunyi (Anchored at bottom edge) */}
      <AnimatePresence>
        {isHidden && (
          <motion.div
            key="bottom-wooden-unhide-button"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="absolute bottom-0 w-full flex flex-col items-center z-40 pb-0 pointer-events-auto"
          >
            {/* Papan Tombol Kayu Bawah */}
            <motion.button
              id="unhide-wooden-bottom-btn"
              type="button"
              whileHover={{ scale: 1.06, y: -2 }}
              whileTap={{ scale: 0.94 }}
              onClick={toggleHide}
              className="relative px-4 sm:px-5 py-2 rounded-xl border-3 border-[#241408] bg-gradient-to-b from-[#E0A055] via-[#C6843A] to-[#97581D] shadow-[0_4px_0px_0px_#1B0E05,0_8px_16px_rgba(0,0,0,0.35)] flex items-center gap-2.5 cursor-pointer select-none group"
              title="Klik untuk membuka kembali navbar"
            >
              {/* Baut Besi Kiri */}
              <div className="w-2.5 h-2.5 rounded-full bg-[#46382E] border border-[#19120D] shadow-inner flex items-center justify-center">
                <div className="w-1 h-0.5 bg-[#17100B] rotate-45" />
              </div>

              {/* Teks Tombol */}
              <span className="text-[#FFECC7] font-mono-brutal text-xs sm:text-sm font-bold uppercase tracking-wider group-hover:text-white transition-colors drop-shadow-xs">
                BUKA NAVBAR
              </span>

              {/* Icon Panah Naik */}
              <div className="w-5 h-5 rounded-full bg-[#241408] flex items-center justify-center shadow-xs">
                <ChevronUp className="w-3.5 h-3.5 text-[#FFE500] animate-bounce stroke-[3]" />
              </div>

              {/* Baut Besi Kanan */}
              <div className="w-2.5 h-2.5 rounded-full bg-[#46382E] border border-[#19120D] shadow-inner flex items-center justify-center">
                <div className="w-1 h-0.5 bg-[#17100B] -rotate-30" />
              </div>
            </motion.button>

            {/* 2 Rantai Pendek ke Dasar Bawah */}
            <div className="flex justify-between w-36 px-4 pointer-events-none -mt-0.5">
              <div className="flex flex-col items-center">
                <div className="w-1 h-2 bg-[#5A5046] border border-[#120E0A] rounded-xs" />
                <div className="w-2.5 h-2.5 -mt-0.5 rounded-full border-2 border-[#120E0A] bg-[#8A8076] flex items-center justify-center" />
                <div className="w-4 h-2 -mt-0.5 bg-gradient-to-t from-[#18120D] to-[#362E27] border-t border-x border-[#100C08] rounded-t-xs" />
              </div>
              <div className="flex flex-col items-center">
                <div className="w-1 h-2 bg-[#5A5046] border border-[#120E0A] rounded-xs" />
                <div className="w-2.5 h-2.5 -mt-0.5 rounded-full border-2 border-[#120E0A] bg-[#8A8076] flex items-center justify-center" />
                <div className="w-4 h-2 -mt-0.5 bg-gradient-to-t from-[#18120D] to-[#362E27] border-t border-x border-[#100C08] rounded-t-xs" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Main Wooden Board Rig:
             - Slides down to hide (y: 160) and slides up to show (y: 0)
             - Physical weighted spring drop/raise animation
      */}
      <motion.div
        id="wooden-navbar-main-rig"
        className={`w-full flex flex-col items-center origin-bottom pointer-events-auto ${isHidden ? 'pointer-events-none' : ''}`}
        initial={false}
        animate={{
          y: isHidden ? 160 : 0,
          opacity: isHidden ? 0 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 160,
          damping: 16,
          mass: 1.05,
        }}
      >
        {/* Subtle idle sway */}
        <motion.div
          className="w-full flex flex-col items-center"
          animate={{
            rotate: isHidden ? 0 : [-0.25, 0.25, -0.25],
          }}
          transition={{
            repeat: Infinity,
            duration: 6,
            ease: 'easeInOut',
          }}
        >
          {/* Top Wooden Post Tips (peeking out above beam) */}
          <div className="w-full flex justify-between px-8 sm:px-14 -mb-2 relative z-10 pointer-events-none">
            {/* Left Top Peg */}
            <div className="w-6 sm:w-7 h-3.5 bg-gradient-to-r from-[#593416] via-[#7B4821] to-[#45260E] border-2 border-[#261508] rounded-t-md shadow-inner flex flex-col items-center justify-end">
              <div className="w-full h-1 bg-[#261508]/40" />
            </div>
            {/* Right Top Peg */}
            <div className="w-6 sm:w-7 h-3.5 bg-gradient-to-r from-[#593416] via-[#7B4821] to-[#45260E] border-2 border-[#261508] rounded-t-md shadow-inner flex flex-col items-center justify-end">
              <div className="w-full h-1 bg-[#261508]/40" />
            </div>
          </div>

          {/* Main Horizontal Solid Wooden Beam */}
          <div className="relative z-20 w-full rounded-2xl sm:rounded-full border-3 sm:border-4 border-[#241408] bg-gradient-to-b from-[#E0A055] via-[#C6843A] to-[#97581D] shadow-[0_4px_0px_0px_#1B0E05,0_8px_14px_rgba(0,0,0,0.32)] overflow-hidden">
            
            {/* Authentic Wood Grain Lines, Knots, and Highlights */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none opacity-40 mix-blend-multiply"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              viewBox="0 0 600 64"
            >
              {/* Grain Flow Lines */}
              <path d="M0,10 Q140,6 280,11 T600,8" fill="none" stroke="#3A1F0C" strokeWidth="1.2" opacity="0.6" />
              <path d="M0,18 Q200,22 420,16 T600,20" fill="none" stroke="#FFE9C2" strokeWidth="1" opacity="0.45" />
              <path d="M0,32 Q160,28 340,34 T600,30" fill="none" stroke="#3A1F0C" strokeWidth="1.4" opacity="0.5" />
              <path d="M0,38 Q220,41 460,36 T600,39" fill="none" stroke="#FFE9C2" strokeWidth="1" opacity="0.45" />
              <path d="M0,52 Q110,55 300,50 T600,53" fill="none" stroke="#3A1F0C" strokeWidth="1.2" opacity="0.6" />
              
              {/* Center Wood Knot */}
              <ellipse cx="270" cy="32" rx="14" ry="4.5" fill="none" stroke="#2F1808" strokeWidth="1.4" opacity="0.7" />
              <ellipse cx="270" cy="32" rx="7" ry="2" fill="#2F1808" opacity="0.5" />
            </svg>

            {/* Top Specular Edge Highlight */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FFEBCA] via-[#FFF3DC] to-[#FFEBCA] opacity-55 pointer-events-none" />

            {/* 4 Corner Screws / Bolts */}
            {/* Left Top Screw */}
            <div className="absolute top-2 left-3 sm:left-4 w-3 sm:w-3.5 h-3 sm:h-3.5 rounded-full bg-gradient-to-br from-[#7E6F62] via-[#46382E] to-[#1E1712] border border-[#19120D] shadow-[inset_1px_1px_1px_#BFB0A2,0_1px_2px_rgba(0,0,0,0.6)] flex items-center justify-center pointer-events-none">
              <div className="w-1.5 h-0.5 bg-[#17100B] rotate-45" />
            </div>
            {/* Left Bottom Screw */}
            <div className="absolute bottom-2 left-3 sm:left-4 w-3 sm:w-3.5 h-3 sm:h-3.5 rounded-full bg-gradient-to-br from-[#7E6F62] via-[#46382E] to-[#1E1712] border border-[#19120D] shadow-[inset_1px_1px_1px_#BFB0A2,0_1px_2px_rgba(0,0,0,0.6)] flex items-center justify-center pointer-events-none">
              <div className="w-1.5 h-0.5 bg-[#17100B] -rotate-30" />
            </div>

            {/* Right Top Screw */}
            <div className="absolute top-2 right-3 sm:right-4 w-3 sm:w-3.5 h-3 sm:h-3.5 rounded-full bg-gradient-to-br from-[#7E6F62] via-[#46382E] to-[#1E1712] border border-[#19120D] shadow-[inset_1px_1px_1px_#BFB0A2,0_1px_2px_rgba(0,0,0,0.6)] flex items-center justify-center pointer-events-none">
              <div className="w-1.5 h-0.5 bg-[#17100B] rotate-15" />
            </div>
            {/* Right Bottom Screw */}
            <div className="absolute bottom-2 right-3 sm:right-4 w-3 sm:w-3.5 h-3 sm:h-3.5 rounded-full bg-gradient-to-br from-[#7E6F62] via-[#46382E] to-[#1E1712] border border-[#19120D] shadow-[inset_1px_1px_1px_#BFB0A2,0_1px_2px_rgba(0,0,0,0.6)] flex items-center justify-center pointer-events-none">
              <div className="w-1.5 h-0.5 bg-[#17100B] -rotate-60" />
            </div>

            {/* Navbar Content: Justify Between (Logo on Left, Speaker & Hide Buttons on Right) */}
            <div className="relative z-10 w-full flex items-center justify-between px-7 sm:px-11 py-2.5 sm:py-3">
              
              {/* Left Side: Brand Logo (Enlarged for prominent clarity and presence) */}
              <div className="flex items-center">
                <img
                  src="/public/assets/logo.png"
                  alt="Logo"
                  className="h-11 sm:h-13 md:h-14 w-auto object-contain select-none filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.55)]"
                  onError={(e) => {
                    e.currentTarget.src = '/assets/logo.png';
                  }}
                />
              </div>

              {/* Right Side: Speaker Button & Hide Navbar Button */}
              <div className="flex items-center gap-2 sm:gap-2.5">
                
                {/* Circular Yellow Speaker Button */}
                <motion.button
                  id="wooden-navbar-speaker-btn"
                  type="button"
                  whileHover={{ scale: 1.1, rotate: isMuted ? -4 : 4 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={onToggleMute}
                  className={`relative w-9.5 h-9.5 sm:w-10.5 sm:h-10.5 rounded-full border-3 border-[#241408] transition-all cursor-pointer shadow-[0_2.5px_0px_0px_#1B0E05,0_3px_5px_rgba(0,0,0,0.35)] flex items-center justify-center ${
                    isMuted
                      ? 'bg-gradient-to-b from-[#8C7664] to-[#544335] text-neutral-300 hover:from-[#A08873] hover:to-[#635041]'
                      : 'bg-gradient-to-b from-[#FFE500] via-[#FFD700] to-[#E6B800] text-[#241408] hover:from-[#FFF04D] hover:to-[#F5C700]'
                  }`}
                  title={isMuted ? 'Aktifkan Suara Video' : 'Bisukan Suara Video'}
                  aria-label={isMuted ? 'Aktifkan Suara Video' : 'Bisukan Suara Video'}
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5 sm:w-5.5 sm:h-5.5 stroke-[2.7]" />
                  ) : (
                    <Volume2 className="w-5 h-5 sm:w-5.5 sm:h-5.5 stroke-[2.7]" />
                  )}
                </motion.button>

                {/* Hide Navbar Button (ChevronDown to slide down/hide to bottom) */}
                <motion.button
                  id="wooden-navbar-hide-btn"
                  type="button"
                  whileHover={{ scale: 1.1, y: 1.5 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={toggleHide}
                  className="relative w-9.5 h-9.5 sm:w-10.5 sm:h-10.5 rounded-full border-3 border-[#241408] bg-gradient-to-b from-[#5C4533] via-[#433123] to-[#2B1E14] text-[#FFECC7] hover:text-[#FFE500] transition-all cursor-pointer shadow-[0_2.5px_0px_0px_#1B0E05,0_3px_5px_rgba(0,0,0,0.35)] flex items-center justify-center group"
                  title="Sembunyikan Navbar (Tutup ke Bawah Halaman)"
                  aria-label="Sembunyikan Navbar"
                >
                  <ChevronDown className="w-5 h-5 sm:w-5.5 sm:h-5.5 stroke-[2.7] group-hover:translate-y-0.5 transition-transform" />
                </motion.button>

              </div>

            </div>

          </div>

          {/* Bottom Wooden Post Tips (peeking out below beam) */}
          <div className="w-full flex justify-between px-8 sm:px-14 -mt-1.5 relative z-10 pointer-events-none">
            {/* Left Bottom Peg */}
            <div className="w-6 sm:w-7 h-3 bg-gradient-to-r from-[#593416] via-[#7B4821] to-[#45260E] border-2 border-[#261508] rounded-b-md shadow-md" />
            {/* Right Bottom Peg */}
            <div className="w-6 sm:w-7 h-3 bg-gradient-to-r from-[#593416] via-[#7B4821] to-[#45260E] border-2 border-[#261508] rounded-b-md shadow-md" />
          </div>
        </motion.div>

        {/* Short Anchoring Chains with Exactly 4 Links (4 Mata Rantai Pendek ke Dasar Bawah) */}
        <div className="w-full flex justify-between px-8 sm:px-14 -mt-1 relative z-0 pointer-events-none">
          <FourShortLinksChainBottom />
          <FourShortLinksChainBottom />
        </div>

      </motion.div>
    </div>
  );
};
