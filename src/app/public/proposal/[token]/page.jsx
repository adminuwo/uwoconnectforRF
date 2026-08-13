'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import PublicDocumentView from '@/components/sales/PublicDocumentView';

export default function PublicProposalPage() {
  const { token } = useParams();
  return <PublicDocumentView token={token} documentTypeHint="proposal" />;
}
