import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { verifyPassword, signToken } from '@/lib/auth';
import { loginSchema } from '@/lib/validators';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return res.status(401).json({ error: 'ایمیل یا رمز عبور اشتباه است' });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { lastActiveDate: new Date() },
  });

  const token = signToken({ userId: user.id, email: user.email });

  return res.status(200).json({
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      level: user.level,
      learningGoal: user.learningGoal,
      ageRange: user.ageRange,
      xp: user.xp,
      streakDays: user.streakDays,
    },
    token,
  });
}
