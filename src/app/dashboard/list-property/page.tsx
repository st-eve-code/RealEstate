'use client'

import { useAuth } from '../../../lib/auth-context'
import ListProperty from '@/pages-components/Caretaker/ListProperty'

export default function ListPropertyPage() {
  const { user } = useAuth()

  // Only for landlords/caretakers
  if (user?.role?.role !== 'landlord') {
    return null
  }

  return <ListProperty />
}
