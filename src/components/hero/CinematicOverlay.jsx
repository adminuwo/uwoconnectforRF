'use client';

import React from 'react';

const CinematicOverlay = () => {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 font-sans">
      {/* Dark Vignette Overlay */}
      <div className="absolute inset-0 bg-slate-950/65 backdrop-blur-[1px]" />

      {/* Radial Gradient Glow in Center */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,6,23,0.85)_100%)]" />

      {/* Top & Bottom Ambient Vignette Fade */}
      <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-slate-950/90 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
    </div>
  );
};

export default CinematicOverlay;
