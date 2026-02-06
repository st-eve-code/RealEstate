'use client'

import { useAuth } from '../../../lib/auth-context'
import Setting from '@/components/User_Dashboard/Setting'
import LandlordSettings from '@/components/Caretaker_Dashboard/LandlordSettings.jsx'

export default function SettingPage() {
  const { user, loading } = useAuth()
  const userRole = user?.role?.role || 'user'

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    )
  }

  // Landlords get premium settings WITHOUT layout wrapper
  // (LandlordSettings is a full-page component with its own styling)
  if (userRole === 'landlord') {
    return <LandlordSettings />
  }

  // Regular users get standard settings WITHOUT layout wrapper
  // (Setting is a full-page component with its own styling)
  if (userRole === 'user') {
    return <Setting />
  }

  // Fallback for other roles
  return null
}
