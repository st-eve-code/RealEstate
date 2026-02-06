'use client'

import { useAuth } from '../../../lib/auth-context'
import HelpSection from '@/components/User_Dashboard/Help'
import UserDashboardLayout from '../layouts/UserDashboardLayout'

export default function HelpPage() {
  const { user } = useAuth()

  // Only for regular users
  if (user?.role?.role !== 'user') {
    return null
  }

  return (
    <UserDashboardLayout>
      <HelpSection />
    </UserDashboardLayout>
  )
}
