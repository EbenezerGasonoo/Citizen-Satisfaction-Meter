'use client'

import { motion } from 'framer-motion'
import { Suspense } from 'react'
import NationalMeter from '@/components/NationalMeter'
import TrendingGrid from '@/components/TrendingGrid'
import MinisterDirectory from '@/components/MinisterDirectory'
import VoteNotification from '@/components/VoteNotification'
import { Sparkles, TrendingUp, Users } from 'lucide-react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.2
    }
  }
}

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
}

const titleVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
}

export default function Home() {
  return (
    <>
      <motion.div
        className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Section with modern design */}
        <motion.div 
          className="relative overflow-hidden"
          variants={titleVariants}
        >
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-30"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 90, 0],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            <motion.div
              className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 dark:bg-blue-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-30"
              animate={{
                scale: [1, 1.3, 1],
                rotate: [0, -90, 0],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 relative z-10">
            <motion.header 
              className="text-center mb-8 sm:mb-12"
              variants={titleVariants}
            >
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Sparkles className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Transparency in Action
                </span>
              </motion.div>

              <motion.h1 
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-6 leading-tight"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                  Who is working?
                </span>
                <br />
                <span className="text-gray-800 dark:text-gray-100">
                  Know your Ministers
                </span>
              </motion.h1>

              <motion.p 
                className="text-lg sm:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed px-4"
                variants={sectionVariants}
              >
                Rate the performance of Ghanaian cabinet ministers and see live satisfaction metrics. 
                Your voice matters in building a better Ghana.
              </motion.p>

              {/* Stats row */}
              <motion.div 
                className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-3xl mx-auto"
                variants={containerVariants}
              >
                {[
                  { icon: Users, label: 'Ministers', value: '30+' },
                  { icon: TrendingUp, label: 'Active Voters', value: '1000+' },
                  { icon: Sparkles, label: 'Transparency', value: '100%' }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow"
                    variants={sectionVariants}
                    whileHover={{ y: -5 }}
                  >
                    <stat.icon className="w-8 h-8 mx-auto mb-2 text-purple-600 dark:text-purple-400" />
                    <div className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.header>
          </div>
        </motion.div>

        {/* Main content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-16 sm:space-y-20">
          <motion.section 
            id="national-meter"
            className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-3xl p-6 sm:p-8 lg:p-12 shadow-xl"
            variants={sectionVariants}
          >
            <NationalMeter />
          </motion.section>

          <motion.section 
            id="trending"
            className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-3xl p-6 sm:p-8 lg:p-12 shadow-xl"
            variants={sectionVariants}
          >
            <TrendingGrid />
          </motion.section>

          <motion.section 
            id="ministers"
            className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-3xl p-6 sm:p-8 lg:p-12 shadow-xl"
            variants={sectionVariants}
          >
            <MinisterDirectory />
          </motion.section>
        </div>
      </motion.div>
      <VoteNotification />
    </>
  )
} 