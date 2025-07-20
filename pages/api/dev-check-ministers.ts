import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const prisma = new PrismaClient();
  const ministers = await prisma.minister.findMany({
    select: { id: true, fullName: true, portfolio: true }
  });
  res.status(200).json({ ministers });
} 