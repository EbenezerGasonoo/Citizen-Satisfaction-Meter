import NextAuth from 'next-auth'
import { authOptions } from './authOptions'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import { compare } from 'bcryptjs'
import type { Session, User } from 'next-auth'
import type { JWT } from 'next-auth/jwt'

// Module augmentation for next-auth types
import NextAuthDefault from 'next-auth'
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      role: string
      name?: string | null
      image?: string | null
    }
  }
  interface User {
    role: string
  }
}
declare module 'next-auth/jwt' {
  interface JWT {
    role?: string
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST } 