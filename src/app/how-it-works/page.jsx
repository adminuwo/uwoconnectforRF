import React from 'react';
import HowItWorksPage from '@/components/landing/pages/HowItWorksPage';
import { buildPageMetadata, SITE_CONFIG } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: `How It Works — Connect, Automate & Grow with UWO Connect | ${SITE_CONFIG.name}`,
  description:
    'See exactly how UWO Connect works in 3 simple steps: Connect your channels, let Abha automate every customer workflow, and grow revenue with real-time analytics.',
  path: '/how-it-works',
});

export default function Page() {
  return <HowItWorksPage />;
}
