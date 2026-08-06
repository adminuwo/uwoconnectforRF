'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#06080E] text-gray-900 dark:text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="w-12 h-12 rounded-2xl bg-[#16A34A] flex items-center justify-center text-white font-bold mb-6">
        <Sparkles className="w-6 h-6" />
      </div>
      <h1 className="text-6xl font-bold text-[#16A34A] mb-4">404</h1>
      <h2 className="text-2xl font-bold mb-2">Page Not Found</h2>
      <p className="text-gray-500 dark:text-gray-400 max-w-md mb-8 text-sm">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-[#16A34A] hover:bg-[#15803D] text-white px-6 py-3 rounded-xl font-semibold text-sm shadow-md transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        Return to Workspace Home
      </Link>
    </div>
  );
}
