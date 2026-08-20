import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { level, q, take } = req.query;

  const words = await prisma.word.findMany({
    where: {
      ...(typeof level === 'string' && level !== 'all' ? { level } : {}),
      ...(typeof q === 'string' && q
        ? {
            OR: [
              { english: { contains: q } },
              { persian: { contains: q } },
            ],
          }
        : {}),
    },
    take: typeof take === 'string' ? Math.min(Number(take) || 50, 200) : 50,
    orderBy: { createdAt: 'desc' },
  });

  return res.status(200).json({ words, count: words.length });
}
