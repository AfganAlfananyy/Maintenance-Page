import React from 'react';

export const AmbientBackground: React.FC = () => {
  return (
    <div 
      className="pointer-events-none fixed inset-0 overflow-hidden z-0 select-none bg-[#F3F3F3]"
      aria-hidden="true"
    />
  );
};
