import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { fromJson } from '@/lib/json';

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

  // Parse `related` JSON string back into an array
  const parsed = words.map((w) => ({ ...w, related: fromJson<string[]>(w.related) ?? [] }));

  return res.status(200).json({ words: parsed, count: words.length });
}
