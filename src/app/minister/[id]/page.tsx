'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import VoteButtons from '@/components/VoteButtons'
import FavoriteButton from '@/components/FavoriteButton'
import PolicySection from '@/components/PolicySection'
import ActionSection from '@/components/ActionSection'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { XLogo } from '@/components/icons/XLogo'
import {
  ArrowLeft, TrendingUp, TrendingDown, Award, BarChart3,
  Calendar, Clock, Users, Activity,
  Target, TrendingUp as TrendingIcon, Star, Briefcase,
  FileText, Zap, Shield, Globe, MapPin,
  Facebook, Instagram, Linkedin, Mail, Building2
} from 'lucide-react'

interface MinisterDetail {
  id: number
  fullName: string
  portfolio: string
  photoUrl: string
  bio: string
  satisfactionRate: number
  totalVotes: number
  positiveVotes: number
  isTrending?: boolean
  createdAt?: string
}

// Portfolio to Department Responsibilities mapping
const getPortfolioResponsibilities = (portfolio: string) => {
  const portfolioLower = portfolio.toLowerCase()

  if (portfolioLower.includes('finance') || portfolioLower.includes('economic')) {
    return {
      department: 'Ministry of Finance & Economic Planning',
      responsibilities: [
        'Managing national budget and fiscal policy',
        'Overseeing economic planning and development',
        'Coordinating with international financial institutions',
        'Managing public debt and treasury operations',
        'Regulating financial services sector',
        'Tax policy formulation and revenue collection',
        'Economic forecasting and analysis',
        'Public financial management reforms'
      ],
      keyMetrics: ['GDP Growth', 'Budget Deficit', 'Inflation Rate', 'Public Debt'],
    }
  }

  if (portfolioLower.includes('education')) {
    return {
      department: 'Ministry of Education',
      responsibilities: [
        'Formulating education policies and curriculum',
        'Managing public schools and educational institutions',
        'Teacher recruitment, training, and welfare',
        'Educational infrastructure development',
        'Free Senior High School program oversight',
        'Technical and vocational education',
        'Educational research and assessment',
        'Partnerships with international education bodies'
      ],
      keyMetrics: ['Literacy Rate', 'School Enrollment', 'Teacher-Student Ratio', 'Education Budget'],
    }
  }

  if (portfolioLower.includes('health')) {
    return {
      department: 'Ministry of Health',
      responsibilities: [
        'National health policy formulation',
        'Managing public hospitals and health facilities',
        'Disease prevention and control programs',
        'National Health Insurance Scheme oversight',
        'Healthcare workforce management',
        'Medical supplies and pharmaceutical management',
        'Public health campaigns and awareness',
        'International health partnerships'
      ],
      keyMetrics: ['Life Expectancy', 'Infant Mortality', 'Health Coverage', 'Hospital Bed Capacity'],
    }
  }

  if (portfolioLower.includes('foreign') || portfolioLower.includes('international')) {
    return {
      department: 'Ministry of Foreign Affairs & Regional Integration',
      responsibilities: [
        'Managing diplomatic relations with other countries',
        'Representing Ghana in international organizations',
        'Facilitating trade and investment agreements',
        'Protecting Ghanaian citizens abroad',
        'Regional integration efforts (ECOWAS, AU)',
        'Consular services and visa processing',
        'International cooperation and development partnerships',
        'Foreign policy formulation and implementation'
      ],
      keyMetrics: ['Bilateral Agreements', 'Trade Partnerships', 'International Aid', 'Diplomatic Missions'],
    }
  }

  if (portfolioLower.includes('interior')) {
    return {
      department: 'Ministry of the Interior',
      responsibilities: [
        'Maintaining national security and public order',
        'Overseeing Ghana Police Service',
        'Immigration and border control',
        'Prisons and correctional services',
        'Fire and emergency services',
        'National identification and documentation',
        'Civil registration services',
        'Security sector reforms'
      ],
      keyMetrics: ['Crime Rate', 'Police Response Time', 'Immigration Processing', 'Border Security'],
    }
  }

  if (portfolioLower.includes('justice') || portfolioLower.includes('attorney')) {
    return {
      department: 'Ministry of Justice & Attorney General\'s Department',
      responsibilities: [
        'Providing legal advice to government',
        'Representing government in legal matters',
        'Drafting and reviewing legislation',
        'Prosecuting criminal cases',
        'Legal reform and law modernization',
        'Human rights protection and advocacy',
        'International legal cooperation',
        'Legal aid and access to justice'
      ],
      keyMetrics: ['Cases Handled', 'Legal Reforms', 'Prosecution Rate', 'Legal Aid Beneficiaries'],
    }
  }

  if (portfolioLower.includes('energy')) {
    return {
      department: 'Ministry of Energy',
      responsibilities: [
        'National energy policy formulation',
        'Power generation and distribution',
        'Renewable energy development',
        'Oil and gas sector management',
        'Energy security and reliability',
        'Rural electrification programs',
        'Energy efficiency and conservation',
        'International energy partnerships'
      ],
      keyMetrics: ['Power Generation', 'Energy Access', 'Renewable Energy %', 'Energy Efficiency'],
    }
  }

  if (portfolioLower.includes('transport')) {
    return {
      department: 'Ministry of Transport',
      responsibilities: [
        'Transportation policy and planning',
        'Road, rail, and air transport regulation',
        'Public transport infrastructure',
        'Road safety and traffic management',
        'Aviation and maritime services',
        'Transport sector reforms',
        'Logistics and supply chain development',
        'Transportation safety standards'
      ],
      keyMetrics: ['Road Safety', 'Transport Infrastructure', 'Passenger Volume', 'Transport Efficiency'],
    }
  }

  if (portfolioLower.includes('roads') || portfolioLower.includes('highways')) {
    return {
      department: 'Ministry of Roads & Highways',
      responsibilities: [
        'Road infrastructure development and maintenance',
        'Highway construction and rehabilitation',
        'Road safety and traffic management',
        'Bridge and road structure maintenance',
        'Rural road network development',
        'Road planning and design',
        'Public-private partnerships in road infrastructure',
        'Road transport regulations'
      ],
      keyMetrics: ['Road Network Length', 'Road Condition Index', 'Road Safety', 'Construction Projects'],
    }
  }

  if (portfolioLower.includes('food') || portfolioLower.includes('agriculture')) {
    return {
      department: 'Ministry of Food & Agriculture',
      responsibilities: [
        'Agricultural policy formulation',
        'Food security and production',
        'Farmer support and extension services',
        'Agricultural research and development',
        'Rural development programs',
        'Agricultural marketing and trade',
        'Livestock and fisheries management',
        'Climate-smart agriculture'
      ],
      keyMetrics: ['Food Production', 'Food Security', 'Farmer Support', 'Agricultural Exports'],
    }
  }

  if (portfolioLower.includes('trade') || portfolioLower.includes('industry')) {
    return {
      department: 'Ministry of Trade & Industry',
      responsibilities: [
        'Trade policy and regulation',
        'Industrial development and promotion',
        'Export promotion and market access',
        'Business registration and licensing',
        'Consumer protection',
        'Small and medium enterprise support',
        'Investment promotion',
        'International trade negotiations'
      ],
      keyMetrics: ['Trade Volume', 'Industrial Growth', 'SME Support', 'Export Performance'],
    }
  }

  if (portfolioLower.includes('communications') || portfolioLower.includes('digitization')) {
    return {
      department: 'Ministry of Communications, Digitisation & Innovation',
      responsibilities: [
        'Digital transformation and innovation',
        'ICT policy and regulation',
        'Telecommunications infrastructure',
        'E-government initiatives',
        'Digital inclusion programs',
        'Cybersecurity and data protection',
        'Technology innovation hubs',
        'Digital skills development'
      ],
      keyMetrics: ['Digital Penetration', 'ICT Infrastructure', 'E-Government Services', 'Digital Literacy'],
    }
  }

  if (portfolioLower.includes('local government') || portfolioLower.includes('chieftaincy')) {
    return {
      department: 'Ministry of Local Government, Chieftaincy & Religious Affairs',
      responsibilities: [
        'Local governance and decentralization',
        'Metropolitan, Municipal, and District Assemblies oversight',
        'Chieftaincy affairs and traditional governance',
        'Religious affairs coordination',
        'Local development planning',
        'Revenue mobilization at local level',
        'Community development programs',
        'Traditional authority relations'
      ],
      keyMetrics: ['Local Governance', 'Decentralization', 'MMDA Performance', 'Community Development'],
    }
  }

  if (portfolioLower.includes('tourism') || portfolioLower.includes('culture')) {
    return {
      department: 'Ministry of Tourism, Culture & Creative Arts',
      responsibilities: [
        'Tourism promotion and development',
        'Cultural heritage preservation',
        'Creative arts industry support',
        'Tourist site development',
        'Cultural events and festivals',
        'Arts and crafts promotion',
        'Tourism infrastructure development',
        'International tourism marketing'
      ],
      keyMetrics: ['Tourist Arrivals', 'Tourism Revenue', 'Cultural Events', 'Heritage Sites'],
    }
  }

  if (portfolioLower.includes('youth') || portfolioLower.includes('empowerment')) {
    return {
      department: 'Ministry of Youth Development & Empowerment',
      responsibilities: [
        'Youth policy formulation and implementation',
        'Youth employment and skills development',
        'Youth entrepreneurship support',
        'Youth leadership development',
        'Youth organizations coordination',
        'Youth-focused programs and initiatives',
        'Career guidance and counseling',
        'Youth participation in governance'
      ],
      keyMetrics: ['Youth Employment', 'Skills Training', 'Youth Programs', 'Entrepreneurship Support'],
    }
  }

  if (portfolioLower.includes('sports') || portfolioLower.includes('recreation')) {
    return {
      department: 'Ministry of Sports & Recreation',
      responsibilities: [
        'Sports policy and development',
        'National sports facilities management',
        'Athlete development and support',
        'Sports competitions and events',
        'Recreation and leisure programs',
        'Sports infrastructure development',
        'International sports participation',
        'Sports for development initiatives'
      ],
      keyMetrics: ['Sports Infrastructure', 'Athlete Performance', 'Sports Events', 'Recreation Access'],
    }
  }

  if (portfolioLower.includes('gender') || portfolioLower.includes('children') || portfolioLower.includes('social protection')) {
    return {
      department: 'Ministry of Gender, Children & Social Protection',
      responsibilities: [
        'Gender equality and women empowerment',
        'Child protection and welfare',
        'Social protection programs',
        'Domestic violence prevention',
        'Women\'s economic empowerment',
        'Child rights advocacy',
        'Social welfare services',
        'Gender mainstreaming in policies'
      ],
      keyMetrics: ['Gender Equality', 'Child Protection', 'Social Programs', 'Women Empowerment'],
    }
  }

  if (portfolioLower.includes('lands') || portfolioLower.includes('natural resources')) {
    return {
      department: 'Ministry of Lands & Natural Resources',
      responsibilities: [
        'Land administration and management',
        'Natural resources conservation',
        'Mining and mineral resources regulation',
        'Forestry and wildlife management',
        'Land use planning',
        'Environmental protection',
        'Natural resources policy',
        'Sustainable resource management'
      ],
      keyMetrics: ['Land Administration', 'Mining Revenue', 'Forest Cover', 'Resource Management'],
    }
  }

  if (portfolioLower.includes('works') || portfolioLower.includes('housing') || portfolioLower.includes('water')) {
    return {
      department: 'Ministry of Works, Housing & Water Resources',
      responsibilities: [
        'Public works and infrastructure',
        'Housing policy and development',
        'Water resources management',
        'Affordable housing programs',
        'Water supply and sanitation',
        'Infrastructure planning and design',
        'Public building maintenance',
        'Water quality and safety'
      ],
      keyMetrics: ['Housing Units', 'Water Access', 'Infrastructure Projects', 'Sanitation Coverage'],
    }
  }

  if (portfolioLower.includes('labour') || portfolioLower.includes('employment') || portfolioLower.includes('jobs')) {
    return {
      department: 'Ministry of Labour, Jobs & Employment',
      responsibilities: [
        'Labor policy and regulation',
        'Employment creation and job placement',
        'Labor relations and dispute resolution',
        'Workplace safety and health',
        'Skills development and training',
        'Social security and pensions',
        'Labor market analysis',
        'Employment services'
      ],
      keyMetrics: ['Employment Rate', 'Job Creation', 'Labor Disputes', 'Skills Training'],
    }
  }

  if (portfolioLower.includes('fisheries') || portfolioLower.includes('aquaculture')) {
    return {
      department: 'Ministry of Fisheries & Aquaculture',
      responsibilities: [
        'Fisheries policy and management',
        'Marine and inland fisheries regulation',
        'Aquaculture development',
        'Fisheries resource conservation',
        'Fishermen support and training',
        'Fisheries infrastructure',
        'Sustainable fishing practices',
        'Fish processing and marketing'
      ],
      keyMetrics: ['Fish Production', 'Fisheries Sustainability', 'Fishermen Support', 'Aquaculture Growth'],
    }
  }

  // Default for other portfolios
  return {
    department: portfolio,
    responsibilities: [
      'Policy formulation and implementation',
      'Sector development and planning',
      'Stakeholder engagement and coordination',
      'Resource management and allocation',
      'Service delivery oversight',
      'Regulatory compliance',
      'Performance monitoring and evaluation',
      'International cooperation and partnerships'
    ],
    keyMetrics: ['Service Delivery', 'Policy Implementation', 'Stakeholder Satisfaction', 'Resource Efficiency'],
  }
}

