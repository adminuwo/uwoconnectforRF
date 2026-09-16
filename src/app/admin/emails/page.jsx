'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

const AdminEmailsPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin');
  }, [router]);

  return (
    <DashboardLayout role="ADMIN">
      <div className="w-full max-w-full pb-24 px-4 sm:px-8 lg:px-10 font-sans flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-emerald-600" />
      </div>
    </DashboardLayout>
  );
};

export default AdminEmailsPage;
