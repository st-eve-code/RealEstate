'use client'

import { useAuth } from '@/lib/auth-context'
import Loader from '@/components/ado/loader'

// User property component
import UserProperty from '@/components/User_Dashboard/Properties'
// Caretaker property component
import CaretakerPropertyPage from '@/pages/Caretaker/PropertyPage'

import UserDashboardLayout from '../layouts/UserDashboardLayout'
import CaretakerDashboardLayout from '../layouts/CaretakerDashboardLayout'

export default function PropertiesPage() {
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

  // Caretaker/Landlord sees property management
  if (userRole === 'landlord') {
    return (
      <CaretakerDashboardLayout>
        <CaretakerPropertyPage />
      </CaretakerDashboardLayout>
    )
  }

  // Regular user sees their properties
  return (
    <UserDashboardLayout>
      <UserProperty />
    </UserDashboardLayout>
  )
}
