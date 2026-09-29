import React from 'react';
import AutomationPage from '@/components/landing/pages/AutomationPage';
import { buildPageMetadata, SITE_CONFIG } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: `Automation — AI Auto Replies, CRM Lead Scoring & GST Invoicing | ${SITE_CONFIG.name}`,
  description:
    'Automate repetitive customer workflows with Abha. 0.2s smart AI auto-replies, automated lead scoring, dynamic GST quotation generation, and instant tax invoices.',
  path: '/automation',
});

export default function Page() {
  return <AutomationPage />;
}
