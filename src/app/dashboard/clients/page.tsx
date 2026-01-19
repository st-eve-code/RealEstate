'use client'

import { useAuth } from '@/lib/auth-context'
import Loader from '@/components/ado/loader'
import AdminDashboard from '@/pages/Admin/Admin'

export default function ClientsPage() {
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

  if (userRole === 'admin') {
    return <AdminDashboard />
  }

  return <div>Access denied. Admin only.</div>
}
