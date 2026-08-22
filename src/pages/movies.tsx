import React, { useState, useMemo } from 'react';
import { Film, Play, Captions, BookOpen, PlusCircle, Search, Volume2 } from 'lucide-react';
import Layout from '@/components/Layout';
import { useUI } from '@/lib/ui-context';
import { ACCENT } from '@/styles/tokens';

interface Clip {
  id: string;
  title: string;
  titleFa: string;
  source: string;
  duration: string;
  level: string;
  emoji: string;
  summary: string;
  words: { en: string; fa: string }[];
  sentId: number;
}

const CLIPS: Clip[] = [
  { id: 'greetings', title: 'Greetings & Introductions', titleFa: 'سلام و احوالپرسی', source: 'انیمیشن آموزشی', duration: '۳:۱۲', level: 'beginner', emoji: '👋', summary: 'آموزش سلام کردن و معرفی خود به انگلیسی با زیرنویس دو زبانه.', words: [{ en: 'Hello', fa: 'سلام' }, { en: 'Nice to meet you', fa: 'از آشنایی با تو خوشحالم' }, { en: 'How are you?', fa: 'حالت چطور است؟' }], sentId: 1 },
  { id: 'food', title: 'Ordering Food', titleFa: 'سفارش غذا', source: 'فیلم کوتاه', duration: '۴:۴۵', level: 'elementary', emoji: '🍕', summary: 'یادگیری اصطلاحات رستوران و سفارش غذا در موقعیت واقعی.', words: [{ en: 'Menu', fa: 'منو' }, { en: 'Order', fa: 'سفارش' }, { en: 'Delicious', fa: 'خوشمزه' }], sentId: 2 },
  { id: 'daily', title: 'A Day in the Life', titleFa: 'یک روز از زندگی', source: 'انیمیشن آموزشی', duration: '۵:۲۰', level: 'intermediate', emoji: '🌅', summary: 'روتین روزانه با افعال پرکاربرد و عبارات زمانی.', words: [{ en: 'Wake up', fa: 'بیدار شدن' }, { en: 'Get ready', fa: 'آماده شدن' }, { en: 'Routine', fa: 'روتین' }], sentId: 3 },
  { id: 'travel', title: 'At the Airport', titleFa: 'در فرودگاه', source: 'فیلم آموزشی', duration: '۶:۰۸', level: 'intermediate', emoji: '✈️', summary: 'مکالمه‌های فرودگاه: چک‌این، بلیت و پرواز.', words: [{ en: 'Boarding pass', fa: 'کارت پرواز' }, { en: 'Luggage', fa: 'چمدان' }, { en: 'Gate', fa: 'گیت' }], sentId: 4 },
];

function sampleSentence(id: number) {
  const sentences: [string, string, string][] = [
    ['Hello! Nice to meet you.', 'دوست دارم یاد بگیرم اسمم را بگویم.', "The word 'Hello' means a friendly greeting."],
    ["I'd like to order a pizza, please.", 'بخاطر مودبانه‌تر شدن، از would like استفاده می‌کنیم.', "'Would like' is a polite way to say 'want'."],
    ['I wake up at seven every morning.', 'حرف اضافه at برای ساعت مشخص به کار می‌رود.', "We use 'at' for specific times."],
    ['Where is the boarding gate?', 'برای پرسیدن مکان از where استفاده می‌کنیم.', "'Where' asks about a place."],
  ];
  return sentences[id - 1] || sentences[0];
}

const LEVEL_LABEL: Record<string, { fa: string; en: string; color: string }> = {
  beginner: { fa: 'مبتدی', en: 'Beginner', color: ACCENT.green },
  elementary: { fa: 'مقدماتی', en: 'Elementary', color: ACCENT.teal },
  intermediate: { fa: 'متوسط', en: 'Intermediate', color: ACCENT.amber },
};

