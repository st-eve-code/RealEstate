'use client'

import { useAuth } from '../../../lib/auth-context'
import ReferralSection from '@/components/User_Dashboard/ReferralSection'

export default function ReferralsPage() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // All users see the same referral section without layout wrapper
  // (ReferralSection is a full-page component with its own styling)
  return <ReferralSection />
}
