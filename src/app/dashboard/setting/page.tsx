'use client'

import { useAuth } from '@/lib/auth-context'
import Setting from '@/components/User_Dashboard/Setting'
import UserDashboardLayout from '../layouts/UserDashboardLayout'

export default function SettingPage() {
  const { user } = useAuth()

  // Only for regular users
  if (user?.role?.role !== 'user') {
    return null
  }

  return (
    <UserDashboardLayout>
      <Setting />
    </UserDashboardLayout>
  )
}
