'use client'

import { useAuth } from '../../../lib/auth-context'
import Store from '@/components/User_Dashboard/Store'

export default function StorePage() {
  const { user } = useAuth()

  // Only for regular users
  if (user?.role?.role !== 'user') {
    return null
  }

  return <Store sidebar={null} />
}
