import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { bearer, verifyToken } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = bearer(req.headers.authorization);
  const payload = token ? verifyToken(token) : null;

  if (!payload) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      fullName: true,
      email: true,
      ageRange: true,
      level: true,
      learningGoal: true,
      xp: true,
      streakDays: true,
      settings: true,
      createdAt: true,
      _count: {
        select: { savedWords: true, quizResults: true, aiConversations: true },
      },
    },
  });

  if (!user) return res.status(404).json({ error: 'User not found' });

  return res.status(200).json({ user });
}
