'use client'

import { motion } from 'framer-motion'
import { Suspense } from 'react'
import NationalMeter from '@/components/NationalMeter'
import TrendingGrid from '@/components/TrendingGrid'
import MinisterDirectory from '@/components/MinisterDirectory'
import VoteNotification from '@/components/VoteNotification'
import { BarChart3, Users, Shield, TrendingUp } from 'lucide-react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.4,
      staggerChildren: 0.1
    }
  }
}

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
}

export default function Home() {
  return (
    <>
      <motion.div
        className="min-h-screen bg-slate-50 dark:bg-slate-950"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Professional Hero Section */}
        <motion.section 
          className="relative bg-gradient-to-b from-white via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 border-b border-slate-200 dark:border-slate-800"
          variants={sectionVariants}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div className="max-w-4xl mx-auto text-center">
              {/* Official Badge */}
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 mb-8 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Shield className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Official Government Transparency Platform
                </span>
              </motion.div>

              {/* Main Heading */}
              <motion.h1 
                className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-slate-900 dark:text-slate-50 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <span className="text-slate-900 dark:text-slate-50">Cabinet Minister</span>
                <br />
                <span className="text-primary">Performance Tracker</span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p 
                className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Monitor, evaluate, and engage with the performance of Ghana's cabinet ministers. 
                Real-time citizen satisfaction metrics for transparent governance.
              </motion.p>

              {/* Key Metrics Row */}
              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {[
                  { 
                    icon: Users, 
                    label: 'Active Ministers', 
                    value: '25',
                    description: 'Cabinet Members'
                  },
                  { 
                    icon: BarChart3, 
                    label: 'Real-time Data', 
                    value: 'Live',
                    description: 'Updated Continuously'
                  },
                  { 
                    icon: TrendingUp, 
                    label: 'Citizen Engagement', 
                    value: '24/7',
                    description: 'Always Available'
                  }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ y: -2 }}
                  >
                    <div className="flex items-center justify-center w-12 h-12 mb-4 bg-primary/10 rounded-lg mx-auto">
                      <stat.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {stat.label}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {stat.description}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Main Content Sections */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-12 lg:space-y-16">
          {/* National Satisfaction Meter */}
          <motion.section 
            id="national-meter"
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 lg:p-10 shadow-lg"
            variants={sectionVariants}
          >
            <NationalMeter />
          </motion.section>

          {/* Trending Ministers */}
          <motion.section 
            id="trending"
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 lg:p-10 shadow-lg"
            variants={sectionVariants}
          >
            <div className="mb-8 lg:mb-10">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-3">
                Trending Ministers
              </h2>
              <p className="text-base text-slate-600 dark:text-slate-400">
                Ministers receiving the most attention and engagement
              </p>
            </div>
            <TrendingGrid />
          </motion.section>

          {/* Minister Directory */}
          <motion.section 
            id="ministers"
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 lg:p-10 shadow-lg"
            variants={sectionVariants}
          >
            <div className="mb-8 lg:mb-10">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-3">
                Complete Minister Directory
              </h2>
              <p className="text-base text-slate-600 dark:text-slate-400">
                Browse all cabinet ministers and their performance metrics
              </p>
            </div>
            <MinisterDirectory />
          </motion.section>
        </div>
      </motion.div>
      <VoteNotification />
    </>
  )
}
