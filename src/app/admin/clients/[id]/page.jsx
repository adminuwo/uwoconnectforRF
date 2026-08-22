import React from 'react';

export default function ClientDetailsPage({ params }) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Client Details</h1>
      <p>Viewing details for client ID: {params.id}</p>
    </div>
  );
}