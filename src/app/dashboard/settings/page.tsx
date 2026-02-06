'use client'

import { useAuth } from '../../../lib/auth-context'
import EnhancedSettings from '../../../components/Admin/Settings/EnhancedSettings';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SettingsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user?.role?.role !== 'admin') {
      // Redirect non-admins to their own settings
      router.push('/dashboard/setting')
    }
  }, [user, loading, router])

  // Only render for admins
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (user?.role?.role !== 'admin') {
    return null
  }

  return <EnhancedSettings isSidebarCollapsed={false} />;
}
