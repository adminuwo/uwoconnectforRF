'use client';

import React from 'react';

// ════════════════════════════════════════════════════════════════
// PREMIUM 3D INDUSTRY SHOWCASE VISUALS (UNIFIED ART DIRECTION)
// High-fidelity tactile clay & studio miniature 3D renders with animated loops
// ════════════════════════════════════════════════════════════════

// 1. EDUCATION: 3D Stack of Books, Ladders, Globe & Graduation Cap
export function Education3DObjects({ className = '' }) {
  return (
    <div className={`relative w-full h-full flex items-center justify-center select-none pointer-events-none ${className}`}>
      <div className="relative w-full max-w-[360px] sm:max-w-[420px] h-[350px] sm:h-[400px] flex items-center justify-center">
        {/* Soft Radial Brand Ambient Lighting */}
        <div className="absolute inset-2 bg-gradient-to-t from-emerald-500/25 via-teal-500/10 to-transparent rounded-full blur-3xl pointer-events-none transform scale-95" />

        {/* Animated 3D Education Visual */}
        <img
          src="/solutions/education_3d_loop.webp"
          alt="Education Solutions - Knowledge, Admissions & Growth"
          className="relative z-10 w-full h-full object-contain drop-shadow-[0_25px_40px_rgba(11,143,120,0.25)]"
        />

        {/* Subtle Gleam Reflection on the Gold Medal */}
        <div className="absolute bottom-[24%] right-[23%] z-20 w-4 h-4 rounded-full bg-amber-300/60 blur-xs pointer-events-none animate-ping" />
      </div>
    </div>
  );
}

// 2. REAL ESTATE: Video Showcasing Real Estate Platform
export function RealEstate3DObjects({ className = '' }) {
  const videoRef = React.useRef(null);
  const [isPlaying, setIsPlaying] = React.useState(true);

  React.useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.defaultMuted = true;
      video.muted = true;
      video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className={`relative w-full h-full flex items-center justify-center select-none ${className}`}>
      <div className="relative w-full max-w-[420px] sm:max-w-[460px] flex items-center justify-center">
        {/* Soft Blue Ambient Glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-blue-500/30 via-sky-500/15 to-transparent rounded-3xl blur-3xl pointer-events-none transform scale-95" />

        {/* Real Estate Video Container */}
        <div
          onClick={togglePlay}
          className="relative z-10 w-full overflow-hidden rounded-2xl shadow-2xl border border-white/15 bg-slate-900/40 backdrop-blur-xs cursor-pointer group/vid"
        >
          <video
            ref={videoRef}
            src="/gemini_generated_video_83f0cbef.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-auto object-cover aspect-video rounded-2xl drop-shadow-[0_20px_35px_rgba(37,99,235,0.3)]"
            aria-label="Real Estate Solutions - Video"
          />
        </div>
      </div>
    </div>
  );
}

// 3. FINANCE: 3D Heavy Bank Vault, Gold Coin Stacks, Growth Chart & Ladder
export function Finance3DObjects({ className = '' }) {
  return (
    <div className={`relative w-full h-full flex items-center justify-center select-none pointer-events-none ${className}`}>
      <div className="relative w-full max-w-[360px] sm:max-w-[420px] h-[350px] sm:h-[400px] flex items-center justify-center">
        {/* Soft Emerald/Gold Ambient Glow */}
        <div className="absolute inset-2 bg-gradient-to-t from-emerald-500/25 via-amber-500/10 to-transparent rounded-full blur-3xl pointer-events-none transform scale-95" />

        {/* Animated 3D Finance Visual */}
        <img
          src="/solutions/finance_3d_loop.webp"
          alt="Finance Solutions - Wealth Management, Vault & Investments"
          className="relative z-10 w-full h-full object-contain drop-shadow-[0_25px_40px_rgba(5,150,105,0.25)]"
        />

        {/* Shimmer on Gold Coin Stack */}
        <div className="absolute top-[28%] right-[32%] z-20 w-4 h-4 rounded-full bg-amber-200/70 blur-xs pointer-events-none animate-ping" />
      </div>
    </div>
  );
}

// 4. HEALTHCARE: 3D Medical Cross Kit, Stethoscope, Prescription & Ladder
export function Healthcare3DObjects({ className = '' }) {
  return (
    <div className={`relative w-full h-full flex items-center justify-center select-none pointer-events-none ${className}`}>
      <div className="relative w-full max-w-[360px] sm:max-w-[420px] h-[350px] sm:h-[400px] flex items-center justify-center">
        {/* Soft Rose/Pink Ambient Glow */}
        <div className="absolute inset-2 bg-gradient-to-t from-rose-500/25 via-pink-500/10 to-transparent rounded-full blur-3xl pointer-events-none transform scale-95" />

        {/* Animated 3D Healthcare Visual */}
        <img
          src="/solutions/healthcare_3d_loop.webp"
          alt="Healthcare Solutions - Appointments, Medical Care & Patient Communication"
          className="relative z-10 w-full h-full object-contain drop-shadow-[0_25px_40px_rgba(244,63,94,0.25)]"
        />

        {/* Gentle Pulse on Stethoscope Chrome Piece */}
        <div className="absolute bottom-[28%] right-[32%] z-20 w-4 h-4 rounded-full bg-rose-300/60 blur-xs pointer-events-none animate-ping" />
      </div>
    </div>
  );
}

