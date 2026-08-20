import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { bearer, verifyToken } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = bearer(req.headers.authorization);
  const payload = token ? verifyToken(token) : null;
  if (!payload) return res.status(401).json({ error: 'Unauthorized' });

  if (req.method === 'GET') {
    const conversations = await prisma.aIConversation.findMany({
      where: { userId: payload.userId },
      orderBy: { updatedAt: 'desc' },
      take: 50,
    });
    return res.status(200).json({ conversations });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
