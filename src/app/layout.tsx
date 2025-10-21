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
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
        <meta name="theme-color" content="#10b981" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className={`${inter.className} antialiased touch-manipulation`}>
        <ThemeProvider>
          <Navigation />
          {children}
          <footer className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 border-t border-gray-200 dark:border-gray-800 py-12 transition-colors duration-300">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-5xl mx-auto text-center space-y-8">
                {/* Action Buttons - Enhanced Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                  {/* Suggestion Button */}
                  <a 
                    href="/suggest" 
                    className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all font-bold text-base touch-manipulation"
                  >
                    <span className="text-xl group-hover:scale-110 transition-transform">💡</span>
                    <span>Got a suggestion?</span>
                  </a>

                  {/* Bug Report Button */}
                  <a 
                    href="/suggest?type=bug" 
                    className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-6 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all font-bold text-base touch-manipulation"
                  >
                    <span className="text-xl group-hover:scale-110 transition-transform">🐛</span>
                    <span>Found a bug?</span>
                  </a>

                  {/* Nominate Minister Button */}
                  <a 
                    href="/suggest?type=nominate" 
                    className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all font-bold text-base touch-manipulation"
                  >
                    <span className="text-xl group-hover:scale-110 transition-transform">🎯</span>
                    <span>Nominate a minister</span>
                  </a>
                </div>

                {/* Footer Text */}
                <div className="space-y-3 pt-4">
                  <p className="text-gray-700 dark:text-gray-300 font-semibold text-base sm:text-lg">
                    © 2025 Citizen Satisfaction Meter
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                    Empowering citizens to hold government accountable.
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    Built with transparency and democracy in mind. 🇬🇭
                  </p>
                </div>

                {/* Social Links or Additional Info */}
                <div className="flex justify-center gap-6 pt-2">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span>Live & Transparent</span>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  )
} 