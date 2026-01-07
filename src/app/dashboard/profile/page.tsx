'use client'

import { useAuth } from '@/lib/auth-context'
import Profile from '@/components/User_Dashboard/Profile'
import Loader from '@/components/ado/loader'

import UserDashboardLayout from '../layouts/UserDashboardLayout'
import CaretakerDashboardLayout from '../layouts/CaretakerDashboardLayout'
import AdminDashboardLayout from '../layouts/AdminDashboardLayout'

export default function ProfilePage() {
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

  // Profile is same for all roles, just different layouts
  const ProfileContent = <Profile user={user} />

  if (userRole === 'landlord') {
    return (
      <CaretakerDashboardLayout>
        {ProfileContent}
      </CaretakerDashboardLayout>
    )
  }

  if (userRole === 'admin') {
    return (
      <AdminDashboardLayout>
        {ProfileContent}
      </AdminDashboardLayout>
    )
  }

  return (
    <UserDashboardLayout>
      {ProfileContent}
    </UserDashboardLayout>
  )
}