// Helper to get social media links (can be enhanced with database later)
const getSocialMediaLinks = (fullName: string, portfolio: string) => {
  // Return ministry social media accounts based on portfolio
  const portfolioLower = portfolio.toLowerCase()

  // Default ministry social accounts
  let twitter = null
  let facebook = null
  let instagram = null
  let linkedin = null
  let website = null

  if (portfolioLower.includes('president') && !portfolioLower.includes('vice')) {
    twitter = 'https://twitter.com/NAkufoAddo'
    facebook = 'https://facebook.com/PresidencyGhana'
    website = 'https://presidency.gov.gh'
  } else if (portfolioLower.includes('vice president')) {
    twitter = 'https://twitter.com/VPBawumia'
    facebook = 'https://facebook.com/VicePresidentGhana'
    website = 'https://veep.gov.gh'
  } else if (portfolioLower.includes('finance') || portfolioLower.includes('economic')) {
    twitter = 'https://twitter.com/FinanceGhana'
    facebook = 'https://facebook.com/MinistryofFinanceGhana'
    website = 'https://mofep.gov.gh'
  } else if (portfolioLower.includes('education')) {
    twitter = 'https://twitter.com/GhanaEducation'
    facebook = 'https://facebook.com/MinistryofEducationGhana'
    website = 'https://moe.gov.gh'
  } else if (portfolioLower.includes('health')) {
    twitter = 'https://twitter.com/GHSOfficial'
    facebook = 'https://facebook.com/GhanaHealthService'
    website = 'https://moh.gov.gh'
  } else if (portfolioLower.includes('foreign')) {
    twitter = 'https://twitter.com/GhanaForeignMin'
    facebook = 'https://facebook.com/MinistryofForeignAffairsGhana'
    website = 'https://mfa.gov.gh'
  } else if (portfolioLower.includes('interior')) {
    twitter = 'https://twitter.com/GhanaPoliceService'
    facebook = 'https://facebook.com/GhanaPoliceService'
    website = 'https://mint.gov.gh'
  } else if (portfolioLower.includes('justice') || portfolioLower.includes('attorney')) {
    twitter = 'https://twitter.com/AGDeptGhana'
    facebook = 'https://facebook.com/AttorneyGeneralGhana'
    website = 'https://mojag.gov.gh'
  } else if (portfolioLower.includes('energy')) {
    twitter = 'https://twitter.com/EnergyMinGhana'
    facebook = 'https://facebook.com/MinistryofEnergyGhana'
    website = 'https://energymin.gov.gh'
  } else if (portfolioLower.includes('transport')) {
    twitter = 'https://twitter.com/GhanaTransport'
    facebook = 'https://facebook.com/MinistryofTransportGhana'
    website = 'https://mot.gov.gh'
  } else if (portfolioLower.includes('roads') || portfolioLower.includes('highways')) {
    twitter = 'https://twitter.com/GhanaRoads'
    facebook = 'https://facebook.com/MinistryofRoadsGhana'
    website = 'https://mrh.gov.gh'
  } else if (portfolioLower.includes('communication') || portfolioLower.includes('digitisation')) {
    twitter = 'https://twitter.com/MinComGhana'
    facebook = 'https://facebook.com/MinistryofCommunicationsGhana'
    website = 'https://moc.gov.gh'
  } else if (portfolioLower.includes('food') || portfolioLower.includes('agriculture')) {
    twitter = 'https://twitter.com/MoFAGhana_'
    facebook = 'https://facebook.com/MoFAGhana'
    website = 'https://mofa.gov.gh'
  } else if (portfolioLower.includes('fisheries') || portfolioLower.includes('aquaculture')) {
    twitter = 'https://twitter.com/FisheriesGhana'
    facebook = 'https://facebook.com/MinistryofFisheriesGhana'
    website = 'https://mofad.gov.gh'
  } else if (portfolioLower.includes('trade') || portfolioLower.includes('industry')) {
    twitter = 'https://twitter.com/GhanaTrade'
    facebook = 'https://facebook.com/MinistryofTradeGhana'
    website = 'https://moti.gov.gh'
  } else if (portfolioLower.includes('lands') || portfolioLower.includes('natural resources')) {
    twitter = 'https://twitter.com/LandsGhana'
    facebook = 'https://facebook.com/MinistryofLandsGhana'
    website = 'https://mlnr.gov.gh'
  } else if (portfolioLower.includes('local government') || portfolioLower.includes('chieftaincy')) {
    twitter = 'https://twitter.com/LocalGovGhana'
    facebook = 'https://facebook.com/MinistryofLocalGovernmentGhana'
    website = 'https://mlgrd.gov.gh'
  } else if (portfolioLower.includes('tourism') || portfolioLower.includes('culture') || portfolioLower.includes('creative arts')) {
    twitter = 'https://twitter.com/TourismGhana'
    facebook = 'https://facebook.com/GhanaTourismAuthority'
    website = 'https://motcca.gov.gh'
  } else if (portfolioLower.includes('labour') || portfolioLower.includes('employment')) {
    twitter = 'https://twitter.com/LabourGhana'
    facebook = 'https://facebook.com/MinistryofLabourGhana'
    website = 'https://melr.gov.gh'
  } else if (portfolioLower.includes('works') || portfolioLower.includes('housing') || portfolioLower.includes('water')) {
    twitter = 'https://twitter.com/WorksGhana'
    facebook = 'https://facebook.com/MinistryofWorksGhana'
    website = 'https://mwh.gov.gh'
  } else if (portfolioLower.includes('youth') || portfolioLower.includes('empowerment')) {
    twitter = 'https://twitter.com/YouthGhana'
    facebook = 'https://facebook.com/MinistryofYouthGhana'
    website = 'https://mys.gov.gh'
  } else if (portfolioLower.includes('sports') || portfolioLower.includes('recreation')) {
    twitter = 'https://twitter.com/SportsGhana'
    facebook = 'https://facebook.com/MinistryofSportsGhana'
    website = 'https://mys.gov.gh'
  } else if (portfolioLower.includes('gender') || portfolioLower.includes('children') || portfolioLower.includes('social protection')) {
    twitter = 'https://twitter.com/GenderGhana'
    facebook = 'https://facebook.com/MinistryofGenderGhana'
    website = 'https://mogcsp.gov.gh'
  }

  return {
    twitter,
    facebook,
    instagram,
    linkedin,
    website
  }
}

