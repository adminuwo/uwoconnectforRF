'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import UwoLandingPage from '@/components/landing/UwoLandingPage';
import CookiePreferencesModal from '@/components/common/CookiePreferencesModal';

export default function CookiePolicyClient() {
  const router = useRouter();

  return (
    <main className="relative min-h-screen">
      {/* Background Landing Page */}
      <UwoLandingPage />

      {/* Pop-up Modal rendered on /cookie-policy route */}
      <CookiePreferencesModal
        isOpen={true}
        onClose={() => {
          router.push('/');
        }}
      />
    </main>
  );
}
