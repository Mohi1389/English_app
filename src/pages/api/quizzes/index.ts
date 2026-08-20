import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { bearer, verifyToken } from '@/lib/auth';
import { quizResultSchema } from '@/lib/validators';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Public: list quizzes
  if (req.method === 'GET') {
    const { type } = req.query;
    const quizzes = await prisma.quiz.findMany({
      where: typeof type === 'string' && type !== 'all' ? { type } : {},
      orderBy: { createdAt: 'desc' },
    });
    return res.status(200).json({ quizzes });
  }

  // Protected: submit a quiz result
  if (req.method === 'POST') {
    const token = bearer(req.headers.authorization);
    const payload = token ? verifyToken(token) : null;
    if (!payload) return res.status(401).json({ error: 'Unauthorized' });

    const parsed = quizResultSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid input' });

    const { quizId, score, total, strengths, weaknesses } = parsed.data;

    const result = await prisma.quizResult.create({
      data: {
        userId: payload.userId,
        quizId,
        score,
        total,
        strengths: strengths ?? [],
        weaknesses: weaknesses ?? [],
      },
    });

    // Award XP based on score
    await prisma.user.update({
      where: { id: payload.userId },
      data: { xp: { increment: Math.round(score) } },
    });

    return res.status(201).json({ result });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
