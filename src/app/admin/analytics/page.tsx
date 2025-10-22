import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'
import { redirect } from 'next/navigation'
import AdminAnalyticsClient from './AdminAnalyticsClient'

export default async function AdminAnalyticsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/signin')
  }
  
  if ((session.user as any).role !== 'ADMIN') {
    return <div className="p-8 text-center text-red-600">Unauthorized: Admins only.</div>
  }

  return <AdminAnalyticsClient />
}