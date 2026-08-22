import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ClipboardCheck, Loader2, CheckCircle2, XCircle, Award, TrendingUp, Target, Sparkles, Timer, Zap } from 'lucide-react';
import Layout from '@/components/Layout';
import { useUI } from '@/lib/ui-context';
import { useAuth } from '@/lib/auth-context';
import { ACCENT, GRADIENT } from '@/styles/tokens';

interface Question { q: string; options: string[]; answer: number; hint?: string; }
interface Quiz { id: string; title: string; type: string; level: string; questions: Question[] }

const TYPE_META: Record<string, { fa: string; en: string; grad: string; emoji: string }> = {
  vocabulary: { fa: 'لغات', en: 'Vocabulary', grad: GRADIENT.teal, emoji: '📚' },
  grammar: { fa: 'گرامر', en: 'Grammar', grad: GRADIENT.coral, emoji: '✏️' },
  placement: { fa: 'تعیین سطح', en: 'Placement', grad: GRADIENT.ocean, emoji: '🎯' },
  mixed: { fa: 'ترکیبی', en: 'Mixed', grad: GRADIENT.lilac, emoji: '🎲' },
};

const LEVEL_LABEL: Record<string, { fa: string; en: string }> = {
  beginner: { fa: 'مبتدی', en: 'Beginner' },
  elementary: { fa: 'مقدماتی', en: 'Elementary' },
  intermediate: { fa: 'متوسط', en: 'Intermediate' },
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
  const [feedback, setFeedback] = useState<string | null>(null);

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
    setFeedback(null);
  }

  function pick(i: number) {
    if (picked !== null || !active) return;
    setPicked(i);
    const correct = i === active.questions[idx].answer;
    if (correct) {
      setScore((s) => s + 1);
      setFeedback(text('آفرین! درست بود 🎉', 'Correct! 🎉'));
    } else {
      setFeedback(text('اشکالی نداره، دفعه بعد درست می‌شه 💪', 'No worries, keep going 💪'));
    }
  }

  async function next() {
    if (!active) return;
    if (idx + 1 < active.questions.length) {
      setIdx(idx + 1);
      setPicked(null);
      setFeedback(null);
    } else {
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
      <div className="space-y-6">
        {!active && (
          <div className="rounded-3xl relative overflow-hidden p-6 md:p-8 animate-fade-up" style={{ background: GRADIENT.coral }}>
            <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'radial-gradient(circle at 30% 30%, #fff 1px, transparent 1px)', backgroundSize: '26px 26px' }} />
            <div className="relative flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shrink-0 animate-float" style={{ backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }}>
                <ClipboardCheck size={26} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white flex items-center gap-2">{text('آزمون‌های چالشی', 'Challenge Quizzes')} <Zap size={18} /></h2>
                <p className="text-white/85 text-sm mt-1.5 max-w-xl leading-relaxed">
                  {text('۸ سوال هدفمند در هر آزمون — سطحت را بسنج، امتیاز بگیر و قدم بعدی‌ات را پیدا کن.', '8 focused questions per quiz — test your level, earn XP and find your next step.')}
                </p>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-16"><Loader2 size={28} className="mx-auto animate-spin" style={{ color: ACCENT.ocean }} /></div>
        ) : done && active ? (
          <ResultCard pct={Math.round((score / active.questions.length) * 100)} score={score} total={active.questions.length} submitting={submitting} onRestart={() => start(active)} onClose={() => { setActive(null); setDone(false); }} lang={lang} theme={theme} />
        ) : active ? (
          <div className="rounded-3xl border p-6 md:p-7 animate-fade-up" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
            <div className="flex items-center justify-between gap-3 mb-4">
              <span className="text-sm font-bold" style={{ color: theme.sub }}>{active.title}</span>
              <span className="text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5" style={{ backgroundColor: theme.navBg, color: theme.sub }}>
                <Timer size={12} /> {idx + 1} / {active.questions.length}
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full mb-6 overflow-hidden" style={{ backgroundColor: theme.navBg }}>
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${((idx + (picked !== null ? 1 : 0)) / active.questions.length) * 100}%`, background: GRADIENT.ocean }} />
            </div>

            <h3 className="text-xl font-bold mb-6 leading-relaxed" dir="auto">{active.questions[idx].q}</h3>

            <div className="grid gap-3">
              {active.questions[idx].options.map((opt, i) => {
                const isAnswer = picked !== null && i === active.questions[idx].answer;
                const isWrong = picked === i && i !== active.questions[idx].answer;
                return (
                  <button key={i} onClick={() => pick(i)} disabled={picked !== null}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-2xl border text-start text-[15px] font-medium transition-all duration-200 disabled:cursor-default hover:-translate-y-0.5"
                    dir="auto"
                    style={{
                      backgroundColor: isAnswer ? ACCENT.green + '18' : isWrong ? ACCENT.coral + '12' : theme.rowHover,
                      borderColor: isAnswer ? ACCENT.green : isWrong ? ACCENT.coral : theme.border,
                      color: isAnswer ? ACCENT.green : isWrong ? ACCENT.coral : theme.text,
                    }}>
                    <span className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-black shrink-0"
                      style={{ backgroundColor: isAnswer ? ACCENT.green : isWrong ? ACCENT.coral : theme.navBg, color: isAnswer || isWrong ? '#fff' : theme.sub }}>
                      {isAnswer ? <CheckCircle2 size={16} /> : isWrong ? <XCircle size={16} /> : String.fromCharCode(65 + i)}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>

            {feedback && (
              <div className="mt-4 p-4 rounded-2xl animate-slide-down text-sm font-semibold"
                style={{ backgroundColor: theme.rowHover, color: theme.text }}>
                {feedback}
              </div>
            )}
            {picked !== null && active.questions[idx].hint && (
              <p className="text-sm mt-3 p-3.5 rounded-2xl" style={{ backgroundColor: ACCENT.amber + '12', color: theme.sub }}>
                💡 {active.questions[idx].hint}
              </p>
            )}

            <button onClick={next} disabled={picked === null}
              className="mt-6 w-full py-3.5 rounded-full text-base font-bold flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-40"
              style={{ background: GRADIENT.ocean, color: '#fff' }}>
              {idx + 1 < active.questions.length ? text('سوال بعدی', 'Next question') : text('پایان آزمون', 'Finish quiz')}
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {quizzes.map((qz) => {
              const meta = TYPE_META[qz.type] || TYPE_META.mixed;
              return (
                <button key={qz.id} onClick={() => start(qz)}
                  className="group rounded-3xl border p-6 text-start transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl animate-fade-up"
                  style={{ backgroundColor: theme.card, borderColor: theme.border }}>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
                      style={{ background: meta.grad }}>
                      <span>{meta.emoji}</span>
                    </div>
                    <span className="text-[11px] px-3 py-1 rounded-full font-bold text-white"
                      style={{ background: meta.grad }}>
                      {lang === 'fa' ? meta.fa : meta.en}
                    </span>
                  </div>
                  <h4 className="text-lg font-black">{qz.title}</h4>
                  <div className="flex items-center gap-2 mt-2 text-sm" style={{ color: theme.meta }}>
                    <span>{qz.questions.length} {text('سوال', 'questions')}</span>
                    <span>·</span>
                    <span>{LEVEL_LABEL[qz.level]?.[lang] || qz.level}</span>
                  </div>
                  <div className="mt-4 flex items-center gap-1.5 text-sm font-bold" style={{ color: ACCENT.ocean }}>
                    {text('شروع کن', 'Start')} <Target size={14} />
                  </div>
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
    <div className="rounded-3xl border p-8 text-center animate-fade-up" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
      <div className="relative w-32 h-32 mx-auto mb-6">
        <div className="absolute inset-0 rounded-full" style={{ background: `conic-gradient(${good ? ACCENT.green : ACCENT.amber} ${pct * 3.6}deg, ${theme.navBg} 0deg)` }} />
        <div className="absolute inset-[12px] rounded-full flex flex-col items-center justify-center animate-pulse-glow" style={{ backgroundColor: theme.card }}>
          <span className="text-3xl font-black">{pct}%</span>
        </div>
      </div>
      <h3 className="text-2xl font-black flex items-center justify-center gap-2">
        {good ? <Award size={22} style={{ color: ACCENT.green }} /> : <TrendingUp size={22} style={{ color: ACCENT.amber }} />}
        {good ? text('آفرین! عملکرد عالی داشتی 🎉', 'Great job! 🎉') : text('خوب پیش رفتی، ادامه بده 💪', 'Good progress! 💪')}
      </h3>
      <p className="text-lg mt-2 font-semibold" style={{ color: theme.sub }}>
        {text(`پاسخ درست: ${score} از ${total}`, `Correct: ${score} of ${total}`)}
      </p>
      <p className="text-sm mt-3 max-w-md mx-auto p-4 rounded-2xl" style={{ backgroundColor: theme.rowHover, color: theme.sub }}>
        {good
          ? text('نقطه قوتت واژگان است. قدم بعدی: تمرین گرامر با دستیار هوش مصنوعی.', 'Your strength is vocabulary. Next: practice grammar with the AI tutor.')
          : text('پیشنهاد: واژگان پایه را مرور کن و با دستیار AI تمرین کن.', 'Tip: review core vocabulary and practice with the AI tutor.')}
      </p>
      <div className="flex gap-3 mt-7 justify-center flex-wrap">
        <button onClick={onRestart} className="px-6 py-3 rounded-full text-sm font-bold transition-all hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2" style={{ background: GRADIENT.ocean, color: '#fff' }}>
          {submitting ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}{text('دوباره', 'Retry')}
        </button>
        <button onClick={onClose} className="px-6 py-3 rounded-full text-sm font-bold border transition-all hover:shadow-md" style={{ backgroundColor: theme.card, borderColor: theme.border, color: theme.text }}>
          {text('همه آزمون‌ها', 'All quizzes')}
        </button>
      </div>
    </div>
  );
}
