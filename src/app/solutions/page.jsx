import React from 'react';
import SolutionsPage from '@/components/landing/pages/SolutionsPage';
import { buildPageMetadata, SITE_CONFIG } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: `Industry Solutions — Education, Real Estate, Healthcare, Finance & Retail | ${SITE_CONFIG.name}`,
  description:
    'Discover how UWO Connect automates customer communication, captures leads, and coordinates workflows across Education, Real Estate, Healthcare, Finance, Automobile, Logistics, E-commerce, and Travel.',
  path: '/solutions',
  keywords: [
    'UWO Connect Solutions',
    'Industry communication platform',
    'WhatsApp for Education admissions',
    'Real Estate lead automation',
    'Healthcare appointment reminders',
    'Financial document collection WhatsApp',
    'Automobile test drive booking',
    'Logistics shipment alerts WhatsApp',
    'E-commerce cart recovery',
    'Travel and hospitality WhatsApp bot',
    'Omnichannel business solutions'
  ]
});

export default function Page() {
  return <SolutionsPage />;
}
