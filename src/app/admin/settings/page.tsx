import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'
import { redirect } from 'next/navigation'
import dynamic from 'next/dynamic'

const AdminSettings = dynamic(() => import('@/components/AdminSettings'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cocoa-green"></div>
    </div>
  )
})

export default async function AdminSettingsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/signin')
  }
  
  if ((session.user as any).role !== 'ADMIN') {
    return <div className="p-8 text-center text-red-600">Unauthorized: Admins only.</div>
  }

  return <AdminSettings />
}