'use client'

import { useAuth } from '../../../../lib/auth-context'
import PropertyDetails from '@/components-legacy/Caretaker/PropertyDetails'
import UnitDetails from '@/components-legacy/Admin/Components/Property/UnitDetails'
import Sidebar from '@/components-legacy/Admin/Components/Sidebar'
import { useState, use, Suspense } from 'react'
import Loader from '../../../../components/ado/loader'

function PropertyDetailsContent({ params }: { params: Promise<{ id: string }> }) {
  const { user } = useAuth()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const { id: propertyId } = use(params)
  const userRole = user?.role?.role || 'user'

  // Admin view
  if (userRole === 'admin') {
    return (
      <section className="admin-section bg-gray-100 min-h-screen flex flex-col md:flex-row justify-start gap-2">
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
          activeView="properties"
        />
        <UnitDetails unitId={propertyId} isSidebarCollapsed={isSidebarCollapsed} />
      </section>
    )
  }

  // Landlord view
  if (userRole === 'landlord') {
    return <PropertyDetails />
  }

  return <div>Access denied.</div>
}

export default function PropertyDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={
      <div className='absolute top-0 left-0 w-screen h-screen'>
        <Loader style='dot-121' />
      </div>
    }>
      <PropertyDetailsContent params={params} />
    </Suspense>
  )
}
