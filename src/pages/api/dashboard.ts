import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { bearer, verifyToken } from '@/lib/auth';

/** Aggregated dashboard payload: profile + counts + progress. */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = bearer(req.headers.authorization);
  const payload = token ? verifyToken(token) : null;
  if (!payload) return res.status(401).json({ error: 'Unauthorized' });

  const [user, savedCount, quizResults, aiCount, totalWords] = await Promise.all([
    prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        fullName: true,
        level: true,
        learningGoal: true,
        ageRange: true,
        xp: true,
        streakDays: true,
      },
    }),
    prisma.savedWord.count({ where: { userId: payload.userId } }),
    prisma.quizResult.findMany({
      where: { userId: payload.userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
    prisma.aIConversation.count({ where: { userId: payload.userId } }),
    prisma.word.count(),
  ]);

  if (!user) return res.status(404).json({ error: 'User not found' });

  const avgScore = quizResults.length
    ? Math.round(quizResults.reduce((a, r) => a + r.score, 0) / quizResults.length)
    : 0;

  return res.status(200).json({
    user,
    stats: {
      savedWords: savedCount,
      quizzesDone: quizResults.length,
      aiChats: aiCount,
      totalWords,
      avgScore,
      progressPercent: Math.min(100, Math.round((user.xp / 3000) * 100)),
    },
    recentResults: quizResults,
  });
}
