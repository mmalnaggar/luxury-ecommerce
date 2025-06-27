import 'next-auth'
import { Role } from '@prisma/client'

declare module 'next-auth' {
  interface User {
    role?: Role
  }

  interface Session {
    user?: {
      id?: string
      name?: string | null
      email?: string | null
      image?: string | null
      role?: Role
    }
  }
} 