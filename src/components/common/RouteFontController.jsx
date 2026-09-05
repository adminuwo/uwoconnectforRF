'use client';

import { useEffect } from 'react';

export default function RouteFontController() {
  useEffect(() => {
    // Apply Times New Roman font globally across the entire app including the landing page
    document.body.classList.add('font-times-new-roman');
    document.documentElement.classList.add('font-times-new-roman');
  }, []);

  return null;
}
