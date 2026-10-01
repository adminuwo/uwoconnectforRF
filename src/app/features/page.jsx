import React from 'react';
import FeaturesPage from '@/components/landing/pages/FeaturesPage';
import { buildPageMetadata, SITE_CONFIG } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: `Features — AI Automation, CRM, GST Invoicing & 9 Business Engines | ${SITE_CONFIG.name}`,
  description:
    'Explore all 9 UWO Connect features: Smart AI Auto Reply, Unified CRM, GST Invoicing, Product Catalogs, Quotation Generator, Payments, and HD Video Calling — in one workspace.',
  path: '/features',
});

export default function Page() {
  return <FeaturesPage />;
}
