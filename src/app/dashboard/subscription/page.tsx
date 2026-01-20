'use client'

import { useAuth } from '../../../lib/auth-context'
import Subscription from '@/components/User_Dashboard/Subscription'
import UserDashboardLayout from '../layouts/UserDashboardLayout'

export default function SubscriptionPage() {
  const { user } = useAuth()

  // Only for regular users
  if (user?.role?.role !== 'user') {
    return null
  }

  return (
    <UserDashboardLayout>
      <Subscription />
    </UserDashboardLayout>
  )
}
