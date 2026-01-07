'use client'

import { useAuth } from '@/lib/auth-context'
import Notification from '@/components/User_Dashboard/Notification'
import UserDashboardLayout from '../layouts/UserDashboardLayout'

export default function NotificationPage() {
  const { user } = useAuth()

  // Only for regular users
  if (user?.role?.role !== 'user') {
    return null
  }

  return (
    <UserDashboardLayout>
      <Notification />
    </UserDashboardLayout>
  )
}
