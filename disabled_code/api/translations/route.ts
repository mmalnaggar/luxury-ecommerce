import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import fs from 'fs'
import path from 'path'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Check permissions
    if (session.user.role !== 'BRAND' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    
    const { searchParams } = new URL(request.url)
    const language = searchParams.get('language') || 'en'
    const namespace = searchParams.get('namespace') || 'common'
    
    const validLanguages = ['en', 'ar']
    const validNamespaces = ['common', 'auth', 'dashboard', 'catalog', 'checkout', 'errors']
    
    if (!validLanguages.includes(language) || !validNamespaces.includes(namespace)) {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 })
    }
    
    const filePath = path.join(process.cwd(), 'locales', language, `${namespace}.json`)
    const fileContent = fs.readFileSync(filePath, 'utf8')
    const translations = JSON.parse(fileContent)
    
    return NextResponse.json({ language, namespace, translations })
  } catch (error) {
    console.error('Error fetching translations:', error)
    return NextResponse.json({ error: 'Failed to fetch translations' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { language, namespace, translations } = await request.json()
    
    const validLanguages = ['en', 'ar']
    const validNamespaces = ['common', 'auth', 'dashboard', 'catalog', 'checkout', 'errors']
    
    if (!validLanguages.includes(language) || !validNamespaces.includes(namespace)) {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 })
    }
    
    const filePath = path.join(process.cwd(), 'locales', language, `${namespace}.json`)
    fs.writeFileSync(filePath, JSON.stringify(translations, null, 2), 'utf8')
    
    return NextResponse.json({ success: true, language, namespace })
  } catch (error) {
    console.error('Error updating translations:', error)
    return NextResponse.json({ error: 'Failed to update translations' }, { status: 500 })
  }
} 