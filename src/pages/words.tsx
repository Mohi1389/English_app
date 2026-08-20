import React, { useEffect, useState, useMemo } from 'react';
import { BookOpen, Volume2, Bookmark, BookmarkCheck, Bot, Search, Loader2 } from 'lucide-react';
import Layout from '@/components/Layout';
import { useUI } from '@/lib/ui-context';
import { useAuth } from '@/lib/auth-context';
import { ACCENT } from '@/styles/tokens';

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

export default function WordsPage() {
  const { lang, theme } = useUI();
  const { token } = useAuth();

  const [words, setWords] = useState<Word[]>([]);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [q, setQ] = useState('');
  const [level, setLevel] = useState('all');
  const [loading, setLoading] = useState(true);

  // Load words
  useEffect(() => {
    setLoading(true);
    fetch(`/api/words?level=${level}&take=100`)
      .then((r) => r.json())
      .then((d) => setWords(d.words || []))
      .finally(() => setLoading(false));
  }, [level]);

  // Load which words the user has saved
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
      <div className="space-y-5">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0" style={{ backgroundColor: ACCENT.teal + '20' }}>
            <BookOpen size={19} style={{ color: ACCENT.teal }} />
          </div>
          <div>
            <h2 className="text-lg font-bold">{lang === 'fa' ? 'لغات آموزشی' : 'Vocabulary'}</h2>
            <p className="text-xs mt-1" style={{ color: theme.sub }}>
              {lang === 'fa'
                ? 'هر لغت با معنی، تلفظ، جمله نمونه و ترجمه — ذخیره کن و تمرین کن.'
                : 'Every word with meaning, phonetics, example and translation.'}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="relative flex-1 min-w-[220px] max-w-md">
            <Search size={14} className="absolute top-1/2 -translate-y-1/2" style={{ color: theme.meta, insetInlineStart: '14px' }} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={lang === 'fa' ? 'جستجوی لغت یا معنی…' : 'Search word or meaning…'}
              className="w-full py-2.5 text-sm rounded-full border focus:outline-none transition-all"
              style={{ backgroundColor: theme.card, borderColor: theme.border, color: theme.text, paddingInlineStart: '40px', paddingInlineEnd: '16px' }}
            />
          </div>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="text-sm rounded-full border px-4 py-2.5 focus:outline-none"
            style={{ backgroundColor: theme.card, borderColor: theme.border, color: theme.text }}
          >
            <option value="all">{lang === 'fa' ? 'همه سطوح' : 'All levels'}</option>
            <option value="beginner">Beginner</option>
            <option value="elementary">Elementary</option>
            <option value="intermediate">Intermediate</option>
          </select>
          <span className="text-[11px] font-medium" style={{ color: theme.meta }}>
            {filtered.length} / {words.length}
          </span>
        </div>

        {loading && (
          <div className="text-center py-14">
            <Loader2 size={26} className="mx-auto animate-spin" style={{ color: ACCENT.ocean }} />
          </div>
        )}

        {/* Word cards */}
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((w) => {
            const color = LEVEL_COLOR[w.level] || ACCENT.ocean;
            const isSaved = savedIds.has(w.id);
            return (
              <div
                key={w.id}
                className="rounded-2xl border p-5 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
                style={{ backgroundColor: theme.card, borderColor: theme.border }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-bold" dir="ltr">{w.english}</h3>
                      <button
                        onClick={() => speak(w.english)}
                        className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                        style={{ backgroundColor: ACCENT.ocean + '15' }}
                        aria-label="Play pronunciation"
                      >
                        <Volume2 size={11} style={{ color: ACCENT.ocean }} />
                      </button>
                    </div>
                    <p className="text-[11px] font-mono mt-0.5" dir="ltr" style={{ color: ACCENT.ocean }}>{w.phonetic}</p>
                    <p className="text-[13px] mt-2 font-medium">{w.persian}</p>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span
                      className="text-[10px] px-2.5 py-1 rounded-full font-semibold border whitespace-nowrap"
                      style={{ backgroundColor: color + '12', color: theme.sub, borderColor: color + '30' }}
                    >
                      {w.level}
                    </span>
                    <button
                      onClick={() => toggleSave(w)}
                      disabled={!token}
                      className="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 disabled:opacity-40"
                      style={{ backgroundColor: isSaved ? ACCENT.coral + '18' : theme.rowHover }}
                    >
                      {isSaved
                        ? <BookmarkCheck size={13} style={{ color: ACCENT.coral }} />
                        : <Bookmark size={13} style={{ color: theme.meta }} />}
                    </button>
                  </div>
                </div>

                <div className="mt-3.5 p-3.5 rounded-xl border" style={{ backgroundColor: theme.rowHover, borderColor: theme.border }}>
                  <p className="text-[12px] italic" dir="ltr">“{w.exampleEn}”</p>
                  <p className="text-[11px] mt-1.5" style={{ color: theme.sub }}>{w.exampleFa}</p>
                </div>
              </div>
            );
          })}
        </div>

        {!loading && filtered.length === 0 && (
          <div className="rounded-2xl border text-center py-14" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
            <BookOpen size={28} className="mx-auto mb-3" style={{ color: theme.border }} />
            <p className="text-sm" style={{ color: theme.meta }}>
              {lang === 'fa' ? 'لغتی با این فیلترها پیدا نشد' : 'No words match your filters'}
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
