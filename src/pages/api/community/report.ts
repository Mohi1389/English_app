import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { bearer, verifyToken } from '@/lib/auth';
import { z } from 'zod';

const reportSchema = z.object({ postId: z.string().min(1) });

/**
 * Report inappropriate content.
 * A full moderation queue would store these; for now we acknowledge them.
 * In production this should create a Report record and/or notify moderators.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = bearer(req.headers.authorization);
  const payload = token ? verifyToken(token) : null;
  if (!payload) return res.status(401).json({ error: 'Unauthorized' });

  const parsed = reportSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid input' });

  const post = await prisma.communityPost.findUnique({ where: { id: parsed.data.postId } });
  if (!post) return res.status(404).json({ error: 'Post not found' });

  // TODO: persist to a moderation queue with the reporter's userId.
  return res.status(200).json({ ok: true });
}
