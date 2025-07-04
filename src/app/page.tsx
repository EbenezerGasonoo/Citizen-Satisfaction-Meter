'use client'

import { motion } from 'framer-motion'
import { Suspense } from 'react'
import NationalMeter from '@/components/NationalMeter'
import TrendingGrid from '@/components/TrendingGrid'
import MinisterDirectory from '@/components/MinisterDirectory'
import VoteNotification from '@/components/VoteNotification'

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
        className="min-h-screen"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="container mx-auto px-4 py-8">
          <motion.header 
            className="text-center mb-12"
            variants={titleVariants}
          >
            <motion.h1 
              className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              Who is working? Know your Ministers
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
              variants={sectionVariants}
            >
              Rate the performance of Ghanaian cabinet ministers and see live satisfaction metrics
            </motion.p>
          </motion.header>

          <motion.section 
            id="national-meter"
            className="mb-12"
            variants={sectionVariants}
          >
            <NationalMeter />
          </motion.section>

          <motion.section 
            id="trending"
            className="mb-12"
            variants={sectionVariants}
          >
            <TrendingGrid />
          </motion.section>

          <motion.section 
            id="ministers"
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