'use client'

import { useAuth } from '../../../../lib/auth-context'
import EnhancedSettings from '../../../../components/Admin/Settings/EnhancedSettings';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function GeneralSettingsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user?.role?.role !== 'admin') {
      router.push('/dashboard/setting')
    }
  }, [user, loading, router])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (user?.role?.role !== 'admin') {
    return null
  }

  return <EnhancedSettings isSidebarCollapsed={false} activeTab="general" />;
}
