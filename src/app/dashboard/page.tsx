'use client'

import { useAuth } from '@/lib/auth-context'
import Loader from '@/components/ado/loader'

// Import dashboard components for each role
import UserDashboardContent from '@/components/User_Dashboard/Dashboard'
import CaretakerDashboard from '@/components/Caretaker_Dashboard/Dashboard'
import AdminDashboard from '@/pages/Admin/Admin'

// Import layouts
import UserDashboardLayout from './layouts/UserDashboardLayout'
import CaretakerDashboardLayout from './layouts/CaretakerDashboardLayout'
import AdminDashboardLayout from './layouts/AdminDashboardLayout'

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

  // Render different dashboard based on role
  if (userRole === 'landlord') {
    return (
      <CaretakerDashboardLayout>
        <CaretakerDashboard />
      </CaretakerDashboardLayout>
    )
  }

  if (userRole === 'admin') {
    return (
      <AdminDashboardLayout>
        <AdminDashboard />
      </AdminDashboardLayout>
    )
  }

  // Default to user dashboard
  return (
    <UserDashboardLayout>
      <UserDashboardContent />
    </UserDashboardLayout>
  )
}
