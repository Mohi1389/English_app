import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ClipboardCheck, Loader2, CheckCircle2, XCircle, Award, TrendingUp, Target, Sparkles } from 'lucide-react';
import Layout from '@/components/Layout';
import { useUI } from '@/lib/ui-context';
import { useAuth } from '@/lib/auth-context';
import { ACCENT } from '@/styles/tokens';

interface Question { q: string; options: string[]; answer: number; hint?: string; }
interface Quiz { id: string; title: string; type: string; level: string; questions: Question[] }

const TYPE_META: Record<string, { fa: string; en: string; color: string }> = {
  vocabulary: { fa: 'لغات', en: 'Vocabulary', color: ACCENT.teal },
  grammar: { fa: 'گرامر', en: 'Grammar', color: ACCENT.amber },
  placement: { fa: 'تعیین سطح', en: 'Placement', color: ACCENT.ocean },
  mixed: { fa: 'ترکیبی', en: 'Mixed', color: ACCENT.lilac },
};

export default function QuizzesPage() {
  const { lang, theme } = useUI();
  const router = useRouter();
  const { token } = useAuth();

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<Quiz | null>(null);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const text = (fa: string, en: string) => (lang === 'fa' ? fa : en);

  useEffect(() => {
    fetch('/api/quizzes')
      .then((r) => r.json())
      .then((d) => setQuizzes(d.quizzes || []))
      .finally(() => setLoading(false));
  }, []);

  function start(q: Quiz) {
    setActive(q);
    setIdx(0);
    setPicked(null);
    setScore(0);
    setDone(false);
  }

  function pick(i: number) {
    if (picked !== null || !active) return;
    setPicked(i);
    if (i === active.questions[idx].answer) setScore((s) => s + 1);
  }

  async function next() {
    if (!active) return;
    if (idx + 1 < active.questions.length) {
      setIdx(idx + 1);
      setPicked(null);
    } else {
      // finishing
      const total = active.questions.length;
      const pct = Math.round((score / total) * 100);
      setDone(true);
      if (token) {
        setSubmitting(true);
        try {
          await fetch('/api/quizzes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ quizId: active.id, score: pct, total, strengths: ['vocabulary'], weaknesses: ['practice'] }),
          });
        } catch { /* ignore */ }
        setSubmitting(false);
      }
    }
  }

  return (
    <Layout>
      <div className="space-y-5">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0" style={{ backgroundColor: ACCENT.amber + '20' }}>
            <ClipboardCheck size={19} style={{ color: ACCENT.amber }} />
          </div>
          <div>
            <h2 className="text-lg font-bold">{text('آزمون‌ها', 'Quizzes')}</h2>
            <p className="text-xs mt-1" style={{ color: theme.sub }}>
              {text('آزمون واژگان، گرامر، تعیین سطح و ترکیبی — بعد از هر آزمون امتیاز و پیشنهاد قدم بعدی ببینید.', 'Vocabulary, grammar, placement and mixed tests with score and next-step guidance.')}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-14"><Loader2 size={26} className="mx-auto animate-spin" style={{ color: ACCENT.ocean }} /></div>
        ) : done && active ? (
          <ResultCard pct={Math.round((score / active.questions.length) * 100)} score={score} total={active.questions.length} submitting={submitting} onRestart={() => start(active)} onClose={() => { setActive(null); setDone(false); }} lang={lang} theme={theme} />
        ) : active ? (
          <div className="rounded-2xl border p-5 md:p-6" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
            <div className="flex items-center justify-between gap-3 mb-4">
              <span className="text-xs font-semibold" style={{ color: theme.sub }}>{active.title}</span>
              <span className="text-[11px] px-2.5 py-1 rounded-full font-semibold" style={{ backgroundColor: theme.navBg, color: theme.sub }}>
                {idx + 1} / {active.questions.length}
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full mb-5 overflow-hidden" style={{ backgroundColor: theme.navBg }}>
              <div className="h-full rounded-full transition-all duration-300" style={{ width: `${((idx + (picked !== null ? 1 : 0)) / active.questions.length) * 100}%`, backgroundColor: ACCENT.ocean }} />
            </div>
            <h3 className="text-base font-semibold mb-4" dir="auto">{active.questions[idx].q}</h3>
            <div className="grid gap-2">
              {active.questions[idx].options.map((opt, i) => {
                const isAnswer = picked !== null && i === active.questions[idx].answer;
                const isWrong = picked === i && i !== active.questions[idx].answer;
                return (
                  <button key={i} onClick={() => pick(i)} disabled={picked !== null}
                    className="flex items-center gap-2.5 px-4 py-3 rounded-xl border text-start text-sm font-medium transition-all duration-200 disabled:cursor-default"
                    dir="auto"
                    style={{
                      backgroundColor: isAnswer ? ACCENT.green + '18' : isWrong ? ACCENT.coral + '12' : theme.rowHover,
                      borderColor: isAnswer ? ACCENT.green : isWrong ? ACCENT.coral : picked !== null ? theme.border : theme.border,
                      color: isAnswer ? ACCENT.green : isWrong ? ACCENT.coral : theme.text,
                    }}>
                    {isAnswer ? <CheckCircle2 size={16} style={{ color: ACCENT.green }} /> : isWrong ? <XCircle size={16} style={{ color: ACCENT.coral }} /> : <span className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0" style={{ backgroundColor: theme.navBg, color: theme.sub }}>{String.fromCharCode(65 + i)}</span>}
                    {opt}
                  </button>
                );
              })}
            </div>
            {picked !== null && active.questions[idx].hint && (
              <p className="text-xs mt-4 p-3 rounded-xl" style={{ backgroundColor: theme.rowHover, color: theme.sub }}>{active.questions[idx].hint}</p>
            )}
            <button onClick={next} disabled={picked === null}
              className="mt-5 w-full py-3 rounded-full text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-md disabled:opacity-40"
              style={{ backgroundColor: ACCENT.ocean, color: '#fff' }}>
              {idx + 1 < active.questions.length ? text('سوال بعدی', 'Next question') : text('پایان آزمون', 'Finish')}
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {quizzes.map((qz) => {
              const meta = TYPE_META[qz.type] || TYPE_META.mixed;
              return (
                <button key={qz.id} onClick={() => start(qz)}
                  className="rounded-2xl border p-5 text-start hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
                  style={{ backgroundColor: theme.card, borderColor: theme.border }}>
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: meta.color + '20' }}>
                      <Target size={15} style={{ color: meta.color }} />
                    </div>
                    <span className="text-[10px] px-2.5 py-1 rounded-full font-semibold border" style={{ backgroundColor: meta.color + '15', color: theme.sub, borderColor: meta.color + '30' }}>
                      {lang === 'fa' ? meta.fa : meta.en}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold">{qz.title}</h4>
                  <p className="text-[11px] mt-1" style={{ color: theme.meta }}>{qz.questions.length} {text('سوال', 'questions')} · {qz.level}</p>
                </button>
              );
            })}
            {quizzes.length === 0 && (
              <p className="text-sm md:col-span-2 text-center py-10" style={{ color: theme.meta }}>{text('هنوز آزمونی اضافه نشده است.', 'No quizzes yet.')}</p>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}

function ResultCard({ pct, score, total, submitting, onRestart, onClose, lang, theme }: any) {
  const text = (fa: string, en: string) => (lang === 'fa' ? fa : en);
  const good = pct >= 70;
  return (
    <div className="rounded-2xl border p-6 md:p-8 text-center" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
      <div className="relative w-28 h-28 mx-auto mb-5">
        <div className="absolute inset-0 rounded-full" style={{ background: `conic-gradient(${ACCENT.ocean} ${pct * 3.6}deg, ${theme.navBg} 0deg)` }} />
        <div className="absolute inset-[10px] rounded-full flex flex-col items-center justify-center" style={{ backgroundColor: theme.card }}>
          <span className="text-2xl font-bold">{pct}%</span>
        </div>
      </div>
      <h3 className="text-lg font-bold flex items-center justify-center gap-2">
        {good ? <Award size={18} style={{ color: ACCENT.green }} /> : <TrendingUp size={18} style={{ color: ACCENT.amber }} />}
        {good ? text('آفرین! عملکرد عالی داشتی', 'Great job!') : text('خوب پیش رفتی، ادامه بده', 'Good progress!')}
      </h3>
      <p className="text-sm mt-2" style={{ color: theme.sub }}>
        {text(`پاسخ درست: ${score} از ${total}`, `Correct: ${score} of ${total}`)}
      </p>
      <p className="text-xs mt-3 max-w-md mx-auto p-3 rounded-xl" style={{ backgroundColor: theme.rowHover, color: theme.sub }}>
        {good
          ? text('نقطه قوتت واژگان است. قدم بعدی: تمرین گرامر با دستیار هوش مصنوعی.', 'Your strength is vocabulary. Next: practice grammar with the AI tutor.')
          : text('پیشنهاد: واژگان پایه را مرور کن و با دستیار AI تمرین کن.', 'Tip: review core vocabulary and practice with the AI tutor.')}
      </p>
      <div className="flex gap-2.5 mt-6 justify-center flex-wrap">
        <button onClick={onRestart} className="px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:shadow-md" style={{ backgroundColor: ACCENT.ocean, color: '#fff' }}>
          {submitting ? <Loader2 size={14} className="inline animate-spin" /> : text('دوباره', 'Retry')}
        </button>
        <button onClick={onClose} className="px-5 py-2.5 rounded-full text-sm font-semibold border transition-all hover:shadow-sm" style={{ backgroundColor: theme.card, borderColor: theme.border, color: theme.text }}>
          {text('همه آزمون‌ها', 'All quizzes')}
        </button>
      </div>
    </div>
  );
}
