'use client'

import { useAuth } from '../../../lib/auth-context'
import AdminDashboard from '@/components-legacy/Admin/Admin'

export default function ClientsPage() {
  const { user } = useAuth()
  const userRole = user?.role?.role || 'user'

  if (userRole === 'admin') {
    return <AdminDashboard />
  }

  return <div>Access denied. Admin only.</div>
}
