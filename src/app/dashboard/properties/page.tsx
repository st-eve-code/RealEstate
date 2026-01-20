'use client'

import { useAuth } from '../../../lib/auth-context'
import Loader from '../../../components/ado/loader'

// Import role-specific property components
import AdminProperties from '@/components-legacy/Admin/Components/Property/Property'
import CaretakerProperties from '@/components-legacy/Caretaker/PropertyPage'
import UserProperties from '@/components/User_Dashboard/Properties'

export default function PropertiesPage() {
  const { user, loadingUser } = useAuth()

  if (loadingUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader style="dot-121" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  const userRole = user?.role?.role || 'user'

  // Render different components based on role
  if (userRole === 'admin') {
    return <AdminProperties />
  }

  if (userRole === 'landlord') {
    return <CaretakerProperties />
  }

  // Default to user/tenant properties view
  return <UserProperties />
}