export default function MoviesPage() {
  const { lang, theme } = useUI();
  const [active, setActive] = useState<Clip | null>(null);
  const [saved, setSaved] = useState<string[]>([]);
  const [q, setQ] = useState('');

  const text = (fa: string, en: string) => (lang === 'fa' ? fa : en);

  const filtered = useMemo(() => CLIPS.filter((c) => !q || c.title.toLowerCase().includes(q.toLowerCase()) || c.titleFa.includes(q)), [q]);

  function speak(t: string) {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    const u = new SpeechSynthesisUtterance(t);
    u.lang = 'en-US';
    window.speechSynthesis.speak(u);
  }

  function toggleSave(w: string) {
    setSaved((s) => (s.includes(w) ? s.filter((x) => x !== w) : [...s, w]));
  }

  if (active) {
    const sent = sampleSentence(active.sentId);
    return (
      <Layout>
        <div className="space-y-5">
          <button onClick={() => setActive(null)} className="text-xs font-semibold px-3 py-1.5 rounded-full border transition-all hover:shadow-sm" style={{ backgroundColor: theme.card, borderColor: theme.border, color: theme.sub }}>
            ← {text('بازگشت', 'Back')}
          </button>

          <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
            <div className="aspect-video relative flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0C4E6E, #072849)' }}>
              <span className="text-6xl">{active.emoji}</span>
              <button className="absolute inset-0 flex items-center justify-center">
                <span className="w-16 h-16 rounded-full flex items-center justify-center transition-transform hover:scale-105" style={{ backgroundColor: 'rgba(255,255,255,0.9)' }}>
                  <Play size={26} style={{ color: ACCENT.ocean }} />
                </span>
              </button>
              <span className="absolute bottom-3 right-3 text-[11px] px-2 py-0.5 rounded bg-black/40 text-white">{active.duration}</span>
            </div>
          </div>

          <div className="rounded-2xl border p-5" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
            <h3 className="text-base font-bold">{text(active.titleFa, active.title)}</h3>
            <p className="text-xs mt-1" style={{ color: theme.sub }}>{active.summary}</p>

            <div className="mt-5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide" style={{ color: theme.meta }}>
                <Captions size={13} />{text('زیرنویس دو زبانه', 'Bilingual subtitles')}
              </div>
              <div className="p-4 rounded-xl border" style={{ backgroundColor: theme.rowHover, borderColor: theme.border }}>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm italic font-medium" dir="ltr">{sent[0]}</p>
                  <button onClick={() => speak(sent[0])} className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: ACCENT.ocean + '18' }}>
                    <Volume2 size={12} style={{ color: ACCENT.ocean }} />
                  </button>
                </div>
                <p className="text-xs mt-1.5" style={{ color: theme.sub }}>{sent[1]}</p>
                <p className="text-[11px] mt-2 p-2 rounded-lg" style={{ backgroundColor: ACCENT.lilac + '12', color: theme.sub }}>{sent[2]}</p>
              </div>
            </div>

            <div className="mt-5">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: theme.meta }}>
                <BookOpen size={13} />{text('لغات این ویدیو', 'Words in this clip')}
              </div>
              <div className="grid gap-2">
                {active.words.map((w) => (
                  <div key={w.en} className="flex items-center justify-between gap-3 p-3 rounded-xl border" style={{ backgroundColor: theme.rowHover, borderColor: theme.border }}>
                    <div className="flex items-center gap-2.5">
                      <button onClick={() => speak(w.en)} className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: ACCENT.ocean + '18' }}>
                        <Volume2 size={12} style={{ color: ACCENT.ocean }} />
                      </button>
                      <div>
                        <p className="text-sm font-semibold" dir="ltr">{w.en}</p>
                        <p className="text-xs" style={{ color: theme.sub }}>{w.fa}</p>
                      </div>
                    </div>
                    <button onClick={() => toggleSave(w.en)} className="w-8 h-8 rounded-lg flex items-center justify-center transition-all" style={{ backgroundColor: saved.includes(w.en) ? ACCENT.coral + '18' : theme.navBg }}>
                      <PlusCircle size={15} style={{ color: saved.includes(w.en) ? ACCENT.coral : theme.meta }} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-5">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0" style={{ backgroundColor: ACCENT.coral + '20' }}>
            <Film size={19} style={{ color: ACCENT.coral }} />
          </div>
          <div>
            <h2 className="text-lg font-bold">{text('فیلم و انیمیشن آموزشی', 'Movies & Animation')}</h2>
            <p className="text-xs mt-1" style={{ color: theme.sub }}>
              {text('آموزش انگلیسی با ویدیو، زیرنویس دو زبانه و استخراج لغات.', 'Learn English with videos, bilingual subtitles and word extraction.')}
            </p>
          </div>
        </div>

        <div className="relative max-w-md">
          <Search size={14} className="absolute top-1/2 -translate-y-1/2" style={{ color: theme.meta, insetInlineStart: '14px' }} />
          <input value={q} onChange={(e) => setQ(e.target.value)}
            placeholder={text('جستجو در ویدیوها…', 'Search clips…')}
            className="w-full py-2.5 text-sm rounded-full border focus:outline-none"
            style={{ backgroundColor: theme.card, borderColor: theme.border, color: theme.text, paddingInlineStart: '40px', paddingInlineEnd: '16px' }} />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((c) => {
            const lvl = LEVEL_LABEL[c.level] || LEVEL_LABEL.beginner;
            return (
              <button key={c.id} onClick={() => setActive(c)}
                className="rounded-2xl border overflow-hidden text-start hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
                style={{ backgroundColor: theme.card, borderColor: theme.border }}>
                <div className="aspect-[16/8] relative flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0C4E6E, #072849)' }}>
                  <span className="text-5xl">{c.emoji}</span>
                  <span className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <span className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.9)' }}>
                      <Play size={20} style={{ color: ACCENT.ocean }} />
                    </span>
                  </span>
                  <span className="absolute bottom-2 right-2 text-[10px] px-2 py-0.5 rounded bg-black/40 text-white">{c.duration}</span>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-semibold">{text(c.titleFa, c.title)}</h4>
                    <span className="text-[9px] px-2 py-0.5 rounded-full font-semibold shrink-0" style={{ backgroundColor: lvl.color + '18', color: theme.sub }}>{text(lvl.fa, lvl.en)}</span>
                  </div>
                  <p className="text-[11px] mt-1.5" style={{ color: theme.meta }}>{c.summary}</p>
                </div>
              </button>
            );
          })}
        </div>

        {saved.length > 0 && (
          <p className="text-[11px] text-center" style={{ color: theme.meta }}>
            {text(`شما ${saved.length} عبارت ذخیره کرده‌اید.`, `You've saved ${saved.length} phrases.`)}
          </p>
        )}
      </div>
    </Layout>
  );
}
