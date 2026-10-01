import React from 'react';
import ChannelsPage from '@/components/landing/pages/ChannelsPage';
import { buildPageMetadata, SITE_CONFIG } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: `Channels — WhatsApp, Instagram, Facebook & YouTube Communication | ${SITE_CONFIG.name}`,
  description:
    'Connect WhatsApp Business API, Instagram DMs, Facebook Messenger, and YouTube comments into a unified command inbox with 24/7 AI automated routing.',
  path: '/channels',
});

export default function Page() {
  return <ChannelsPage />;
}
