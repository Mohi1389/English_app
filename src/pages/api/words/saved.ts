import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { bearer, verifyToken } from '@/lib/auth';
import { savedWordSchema } from '@/lib/validators';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = bearer(req.headers.authorization);
  const payload = token ? verifyToken(token) : null;
  if (!payload) return res.status(401).json({ error: 'Unauthorized' });

  // List saved words
  if (req.method === 'GET') {
    const saved = await prisma.savedWord.findMany({
      where: { userId: payload.userId },
      include: { word: true },
      orderBy: { createdAt: 'desc' },
    });
    return res.status(200).json({ saved });
  }

  // Save a word
  if (req.method === 'POST') {
    const parsed = savedWordSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid input' });

    const row = await prisma.savedWord.upsert({
      where: { userId_wordId: { userId: payload.userId, wordId: parsed.data.wordId } },
      update: {},
      create: { userId: payload.userId, wordId: parsed.data.wordId },
    });
    return res.status(201).json({ saved: row });
  }

  // Unsave a word
  if (req.method === 'DELETE') {
    const parsed = savedWordSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid input' });

    await prisma.savedWord.deleteMany({
      where: { userId: payload.userId, wordId: parsed.data.wordId },
    });
    return res.status(204).end();
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
