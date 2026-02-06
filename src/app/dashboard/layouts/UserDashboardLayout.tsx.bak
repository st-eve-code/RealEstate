'use client'

import Sidebar from '@/components/Sidebar'
import MainContent from '@/components/MainContent'
import { useState } from 'react'

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  return (
    <div className="min-h-screen bg-gray-100/30 block md:flex">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={toggleSidebar}
      />
      <MainContent isSidebarCollapsed={isSidebarCollapsed}>
        {children}
      </MainContent>
    </div>
  )
}
