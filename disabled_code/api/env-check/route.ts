export async function GET() {
  const envStatus = {
    NODE_ENV: process.env.NODE_ENV || 'undefined',
    hasDatabase: !!process.env.DATABASE_URL,
    hasNextAuth: !!process.env.NEXTAUTH_SECRET,
    hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
    timestamp: new Date().toISOString()
  }
  
  return Response.json({
    status: 'ok',
    message: 'Environment check API working',
    environment: envStatus
  })
} 