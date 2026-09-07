'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import UwoLandingPage from '@/components/landing/UwoLandingPage';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const state = params.get('state');
      if (code && (state === 'whatsapp' || state === 'instagram')) {
        router.replace(`/client/channels?state=${state}&code=${encodeURIComponent(code)}`);
      }
    }
  }, [router]);

  return <UwoLandingPage />;
}
