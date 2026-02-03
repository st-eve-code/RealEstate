'use client'

import { useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'

export default function TawkToChat() {
  const { user } = useAuth()
  useEffect(() => {
    // Tawk.to widget script
    // You'll need to replace PROPERTY_ID and WIDGET_ID with your actual Tawk.to credentials
    // Sign up at https://www.tawk.to/ to get your IDs
    
    const script = document.createElement('script')
    script.async = true
    script.src = 'https://embed.tawk.to/697491ce194607197bccf727/1jfnlj49t'
    script.charset = 'UTF-8'
    script.setAttribute('crossorigin', '*')
    
    // Add script to document
    document.body.appendChild(script)
    
    // Optional: Customize Tawk.to widget
    script.onload = () => {
      if (window.Tawk_API) {
        // Set custom attributes for tracking
        window.Tawk_API.onLoad = function() {
          console.log('Tawk.to chat loaded successfully')
          
          // Set visitor information only if user is logged in
          if (user && user.email) {
            window.Tawk_API.setAttributes({
              name: user.displayName || 'User',
              email: user.email,
            }, function(error: any) {
              if (error) {
                console.error('Tawk.to error:', error)
              }
            })
          }
        }
      }
    }
    
    // Cleanup
    return () => {
      // Remove script when component unmounts
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
      
      // Remove Tawk.to widget
      const tawkWidget = document.getElementById('tawk-bubble')
      if (tawkWidget) {
        tawkWidget.remove()
      }
    }
  }, [user])

  return null // This component doesn't render anything
}

// TypeScript declarations for Tawk.to
declare global {
  interface Window {
    Tawk_API?: any
    Tawk_LoadStart?: Date
  }
}
