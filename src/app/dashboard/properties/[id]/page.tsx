'use client'

import { useAuth } from '@/lib/auth-context'
import PropertyDetails from '@/pages/Caretaker/PropertyDetails'
import CaretakerDashboardLayout from '../../layouts/CaretakerDashboardLayout'

export default function PropertyDetailsPage() {
  const { user } = useAuth()

  // Only for landlords/caretakers
  if (user?.role?.role !== 'landlord') {
    return null
  }

  return (
    <CaretakerDashboardLayout>
      <PropertyDetails />
    </CaretakerDashboardLayout>
  )
}
