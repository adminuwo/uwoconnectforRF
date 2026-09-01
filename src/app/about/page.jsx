'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import UwoLandingPage from '@/components/landing/UwoLandingPage';
import AboutModal from '@/components/AboutModal';

export default function AboutRoutePage() {
  const router = useRouter();

  return (
    <main className="relative min-h-screen">
      {/* Background Landing Page */}
      <UwoLandingPage />

      {/* Pop-up Modal rendered on /about route */}
      <AboutModal
        isOpen={true}
        onClose={() => {
          router.push('/');
        }}
      />
    </main>
  );
}
