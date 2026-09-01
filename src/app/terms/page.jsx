'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import UwoLandingPage from '@/components/landing/UwoLandingPage';
import TermsModal from '@/components/TermsModal';

export default function TermsRoutePage() {
  const router = useRouter();

  return (
    <main className="relative min-h-screen">
      {/* Background Landing Page */}
      <UwoLandingPage />

      {/* Pop-up Modal rendered on /terms route */}
      <TermsModal
        isOpen={true}
        onClose={() => {
          router.push('/');
        }}
      />
    </main>
  );
}
