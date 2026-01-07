'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Loader from '@/components/ado/loader'

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

  return <>{children}</>
}
