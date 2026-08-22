import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { bearer, verifyToken } from '@/lib/auth';
import { z } from 'zod';
import { AGE_RANGES } from '@/lib/validators';

const settingsSchema = z.object({
  ageRange: z.enum(AGE_RANGES).optional(),
  level: z.string().optional(),
  learningGoal: z.string().optional(),
  settings: z.record(z.any()).optional(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = bearer(req.headers.authorization);
  const payload = token ? verifyToken(token) : null;
  if (!payload) return res.status(401).json({ error: 'Unauthorized' });

  const parsed = settingsSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid input' });

  const { ageRange, level, learningGoal, settings } = parsed.data;
  const data: Record<string, unknown> = { settings };
  if (ageRange) data.ageRange = ageRange;
  if (level) data.level = level;
  if (learningGoal) data.learningGoal = learningGoal;

  const user = await prisma.user.update({
    where: { id: payload.userId },
    data,
    select: { id: true, ageRange: true, level: true, learningGoal: true, settings: true },
  });

  return res.status(200).json({ user });
}
