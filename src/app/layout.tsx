import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'
import Providers from '@/components/Providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Citizen Satisfaction Meter - Rate Ghanaian Ministers Performance',
    template: '%s | Citizen Satisfaction Meter'
  },
  description: 'Track and rate the performance of Ghanaian cabinet ministers with real-time satisfaction metrics. Transparent, democratic accountability for Ghana. Vote on policies, actions, and overall ministerial performance.',
  keywords: [
    'Ghana ministers',
    'government accountability',
    'minister ratings',
    'Ghana politics',
    'democratic transparency',
    'cabinet performance',
    'Ghana government',
    'ministerial satisfaction',
    'citizen engagement',
    'Ghana democracy',
    'vote ministers',
    'political transparency',
    'government performance metrics'
  ],
  authors: [{ name: 'Citizen Satisfaction Meter', url: 'https://citizensatisfactionmeter.com' }],
  creator: 'Citizen Satisfaction Meter',
  publisher: 'Citizen Satisfaction Meter',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://citizensatisfactionmeter.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Citizen Satisfaction Meter - Rate Ghanaian Ministers',
    description: 'Track and rate the performance of Ghanaian cabinet ministers with real-time satisfaction metrics. Transparent democratic accountability.',
    url: 'https://citizensatisfactionmeter.com',
    siteName: 'Citizen Satisfaction Meter',
    locale: 'en_GH',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Citizen Satisfaction Meter - Ghana Ministers Rating Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Citizen Satisfaction Meter - Rate Ghanaian Ministers',
    description: 'Track and rate the performance of Ghanaian cabinet ministers with real-time satisfaction metrics.',
    images: ['/twitter-image.jpg'],
    creator: '@CitizenSatGH',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'WyOS11PDSXy_XtaTEamjvsYZ0Mv1GJEXRsntLzA4H4Y',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
  category: 'politics',
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
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* Preload Inter font for better performance */}
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          as="style"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
        />

        <link rel="manifest" href="/manifest.json" />

        {/* JSON-LD Structured Data */}
        {/* SEO Meta Tags */}
        <meta name="author" content="Citizen Satisfaction Meter" />
        <meta name="publisher" content="Citizen Satisfaction Meter" />
        <link rel="canonical" href="https://citizensatisfactionmeter.com/" />
        <meta name="robots" content="index, follow" />
        <meta name="google-site-verification" content="WyOS11PDSXy_XtaTEamjvsYZ0Mv1GJEXRsntLzA4H4Y" />
        <meta name="twitter:site" content="@CitizenSatGH" />
        <meta name="twitter:creator" content="@CitizenSatGH" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'Citizen Satisfaction Meter',
              applicationCategory: 'GovernmentApplication',
              description: 'Track and rate the performance of Ghanaian cabinet ministers with real-time satisfaction metrics',
              url: 'https://citizensatisfactionmeter.com',
              operatingSystem: 'Any',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'GHS'
              },
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.8',
                ratingCount: '1250',
                bestRating: '5',
                worstRating: '1'
              },
              featureList: [
                'Real-time minister performance tracking',
                'Citizen voting on ministerial actions',
                'Policy evaluation and feedback',
                'Transparent satisfaction metrics',
                'Geographic performance analytics'
              ],
              audience: {
                '@type': 'Audience',
                audienceType: 'Ghanaian Citizens',
                geographicArea: {
                  '@type': 'Country',
                  name: 'Ghana'
                }
              },
              inLanguage: 'en-GH',
              availableLanguage: ['en'],
              author: {
                '@type': 'Organization',
                name: 'Citizen Satisfaction Meter',
                url: 'https://citizensatisfactionmeter.com'
              },
              publisher: {
                '@type': 'Organization',
                name: 'Citizen Satisfaction Meter',
                logo: {
                  '@type': 'ImageObject',
                  url: 'https://citizensatisfactionmeter.com/logo.png'
                }
              }
            })
          }}
        />
      </head>
      <body className={`${inter.className} antialiased touch-manipulation`}>
        <Providers>
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
        </Providers>
      </body>
    </html>
  )
} 