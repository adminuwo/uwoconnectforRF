'use client';

import React, { useState, useEffect, useRef } from 'react';
import { HERO_VIDEO_CONFIG } from './heroVideoConfig';
import BackgroundVideo from './BackgroundVideo';

const FullscreenVideo = () => {
  const videoRef = useRef(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  // Fallback timer for canvas animation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(prev => (prev >= 35 ? 0 : prev + 0.5));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden select-none pointer-events-none z-0 bg-slate-950 font-sans">
      
      {/* Native HTML5 Video Element */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        poster={HERO_VIDEO_CONFIG.sources.poster}
        onLoadedData={() => setVideoLoaded(true)}
        className={`w-full h-full object-cover transition-opacity duration-1000 ${
          videoLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <source src={HERO_VIDEO_CONFIG.sources.desktop} type="video/mp4" />
        <source src="/videos/uwo-connect-hero.webm" type="video/webm" />
      </video>

      {/* Fallback Animated Canvas Scene Engine when mp4 file is loading/pending */}
      {!videoLoaded && (
        <div className="absolute inset-0 w-full h-full">
          <BackgroundVideo currentTime={currentTime} />
        </div>
      )}

    </div>
  );
};

export default FullscreenVideo;
