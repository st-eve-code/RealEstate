'use client'

import { useAuth } from '@/lib/auth-context'
import Transaction from '@/components/User_Dashboard/Transaction'
import UserDashboardLayout from '../layouts/UserDashboardLayout'

export default function TransactionPage() {
  const { user } = useAuth()

  // Only for regular users
  if (user?.role?.role !== 'user') {
    return null
  }

  return (
    <UserDashboardLayout>
      <Transaction />
    </UserDashboardLayout>
  )
}
