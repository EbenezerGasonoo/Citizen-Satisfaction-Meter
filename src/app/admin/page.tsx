import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'
import { redirect } from 'next/navigation'
import React from 'react'
import { prisma } from '@/lib/prisma'
import AdminDashboardClient from './AdminDashboardClient'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/auth/signin')
  }
  if ((session.user as any).role !== 'ADMIN') {
    return <div className="p-8 text-center text-red-600 font-semibold">Unauthorized: Admins only.</div>
  }

  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)

  // Fetch all core admin telemetry in parallel
  const [
    ministers,
    totalVotes,
    votesToday,
    positiveVotes,
    totalActions,
    actionsWithSource,
    pendingSubmissions,
    stagedMinisters,
    activePolicies,
    recentVotesRaw,
    recentSubmissionsRaw
  ] = await Promise.all([
    prisma.minister.findMany({
      select: {
        id: true,
        fullName: true,
        portfolio: true,
        photoUrl: true,
        isTrending: true,
        votes: {
          select: { positive: true }
        }
      }
    }),
    prisma.vote.count(),
    prisma.vote.count({
      where: {
        createdAt: { gte: yesterday }
      }
    }),
    prisma.vote.count({
      where: { positive: true }
    }),
    prisma.action.count(),
    prisma.action.count({
      where: { sourceUrl: { not: null } }
    }),
    prisma.submission.count({
      where: { status: 'pending' }
    }),
    prisma.stagedMinister.count({
      where: { status: 'PENDING' }
    }),
    prisma.policy.count(),
    prisma.vote.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        positive: true,
        createdAt: true,
        minister: {
          select: {
            id: true,
            fullName: true,
            portfolio: true,
            photoUrl: true
          }
        }
      }
    }),
    prisma.submission.findMany({
      take: 4,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        type: true,
        message: true,
        status: true,
        createdAt: true
      }
    })
  ])

  // Calculate satisfaction rates for each minister
  const ministerStats = ministers.map((m) => {
    const total = m.votes.length
    const positive = m.votes.filter((v) => v.positive).length
    const satisfactionRate = total > 0 ? Math.round((positive / total) * 100) : 50
    return {
      id: m.id,
      fullName: m.fullName,
      portfolio: m.portfolio,
      photoUrl: m.photoUrl,
      isTrending: m.isTrending,
      totalVotes: total,
      positiveVotes: positive,
      satisfactionRate
    }
  })

  // Sort by satisfaction rate & vote confidence
  const sortedMinisters = [...ministerStats].sort((a, b) => {
    if (b.satisfactionRate !== a.satisfactionRate) {
      return b.satisfactionRate - a.satisfactionRate
    }
    return b.totalVotes - a.totalVotes
  })

  const topMinisters = sortedMinisters.slice(0, 3)
  const scrutinyMinisters = [...sortedMinisters].reverse().slice(0, 3)

  const satisfactionRate = totalVotes > 0 ? Math.round((positiveVotes / totalVotes) * 100) : 0

  const metrics = {
    totalMinisters: ministers.length,
    totalVotes,
    votesToday,
    satisfactionRate,
    totalActions,
    actionsWithSource,
    pendingSubmissions,
    stagedMinisters,
    trendingMinisters: ministers.filter((m) => m.isTrending).length,
    activePolicies
  }

  // Serialize dates for client boundary
  const recentVotes = recentVotesRaw.map((v) => ({
    id: v.id,
    positive: v.positive,
    createdAt: v.createdAt.toISOString(),
    minister: v.minister
  }))

  const recentSubmissions = recentSubmissionsRaw.map((s) => ({
    id: s.id,
    type: s.type,
    message: s.message,
    status: s.status,
    createdAt: s.createdAt.toISOString()
  }))

  return (
    <main className="min-h-screen bg-slate-50/60 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <AdminDashboardClient
          metrics={metrics}
          topMinisters={topMinisters}
          scrutinyMinisters={scrutinyMinisters}
          recentVotes={recentVotes}
          recentSubmissions={recentSubmissions}
          adminEmail={session.user?.email}
        />
      </div>
    </main>
  )
}