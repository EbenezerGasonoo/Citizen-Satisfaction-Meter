'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Home, Users, TrendingUp, BarChart3, Shield } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import { signOut, useSession } from 'next-auth/react'

const publicNavigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Ministers', href: '/#ministers', icon: Users },
  { name: 'Trending', href: '/#trending', icon: TrendingUp },
]

const adminNavigation = [
  { name: 'Dashboard', href: '/admin', icon: BarChart3 },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
]

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { data: session, status } = useSession()
  // Only show admin nav when session is loaded AND user is admin
  const isAdmin = status === 'authenticated' && session?.user?.role === 'ADMIN'

  const isActive = (href: string) => {
    const currentPath = pathname || '';
    if (href === '/') {
      return currentPath === '/'
    }
    return currentPath.startsWith(href)
  }

  const navigation = isAdmin ? [...publicNavigation, ...adminNavigation] : publicNavigation

  return (
    <nav className="bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3 touch-manipulation">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center shadow-sm">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="hidden sm:block">
                  <span className="text-lg font-bold text-slate-900 dark:text-slate-50">
                    CSM
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 block -mt-1">
                    Citizen Satisfaction Meter
                  </span>
                </div>
              </motion.div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 touch-manipulation ${
                    active
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
            
            {/* Admin Sign Out */}
            {isAdmin && pathname?.startsWith('/admin') && (
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 border border-red-200 dark:border-red-800 transition-all duration-200 ml-2"
              >
                Sign Out
              </button>
            )}
            
            <div className="ml-2">
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none transition-colors touch-manipulation"
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
        className={`md:hidden overflow-hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 ${
          isOpen ? 'block' : 'hidden'
        }`}
        initial={{ opacity: 0, height: 0 }}
        animate={{ 
          opacity: isOpen ? 1 : 0, 
          height: isOpen ? 'auto' : 0 
        }}
        transition={{ duration: 0.2 }}
      >
        <div className="px-4 py-3 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 touch-manipulation ${
                  active
                    ? 'bg-primary text-white'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            )
          })}
          
          {/* Admin Sign Out for Mobile */}
          {isAdmin && pathname?.startsWith('/admin') && (
            <button
              onClick={() => {
                setIsOpen(false)
                signOut({ callbackUrl: '/' })
              }}
              className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 border border-red-200 dark:border-red-800 transition-all duration-200 mt-2"
            >
              Sign Out
            </button>
          )}
        </div>
      </motion.div>
    </nav>
  )
}
