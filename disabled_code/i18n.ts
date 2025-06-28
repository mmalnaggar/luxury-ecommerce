import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import resourcesToBackend from 'i18next-resources-to-backend'

// Define available languages
export const languages = ['en', 'ar'] as const
export type Language = typeof languages[number]

// Default language
export const defaultLanguage: Language = 'en'

// Language display names
export const languageNames: Record<Language, string> = {
  en: 'English',
  ar: 'العربية'
}

// Language directions
export const languageDirections: Record<Language, 'ltr' | 'rtl'> = {
  en: 'ltr',
  ar: 'rtl'
}

i18n
  .use(
    resourcesToBackend((language: string, namespace: string) => 
      import(`../locales/${language}/${namespace}.json`)
    )
  )
  .use(initReactI18next)
  .init({
    lng: defaultLanguage,
    fallbackLng: defaultLanguage,
    supportedLngs: languages,
    
    // Namespaces
    defaultNS: 'common',
    ns: ['common', 'auth', 'dashboard', 'catalog', 'checkout', 'errors'],
    
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    
    react: {
      useSuspense: false,
    },
    
    debug: process.env.NODE_ENV === 'development',
  })

export default i18n 