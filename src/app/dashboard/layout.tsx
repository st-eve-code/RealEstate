'use client'

import { useAuth } from '../../lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Loader from '../../components/ado/loader'
import AdminDashboardLayout from './layouts/AdminDashboardLayout'
import CaretakerDashboardLayout from './layouts/CaretakerDashboardLayout'
import UserDashboardLayout from './layouts/UserDashboardLayout'
import TawkToChat from '../../components/TawkToChat'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, firebaseUser, loadingUser } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loadingUser && !firebaseUser) {
      router.push('/login')
    }
  }, [loadingUser, firebaseUser, router])

  if (loadingUser) {
    return (
      <div className="absolute top-0 left-0 w-screen h-screen">
        <Loader style='factory-stack' />
      </div>
    )
  }

  if (!firebaseUser) {
    return null
  }

  if (!user) {
    return (
      <div className='absolute top-0 left-0 w-screen h-screen'>
        <Loader style='dot-121' />
      </div>
    )
  }

  const userRole = user?.role?.role || 'user'

  // Apply role-based layouts
  if (userRole === 'admin') {
    return (
      <>
        <AdminDashboardLayout>{children}</AdminDashboardLayout>
        <TawkToChat />
      </>
    )
  }

  if (userRole === 'landlord') {
    return (
      <>
        <CaretakerDashboardLayout>{children}</CaretakerDashboardLayout>
        <TawkToChat />
      </>
    )
  }

  // Default to user layout
  return (
    <>
      <UserDashboardLayout>{children}</UserDashboardLayout>
      <TawkToChat />
    </>
  )
}
