'use client'

import React, { createContext, useContext, useState } from 'react'

type Language = 'en' | 'ar'

interface Translations {
  [key: string]: {
    [key: string]: string
  }
}

const translations: Translations = {
  en: {
    'nav.home': 'Home',
    'nav.products': 'Products',
    'nav.admin': 'Admin',
    'nav.reviews': 'Reviews',
    'nav.cart': 'Cart',
    'nav.signIn': 'Sign In',
    'nav.signOut': 'Sign Out',
  },
  ar: {
    'nav.home': 'الرئيسية',
    'nav.products': 'المنتجات',
    'nav.admin': 'المدير',
    'nav.reviews': 'المراجعات',
    'nav.cart': 'السلة',
    'nav.signIn': 'تسجيل الدخول',
    'nav.signOut': 'تسجيل الخروج',
  },
}

export interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  isRTL: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en')

  const t = (key: string): string => {
    return translations[language][key] || key
  }

  // Arabic is RTL, all other languages are LTR
  const isRTL = language === 'ar'

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
} 