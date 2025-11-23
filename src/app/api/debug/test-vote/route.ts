import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashClient, getClientIP } from '@/lib/utils'

// Test endpoint to create a test vote and verify database connection
export async function POST(request: NextRequest) {
  try {
    console.log('🧪 Testing vote creation...')
    
    // Test database connection
    const dbTest = await prisma.$queryRaw`SELECT 1 as test`.catch((e) => {
      console.error('Database connection test failed:', e)
      return null
    })
    
    if (!dbTest) {
      return NextResponse.json({
        success: false,
        error: 'Database connection failed',
        details: 'Unable to connect to database'
      }, { status: 500 })
    }
    
    console.log('✅ Database connection successful')
    
    // Get first minister
    const firstMinister = await prisma.minister.findFirst({
      orderBy: { id: 'asc' }
    })
    
    if (!firstMinister) {
      return NextResponse.json({
        success: false,
        error: 'No ministers found in database',
        details: 'Database is empty or ministers table is missing'
      }, { status: 404 })
    }
    
    console.log('✅ Found minister:', firstMinister.id, firstMinister.fullName)
    
    // Get client info
    const ip = getClientIP(request)
    const userAgent = request.headers.get('user-agent') || ''
    const clientHash = hashClient(ip, userAgent) + '_test_' + Date.now()
    
    // Create a test vote
    const testVote = await prisma.vote.create({
      data: {
        ministerId: firstMinister.id,
        positive: true,
        clientHash: clientHash,
      }
    })
    
    console.log('✅ Test vote created:', testVote.id)
    
    // Verify the vote was saved
    const verifyVote = await prisma.vote.findUnique({
      where: { id: testVote.id }
    })
    
    if (!verifyVote) {
      return NextResponse.json({
        success: false,
        error: 'Vote created but not found in database',
        details: 'Transaction may have rolled back'
      }, { status: 500 })
    }
    
    // Get total vote count
    const totalVotes = await prisma.vote.count()
    const realVotes = await prisma.vote.count({
      where: {
        clientHash: {
          not: {
            startsWith: 'demo_vote'
          }
        }
      }
    })
    
    // Clean up test vote
    await prisma.vote.delete({
      where: { id: testVote.id }
    }).catch(e => {
      console.warn('Could not delete test vote:', e)
    })
    
    return NextResponse.json({
      success: true,
      message: 'Vote creation test successful',
      testVote: {
        id: testVote.id,
        ministerId: testVote.ministerId,
        created: !!verifyVote
      },
      database: {
        connected: true,
        totalVotes,
        realVotes,
        testVoteDeleted: true
      }
    })
  } catch (error) {
    console.error('❌ Test vote creation failed:', error)
    return NextResponse.json({
      success: false,
      error: 'Test vote creation failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}

