'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function RouteFontController() {
  const pathname = usePathname();

  useEffect(() => {
    // If on the root landing page ('/'), use standard sans-serif font
    if (pathname === '/') {
      document.body.classList.remove('font-times-new-roman');
      document.documentElement.classList.remove('font-times-new-roman');
      document.body.classList.add('font-landing');
    } else {
      // Everywhere else (client workspace, admin, catalog, crm, etc.), apply Times New Roman
      document.body.classList.add('font-times-new-roman');
      document.documentElement.classList.add('font-times-new-roman');
      document.body.classList.remove('font-landing');
    }
  }, [pathname]);

  return null;
}
