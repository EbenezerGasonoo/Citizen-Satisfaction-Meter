import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    const body = await req.json();
    const { title, description, status, date, impact, ministerId } = body;
    if (!title || !description || !status || !date || !impact || !ministerId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const action = await prisma.action.update({
      where: { id },
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
    return NextResponse.json({ error: 'Failed to update action' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    await prisma.action.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete action' }, { status: 500 });
  }
} 