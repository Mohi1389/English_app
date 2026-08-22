import React, { useEffect, useState, useMemo } from 'react';
import { BookOpen, Volume2, Bookmark, BookmarkCheck, Search, Loader2, Sparkles } from 'lucide-react';
import Layout from '@/components/Layout';
import { useUI } from '@/lib/ui-context';
import { useAuth } from '@/lib/auth-context';
import { ACCENT, GRADIENT } from '@/styles/tokens';

interface Word {
  id: string;
  english: string;
  persian: string;
  phonetic: string;
  exampleEn: string;
  exampleFa: string;
  level: string;
  difficulty: number;
}

const LEVEL_COLOR: Record<string, string> = {
  beginner: ACCENT.green,
  elementary: ACCENT.teal,
  intermediate: ACCENT.amber,
};

const LEVEL_LABEL: Record<string, { fa: string; en: string }> = {
  beginner: { fa: 'مبتدی', en: 'Beginner' },
  elementary: { fa: 'مقدماتی', en: 'Elementary' },
  intermediate: { fa: 'متوسط', en: 'Intermediate' },
};

const WORD_EMOJI: Record<string, string> = {
  learn: '🧠', friend: '🤝', confident: '💪', hello: '👋', help: '🙌',
  beautiful: '🌸', travel: '✈️', delicious: '😋', understand: '💡', important: '⭐',
  practice: '🎯', mother: '👩', school: '🏫', yesterday: '📅', achieve: '🏆',
  book: '📖', happy: '😄', journey: '🗺️', apple: '🍎', house: '🏠',
  family: '👨‍👩‍👧‍👦', water: '💧', sun: '☀️', moon: '🌙', star: '🌟',
  love: '❤️', food: '🍕', music: '🎵', time: '⏰', money: '💵',
};

function emojiFor(word: string): string {
  return WORD_EMOJI[word.toLowerCase()] || '✨';
}

