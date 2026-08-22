import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { fromJson } from '@/lib/json';

/**
 * Dictionary search — جستجوی آزاد هر کلمه
 * ابتدا در دیتابیس محلی جستجو می‌کند؛ اگر پیدا نشد،
 * از دیکشنری رایگان آنلاین (dictionaryapi.dev) استفاده می‌کند
 * تا کاربر بتواند هر کلمه‌ای را جستجو کند.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const q = (req.query.q as string | undefined)?.trim().toLowerCase();
  if (!q) return res.status(400).json({ error: 'Missing query' });

  const word = await prisma.word.findFirst({
    where: { english: { equals: q } },
  });

  let parsedWord = word ? { ...word, related: fromJson<string[]>(word.related) ?? [] } : null;

  if (!parsedWord) {
    const fallback = await prisma.word.findMany({
      where: { english: { contains: q } },
      take: 1,
    });
    if (fallback.length > 0) {
      parsedWord = { ...fallback[0], related: fromJson<string[]>(fallback[0].related) ?? [] };
      return res.status(200).json({ word: parsedWord });
    }
  } else {
    return res.status(200).json({ word: parsedWord });
  }

  try {
    const apiRes = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(q)}`);
    if (apiRes.ok) {
      const data = await apiRes.json();
      if (Array.isArray(data) && data.length > 0) {
        const entry = data[0];
        const meaning = entry.meanings?.[0];
        const def = meaning?.definitions?.[0];
        const phonetic = entry.phonetic || entry.phonetics?.find((p: any) => p.text)?.text || '';
        const example = def?.example || '';
        const definition = def?.definition || '';
        const persianGuess = translateGuess(q);

        const onlineWord = {
          id: `online-${q}`,
          english: entry.word || q,
          persian: persianGuess,
          phonetic: phonetic || '',
          exampleEn: example || `${entry.word} is a useful word.`,
          exampleFa: example ? 'این جمله نمونه‌ای از کاربرد کلمه است.' : 'این کلمه در جملات انگلیسی به کار می‌رود.',
          level: 'intermediate',
          difficulty: 2,
          related: def?.synonyms?.slice(0, 5) || [],
          definition: definition,
          online: true,
        };
        return res.status(200).json({ word: onlineWord });
      }
    }
  } catch {
  }

  return res.status(404).json({
    error: 'کلمه پیدا نشد',
    word: null,
    suggestion: 'املای کلمه را بررسی کن یا کلمه دیگری را امتحان کن.',
  });
}

function translateGuess(word: string): string {
  const map: Record<string, string> = {
    cat: 'گربه', dog: 'سگ', bird: 'پرنده', car: 'ماشین', bus: 'اتوبوس',
    run: 'دویدن', walk: 'راه رفتن', jump: 'پریدن', read: 'خواندن', write: 'نوشتن',
    good: 'خوب', bad: 'بد', big: 'بزرگ', small: 'کوچک', fast: 'سریع',
    slow: 'کند', day: 'روز', night: 'شب', today: 'امروز', tomorrow: 'فردا',
    hello: 'سلام', goodbye: 'خداحافظ', please: 'لطفاً', thank: 'تشکر', sorry: 'متاسفم',
    happy: 'خوشحال', sad: 'غمگین', angry: 'عصبانی', tired: 'خسته', hungry: 'گرسنه',
    eat: 'خوردن', drink: 'نوشیدن', sleep: 'خوابیدن', play: 'بازی کردن', work: 'کار کردن',
    world: 'دنیا', life: 'زندگی', peace: 'صلح', hope: 'امید', dream: 'رویا',
    freedom: 'آزادی', wisdom: 'خرد', knowledge: 'دانش', happiness: 'خوشبختی', friendship: 'دوستی',
  };
  const found = map[word];
  return found || 'معنی این کلمه را از جمله و تعریف متوجه شو (ترجمهٔ دقیق به‌زودی اضافه می‌شود).';
}
