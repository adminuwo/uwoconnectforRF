'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Loader2 } from 'lucide-react';

export default function AdminAIPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/knowledge');
  }, [router]);

  return (
    <DashboardLayout role="ADMIN">
      <div className="w-full h-96 flex flex-col items-center justify-center gap-3">
        <Loader2 className="animate-spin text-emerald-600" size={32} />
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Redirecting to Knowledge Base...</p>
      </div>
    </DashboardLayout>
  );
}
