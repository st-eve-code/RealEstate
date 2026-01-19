'use client'

import { useAuth } from '@/lib/auth-context'
import { MessagesPage } from '@/components/Messaging'

export default function Messages() {
  const { user } = useAuth()

  // Only for landlords/caretakers
  if (user?.role?.role !== 'landlord') {
    return null
  }

  return <MessagesPage />
}
