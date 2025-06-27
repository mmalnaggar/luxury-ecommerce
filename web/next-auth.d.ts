import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface User {
    role?: string
  }
  
  interface Session extends DefaultSession {
    user: {
      id: string
      role: string
      // Other properties from DefaultSession.user
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
  }
} 