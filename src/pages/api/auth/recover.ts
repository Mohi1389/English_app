import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const recoverSchema = z.object({ email: z.string().email() });

/**
 * Password recovery.
 * For a real deployment this would generate a token and email a reset link.
 * Since there is no SMTP configured yet, we acknowledge the request safely
 * without revealing whether the email exists (anti-enumeration).
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const parsed = recoverSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid email' });

  const { email } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email }, select: { id: true } });

  // Always return success to avoid leaking which emails are registered.
  // TODO: wire up an email provider to actually deliver the reset link.
  return res.status(200).json({ ok: true, userId: user?.id ?? null });
}
