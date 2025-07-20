import { NextApiRequest, NextApiResponse } from 'next';
import { main as seedMain } from '../../prisma/seed';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await seedMain();
    res.status(200).json({ message: 'Seeded successfully' });
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
} 