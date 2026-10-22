import React from 'react';
import MobileAppPage from '@/components/landing/pages/MobileAppPage';
import { buildPageMetadata, SITE_CONFIG } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: `Mobile App — Download UWO Connect for Android & iOS | ${SITE_CONFIG.name}`,
  description:
    'Download the official UWO Connect Mobile App for Android. Manage WhatsApp chats, Meta ad leads, automated pipelines, AI quick replies, and team SLAs on the go.',
  path: '/mobile-app',
});

export default function Page() {
  return <MobileAppPage />;
}
