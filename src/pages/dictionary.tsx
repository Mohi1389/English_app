import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Search, Volume2, Sparkles, Bot, Loader2, Book, Languages } from 'lucide-react';
import Layout from '@/components/Layout';
import { useUI } from '@/lib/ui-context';
import { useAuth } from '@/lib/auth-context';
import { ACCENT } from '@/styles/tokens';

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
}

const LEVEL_COLOR: Record<string, string> = {
  beginner: ACCENT.green,
  elementary: ACCENT.teal,
  intermediate: ACCENT.amber,
};

export default function DictionaryPage() {
  const { lang, theme } = useUI();
  const router = useRouter();
  const { token } = useAuth();
  const [q, setQ] = useState('');
  const [hit, setHit] = useState<DictHit | null>(null);
  const [loading, setLoading] = useState(false);

  const text = (fa: string, en: string) => (lang === 'fa' ? fa : en);

  async function search() {
    const term = q.trim();
    if (!term) return;
    setLoading(true);
    try {
      const r = await fetch(`/api/dictionary?q=${encodeURIComponent(term)}`);
      const d = await r.json();
      setHit(d.word || null);
    } catch {
      setHit(null);
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
      <div className="space-y-5">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0" style={{ backgroundColor: ACCENT.lilac + '20' }}>
            <Search size={19} style={{ color: ACCENT.lilac }} />
          </div>
          <div>
            <h2 className="text-lg font-bold">{text('دیکشنری هوشمند', 'Smart Dictionary')}</h2>
            <p className="text-xs mt-1" style={{ color: theme.sub }}>
              {text('هر کلمه را جستجو کن تا معنی، تلفظ، مثال و سطح آن را ببینی.', 'Search any word for meaning, pronunciation, examples and level.')}
            </p>
          </div>
        </div>

        <div className="flex gap-2.5">
          <div className="relative flex-1">
            <Search size={15} className="absolute top-1/2 -translate-y-1/2" style={{ color: theme.meta, insetInlineStart: '16px' }} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') search(); }}
              placeholder={text('جستجوی کلمه…', 'Search a word…')}
              className="w-full py-3 text-sm rounded-full border focus:outline-none"
              style={{ backgroundColor: theme.card, borderColor: theme.border, color: theme.text, paddingInlineEnd: '16px', paddingInlineStart: '42px' }}
            />
          </div>
          <button
            onClick={search}
            disabled={loading || !q.trim()}
            className="px-5 py-3 rounded-full flex items-center gap-2 text-sm font-semibold disabled:opacity-40"
            style={{ backgroundColor: ACCENT.ocean, color: '#fff' }}
          >
            {loading ? <Loader2 size={15} className="animate-spin" /> : text('جستجو', 'Search')}
          </button>
        </div>

        {hit && (
          <div className="rounded-2xl border p-5 md:p-6 aria-live="polite"" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-3">
                <h3 className="text-2xl font-bold" dir="ltr">{hit.english}</h3>
                <button onClick={() => speak(hit.english)} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: ACCENT.ocean + '18' }}>
                  <Volume2 size={16} style={{ color: ACCENT.ocean }} />
                </button>
              </div>
              <span className="text-[10px] px-2.5 py-1 rounded-full font-semibold border" style={{ backgroundColor: (LEVEL_COLOR[hit.level] ? LEVEL_COLOR[hit.level] : ACCENT.ocean) + '15', color: theme.sub, borderColor: theme.border }}>{hit.level}</span>
            </div>

            <p className="text-[22px] font-bold mt-2" style={{ color: theme.text }}>{hit.persian}</p>
            <p className="text-[12px] font-mono mt-1" dir="ltr" style={{ color: ACCENT.ocean }}>{hit.phonetic}</p>

            <div className="mt-4 space-y-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: theme.meta }}>{text('مثال', 'Example')}</p>
              <div className="p-4 rounded-xl border" style={{ backgroundColor: theme.rowHover, borderColor: theme.border }}>
                <p className="text-[13px] italic" dir="ltr">“{hit.exampleEn}”</p>
                <p className="text-[12px] mt-1.5" style={{ color: theme.sub }}>{hit.exampleFa}</p>
              </div>
            </div>

            {hit.related && hit.related.length > 0 && (
              <div className="mt-4">
                <p className="text-[10px] font-semibold uppercase tracking-wide mb-2" style={{ color: theme.meta }}>{text('کلمات مرتبط', 'Related words')}</p>
                <div className="flex flex-wrap gap-2">
                  {hit.related.slice(0, 7).map((rw, i) => (
                    <button key={i} onClick={() => { setQ(rw); setHit(null); setTimeout(search, 0); }}
                      className="text-[11px] px-3 py-1.5 rounded-full border dir="ltr" font-medium"
                      style={{ backgroundColor: theme.rowHover, borderColor: theme.border, color: theme.sub }}>
                      {rw}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => router.push(`/ai?q=${encodeURIComponent(hit.english)}`)}
              className="mt-5 px-4 py-2.5 rounded-full flex items-center gap-2 text-sm font-semibold transition-all hover:shadow-md"
              style={{ backgroundColor: ACCENT.coral, color: '#1A1A1A' }}
            >
              <Bot size={15} /> {text('تمرین این کلمه با هوش مصنوعی', 'Practice this word with AI')}
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}
