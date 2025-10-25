'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Home, Users, TrendingUp, BarChart3, Settings, LogIn } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import { signOut, useSession } from 'next-auth/react'

const publicNavigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Ministers', href: '/#ministers', icon: Users },
  { name: 'Trending', href: '/#trending', icon: TrendingUp },
]

const adminNavigation = [
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Admin', href: '/admin', icon: Settings },
]

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const isAdmin = session?.user?.role === 'ADMIN'

  const isActive = (href: string) => {
    const currentPath = pathname || '';
    if (href === '/') {
      return currentPath === '/'
    }
    return currentPath.startsWith(href)
  }

  // Determine which navigation items to show
  const navigation = isAdmin ? [...publicNavigation, ...adminNavigation] : publicNavigation

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-lg sticky top-0 z-50 transition-all duration-300 border-b border-gray-200/50 dark:border-gray-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 sm:h-20">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center touch-manipulation">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">CS</span>
                </div>
                <span className="hidden sm:block text-lg lg:text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                  Citizen Satisfaction
                </span>
              </motion.div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <motion.div key={item.name} whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-2 px-3 lg:px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 touch-manipulation ${
                      isActive(item.href)
                        ? 'text-white bg-gradient-to-r from-green-600 to-emerald-600 shadow-lg shadow-green-500/30'
                        : 'text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden lg:inline">{item.name}</span>
                  </Link>
                </motion.div>
              )
            })}
            {/* Admin Sign Out Button */}
            {isAdmin && pathname?.startsWith('/admin') && (
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 border border-red-200 dark:border-red-700 hover:border-red-300 dark:hover:border-red-600 transition-all duration-200 touch-manipulation"
              >
                Sign Out
              </motion.button>
            )}
            
            {/* Hidden Admin Access - Only show when not authenticated */}
            {!session && (
              <motion.div 
                whileHover={{ y: -2 }} 
                whileTap={{ y: 0 }}
                className="opacity-0 hover:opacity-100 transition-opacity duration-300"
                title="Admin Access"
              >
                <Link
                  href="/admin-access"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-all duration-200"
                >
                  <Settings className="w-4 h-4" />
                </Link>
              </motion.div>
            )}
            <div className="ml-2">
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2.5 rounded-xl text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors touch-manipulation"
            >
              <motion.div
                animate={{ rotate: isOpen ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {isOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </motion.div>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation - Improved with glassmorphism */}
      <motion.div
        className={`md:hidden overflow-hidden ${isOpen ? 'block' : 'hidden'}`}
        initial={{ opacity: 0, height: 0 }}
        animate={{ 
          opacity: isOpen ? 1 : 0, 
          height: isOpen ? 'auto' : 0 
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="px-4 pt-2 pb-4 space-y-2 bg-gradient-to-b from-white/95 to-gray-50/95 dark:from-gray-900/95 dark:to-gray-800/95 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-700/50">
          {navigation.map((item, index) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.2 }}
              >
                <Link
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium transition-all duration-200 touch-manipulation ${
                    isActive(item.href)
                      ? 'text-white bg-gradient-to-r from-green-600 to-emerald-600 shadow-lg shadow-green-500/30'
                      : 'text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 active:scale-95'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span>{item.name}</span>
                </Link>
              </motion.div>
            )
          })}
          {/* Admin Sign Out Button for Mobile */}
          {isAdmin && pathname?.startsWith('/admin') && (
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: navigation.length * 0.05, duration: 0.2 }}
              onClick={() => { setIsOpen(false); signOut({ callbackUrl: '/' }) }}
              className="flex w-full items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 border-2 border-red-200 dark:border-red-700 hover:border-red-300 dark:hover:border-red-600 transition-all duration-200 mt-2 touch-manipulation"
            >
              Sign Out
            </motion.button>
          )}
          
          {/* Hidden Admin Access for Mobile - Only show when not authenticated */}
          {!session && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: (navigation.length + 1) * 0.05, duration: 0.2 }}
              className="opacity-50 hover:opacity-100 transition-opacity duration-300"
            >
              <Link
                href="/admin-access"
                onClick={() => setIsOpen(false)}
                className="flex w-full items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-all duration-200 mt-2"
              >
                <Settings className="w-5 h-5" />
                <span>Admin Access</span>
              </Link>
            </motion.div>
          )}
        </div>
      </motion.div>
    </nav>
  )
} 