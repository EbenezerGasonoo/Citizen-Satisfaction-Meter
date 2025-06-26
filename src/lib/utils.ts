import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import crypto from 'crypto'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function hashClient(ip: string, userAgent: string, salt: string = 'citizen-safistication'): string {
  const date = new Date().toISOString().split('T')[0] // YYYY-MM-DD format
  const data = `${ip}-${userAgent}-${date}-${salt}`
  return crypto.createHash('sha256').update(data).digest('hex')
}

export function isGhanaianIP(ip: string): boolean {
  // Ghana IP ranges (simplified - in production, use a proper IP geolocation service)
  const ghanaIPRanges = [
    '41.203.0.0/16',
    '41.204.0.0/16',
    '41.205.0.0/16',
    '41.206.0.0/16',
    '41.207.0.0/16',
    '102.88.0.0/16',
    '102.89.0.0/16',
    '102.90.0.0/16',
    '102.91.0.0/16',
    '154.160.0.0/16',
    '154.161.0.0/16',
    '154.162.0.0/16',
    '154.163.0.0/16',
    '154.164.0.0/16',
    '154.165.0.0/16',
    '154.166.0.0/16',
    '154.167.0.0/16',
    '154.168.0.0/16',
    '154.169.0.0/16',
    '154.170.0.0/16',
    '154.171.0.0/16',
    '154.172.0.0/16',
    '154.173.0.0/16',
    '154.174.0.0/16',
    '154.175.0.0/16',
    '154.176.0.0/16',
    '154.177.0.0/16',
    '154.178.0.0/16',
    '154.179.0.0/16',
    '154.180.0.0/16',
    '154.181.0.0/16',
    '154.182.0.0/16',
    '154.183.0.0/16',
    '154.184.0.0/16',
    '154.185.0.0/16',
    '154.186.0.0/16',
    '154.187.0.0/16',
    '154.188.0.0/16',
    '154.189.0.0/16',
    '154.190.0.0/16',
    '154.191.0.0/16',
    '154.192.0.0/16',
    '154.193.0.0/16',
    '154.194.0.0/16',
    '154.195.0.0/16',
    '154.196.0.0/16',
    '154.197.0.0/16',
    '154.198.0.0/16',
    '154.199.0.0/16',
    '154.200.0.0/16',
    '154.201.0.0/16',
    '154.202.0.0/16',
    '154.203.0.0/16',
    '154.204.0.0/16',
    '154.205.0.0/16',
    '154.206.0.0/16',
    '154.207.0.0/16',
    '154.208.0.0/16',
    '154.209.0.0/16',
    '154.210.0.0/16',
    '154.211.0.0/16',
    '154.212.0.0/16',
    '154.213.0.0/16',
    '154.214.0.0/16',
    '154.215.0.0/16',
    '154.216.0.0/16',
    '154.217.0.0/16',
    '154.218.0.0/16',
    '154.219.0.0/16',
    '154.220.0.0/16',
    '154.221.0.0/16',
    '154.222.0.0/16',
    '154.223.0.0/16',
    '154.224.0.0/16',
    '154.225.0.0/16',
    '154.226.0.0/16',
    '154.227.0.0/16',
    '154.228.0.0/16',
    '154.229.0.0/16',
    '154.230.0.0/16',
    '154.231.0.0/16',
    '154.232.0.0/16',
    '154.233.0.0/16',
    '154.234.0.0/16',
    '154.235.0.0/16',
    '154.236.0.0/16',
    '154.237.0.0/16',
    '154.238.0.0/16',
    '154.239.0.0/16',
    '154.240.0.0/16',
    '154.241.0.0/16',
    '154.242.0.0/16',
    '154.243.0.0/16',
    '154.244.0.0/16',
    '154.245.0.0/16',
    '154.246.0.0/16',
    '154.247.0.0/16',
    '154.248.0.0/16',
    '154.249.0.0/16',
    '154.250.0.0/16',
    '154.251.0.0/16',
    '154.252.0.0/16',
    '154.253.0.0/16',
    '154.254.0.0/16',
    '154.255.0.0/16',
  ]
  
  // Simple check - in production, use a proper IP geolocation library
  return ghanaIPRanges.some(range => {
    const [rangeIP, mask] = range.split('/')
    const rangeIPNum = ipToNumber(rangeIP)
    const ipNum = ipToNumber(ip)
    const maskNum = Math.pow(2, 32) - Math.pow(2, 32 - parseInt(mask))
    return (ipNum & maskNum) === (rangeIPNum & maskNum)
  })
}

function ipToNumber(ip: string): number {
  return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet), 0) >>> 0
}

export function formatPercentage(value: number, total: number): number {
  if (total === 0) return 0
  return Math.round((value / total) * 100)
}

export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const cfConnectingIP = request.headers.get('cf-connecting-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  if (realIP) {
    return realIP
  }
  if (cfConnectingIP) {
    return cfConnectingIP
  }
  
  return '127.0.0.1' // fallback
} 