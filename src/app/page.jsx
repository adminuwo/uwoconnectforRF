'use client';

import React, { useState } from 'react';
import KinsoNavbar from '@/components/landing/KinsoNavbar';
import KinsoHeroSection from '@/components/landing/KinsoHeroSection';
import KinsoTrustedBy from '@/components/landing/KinsoTrustedBy';
import KinsoProblemStatement from '@/components/landing/KinsoProblemStatement';
import KinsoProductShowcase from '@/components/landing/KinsoProductShowcase';
import KinsoFeatureShowcase from '@/components/landing/KinsoFeatureShowcase';
import KinsoAIAutomation from '@/components/landing/KinsoAIAutomation';
import KinsoTeamCollaboration from '@/components/landing/KinsoTeamCollaboration';
import KinsoSecurity from '@/components/landing/KinsoSecurity';
import KinsoTestimonials from '@/components/landing/KinsoTestimonials';
import KinsoFAQ from '@/components/landing/KinsoFAQ';
import KinsoCTA from '@/components/landing/KinsoCTA';
import KinsoFooter from '@/components/landing/KinsoFooter';

export default function Home() {
  // Light mode default for Kinso clean white aesthetic, dark mode supported via state
  const [isDark, setIsDark] = useState(false);

  return (
    <div
      className={`min-h-screen font-sans selection:bg-[#00AB56]/20 selection:text-[#00AB56] transition-colors duration-300 ${isDark ? 'bg-[#06080E] text-white' : 'bg-[#F0FDF4] text-gray-900'
        }`}
    >
      {/* Top Fixed Sticky Navbar */}
      <KinsoNavbar isDark={isDark} setIsDark={setIsDark} />

      {/* Main Content Layout */}
      <main className="relative z-10">
        {/* Section 1 — Hero */}
        <KinsoHeroSection isDark={isDark} />

        {/* Section 2 — Trusted by Modern Businesses */}
        <KinsoTrustedBy isDark={isDark} />

        {/* Section 3 — Problem Statement (Kinso Storytelling) */}
        <KinsoProblemStatement isDark={isDark} />

        {/* Section 4 — Product Showcase */}
        <KinsoProductShowcase isDark={isDark} />

        {/* Section 5 — Feature Showcase & Connectors Grid */}
        <KinsoFeatureShowcase isDark={isDark} />

        {/* Section 6 — AI Automation Workflow */}
        <KinsoAIAutomation isDark={isDark} />

        {/* Section 7 — Team Collaboration */}
        <KinsoTeamCollaboration isDark={isDark} />

        {/* Section 8 — Enterprise Security */}
        <KinsoSecurity isDark={isDark} />

        {/* Section 9 — Testimonials */}
        <KinsoTestimonials isDark={isDark} />

        {/* Section 10 — FAQ */}
        <KinsoFAQ isDark={isDark} />

        {/* Section 11 — Final CTA */}
        <KinsoCTA isDark={isDark} />
      </main>

      {/* Footer */}
      <KinsoFooter isDark={isDark} />
    </div>
  );
}
