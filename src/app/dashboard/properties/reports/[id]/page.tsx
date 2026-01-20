'use client'

import { useAuth } from '../../../../../lib/auth-context'
import Loader from '../../../../../components/ado/loader'
import UnitReports from '@/components-legacy/Admin/Components/Property/UnitReports'
import { useState, use, Suspense } from 'react'
import Sidebar from '@/components-legacy/Admin/Components/Sidebar'

function PropertyReportsContent({ params }: { params: Promise<{ id: string }> }) {
  const { user } = useAuth()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const { id } = use(params)
  const userRole = user?.role?.role || 'user'

  if (userRole === 'admin') {
    return (
      <section className="admin-section bg-gray-100 min-h-screen flex flex-col md:flex-row justify-start gap-2">
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
          activeView="properties"
        />
        <UnitReports unitID={id} isSidebarCollapsed={isSidebarCollapsed} />
      </section>
    )
  }

  return <div>Access denied. Admin only.</div>
}

export default function PropertyReportsPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={
      <div className='absolute top-0 left-0 w-screen h-screen'>
        <Loader style='dot-121' />
      </div>
    }>
      <PropertyReportsContent params={params} />
    </Suspense>
  )
}
