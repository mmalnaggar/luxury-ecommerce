import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Egyptian E-commerce Platform API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    features: {
      database: 'disabled',
      authentication: 'disabled',
      payments: 'disabled'
    }
  })
} 