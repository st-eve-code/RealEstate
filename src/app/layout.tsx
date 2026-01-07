import type { Metadata } from 'next'
import '../index.css'
import { UserProvider } from '@/components/UserContext'
import { AuthProvider } from '@/lib/auth-context'
import { MessagingProvider } from '@/components/Messaging'

export const metadata: Metadata = {
  title: 'Real Estate Platform',
  description: 'Real estate property management platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          <AuthProvider>
            <MessagingProvider>
              {children}
            </MessagingProvider>
          </AuthProvider>
        </UserProvider>
      </body>
    </html>
  )
}
