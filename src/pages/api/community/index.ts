import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { bearer, verifyToken } from '@/lib/auth';
import { z } from 'zod';

const BAD_WORDS = ['fuck', 'shit', 'bitch', 'asshole', 'stupid', 'بیشعور', 'احمق', 'گه', 'کیری', 'لعنتی'];

const postSchema = z.object({
  room: z.string().min(1),
  content: z.string().min(1).max(1000),
});

function clean(text: string): string {
  let out = text;
  for (const w of BAD_WORDS) {
    const re = new RegExp(w, 'gi');
    out = out.replace(re, '•'.repeat(w.length));
  }
  return out;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Public: list posts in a room
  if (req.method === 'GET') {
    const room = (req.query.room as string | undefined) || 'english-lounge';
    const posts = await prisma.communityPost.findMany({
      where: { room },
      include: { user: { select: { fullName: true } } },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    return res.status(200).json({ posts });
  }

  // Protected: create a post
  if (req.method === 'POST') {
    const token = bearer(req.headers.authorization);
    const payload = token ? verifyToken(token) : null;
    if (!payload) return res.status(401).json({ error: 'Unauthorized' });

    const parsed = postSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid input' });

    const { room, content } = parsed.data;
    const post = await prisma.communityPost.create({
      data: { userId: payload.userId, room, content: clean(content) },
      include: { user: { select: { fullName: true } } },
    });
    return res.status(201).json({ post });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
