import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import { V2Publisher } from '@/lib/v2/publisher';

export const dynamic = 'force-dynamic';

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  return (session?.user as any)?.role === 'ADMIN';
}

export async function POST(request: NextRequest) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const stagedIds = Array.isArray(body?.stagedIds) ? body.stagedIds.map((id: any) => parseInt(id)) : undefined;
    const forcePending = Boolean(body?.forcePending);

    const publisher = new V2Publisher(prisma);
    const result = await publisher.publish({
      stagedIds,
      forcePending
    });

    return NextResponse.json({
      success: true,
      publishedCount: result.publishedCount,
      createdCount: result.createdCount,
      updatedCount: result.updatedCount,
      errors: result.errors,
      details: result.details
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to publish staged ministers' },
      { status: 500 }
    );
  }
}
