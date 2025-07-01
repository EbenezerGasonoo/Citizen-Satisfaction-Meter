'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Home, Users, TrendingUp, BarChart3, Settings } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import { signOut } from 'next-auth/react'

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Ministers', href: '/#ministers', icon: Users },
  { name: 'Trending', href: '/#trending', icon: TrendingUp },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Admin', href: '/admin', icon: Settings },
]

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string) => {
    const currentPath = pathname || '';
    if (href === '/') {
      return currentPath === '/'
    }
    return currentPath.startsWith(href)
  }

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-lg sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-2xl font-bold text-cocoa-green dark:text-green-400"
              >
                Citizen Satisfaction Meter
              </motion.div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'text-cocoa-green dark:text-green-400 bg-green-50 dark:bg-green-900/20'
                      : 'text-gray-600 dark:text-gray-300 hover:text-cocoa-green dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.name}
                </Link>
              )
            })}
            {pathname?.startsWith('/admin') && (
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 border border-transparent hover:border-red-200 dark:hover:border-red-700 transition-colors"
              >
                Sign Out
              </button>
            )}
            <ThemeToggle />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-cocoa-green dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cocoa-green"
            >
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <motion.div
        className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}
        initial={{ opacity: 0, height: 0 }}
        animate={{ 
          opacity: isOpen ? 1 : 0, 
          height: isOpen ? 'auto' : 0 
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
          {navigation.map((item, index) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive(item.href)
                      ? 'text-cocoa-green dark:text-green-400 bg-green-50 dark:bg-green-900/20'
                      : 'text-gray-600 dark:text-gray-300 hover:text-cocoa-green dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              </motion.div>
            )
          })}
          {pathname?.startsWith('/admin') && (
            <button
              onClick={() => { setIsOpen(false); signOut({ callbackUrl: '/' }) }}
              className="flex w-full items-center px-3 py-2 rounded-md text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 border border-transparent hover:border-red-200 dark:hover:border-red-700 transition-colors mt-2"
            >
              Sign Out
            </button>
          )}
        </div>
      </motion.div>
    </nav>
  )
} 