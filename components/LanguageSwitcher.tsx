'use client'

import { useState } from 'react'
import { ChevronDown, Globe } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '@/lib/language-context'
import { languages, languageNames } from '@/lib/i18n'

interface LanguageSwitcherProps {
  variant?: 'header' | 'footer' | 'dropdown'
  className?: string
}

export default function LanguageSwitcher({ 
  variant = 'dropdown', 
  className = '' 
}: LanguageSwitcherProps) {
  const { t } = useTranslation()
  const { language, setLanguage, isRTL } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  
  if (variant === 'header') {
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:text-blue-600 transition-colors ${
            isRTL ? 'space-x-reverse' : ''
          }`}
        >
          <Globe size={16} />
          <span>{languageNames[language]}</span>
          <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setIsOpen(false)}
            />
            <div className={`absolute top-full z-20 mt-1 bg-white border border-gray-200 rounded-md shadow-lg min-w-32 ${
              isRTL ? 'left-0' : 'right-0'
            }`}>
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => {
                    setLanguage(lang)
                    setIsOpen(false)
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                    language === lang ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                  } ${isRTL ? 'text-right' : 'text-left'}`}
                >
                  {languageNames[lang]}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    )
  }
  
  if (variant === 'footer') {
    return (
      <div className={`flex items-center space-x-4 ${className} ${isRTL ? 'space-x-reverse' : ''}`}>
        <span className="text-sm text-gray-600">{t('language.select')}:</span>
        <div className="flex space-x-2">
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`text-sm px-2 py-1 rounded transition-colors ${
                language === lang 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              {languageNames[lang]}
            </button>
          ))}
        </div>
      </div>
    )
  }
  
  // Default dropdown variant
  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md bg-white text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          isRTL ? 'space-x-reverse' : ''
        }`}
      >
        <Globe size={16} />
        <span>{languageNames[language]}</span>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className={`absolute top-full z-20 mt-1 bg-white border border-gray-200 rounded-md shadow-lg min-w-full ${
            isRTL ? 'left-0' : 'right-0'
          }`}>
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => {
                  setLanguage(lang)
                  setIsOpen(false)
                }}
                className={`w-full px-4 py-2 text-sm hover:bg-gray-50 ${
                  language === lang ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                } ${isRTL ? 'text-right' : 'text-left'}`}
              >
                {languageNames[lang]}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
} 