export default function WordsPage() {
  const { lang, theme } = useUI();
  const { token } = useAuth();

  const [words, setWords] = useState<Word[]>([]);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [q, setQ] = useState('');
  const [level, setLevel] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/words?level=${level}&take=200`)
      .then((r) => r.json())
      .then((d) => setWords(d.words || []))
      .finally(() => setLoading(false));
  }, [level]);

  useEffect(() => {
    if (!token) return;
    fetch('/api/words/saved', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.saved) setSavedIds(new Set(d.saved.map((s: { wordId: string }) => s.wordId)));
      })
      .catch(() => undefined);
  }, [token]);

  const filtered = useMemo(
    () => words.filter((w) =>
      !q ||
      w.english.toLowerCase().includes(q.toLowerCase()) ||
      w.persian.includes(q)),
    [words, q],
  );

  async function toggleSave(w: Word) {
    if (!token) return;
    const isSaved = savedIds.has(w.id);
    setSavedIds((prev) => {
      const next = new Set(prev);
      isSaved ? next.delete(w.id) : next.add(w.id);
      return next;
    });
    await fetch('/api/words/saved', {
      method: isSaved ? 'DELETE' : 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ wordId: w.id }),
    });
  }

  function speak(text: string) {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    window.speechSynthesis.speak(u);
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="rounded-3xl relative overflow-hidden p-6 md:p-8 animate-fade-up" style={{ background: GRADIENT.teal }}>
          <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'radial-gradient(circle at 30% 30%, #fff 1px, transparent 1px)', backgroundSize: '26px 26px' }} />
          <div className="relative flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shrink-0 animate-float" style={{ backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }}>
              <BookOpen size={26} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white flex items-center gap-2">{lang === 'fa' ? 'لغات تصویری' : 'Visual Words'} <Sparkles size={18} /></h2>
              <p className="text-white/85 text-sm mt-1.5 max-w-xl leading-relaxed">
                {lang === 'fa' ? 'هر لغت با تصویر، معنی فارسی، تلفظ و جمله نمونه — یاد بگیر و ذخیره کن.' : 'Every word with an image, Persian meaning, pronunciation and example.'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap animate-fade-up">
          <div className="relative flex-1 min-w-[220px] max-w-md">
            <Search size={15} className="absolute top-1/2 -translate-y-1/2" style={{ color: theme.meta, insetInlineStart: '16px' }} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={lang === 'fa' ? 'جستجوی لغت یا معنی…' : 'Search word or meaning…'}
              className="w-full py-3 text-base rounded-full border focus:outline-none transition-all"
              style={{ backgroundColor: theme.card, borderColor: theme.border, color: theme.text, paddingInlineStart: '42px', paddingInlineEnd: '16px' }}
            />
          </div>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="text-sm rounded-full border px-4 py-3 focus:outline-none"
            style={{ backgroundColor: theme.card, borderColor: theme.border, color: theme.text }}
          >
            <option value="all">{lang === 'fa' ? 'همه سطوح' : 'All levels'}</option>
            <option value="beginner">Beginner</option>
            <option value="elementary">Elementary</option>
            <option value="intermediate">Intermediate</option>
          </select>
          <span className="text-sm font-bold" style={{ color: theme.meta }}>{filtered.length} {lang === 'fa' ? 'لغت' : 'words'}</span>
        </div>

        {loading && (
          <div className="text-center py-16">
            <Loader2 size={28} className="mx-auto animate-spin" style={{ color: ACCENT.ocean }} />
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((w) => {
            const color = LEVEL_COLOR[w.level] || ACCENT.ocean;
            const isSaved = savedIds.has(w.id);
            const emoji = emojiFor(w.english);
            return (
              <div key={w.id} className="group rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl animate-fade-up"
                style={{ backgroundColor: theme.card, borderColor: theme.border }}>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                    style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
                    {emoji}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-xl font-black" dir="ltr">{w.english}</h3>
                      <button onClick={() => speak(w.english)}
                        className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform hover:scale-110"
                        style={{ backgroundColor: ACCENT.ocean + '18' }} aria-label="Play">
                        <Volume2 size={12} style={{ color: ACCENT.ocean }} />
                      </button>
                    </div>
                    <p className="text-xs font-mono mt-0.5" dir="ltr" style={{ color: ACCENT.ocean }}>{w.phonetic}</p>
                    <p className="text-base mt-1.5 font-bold">{w.persian}</p>
                  </div>
                  <button onClick={() => toggleSave(w)} disabled={!token}
                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 disabled:opacity-40 shrink-0"
                    style={{ backgroundColor: isSaved ? ACCENT.coral + '20' : theme.rowHover }}>
                    {isSaved ? <BookmarkCheck size={15} style={{ color: ACCENT.coral }} /> : <Bookmark size={15} style={{ color: theme.meta }} />}
                  </button>
                </div>

                <div className="flex items-center gap-2 mt-3">
                  <span className="text-[11px] px-2.5 py-1 rounded-full font-bold border"
                    style={{ backgroundColor: color + '15', color, borderColor: color + '30' }}>
                    {LEVEL_LABEL[w.level]?.[lang] || w.level}
                  </span>
                </div>

                <div className="mt-3 p-3.5 rounded-xl border" style={{ backgroundColor: theme.rowHover, borderColor: theme.border }}>
                  <p className="text-sm italic" dir="ltr">“{w.exampleEn}”</p>
                  <p className="text-sm mt-1.5" style={{ color: theme.sub }}>{w.exampleFa}</p>
                </div>
              </div>
            );
          })}
        </div>

        {!loading && filtered.length === 0 && (
          <div className="rounded-2xl border text-center py-16 animate-fade-up" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
            <span className="text-5xl">🔍</span>
            <p className="text-base font-bold mt-3">{lang === 'fa' ? 'لغتی با این فیلترها پیدا نشد' : 'No words match your filters'}</p>
            <p className="text-sm mt-1" style={{ color: theme.meta }}>{lang === 'fa' ? 'لغت دیگری را امتحان کن یا از دیکشنری هوشمند کمک بگیر.' : 'Try another word or use the smart dictionary.'}</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
