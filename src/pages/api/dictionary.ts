import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { fromJson } from '@/lib/json';

/**
 * Dictionary search.
 * Looks up a word by its English form (case-insensitive) and returns
 * meaning, phonetics, example with Persian translation, related words and level.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const q = (req.query.q as string | undefined)?.trim().toLowerCase();
  if (!q) return res.status(400).json({ error: 'Missing query' });

  const word = await prisma.word.findFirst({
    where: { english: { equals: q } },
  });

  const parsedWord = word ? { ...word, related: fromJson<string[]>(word.related) ?? [] } : null;

  if (!parsedWord) {
    // Try a prefix / contains match as a fallback
    const fallback = await prisma.word.findMany({
      where: { english: { contains: q } },
      take: 1,
    });
    if (fallback.length === 0) {
      return res.status(404).json({ error: 'کلمه پیدا نشد', word: null });
    }
    const first = { ...fallback[0], related: fromJson<string[]>(fallback[0].related) ?? [] };
    return res.status(200).json({ word: first });
  }

  return res.status(200).json({ word: parsedWord });
}
