'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import UwoLandingPage from '@/components/landing/UwoLandingPage';
import TermsModal from '@/components/TermsModal';

export default function TermsClient() {
  const router = useRouter();

  return (
    <main className="relative min-h-screen">
      {/* Background Landing Page */}
      <UwoLandingPage />

      {/* Pop-up Modal rendered on /terms route */}
      <TermsModal
        isOpen={true}
        onClose={() => {
          if (typeof window !== 'undefined' && window.history.length > 1) {
            router.back();
          } else {
            router.push('/');
          }
        }}
      />
    </main>
  );
}
