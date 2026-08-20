import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { bearer, verifyToken } from '@/lib/auth';
import { aiMessageSchema } from '@/lib/validators';

/**
 * Persian-first AI tutor system prompt.
 *
 * Rules baked in:
 *  - Always reply in Persian, kind / patient / encouraging
 *  - Never force the user to speak English
 *  - Correct English mistakes and explain WHY in Persian
 *  - On translation requests: English equivalent + example + Persian note
 */
export const SYSTEM_PROMPT = `تو دستیار مهربان، صبور و تشویق‌کننده آموزش زبان انگلیسی در پلتفرم Learn with Mohanna هستی.

قوانین تو:
1. همیشه به زبان فارسی و دوستانه پاسخ بده.
2. کاربر را هرگز مجبور به انگلیسی صحبت کردن نکن.
3. اگر جمله انگلیسی کاربر غلط داشت، اول تشویق کن، بعد شکل درست را بنویس و دلیل اشتباه را فارسی توضیح بده.
4. اگر درخواست ترجمه بود، معادل انگلیسی + یک مثال در جمله + توضیح فارسی بده.
5. می‌توانی گرامر توضیح بدهی، لغت آموزش بدهی، برنامه یادگیری پیشنهاد کنی و تمرین مکالمه بسازی.
6. لحن تو مانند یک همراه یادگیری است — نه یک معلم سختگیر.`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = bearer(req.headers.authorization);
  const payload = token ? verifyToken(token) : null;
  if (!payload) return res.status(401).json({ error: 'Unauthorized' });

  const parsed = aiMessageSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid input' });

  const { conversationId, message } = parsed.data;

  if (!process.env.OPENAI_API_KEY) {
    return res.status(503).json({
      error: 'دستیار هوشمند هنوز وصل نشده است. لطفاً OPENAI_API_KEY را در .env تنطیم کنید.',
    });
  }

  // Load prior messages so the tutor has conversation context
  let history: { role: string; content: string }[] = [];
  if (conversationId) {
    const conv = await prisma.aIConversation.findFirst({
      where: { id: conversationId, userId: payload.userId },
    });
    if (conv && Array.isArray(conv.messages)) {
      history = conv.messages as { role: string; content: string }[];
    }
  }

  const aiRes = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...history,
        { role: 'user', content: message },
      ],
      temperature: 0.7,
    }),
  });

  if (!aiRes.ok) {
    return res.status(502).json({ error: 'پاسخ دستیار هوشمند دریافت نشد، دوباره تلاش کنید.' });
  }

  const json = await aiRes.json();
  const reply: string = json?.choices?.[0]?.message?.content ?? '';

  const nextMessages = [
    ...history,
    { role: 'user', content: message },
    { role: 'assistant', content: reply },
  ];

  // Persist conversation history
  const conv = conversationId
    ? await prisma.aIConversation.update({
        where: { id: conversationId },
        data: { messages: nextMessages },
      })
    : await prisma.aIConversation.create({
        data: {
          userId: payload.userId,
          title: message.slice(0, 60),
          messages: nextMessages,
        },
      });

  return res.status(200).json({ reply, conversationId: conv.id });
}
