import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Search, Volume2, Sparkles, Bot, Loader2, Globe2 } from 'lucide-react';
import Layout from '@/components/Layout';
import { useUI } from '@/lib/ui-context';
import { ACCENT, GRADIENT } from '@/styles/tokens';

interface DictHit {
  id: string;
  english: string;
  persian: string;
  phonetic: string;
  exampleEn: string;
  exampleFa: string;
  related: string[] | null;
  level: string;
  difficulty: number;
  definition?: string;
  online?: boolean;
}

const LEVEL_COLOR: Record<string, string> = {
  beginner: ACCENT.green,
  elementary: ACCENT.teal,
  intermediate: ACCENT.amber,
};

const WORD_EMOJI: Record<string, string> = {
  cat: '🐱', dog: '🐶', bird: '🐦', car: '🚗', bus: '🚌', run: '🏃',
  walk: '🚶', read: '📖', write: '✍️', good: '👍', big: '🐘', small: '🐜',
  day: '☀️', night: '🌙', eat: '🍽️', drink: '🥤', sleep: '😴', play: '🎮',
  work: '💼', world: '🌍', love: '❤️', happy: '😄', music: '🎵', money: '💵',
};

function emojiFor(word: string): string {
  return WORD_EMOJI[word.toLowerCase()] || '✨';
}

export default function DictionaryPage() {
  const { lang, theme } = useUI();
  const router = useRouter();
  const [q, setQ] = useState('');
  const [hit, setHit] = useState<DictHit | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const text = (fa: string, en: string) => (lang === 'fa' ? fa : en);

  async function search() {
    const term = q.trim();
    if (!term) return;
    setLoading(true);
    setNotFound(false);
    try {
      const r = await fetch(`/api/dictionary?q=${encodeURIComponent(term)}`);
      const d = await r.json();
      if (d.word) {
        setHit(d.word);
        setNotFound(false);
      } else {
        setHit(null);
        setNotFound(true);
      }
    } catch {
      setHit(null);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }

  function speak(textVal: string) {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    const u = new SpeechSynthesisUtterance(textVal);
    u.lang = 'en-US';
    window.speechSynthesis.speak(u);
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="rounded-3xl relative overflow-hidden p-6 md:p-8 animate-fade-up"
          style={{ background: 'linear-gradient(135deg, #38BDF8, #8B7CF0)' }}>
          <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'radial-gradient(circle at 30% 30%, #fff 1px, transparent 1px)', backgroundSize: '26px 26px' }} />
          <div className="relative flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shrink-0 animate-float" style={{ backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }}>
              <Globe2 size={26} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white flex items-center gap-2">{text('دیکشنری هوشمند', 'Smart Dictionary')} <Sparkles size={18} /></h2>
              <p className="text-white/85 text-sm mt-1.5 max-w-xl leading-relaxed">
                {text('هر کلمه‌ای که می‌خوای جستجو کن — معنی، تلفظ، مثال و مترادف را فوری ببین.', 'Search any word you want — meaning, pronunciation, examples and synonyms instantly.')}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-2.5 animate-fade-up">
          <div className="relative flex-1">
            <Search size={16} className="absolute top-1/2 -translate-y-1/2" style={{ color: theme.meta, insetInlineStart: '18px' }} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') search(); }}
              placeholder={text('جستجوی هر کلمه انگلیسی…', 'Search any English word…')}
              className="w-full py-3.5 text-base rounded-full border focus:outline-none"
              style={{ backgroundColor: theme.card, borderColor: theme.border, color: theme.text, paddingInlineEnd: '18px', paddingInlineStart: '46px' }}
            />
          </div>
          <button
            onClick={search}
            disabled={loading || !q.trim()}
            className="px-6 py-3.5 rounded-full flex items-center gap-2 text-sm font-bold disabled:opacity-40 transition-all hover:shadow-lg"
            style={{ background: GRADIENT.ocean, color: '#fff' }}
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : text('جستجو', 'Search')}
          </button>
        </div>

        {hit && (
          <div className="rounded-3xl border p-6 md:p-7 animate-fade-up" aria-live="polite" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shrink-0"
                style={{ background: ACCENT.lilac + '18', border: `1px solid ${ACCENT.lilac}30` }}>
                {emojiFor(hit.english)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="text-3xl font-black" dir="ltr">{hit.english}</h3>
                  <button onClick={() => speak(hit.english)} className="w-9 h-9 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                    style={{ backgroundColor: ACCENT.ocean + '18' }}>
                    <Volume2 size={16} style={{ color: ACCENT.ocean }} />
                  </button>
                  {hit.online && (
                    <span className="text-[11px] px-2.5 py-1 rounded-full font-bold" style={{ backgroundColor: ACCENT.green + '18', color: ACCENT.green }}>
                      {text('آنلاین', 'online')}
                    </span>
                  )}
                </div>
                <p className="text-xl font-bold mt-2">{hit.persian}</p>
                {hit.phonetic && <p className="text-sm font-mono mt-1.5" dir="ltr" style={{ color: ACCENT.ocean }}>{hit.phonetic}</p>}
              </div>
              <span className="text-[11px] px-2.5 py-1 rounded-full font-bold border shrink-0"
                style={{ backgroundColor: (LEVEL_COLOR[hit.level] || ACCENT.ocean) + '15', color: theme.sub, borderColor: theme.border }}>
                {hit.level}
              </span>
            </div>

            {hit.definition && (
              <div className="mt-4 p-4 rounded-xl" style={{ backgroundColor: theme.rowHover }}>
                <p className="text-sm leading-relaxed" dir="ltr" style={{ color: theme.sub }}>{hit.definition}</p>
              </div>
            )}

            <div className="mt-4">
              <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: theme.meta }}>{text('مثال', 'Example')}</p>
              <div className="p-4 rounded-xl border" style={{ backgroundColor: theme.rowHover, borderColor: theme.border }}>
                <p className="text-[15px] italic" dir="ltr">“{hit.exampleEn}”</p>
                <p className="text-sm mt-2" style={{ color: theme.sub }}>{hit.exampleFa}</p>
              </div>
            </div>

            {hit.related && hit.related.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: theme.meta }}>{text('مرتبط‌ها', 'Related')}</p>
                <div className="flex flex-wrap gap-2">
                  {hit.related.slice(0, 8).map((rw, i) => (
                    <button key={i} onClick={() => { setQ(rw); setHit(null); setTimeout(search, 0); }}
                      className="text-sm px-3.5 py-1.5 rounded-full border font-medium transition-all hover:-translate-y-0.5" dir="ltr"
                      style={{ backgroundColor: theme.rowHover, borderColor: theme.border, color: theme.sub }}>
                      {rw}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => router.push(`/ai?q=${encodeURIComponent(hit.english)}`)}
              className="mt-5 px-5 py-3 rounded-full flex items-center gap-2 text-sm font-bold transition-all hover:shadow-lg hover:-translate-y-0.5"
              style={{ background: GRADIENT.coral, color: '#fff' }}
            >
              <Bot size={16} /> {text('تمرین این کلمه با هوش مصنوعی', 'Practice this word with AI')}
            </button>
          </div>
        )}

        {notFound && !loading && (
          <div className="rounded-3xl border text-center py-14 animate-fade-up" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
            <span className="text-5xl">🤔</span>
            <p className="text-base font-bold mt-3">{text('کلمه پیدا نشد', 'Word not found')}</p>
            <p className="text-sm mt-1.5" style={{ color: theme.meta }}>
              {text('املای کلمه را بررسی کن یا یک کلمه انگلیسی دیگر امتحان کن.', 'Check the spelling or try another English word.')}
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
