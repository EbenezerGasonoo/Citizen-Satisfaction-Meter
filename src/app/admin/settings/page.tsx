import dynamic from 'next/dynamic'

const AdminSettings = dynamic(() => import('@/components/AdminSettings'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cocoa-green"></div>
    </div>
  )
})

export default AdminSettings