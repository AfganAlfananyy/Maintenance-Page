import React from 'react';

export const AmbientBackground: React.FC = () => {
  return (
    <div 
      className="pointer-events-none fixed inset-0 overflow-hidden z-0 select-none bg-[#f2f2f2]"
      aria-hidden="true"
    />
  );
};
