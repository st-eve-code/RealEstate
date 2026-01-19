'use client'

import { useAuth } from '@/lib/auth-context'
import Store from '@/components/User_Dashboard/Store'
import UserDashboardLayout from '../layouts/UserDashboardLayout'

export default function StorePage() {
  const { user } = useAuth()

  // Only for regular users
  if (user?.role?.role !== 'user') {
    return null
  }

  return (
    <UserDashboardLayout>
      <Store sidebar={null} />
    </UserDashboardLayout>
  )
}