interface VoteTrend {
  date: string
  positive: number
  negative: number
  satisfaction: number
}

export default function MinisterPage({ params }: { params: { id: string } }) {
  const [minister, setMinister] = useState<MinisterDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [voteTrends, setVoteTrends] = useState<VoteTrend[]>([])
  const [activeTab, setActiveTab] = useState<'overview' | 'actions' | 'policies' | 'analytics'>('overview')
  const [imageError, setImageError] = useState(false)

  // Track if initial data has been loaded
  const hasInitialData = useRef(false)
  const isFetching = useRef(false)

  // GSAP Refs
  const heroRef = useRef<HTMLDivElement>(null)
  const photoRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLHeadingElement>(null)
  const portfolioRef = useRef<HTMLParagraphElement>(null)
  const bioRef = useRef<HTMLParagraphElement>(null)
  const buttonsRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const tabsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Reset when params.id changes
    hasInitialData.current = false

    if (!params.id) {
      setMinister(null)
      setLoading(false)
      return
    }

    let cancelled = false

    const fetchMinister = async () => {
      // Prevent duplicate fetches
      if (isFetching.current) {
        console.log('Fetch already in progress, skipping...')
        return
      }

      isFetching.current = true
      setLoading(true)
      try {
        console.log('Fetching minister data for ID:', params.id)
        const response = await fetch(`/api/ministers/${params.id}`)
        if (cancelled) {
          isFetching.current = false
          return
        }

        if (!response.ok) {
          console.error('Failed to fetch minister:', response.status, response.statusText)
          if (!cancelled) {
            setMinister(null)
            setLoading(false)
          }
          isFetching.current = false
          return
        }
        const data = await response.json()
        if (cancelled) {
          isFetching.current = false
          return
        }

        console.log('Received minister data:', data)
        if (data && data.id) {
          console.log('Setting minister data:', { id: data.id, name: data.fullName, photoUrl: data.photoUrl })
          if (!cancelled) {
            setMinister(data)
            setImageError(false) // Reset image error when new minister data is loaded
            hasInitialData.current = true
          }
        } else {
          console.error('Invalid minister data received:', data)
          if (!cancelled) {
            setMinister(null)
          }
        }
      } catch (error) {
        if (cancelled) {
          isFetching.current = false
          return
        }
        console.error('Error fetching minister:', error)
        if (!cancelled) {
          setMinister(null)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
        isFetching.current = false
      }
    }

    fetchMinister()

    return () => {
      cancelled = true
      isFetching.current = false
      hasInitialData.current = false
    }
  }, [params.id])

  useEffect(() => {
    if (!params.id) return

    const handleVoteUpdate = async () => {
      // Don't update if we don't have initial data yet
      if (!hasInitialData.current) {
        console.log('Skipping vote update - initial data not loaded yet')
        return
      }

      console.log('Handling vote update for minister:', params.id)
      try {
        const response = await fetch(`/api/ministers/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          // Only update if we got valid data
          if (data && data.id) {
            console.log('Updating minister data after vote:', { id: data.id, name: data.fullName })
            setMinister(prev => {
              // Preserve existing data if new data is invalid
              if (!data || !data.id) {
                console.warn('Invalid data in vote update, preserving existing data')
                return prev
              }
              return data
            })
            setImageError(false) // Reset image error when minister data updates
          } else {
            console.error('Invalid minister data received after vote:', data)
            // Don't clear existing data
          }
        } else {
          console.error('Failed to fetch minister after vote:', response.status)
          // Don't clear existing data if update fails
        }
      } catch (error) {
        console.error('Error fetching minister after vote:', error)
        // Don't clear existing data if update fails
      }
    }

    // Add a small delay before listening to avoid catching stale events
    const timeoutId = setTimeout(() => {
      window.addEventListener('voteSubmitted', handleVoteUpdate)
    }, 100)

    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('voteSubmitted', handleVoteUpdate)
    }
  }, [params.id])

  // Debug: Log minister state changes
  useEffect(() => {
    if (minister) {
      console.log('Minister data updated:', {
        id: minister.id,
        name: minister.fullName,
        photoUrl: minister.photoUrl,
        hasPhotoUrl: !!minister.photoUrl && minister.photoUrl.trim() !== '',
        imageError,
        hasInitialData: hasInitialData.current
      })
    } else {
      console.log('Minister data cleared', { hasInitialData: hasInitialData.current })
    }
  }, [minister, imageError])

  // GSAP Animations
  useEffect(() => {
    if (!minister || loading || !hasInitialData.current) {
      console.log('GSAP: Skipping animation', { hasMinister: !!minister, loading, hasInitialData: hasInitialData.current })
      return
    }

    console.log('GSAP: Starting animations for minister:', minister.id)

    // Register GSAP plugins
    try {
      gsap.registerPlugin(ScrollTrigger)
    } catch (e) {
      // Plugins may already be registered
    }

    const ctx = gsap.context(() => {
      // Hero card entrance animation
      if (heroRef.current) {
        // Ensure element is visible before animating
        gsap.set(heroRef.current, { opacity: 1, visibility: 'visible' })
        gsap.from(heroRef.current, {
          opacity: 0,
          y: 50,
          duration: 0.8,
          ease: 'power3.out',
        })
      }

      // Photo animation with scale and rotation
      if (photoRef.current) {
        // Ensure element is visible before animating
        gsap.set(photoRef.current, { opacity: 1, visibility: 'visible' })
        gsap.from(photoRef.current, {
          opacity: 0,
          scale: 0.8,
          rotation: -5,
          duration: 0.8,
          delay: 0.2,
          ease: 'back.out(1.7)',
        })

        // Continuous subtle floating animation
        gsap.to(photoRef.current, {
          y: -10,
          duration: 2,
          ease: 'power1.inOut',
          repeat: -1,
          yoyo: true,
          delay: 1,
        })
      }

      // Name animation with text reveal
      if (nameRef.current) {
        gsap.set(nameRef.current, { opacity: 1, visibility: 'visible' })
        gsap.from(nameRef.current, {
          opacity: 0,
          x: -30,
          duration: 0.8,
          delay: 0.3,
          ease: 'power3.out',
        })
      }

      // Portfolio animation
      if (portfolioRef.current) {
        gsap.set(portfolioRef.current, { opacity: 1, visibility: 'visible' })
        gsap.from(portfolioRef.current, {
          opacity: 0,
          y: 20,
          duration: 0.6,
          delay: 0.5,
          ease: 'power2.out',
        })
      }

      // Bio animation
      if (bioRef.current) {
        gsap.set(bioRef.current, { opacity: 1, visibility: 'visible' })
        gsap.from(bioRef.current, {
          opacity: 0,
          y: 20,
          duration: 0.6,
          delay: 0.6,
          ease: 'power2.out',
        })
      }

      // Action buttons animation
      if (buttonsRef.current) {
        Array.from(buttonsRef.current.children).forEach((child) => {
          gsap.set(child, { opacity: 1, visibility: 'visible' })
        })
        gsap.from(buttonsRef.current.children, {
          opacity: 0,
          y: 20,
          duration: 0.6,
          delay: 0.7,
          stagger: 0.1,
          ease: 'power2.out',
        })
      }

      // Stats counter animation
      if (statsRef.current) {
        const stats = statsRef.current.children

        gsap.from(stats, {
          opacity: 0,
          scale: 0.8,
          y: 30,
          duration: 0.6,
          delay: 0.8,
          stagger: 0.15,
          ease: 'back.out(1.2)',
        })

        // Animate numbers counting up
        Array.from(stats).forEach((stat, index) => {
          const numberElement = stat.querySelector('.gsap-number')
          if (numberElement) {
            let targetValue = 0
            if (index === 0) targetValue = minister.totalVotes
            else if (index === 1) targetValue = minister.positiveVotes
            else if (index === 2) targetValue = minister.satisfactionRate

            gsap.to({ value: 0 }, {
              value: targetValue,
              duration: 1.5,
              delay: 0.9 + index * 0.15,
              ease: 'power2.out',
              onUpdate: function () {
                if (index === 2) {
                  numberElement.textContent = `${Math.round(this.targets()[0].value)}%`
                } else {
                  numberElement.textContent = Math.round(this.targets()[0].value).toLocaleString()
                }
              }
            })
          }
        })
      }

      // Tabs animation
      if (tabsRef.current) {
        gsap.from(tabsRef.current.children, {
          opacity: 0,
          y: 10,
          duration: 0.5,
          delay: 1,
          stagger: 0.05,
          ease: 'power2.out',
        })
      }

      // Scroll-triggered animations for sections
      const sections = document.querySelectorAll('.gsap-section')
      sections.forEach((section, index) => {
        gsap.from(section, {
          opacity: 0,
          y: 50,
          duration: 0.8,
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
          },
          ease: 'power3.out',
          delay: index * 0.1,
        })
      })

    }, heroRef)

    return () => {
      console.log('GSAP: Cleaning up animations')
      ctx.revert()
    }
  }, [minister, loading])

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-32 animate-pulse mb-8" />
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="w-48 h-48 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
                <div className="flex-1 space-y-4">
                  <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-3/4 animate-pulse" />
                  <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/2 animate-pulse" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (!minister) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">Minister Not Found</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-4">The minister you're looking for doesn't exist.</p>
          <Link href="/" className="btn-primary inline-block">
            Back to Home
          </Link>
        </div>
      </main>
    )
  }

  const negativeVotes = minister.totalVotes - minister.positiveVotes
  const satisfactionColor = minister.satisfactionRate >= 70
    ? 'text-green-600 dark:text-green-400'
    : minister.satisfactionRate >= 50
      ? 'text-yellow-600 dark:text-yellow-400'
      : 'text-red-600 dark:text-red-400'

  const statusBadge = minister.satisfactionRate >= 70
    ? { label: 'Excellent', color: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800' }
    : minister.satisfactionRate >= 50
      ? { label: 'Moderate', color: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800' }
      : { label: 'Needs Improvement', color: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800' }

  const portfolioInfo = getPortfolioResponsibilities(minister.portfolio)
  const socialLinks = getSocialMediaLinks(minister.fullName, minister.portfolio)

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-primary/5 dark:from-slate-950 dark:via-slate-900 dark:to-primary/10 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 right-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-80 h-80 bg-primary/15 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -80, 0],
            y: [0, 80, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-all shadow-sm hover:shadow-md"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-medium">Back to Home</span>
            </Link>
          </motion.div>

          {/* Hero Section - Ultra Modern Card */}
          <div
            ref={heroRef}
            className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-3xl shadow-2xl mb-8 lg:mb-10 overflow-hidden border border-white/20 dark:border-slate-800/50"
            style={{
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.1)',
            }}
          >
            {/* Animated gradient background */}
            <motion.div
              className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-primary/5 via-transparent to-primary/10"
              animate={{
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            <div className="relative flex flex-col lg:flex-row gap-10 lg:gap-12 p-8 lg:p-12">
              {/* Profile Picture - Enhanced with Glow */}
              <motion.div
                ref={photoRef}
                className="flex-shrink-0 mx-auto lg:mx-0"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <div className="relative w-56 h-80 lg:w-72 lg:h-[420px] group flex-shrink-0" style={{ minHeight: '320px' }}>
                  {/* Glow effect */}
                  <motion.div
                    className="absolute -inset-2 bg-gradient-to-r from-primary via-primary to-green-500 rounded-3xl blur-2xl opacity-60 group-hover:opacity-90 transition-opacity"
                    animate={{
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />

                  {/* Glassy Image container */}
                  <div className="relative w-full h-full rounded-3xl overflow-hidden bg-gradient-to-br from-white/40 via-white/30 to-white/20 dark:from-slate-800/40 dark:via-slate-800/30 dark:to-slate-800/20 p-2 backdrop-blur-xl border border-white/50 dark:border-slate-700/50 shadow-2xl" style={{ minHeight: '100%' }}>
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/20 to-transparent dark:from-slate-700/20 backdrop-blur-md z-0 pointer-events-none" />
                    <div className="relative w-full h-full rounded-2xl overflow-hidden z-10 bg-slate-200 dark:bg-slate-700" style={{ minHeight: '100%' }}>
                      {minister.photoUrl && minister.photoUrl.trim() !== '' && !imageError ? (
                        <Image
                          key={`${minister.id}-${minister.photoUrl}`}
                          src={minister.photoUrl}
                          alt={minister.fullName}
                          fill
                          className="rounded-2xl object-cover object-top"
                          sizes="(max-width: 768px) 224px, 288px"
                          priority
                          unoptimized={true}
                          onError={(e) => {
                            console.error('Image failed to load:', minister.photoUrl, e)
                            setImageError(true)
                          }}
                          onLoad={() => {
                            console.log('Image loaded successfully:', minister.photoUrl)
                            // Only reset error if it was previously set
                            setImageError(prev => prev ? false : prev)
                          }}
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-200 dark:bg-slate-700 rounded-2xl">
                          <Users className="w-16 h-16 text-slate-400 dark:text-slate-500" />
                          {minister.photoUrl && (
                            <div className="absolute bottom-2 left-2 right-2 text-xs text-slate-500 text-center">
                              {imageError ? 'Image failed to load' : 'Loading image...'}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Badge overlay - top right */}
                  {minister.isTrending && (
                    <motion.div
                      className="absolute -top-4 -right-4 z-20"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3, type: "spring" }}
                    >
                      <div className="bg-primary/90 backdrop-blur-md text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-2xl border border-white/30">
                        <TrendingIcon className="w-4 h-4" />
                        <span>TRENDING</span>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {/* Profile Info */}
              <div className="flex-1 flex flex-col min-w-0 justify-between">
                <div>
                  {/* Name and Status Badges */}
                  <motion.div
                    className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                  >
                    <div className="flex-1">
                      <h1
                        ref={nameRef}
                        className="text-3xl lg:text-5xl xl:text-6xl font-extrabold text-slate-900 dark:text-white leading-tight mb-3"
                      >
                        {minister.fullName}
                        {minister.fullName.includes('(MP)') ? '' : ' (MP)'}
                      </h1>
                      <div className="flex items-center gap-2 flex-wrap">
                        {minister.isTrending && (
                          <motion.div
                            className="bg-primary text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md"
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                          >
                            <TrendingIcon className="w-3.5 h-3.5" />
                            <span>TRENDING</span>
                          </motion.div>
                        )}
                        <div className={`px-3 py-1.5 rounded-xl text-xs font-bold border-2 ${statusBadge.color}`}>
                          {statusBadge.label}
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Portfolio/Title */}
                  <motion.h2
                    ref={portfolioRef}
                    className="text-xl lg:text-2xl xl:text-3xl text-slate-700 dark:text-slate-300 font-semibold mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    {minister.portfolio}
                  </motion.h2>

                  {/* Bio - Always visible */}
                  <motion.div
                    ref={bioRef}
                    className="mb-8 max-w-2xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    <p className="text-base lg:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                      {minister.bio || 'No biography available for this minister.'}
                    </p>
                  </motion.div>
                </div>

                {/* Action Buttons - Modern Style */}
                <motion.div
                  ref={buttonsRef}
                  className="flex items-center gap-4 mb-8 lg:mb-10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <VoteButtons ministerId={minister.id} />
                  <FavoriteButton ministerId={minister.id} />
                </motion.div>

                {/* Stats - Modern Grid */}
                <motion.div
                  ref={statsRef}
                  className="grid grid-cols-3 gap-4 lg:gap-6 xl:gap-8 pt-6 border-t-2 border-slate-200/60 dark:border-slate-800/60"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <motion.div
                    className="flex flex-col items-center text-center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="p-3 lg:p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/20 mb-3">
                      <Users className="w-6 h-6 lg:w-7 lg:h-7 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="text-3xl lg:text-4xl xl:text-5xl font-bold text-slate-900 dark:text-white mb-2 gsap-number">
                      {minister.totalVotes.toLocaleString()}
                    </div>
                    <div className="text-xs lg:text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                      Total Votes
                    </div>
                  </motion.div>
                  <motion.div
                    className="flex flex-col items-center text-center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="p-3 lg:p-4 rounded-2xl bg-green-50 dark:bg-green-900/20 mb-3">
                      <TrendingUp className="w-6 h-6 lg:w-7 lg:h-7 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="text-3xl lg:text-4xl xl:text-5xl font-bold text-green-600 dark:text-green-400 mb-2 gsap-number">
                      {minister.positiveVotes.toLocaleString()}
                    </div>
                    <div className="text-xs lg:text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                      Positive
                    </div>
                  </motion.div>
                  <motion.div
                    className="flex flex-col items-center text-center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className={`p-3 lg:p-4 rounded-2xl mb-3 ${satisfactionColor.replace('text-', 'bg-').replace('dark:text-', 'dark:bg-')} bg-opacity-10 dark:bg-opacity-20`}>
                      <Award className={`w-6 h-6 lg:w-7 lg:h-7 ${satisfactionColor}`} />
                    </div>
                    <div className={`text-3xl lg:text-4xl xl:text-5xl font-bold ${satisfactionColor} mb-2 gsap-number`}>
                      {minister.satisfactionRate}%
                    </div>
                    <div className="text-xs lg:text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                      Satisfaction
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Department & Responsibilities Section */}
          <div
            className="gsap-section bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 rounded-2xl p-6 lg:p-8 xl:p-10 shadow-2xl mb-8"
            style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)' }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                  Department & Responsibilities
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {portfolioInfo.department}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Key Responsibilities */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Key Responsibilities
                </h3>
                <ul className="space-y-3">
                  {portfolioInfo.responsibilities.map((responsibility, index) => (
                    <motion.li
                      key={index}
                      className="flex items-start gap-3 text-slate-700 dark:text-slate-300"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.05 }}
                    >
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm leading-relaxed">{responsibility}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Key Performance Metrics */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Key Performance Areas
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {portfolioInfo.keyMetrics.map((metric, index) => (
                    <motion.div
                      key={index}
                      className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-lg p-3 border border-white/30 dark:border-slate-700/30"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + index * 0.05 }}
                    >
                      <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                        {metric}
                      </div>
                      <div className="text-sm text-slate-700 dark:text-slate-300">
                        Tracked
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Social Media & Contact Section */}
          <div
            className="gsap-section bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 rounded-2xl p-6 lg:p-8 xl:p-10 shadow-2xl mb-8"
            style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)' }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Globe className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                  Connect & Follow
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Social media and contact information
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { icon: XLogo, label: 'X', url: socialLinks.twitter, color: 'text-slate-900 dark:text-white' },
                { icon: Facebook, label: 'Facebook', url: socialLinks.facebook, color: 'text-blue-600' },
                { icon: Globe, label: 'Website', url: socialLinks.website, color: 'text-green-600' },
              ].map((social, index) => {
                const Icon = social.icon
                const hasLink = social.url !== null

                return (
                  <motion.div
                    key={social.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.05 }}
                  >
                    {hasLink ? (
                      <a
                        href={social.url!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center gap-2 p-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl border border-white/30 dark:border-slate-700/30 hover:border-primary/50 transition-all group"
                      >
                        <div className={`p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors ${social.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          {social.label}
                        </span>
                      </a>
                    ) : (
                      <div className="flex flex-col items-center gap-2 p-4 bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm rounded-xl border border-white/20 dark:border-slate-700/20 opacity-60">
                        <div className={`p-3 rounded-lg bg-slate-100 dark:bg-slate-700 ${social.color} opacity-50`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                          {social.label}
                        </span>
                        <span className="text-xs text-slate-400 dark:text-slate-500">
                          Not available
                        </span>
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </div>

            {/* Official Contact */}
            <div className="mt-6 p-4 bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm rounded-xl border border-white/30 dark:border-slate-700/30">
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-primary" />
                <div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                    Official Ministry
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Contact the ministry through official government channels
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation - Glass Style */}
          <div
            className="gsap-section bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 rounded-2xl p-3 lg:p-4 mb-8 shadow-2xl"
            style={{
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
            }}
          >
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'actions', label: 'Actions', icon: Zap },
                { id: 'policies', label: 'Policies', icon: FileText },
                { id: 'analytics', label: 'Analytics', icon: Activity },
              ].map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${isActive
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-8">
                  <motion.div
                    className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                        <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex items-center gap-1 text-xs font-medium text-green-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        Live
                      </div>
                    </div>
                    <div className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                      Total Votes
                    </div>
                    <motion.div
                      className="text-4xl font-bold text-slate-900 dark:text-slate-50"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
                    >
                      {minister.totalVotes.toLocaleString()}
                    </motion.div>
                  </motion.div>

                  <motion.div
                    className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                        <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                      </div>
                    </div>
                    <div className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                      Satisfied Votes
                    </div>
                    <motion.div
                      className="text-4xl font-bold text-green-600 dark:text-green-400"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.4 }}
                    >
                      {minister.positiveVotes.toLocaleString()}
                    </motion.div>
                    <div className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                      {minister.totalVotes > 0 ? Math.round((minister.positiveVotes / minister.totalVotes) * 100) : 0}% of total
                    </div>
                  </motion.div>

                  <motion.div
                    className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 shadow-2xl border border-slate-700 overflow-hidden relative"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
                      Satisfaction Meter
                    </div>

                    <div className="flex flex-col items-center py-4">
                      <div className="relative w-full h-32">
                        <svg viewBox="0 0 200 100" className="w-full h-full">
                          {[...Array(30)].map((_, i) => {
                            const angle = -90 + (i * 180 / 29)
                            const pct = ((i + 1) / 30) * 100
                            const isActive = pct <= minister.satisfactionRate

                            let color = '#334155'
                            if (isActive) {
                              if (pct <= 20) color = '#ef4444'
                              else if (pct <= 40) color = '#f97316'
                              else if (pct <= 60) color = '#eab308'
                              else if (pct <= 80) color = '#84cc16'
                              else color = '#22c55e'
                            }

                            const x = 100
                            const y = 95

                            return (
                              <motion.rect
                                key={i}
                                x={x - 1.5}
                                y={y - 20}
                                width={3}
                                height={20}
                                rx={1.5}
                                fill={color}
                                initial={{ scaleY: 0, opacity: 0 }}
                                animate={{ scaleY: 1, opacity: 1 }}
                                transition={{
                                  delay: 0.5 + (i * 0.03),
                                  duration: 0.3,
                                  ease: "easeOut"
                                }}
                                transform={`rotate(${angle} ${x} ${y})`}
                                style={{ transformOrigin: `${x}px ${y}px` }}
                              />
                            )
                          })}
                        </svg>

                        <motion.div
                          className="absolute inset-0 flex items-end justify-center pb-4"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
                        >
                          <div className="text-5xl font-bold text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
                            {minister.satisfactionRate}
                          </div>
                        </motion.div>
                      </div>

                      <motion.div
                        className={`px-4 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm ${minister.satisfactionRate >= 70 ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                          : minister.satisfactionRate >= 50 ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                            : 'bg-red-500/20 text-red-300 border border-red-500/30'
                          }`}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 1.8, type: "spring" }}
                      >
                        <span className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${minister.satisfactionRate >= 70 ? 'bg-green-400'
                            : minister.satisfactionRate >= 50 ? 'bg-yellow-400'
                              : 'bg-red-400'
                            }`} />
                          {minister.satisfactionRate >= 70 ? 'Excellent' : minister.satisfactionRate >= 50 ? 'Moderate' : 'Poor'}
                        </span>
                      </motion.div>
                    </div>
                  </motion.div>
                </div>

                {/* Actions and Policies Preview */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                  <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 rounded-2xl p-6 shadow-2xl" style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)' }}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-primary" />
                        Recent Actions
                      </h3>
                      <button
                        onClick={() => setActiveTab('actions')}
                        className="text-sm text-primary hover:underline"
                      >
                        View All
                      </button>
                    </div>
                    <ActionSection ministerId={minister.id} />
                  </div>

                  <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 rounded-2xl p-6 shadow-2xl" style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)' }}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" />
                        Recent Policies
                      </h3>
                      <button
                        onClick={() => setActiveTab('policies')}
                        className="text-sm text-primary hover:underline"
                      >
                        View All
                      </button>
                    </div>
                    <PolicySection ministerId={minister.id} />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'actions' && (
              <motion.div
                key="actions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 rounded-2xl p-6 lg:p-8 shadow-2xl" style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)' }}>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2 flex items-center gap-2">
                    <Zap className="w-6 h-6 text-primary" />
                    Key Actions & Initiatives
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 mb-6">
                    Track major initiatives and activities undertaken by this minister
                  </p>
                  <ActionSection ministerId={minister.id} />
                </div>
              </motion.div>
            )}

            {activeTab === 'policies' && (
              <motion.div
                key="policies"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 rounded-2xl p-6 lg:p-8 shadow-2xl" style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)' }}>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2 flex items-center gap-2">
                    <FileText className="w-6 h-6 text-primary" />
                    Policies & Programs
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 mb-6">
                    Policies and their impact on citizens
                  </p>
                  <PolicySection ministerId={minister.id} />
                </div>
              </motion.div>
            )}

            {activeTab === 'analytics' && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 rounded-2xl p-6 lg:p-8 shadow-2xl" style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)' }}>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2 flex items-center gap-2">
                    <BarChart3 className="w-6 h-6 text-primary" />
                    Performance Analytics
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 mb-6">
                    Detailed performance metrics and trends
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md rounded-xl p-6 border border-white/30 dark:border-slate-700/30 shadow-lg" style={{ boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.1)' }}>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">
                        Vote Distribution
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-slate-600 dark:text-slate-400">Positive</span>
                            <span className="font-semibold text-green-600 dark:text-green-400">
                              {Math.round((minister.positiveVotes / minister.totalVotes) * 100 || 0)}%
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{ width: `${(minister.positiveVotes / minister.totalVotes) * 100 || 0}%` }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-slate-600 dark:text-slate-400">Negative</span>
                            <span className="font-semibold text-red-600 dark:text-red-400">
                              {Math.round((negativeVotes / minister.totalVotes) * 100 || 0)}%
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                            <div
                              className="bg-red-600 h-2 rounded-full"
                              style={{ width: `${(negativeVotes / minister.totalVotes) * 100 || 0}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md rounded-xl p-6 border border-white/30 dark:border-slate-700/30 shadow-lg" style={{ boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.1)' }}>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">
                        Performance Summary
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600 dark:text-slate-400">Satisfaction Rate</span>
                          <span className={`text-lg font-bold ${satisfactionColor}`}>
                            {minister.satisfactionRate}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600 dark:text-slate-400">Total Engagement</span>
                          <span className="text-lg font-bold text-slate-900 dark:text-slate-50">
                            {minister.totalVotes.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600 dark:text-slate-400">Status</span>
                          <span className={`text-sm font-semibold px-3 py-1 rounded-full ${statusBadge.color}`}>
                            {statusBadge.label}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  )
}
