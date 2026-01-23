'use client'

import { useAuth } from '../../../lib/auth-context'
import Profile from '@/components/User_Dashboard/Profile'
import Loader from '../../../components/ado/loader'

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

  // Profile is same for all roles, layout applied by dashboard/layout.tsx
  return <Profile user={user} />
}
