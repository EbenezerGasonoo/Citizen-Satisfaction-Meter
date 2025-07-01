import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const actions = await prisma.action.findMany({
      include: { minister: true },
      orderBy: { date: 'desc' },
    });
    return NextResponse.json({ actions });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch actions' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, status, date, impact, ministerId } = body;
    if (!title || !description || !status || !date || !impact || !ministerId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const action = await prisma.action.create({
      data: {
        title,
        description,
        status,
        date: new Date(date),
        impact,
        ministerId: Number(ministerId),
      },
    });
    return NextResponse.json(action);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create action' }, { status: 500 });
  }
} 