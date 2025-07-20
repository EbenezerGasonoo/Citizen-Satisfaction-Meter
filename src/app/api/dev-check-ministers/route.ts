import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export async function GET() {
  const prisma = new PrismaClient();
  const ministers = await prisma.minister.findMany({
    select: { id: true, fullName: true, portfolio: true }
  });
  return NextResponse.json({ ministers });
} 