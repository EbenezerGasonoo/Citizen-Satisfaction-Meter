import { initTRPC } from '@trpc/server'
import { type CreateNextContextOptions } from '@trpc/server/adapters/next'
import { prisma } from './prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export const createContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts
  const session = await getServerSession(req, res, authOptions)

  return {
    prisma,
    session,
    req,
    res,
  }
}

const t = initTRPC.context<typeof createContext>().create()

export const router = t.router
export const publicProcedure = t.procedure

export const protectedProcedure = t.procedure.use(
  t.middleware(({ ctx, next }) => {
    if (!ctx.session?.user) {
      throw new Error('Not authenticated')
    }
    return next({
      ctx: {
        ...ctx,
        session: ctx.session,
      },
    })
  })
)

export const adminProcedure = t.procedure.use(
  t.middleware(({ ctx, next }) => {
    if (!ctx.session?.user || ctx.session.user.role !== 'ADMIN') {
      throw new Error('Not authorized')
    }
    return next({
      ctx: {
        ...ctx,
        session: ctx.session,
      },
    })
  })
) 