// 5. AUTOMOBILE: 3D Sleek Orange EV Sports Car on Stacked Tires & Alloy Wheel
export function Automobile3DObjects({ className = '' }) {
  return (
    <div className={`relative w-full h-full flex items-center justify-center select-none pointer-events-none ${className}`}>
      <div className="relative w-full max-w-[360px] sm:max-w-[420px] h-[350px] sm:h-[400px] flex items-center justify-center">
        {/* Soft Amber/Orange Ambient Glow */}
        <div className="absolute inset-2 bg-gradient-to-t from-amber-500/25 via-orange-500/10 to-transparent rounded-full blur-3xl pointer-events-none transform scale-95" />

        {/* Animated 3D Automobile Visual */}
        <img
          src="/solutions/automobile_3d_loop.webp"
          alt="Automobile Solutions - Dealerships, EV Vehicles & Test Drives"
          className="relative z-10 w-full h-full object-contain drop-shadow-[0_25px_40px_rgba(245,158,11,0.25)]"
        />

        {/* Headlight Beam Glint */}
        <div className="absolute top-[38%] left-[26%] z-20 w-4 h-4 rounded-full bg-amber-200/70 blur-xs pointer-events-none animate-ping" />
      </div>
    </div>
  );
}

// 6. LOGISTICS: 3D Express Cargo Van, Shipping Container, Parcels & Ladder
export function Logistics3DObjects({ className = '' }) {
  return (
    <div className={`relative w-full h-full flex items-center justify-center select-none pointer-events-none ${className}`}>
      <div className="relative w-full max-w-[360px] sm:max-w-[420px] h-[350px] sm:h-[400px] flex items-center justify-center">
        {/* Soft Purple/Indigo Ambient Glow */}
        <div className="absolute inset-2 bg-gradient-to-t from-purple-500/25 via-indigo-500/10 to-transparent rounded-full blur-3xl pointer-events-none transform scale-95" />

        {/* Animated 3D Logistics Visual */}
        <img
          src="/solutions/logistics_3d_loop.webp"
          alt="Logistics Solutions - Parcel Delivery, Fleet Tracking & Dispatch"
          className="relative z-10 w-full h-full object-contain drop-shadow-[0_25px_40px_rgba(139,92,246,0.25)]"
        />

        {/* Headlight Pulse */}
        <div className="absolute bottom-[36%] left-[28%] z-20 w-3.5 h-3.5 rounded-full bg-purple-300/60 blur-xs pointer-events-none animate-ping" />
      </div>
    </div>
  );
}

// 7. E-COMMERCE: 3D Pink Retail Tote Bag, Shopping Cart with Gifts & Sale Badge
export function Ecommerce3DObjects({ className = '' }) {
  return (
    <div className={`relative w-full h-full flex items-center justify-center select-none pointer-events-none ${className}`}>
      <div className="relative w-full max-w-[360px] sm:max-w-[420px] h-[350px] sm:h-[400px] flex items-center justify-center">
        {/* Soft Pink/Fuchsia Ambient Glow */}
        <div className="absolute inset-2 bg-gradient-to-t from-pink-500/25 via-rose-500/10 to-transparent rounded-full blur-3xl pointer-events-none transform scale-95" />

        {/* Animated 3D E-commerce Visual */}
        <img
          src="/solutions/ecommerce_3d_loop.webp"
          alt="E-commerce Solutions - Shopping Carts, Orders & Instant Retail Support"
          className="relative z-10 w-full h-full object-contain drop-shadow-[0_25px_40px_rgba(236,72,153,0.25)]"
        />

        {/* Glint on Golden Sale Tag */}
        <div className="absolute bottom-[32%] right-[20%] z-20 w-4 h-4 rounded-full bg-amber-300/70 blur-xs pointer-events-none animate-ping" />
      </div>
    </div>
  );
}

// 8. TRAVEL & HOSPITALITY: 3D Airplane Swooping Over Stamped Leather Suitcase & Globe
export function Travel3DObjects({ className = '' }) {
  return (
    <div className={`relative w-full h-full flex items-center justify-center select-none pointer-events-none ${className}`}>
      <div className="relative w-full max-w-[360px] sm:max-w-[420px] h-[350px] sm:h-[400px] flex items-center justify-center">
        {/* Soft Cyan/Sky Ambient Glow */}
        <div className="absolute inset-2 bg-gradient-to-t from-cyan-500/25 via-sky-500/10 to-transparent rounded-full blur-3xl pointer-events-none transform scale-95" />

        {/* Animated 3D Travel Visual */}
        <img
          src="/solutions/travel_3d_loop.webp"
          alt="Travel & Hospitality Solutions - Flights, Bookings & Guest Management"
          className="relative z-10 w-full h-full object-contain drop-shadow-[0_25px_40px_rgba(6,182,212,0.25)]"
        />

        {/* Glint on Airplane Wing */}
        <div className="absolute top-[28%] right-[28%] z-20 w-4 h-4 rounded-full bg-cyan-200/70 blur-xs pointer-events-none animate-ping" />
      </div>
    </div>
  );
}

// Static component renderer compliant with React 19 compiler
export function RenderIndustry3D({ sceneId, className = '' }) {
  switch (sceneId) {
    case 'education': return <Education3DObjects className={className} />;
    case 'real-estate': return <RealEstate3DObjects className={className} />;
    case 'finance': return <Finance3DObjects className={className} />;
    case 'healthcare': return <Healthcare3DObjects className={className} />;
    case 'automobile': return <Automobile3DObjects className={className} />;
    case 'logistics': return <Logistics3DObjects className={className} />;
    case 'ecommerce': return <Ecommerce3DObjects className={className} />;
    case 'travel': return <Travel3DObjects className={className} />;
    default: return <Education3DObjects className={className} />;
  }
}
