import { NextRequest } from 'next/server'

export interface GeoLocation {
  country?: string
  region?: string
  city?: string
}

/**
 * Extract IP address from Next.js request
 * Handles various proxy configurations (Vercel, Cloudflare, etc.)
 */
export function getClientIp(request: NextRequest): string | null {
  // Try various headers in order of preference
  const headers = request.headers

  // Vercel/Cloudflare
  const forwardedFor = headers.get('x-forwarded-for')
  if (forwardedFor) {
    // x-forwarded-for can be a comma-separated list of IPs
    // The first one is the client IP
    return forwardedFor.split(',')[0].trim()
  }

  // Other common headers
  const realIp = headers.get('x-real-ip')
  if (realIp) return realIp

  const cfConnectingIp = headers.get('cf-connecting-ip')
  if (cfConnectingIp) return cfConnectingIp

  // Fallback to remote address (may not work in production)
  return headers.get('x-client-ip') || null
}

/**
 * Get geolocation data from IP address using free ip-api.com service
 * Rate limited: 45 requests per minute
 */
export async function getGeolocationFromIp(ip: string): Promise<GeoLocation> {
  // Don't look up localhost/private IPs
  if (!ip || ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
    return {
      country: 'LOCAL',
      region: 'Development',
      city: 'localhost'
    }
  }

  try {
    // Using ip-api.com - free tier (45 req/min, no API key needed)
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,countryCode,region,regionName,city`, {
      headers: { 'Accept': 'application/json' },
      // 5 second timeout
      signal: AbortSignal.timeout(5000)
    })

    if (!response.ok) {
      console.warn('Geolocation API returned non-OK status:', response.status)
      return {}
    }

    const data = await response.json()

    if (data.status === 'success') {
      return {
        country: data.countryCode || data.country,
        region: data.regionName || data.region,
        city: data.city
      }
    }

    console.warn('Geolocation lookup failed:', data.message)
    return {}

  } catch (error) {
    console.error('Error fetching geolocation:', error)
    return {}
  }
}

/**
 * Get geolocation with caching to avoid hitting rate limits
 * In production, you'd want to use Redis or similar for distributed caching
 */
const geoCache = new Map<string, { data: GeoLocation; timestamp: number }>()
const CACHE_TTL = 24 * 60 * 60 * 1000 // 24 hours

export async function getCachedGeolocation(ip: string): Promise<GeoLocation> {
  const cached = geoCache.get(ip)
  const now = Date.now()

  if (cached && (now - cached.timestamp) < CACHE_TTL) {
    return cached.data
  }

  const geoData = await getGeolocationFromIp(ip)
  geoCache.set(ip, { data: geoData, timestamp: now })

  // Clean old cache entries (simple memory management)
  if (geoCache.size > 1000) {
    const oldestKey = Array.from(geoCache.entries())
      .sort((a, b) => a[1].timestamp - b[1].timestamp)[0][0]
    geoCache.delete(oldestKey)
  }

  return geoData
}

/**
 * Anonymize IP address for privacy (optional)
 * Removes last octet for IPv4, last 80 bits for IPv6
 */
export function anonymizeIp(ip: string): string {
  if (!ip) return ''

  // IPv4
  if (ip.includes('.')) {
    const parts = ip.split('.')
    parts[parts.length - 1] = '0'
    return parts.join('.')
  }

  // IPv6
  if (ip.includes(':')) {
    const parts = ip.split(':')
    // Zero out last 5 segments (80 bits)
    for (let i = Math.max(0, parts.length - 5); i < parts.length; i++) {
      parts[i] = '0'
    }
    return parts.join(':')
  }

  return ip
}


