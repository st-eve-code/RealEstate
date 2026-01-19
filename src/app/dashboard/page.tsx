'use client'

import { useAuth } from '@/lib/auth-context'
import Loader from '@/components/ado/loader'

// Import dashboard components for each role
import UserDashboardContent from '@/components/User_Dashboard/Dashboard'
import CaretakerDashboard from '@/components/Caretaker_Dashboard/Dashboard'
import AdminDashboard from '@/pages/Admin/Admin'

export default function DashboardPage() {
  const { user, loadingUser } = useAuth()

  if (loadingUser) {
    return (
      <div className='absolute top-0 left-0 w-screen h-screen'>
        <Loader style='dot-121' />
      </div>
    )
  }

  if (!user) {
    return null
  }

  const userRole = user.role?.role || 'user'

  // Render different dashboard based on role (layout applied by dashboard/layout.tsx)
  if (userRole === 'landlord') {
    return <CaretakerDashboard />
  }

  if (userRole === 'admin') {
    return <AdminDashboard />
  }

  // Default to user dashboard
  return <UserDashboardContent />
}
