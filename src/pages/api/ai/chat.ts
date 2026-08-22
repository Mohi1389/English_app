import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { bearer, verifyToken } from '@/lib/auth';
import { aiMessageSchema } from '@/lib/validators';
import { fromJson } from '@/lib/json';

/**
 * Persian-first AI tutor system prompt.
 *
 * Rules baked in:
 *   - Always reply in Persian, kind / patient / encouraging
 *   - Never force the user to speak English
 *   - Correct English mistakes and explain WHY in Persian
 *   - On translation requests: English equivalent + example + Persian note
 */
export const SYSTEM_PROMPT = `تو یک دستیار مهربان و صبور و تشویق‌کننده هستی و به‌کمک فارسی‌زبان‌ها در یادگیری زبان انگلیسی کمک می‌کنی. نام تو پلتفرم Learn with Mohanna هستی.

قوانین تو:
1. همیشه به زبان فارسی و روان پاسخ بده.
2. هرگز کاربر را مجبور نکن که انگلیسی صحبت کند و برنامه را انگلیسی بگوید.
3. اگر کاربر جمله انگلیسی اشتباه نوشت، جمله صحیح را همراه با دلیل فارسی توضیح بده و با مهربانی آموزش بده.
4. اگر کاربر درخواست ترجمه داد، معادل انگلیسی + مثال + توضیح فارسی بده.
5. اگر کاربر سوال گرامری داشت، جمله را آموزش بده و با مهربانی پاسخ بده.
6. وقتی کاربر درخواست مهارت یا برنامه یادگیری دارد، برنامه مطالعه و تمرین فارسی پیشنهاد بده.`;

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
      error: 'دستیار هوش مصنوعی هنوز فعال نیست. لطفاً OPENAI_API_KEY را در .env تنظیم کنید.',
    });
  }

  // Load prior messages so the tutor has conversation context
  let history: { role: string; content: string }[] = [];
  if (conversationId) {
    const conv = await prisma.aIConversation.findFirst({
      where: { id: conversationId, userId: payload.userId },
    });
    if (conv) {
      const parsedHistory = fromJson<{ role: string; content: string }[]>(conv.messages);
      if (Array.isArray(parsedHistory)) history = parsedHistory;
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
    return res.status(502).json({ error: 'پاسخ دستیار هوش مصنوعی برنگشت. لطفاً دوباره تلاش کن.' });
  }

  const json = await aiRes.json();
  const reply: string = json?.choices?.[0]?.message?.content ?? '';

  const nextMessages = [
    ...history,
    { role: 'user', content: message },
    { role: 'assistant', content: reply },
  ];

  const messagesJson = JSON.stringify(nextMessages);

  // Persist conversation history (messages stored as a JSON string)
  const conv = conversationId
    ? await prisma.aIConversation.update({
        where: { id: conversationId },
        data: { messages: messagesJson },
      })
    : await prisma.aIConversation.create({
        data: {
          userId: payload.userId,
          title: message.slice(0, 60),
          messages: messagesJson,
        },
      });

  return res.status(200).json({ reply, conversationId: conv.id });
}
