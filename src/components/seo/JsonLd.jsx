import React from 'react';

/**
 * XSS-safe JSON-LD Script Component for Schema.org Structured Data
 */
export default function JsonLd({ data, id }) {
  if (!data) return null;

  const jsonString = JSON.stringify(data).replace(/</g, '\\u003c');

  return (
    <script
      id={id || undefined}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonString }}
    />
  );
}
