import React from 'react';
import ConnectorsPage from '@/components/landing/pages/ConnectorsPage';
import { buildPageMetadata, SITE_CONFIG } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: `Connectors — Google Workspace & Microsoft 365 Integrations | ${SITE_CONFIG.name}`,
  description:
    'Connect Gmail, Outlook, Google Sheets, Google Docs, OneDrive, Google Maps, and business tools into one unified automation ecosystem with Dev.',
  path: '/connectors',
});

export default function Page() {
  return <ConnectorsPage />;
}
