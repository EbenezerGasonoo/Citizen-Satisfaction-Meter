import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'
import bcrypt from 'bcryptjs'

// Helper to check admin status
async function isAdmin(req: NextRequest) {
  const session = await getServerSession(authOptions)
  return session?.user?.role === 'ADMIN'
}

// GET: Get current admin profile
export async function GET(request: NextRequest) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No session found' }, { status: 401 })
    }

    const admin = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 })
    }

    return NextResponse.json({ admin })
  } catch (error) {
    console.error('Error fetching admin profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch admin profile' },
      { status: 500 }
    )
  }
}

// PUT: Update admin profile
export async function PUT(request: NextRequest) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No session found' }, { status: 401 })
    }

    const body = await request.json()
    const { name, email, currentPassword, newPassword } = body

    // Get current admin
    const currentAdmin = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!currentAdmin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 })
    }

    // Validate current password if changing password
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: 'Current password is required to change password' },
          { status: 400 }
        )
      }

      const isCurrentPasswordValid = await bcrypt.compare(
        currentPassword,
        currentAdmin.password
      )

      if (!isCurrentPasswordValid) {
        return NextResponse.json(
          { error: 'Current password is incorrect' },
          { status: 400 }
        )
      }

      // Validate new password strength
      if (newPassword.length < 8) {
        return NextResponse.json(
          { error: 'New password must be at least 8 characters long' },
          { status: 400 }
        )
      }
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== currentAdmin.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email }
      })

      if (existingUser) {
        return NextResponse.json(
          { error: 'Email is already taken' },
          { status: 400 }
        )
      }
    }

    // Prepare update data
    const updateData: any = {}
    
    if (name !== undefined) updateData.name = name
    if (email !== undefined) updateData.email = email
    if (newPassword) {
      updateData.password = await bcrypt.hash(newPassword, 10)
    }

    // Update admin
    const updatedAdmin = await prisma.user.update({
      where: { id: currentAdmin.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      admin: updatedAdmin
    })

  } catch (error) {
    console.error('Error updating admin profile:', error)
    return NextResponse.json(
      { error: 'Failed to update admin profile' },
      { status: 500 }
    )
  }
}

// POST: Change password only
export async function POST(request: NextRequest) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No session found' }, { status: 401 })
    }

    const body = await request.json()
    const { currentPassword, newPassword } = body

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Current password and new password are required' },
        { status: 400 }
      )
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'New password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    // Get current admin
    const currentAdmin = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!currentAdmin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 })
    }

    // Validate current password
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      currentAdmin.password
    )

    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 400 }
      )
    }

    // Update password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10)
    
    await prisma.user.update({
      where: { id: currentAdmin.id },
      data: { password: hashedNewPassword }
    })

    return NextResponse.json({
      success: true,
      message: 'Password changed successfully'
    })

  } catch (error) {
    console.error('Error changing password:', error)
    return NextResponse.json(
      { error: 'Failed to change password' },
      { status: 500 }
    )
  }
}
