'use client'

import { useAuth } from '@/lib/auth-context'
import EditProperty from '@/pages/Caretaker/EditProperty'
import CaretakerDashboardLayout from '../../layouts/CaretakerDashboardLayout'

export default function EditPropertyPage() {
  const { user } = useAuth()

  // Only for landlords/caretakers
  if (user?.role?.role !== 'landlord') {
    return null
  }

  return (
    <CaretakerDashboardLayout>
      <EditProperty />
    </CaretakerDashboardLayout>
  )
}
