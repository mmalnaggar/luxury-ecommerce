import { NextResponse } from 'next/server'

// Temporary placeholder - database features disabled
export async function GET() {
  return NextResponse.json({ 
    message: 'Cart API temporarily disabled - database not connected',
    items: [], 
    total: 0 
  })
}

export async function DELETE() {
  return NextResponse.json({ 
    message: 'Cart API temporarily disabled - database not connected',
    success: false 
  })
} 