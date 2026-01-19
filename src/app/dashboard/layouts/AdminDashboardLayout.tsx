'use client'

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Admin layout - you can customize this
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  )
}
