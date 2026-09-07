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

      if (code) {
        // If opened inside popup window, send code to parent opener and close window
        if (window.opener && !window.opener.closed) {
          try {
            window.opener.postMessage({
              type: 'UWO_WHATSAPP_CODE',
              code: code,
              state: state || 'whatsapp'
            }, '*');
          } catch (e) {}
          setTimeout(() => {
            window.close();
          }, 800);
          return;
        }

        // If top-level redirect, route to channels dashboard
        router.replace(`/client/channels?state=${state || 'whatsapp'}&code=${encodeURIComponent(code)}`);
      }
    }
  }, [router]);

  return <UwoLandingPage />;
}
