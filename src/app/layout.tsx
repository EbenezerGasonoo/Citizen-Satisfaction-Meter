import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Who is working? Know your Ministers - Ghana Minister Performance Rating',
  description: 'Rate the performance of Ghanaian cabinet ministers and see live satisfaction metrics',
  keywords: 'Ghana, ministers, voting, satisfaction, performance, government',
  authors: [{ name: 'Who is working? Know your Ministers Team' }],
  openGraph: {
    title: 'Who is working? Know your Ministers',
    description: 'Rate the performance of Ghanaian cabinet ministers',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Who is working? Know your Ministers',
    description: 'Rate the performance of Ghanaian cabinet ministers',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-cocoa-green/5">
          {children}
        </div>
      </body>
    </html>
  )
} 