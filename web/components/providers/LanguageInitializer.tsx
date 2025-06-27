'use client'

import { useEffect } from 'react'
import '@/lib/i18n' // Initialize i18n

interface LanguageInitializerProps {
  children: React.ReactNode
}

export default function LanguageInitializer({ children }: LanguageInitializerProps) {
  useEffect(() => {
    // Add Google Fonts for Arabic support
    const link = document.createElement('link')
    link.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap'
    link.rel = 'stylesheet'
    document.head.appendChild(link)
    
    return () => {
      // Cleanup on unmount
      if (document.head.contains(link)) {
        document.head.removeChild(link)
      }
    }
  }, [])
  
  return <>{children}</>
} 