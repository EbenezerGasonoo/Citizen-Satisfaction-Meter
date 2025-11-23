import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const ministerId = searchParams.get('ministerId');
    if (ministerId) {
        const statements = await prisma.statement.findMany({
            where: { ministerId: Number(ministerId) },
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(statements);
    }
    const all = await prisma.statement.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(all);
}

export async function POST(request: Request) {
    const { content, ministerId } = await request.json();
    if (!content || !ministerId) {
        return NextResponse.json({ error: 'content and ministerId required' }, { status: 400 });
    }
    const stmt = await prisma.statement.create({
        data: { content, ministerId: Number(ministerId) },
    });
    return NextResponse.json(stmt, { status: 201 });
}

export async function PUT(request: Request) {
    const { id, content } = await request.json();
    if (!id || !content) {
        return NextResponse.json({ error: 'id and content required' }, { status: 400 });
    }
    const stmt = await prisma.statement.update({
        where: { id: Number(id) },
        data: { content },
    });
    return NextResponse.json(stmt);
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
        return NextResponse.json({ error: 'id query param required' }, { status: 400 });
    }
    await prisma.statement.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
}
