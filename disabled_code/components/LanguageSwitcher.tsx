'use client'

import React from 'react'
import { useLanguage } from '@/lib/language-context'

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => setLanguage('en')}
        className={`px-2 py-1 rounded ${
          language === 'en'
            ? 'bg-blue-100 text-blue-800'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('ar')}
        className={`px-2 py-1 rounded ${
          language === 'ar'
            ? 'bg-blue-100 text-blue-800'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        عربي
      </button>
    </div>
  )
} 