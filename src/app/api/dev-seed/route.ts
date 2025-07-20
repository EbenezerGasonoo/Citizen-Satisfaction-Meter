import { NextResponse } from 'next/server';
import { main as seedMain } from '../../../../prisma/seed';

export async function GET() {
  try {
    await seedMain();
    return NextResponse.json({ message: 'Seeded successfully' });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
} 