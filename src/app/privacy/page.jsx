'use client';

import { useEffect } from 'react';

export default function PrivacyRedirectPage() {
  useEffect(() => {
    window.location.href = 'https://uwo24.com/privacy-policy';
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white font-sans">
      <div className="space-y-3 text-center">
        <p className="text-sm text-slate-300 font-medium">Redirecting to official UwoConnect Privacy Policy...</p>
        <a 
          href="https://uwo24.com/privacy-policy" 
          className="text-emerald-400 font-bold text-xs underline"
        >
          Click here if not redirected automatically
        </a>
      </div>
    </div>
  );
}
