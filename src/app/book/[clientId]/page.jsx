import React from 'react';
import PublicBookingClient from '@/components/booking/PublicBookingClient';
import JsonLd from '@/components/seo/JsonLd';
import {
  buildPageMetadata,
  getBreadcrumbSchema,
  getBaseUrl,
  SITE_CONFIG,
} from '@/lib/seo';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const clientId = resolvedParams?.clientId || 'Booking';

  return buildPageMetadata({
    title: `Schedule an Appointment | ${clientId} — UwoConnect`,
    description: `Book an appointment directly with ${clientId} through UwoConnect’s real-time automated calendar booking system.`,
    path: `/book/${clientId}`,
    robots: { index: true, follow: true },
  });
}

export default async function PublicBookingPage({ params }) {
  const resolvedParams = await params;
  const clientId = resolvedParams?.clientId || '';
  const baseUrl = getBaseUrl();

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Calendar Booking', url: `/book/${clientId}` },
  ]);

  const scheduleSchema = {
    '@context': 'https://schema.org',
    '@type': 'ScheduleAction',
    name: `Schedule Appointment with ${clientId}`,
    object: {
      '@type': 'Service',
      name: `Consultation & Meeting Booking`,
      provider: {
        '@type': 'Organization',
        name: clientId,
      },
    },
    actionStatus: 'PotentialActionStatus',
  };

  return (
    <>
      <JsonLd id="schema-booking-action" data={scheduleSchema} />
      <JsonLd id="schema-breadcrumb-booking" data={breadcrumbSchema} />
      <PublicBookingClient clientId={clientId} />
    </>
  );
}
