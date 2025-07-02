import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'
import { ThemeProvider } from '@/components/ThemeProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Citizen Satisfaction Meter - Rate Ghanaian Ministers',
  description: 'Rate the performance of Ghanaian cabinet ministers and see live satisfaction metrics. Know who is working for the people.',
  keywords: 'Ghana, ministers, satisfaction, voting, government, performance, democracy',
  authors: [{ name: 'Citizen Satisfaction Meter' }],
  openGraph: {
    title: 'Citizen Satisfaction Meter',
    description: 'Rate the performance of Ghanaian cabinet ministers and see live satisfaction metrics',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Citizen Satisfaction Meter',
    description: 'Rate the performance of Ghanaian cabinet ministers and see live satisfaction metrics',
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
        <ThemeProvider>
          <Navigation />
          <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
            {children}
          </main>
          <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 py-8 transition-colors duration-300">
            <div className="container mx-auto px-4 text-center">
              {/* Suggestion Box Button */}
              <div className="max-w-md mx-auto mb-6">
                <a href="/suggest" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition-colors font-semibold">
                  Got a suggestion?
                </a>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                © 2024 Citizen Satisfaction Meter. Empowering citizens to hold government accountable.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Built with transparency and democracy in mind.
              </p>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  )
} 