import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { hashPassword, signToken } from '@/lib/auth';
import { signupSchema } from '@/lib/validators';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message || 'Invalid input' });
  }

  const { fullName, email, password, ageRange, level, learningGoal } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(409).json({ error: 'این ایمیل قبلاً ثبت شده است' });
  }

  const user = await prisma.user.create({
    data: {
      fullName,
      email,
      passwordHash: await hashPassword(password),
      ageRange,
      level,
      learningGoal,
      lastActiveDate: new Date(),
    },
    select: { id: true, fullName: true, email: true, level: true, learningGoal: true, ageRange: true },
  });

  const token = signToken({ userId: user.id, email: user.email });

  return res.status(201).json({ user, token });
}
