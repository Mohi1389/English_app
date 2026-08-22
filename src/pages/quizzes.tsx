import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import Layout from '@/components/Layout';
import { useUI } from '@/lib/ui-context';
import { useAuth } from '@/lib/auth-context';
import { ACCENT } from '@/styles/tokens';

interface Question { q: string; options: string[]; answer: number; hint?: string; explanation?: string; }
interface Quiz { id: string; title: string; type: string; level: string; questions: Question[] }

const TYPE_LABEL: Record<string, { fa: string; en: string }> = {
  vocabulary: { fa: 'لغات', en: 'Vocabulary' },
  grammar: { fa: 'گرامر', en: 'Grammar' },
  placement: { fa: 'تعیین سطح', en: 'Placement' },
  mixed: { fa: 'ترکیبی', en: 'Mixed' },
};

const LEVEL_LABEL: Record<string, { fa: string; en: string }> = {
  beginner: { fa: 'مبتدی', en: 'Beginner' },
  elementary: { fa: 'مقدماتی', en: 'Elementary' },
  intermediate: { fa: 'متوسط', en: 'Intermediate' },
};

const RICH_QUIZZES: Record<string, Question[]> = {
  beginner: [
    { q: 'کدام کلمه به معنی «معلم خصوصی» است؟', options: ['Tutor', 'Student', 'Desk', 'Pen'], answer: 0, explanation: 'واژه Tutor به معنی مربی یا معلم خصوصی است.' },
    { q: 'معادل «بیدار شدن از خواب» چیست؟', options: ['Sleep', 'Wake up', 'Go out', 'Eat dinner'], answer: 1, explanation: 'Wake up یعنی بیدار شدن.' },
    { q: 'پاسخ درست به «?How are you» کدام است؟', options: ['I am fine, thanks!', 'Goodbye!', 'Yes, please.', 'Nice to meet you.'], answer: 0, explanation: 'پاسخ مودبانه و رایج، I am fine است.' },
    { q: 'معنی «Delicious» چیست؟', options: ['شور', 'خوشمزه', 'تلخ', 'گران‌قیمت'], answer: 1, explanation: 'Delicious یعنی بسیار خوشمزه.' },
    { q: 'برای ساعت مشخص از کدام حرف اضافه استفاده می‌شود؟', options: ['In', 'On', 'At', 'Under'], answer: 2, explanation: 'برای ساعت دقیق از At استفاده می‌شود.' },
    { q: 'جمع کلمه «Child» چیست؟', options: ['Childs', 'Childrens', 'Children', 'Childes'], answer: 2, explanation: 'جمع Child می‌شود Children.' },
    { q: 'رنگ نماد آرامش در لوگو کدام است؟', options: ['آبی و فیروزه‌ای', 'قرمز', 'مشکی', 'قهوه‌ای'], answer: 0, explanation: 'رنگ‌های اصلی برند آبی اقیانوسی و فیروزه‌ای هستند.' },
    { q: 'معنی «Nice to meet you» چیست؟', options: ['روز خوبی داشته باشی', 'از ملاقات شما خوشبختم', 'حالت چطور است؟', 'خوش آمدید'], answer: 1, explanation: 'این جمله یعنی از آشنایی با شما خوشحالم.' },
  ],
  elementary: [
    { q: 'جای خالی: "She ___ to school every day."', options: ['go', 'goes', 'going', 'gone'], answer: 1, explanation: 'برای فاعل سوم شخص فعل s می‌گیرد.' },
    { q: 'معنی «Luggage» چیست؟', options: ['گذرنامه', 'چمدان', 'بلیط', 'گیت'], answer: 1, explanation: 'Luggage یعنی چمدان‌ها و بار مسافر.' },
    { q: 'قید تکرار «همیشه» کدام است؟', options: ['Sometimes', 'Never', 'Always', 'Often'], answer: 2, explanation: 'Always یعنی همیشه.' },
    { q: 'گذشته فعل «Write» چیست؟', options: ['Writed', 'Wrote', 'Written', 'Writing'], answer: 1, explanation: 'گذشته write می‌شود wrote.' },
    { q: 'مودبانه‌ترین روش برای درخواست چیست؟', options: ['I want a pizza.', 'I would like a pizza.', 'Give me a pizza.', 'Pizza please.'], answer: 1, explanation: 'I would like مودبانه‌ترین شکل است.' },
    { q: 'مخالف «Difficult» چیست؟', options: ['Easy', 'Hard', 'Fast', 'Strong'], answer: 0, explanation: 'مخالف Difficult واژه Easy است.' },
    { q: 'معنی «Boarding pass» چیست؟', options: ['کارت پرواز', 'کارت فرودگاه', 'بلیط هوا', 'چمدان'], answer: 0, explanation: 'Boarding pass یعنی کارت پرواز.' },
    { q: 'جای خالی: "I am interested ___ learning English."', options: ['on', 'at', 'in', 'with'], answer: 2, explanation: 'حرف اضافه interested همیشه in است.' },
  ],
  intermediate: [
    { q: 'شکل مجهول «They built this house in 1990.» چیست؟', options: ['This house is built in 1990.', 'This house was built in 1990.', 'This house had built in 1990.', 'This house was builded in 1990.'], answer: 1, explanation: 'برای مجهول گذشته از was/were + p.p استفاده می‌شود.' },
    { q: 'معنی «Achievement» چیست؟', options: ['نیازمندی', 'دستاورد', 'محیط', 'توسعه'], answer: 1, explanation: 'Achievement یعنی دستاورد و موفقیت.' },
    { q: 'جای خالی: "If I ___ rich, I would travel."', options: ['am', 'was', 'were', 'would be'], answer: 2, explanation: 'در شرطی نوع دوم از were استفاده می‌شود.' },
    { q: 'معنی «Confidence» چیست؟', options: ['اعتماد به نفس', 'سخت‌کوشی', 'اضطراب', 'امیدواری'], answer: 0, explanation: 'Confidence یعنی اعتماد به نفس.' },
    { q: 'معنی «Streak» در اپلیکیشن‌ها چیست؟', options: ['انجام پیوسته کار روزانه', 'خرید سکه', 'باخت', 'چت گروهی'], answer: 0, explanation: 'Streak یعنی تکرار منظم روزانه.' },
    { q: 'جای خالی: "By the time she arrived, we ___ the test."', options: ['finished', 'have finished', 'had finished', 'will finish'], answer: 2, explanation: 'گذشته کامل برای کار قبل از اتفاق دیگر استفاده می‌شود.' },
    { q: 'معنی «Phonetic» چیست؟', options: ['گرامر', 'آوانگاری تلفظ', 'ریشه‌یابی', 'نوشتار رسمی'], answer: 1, explanation: 'Phonetic یعنی آوانگاری تلفظ.' },
    { q: 'مترادف «Encourage» چیست؟', options: ['Support/Motivate', 'Force/Compel', 'Ignore/Neglect', 'Disappoint/Sad'], answer: 0, explanation: 'Encourage یعنی تشویق کردن.' },
  ],
};

export default function QuizzesPage() {
  const { lang, theme } = useUI();
  const { token } = useAuth();

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<Quiz | null>(null);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const text = (fa: string, en: string) => (lang === 'fa' ? fa : en);

  useEffect(() => {
    fetch('/api/quizzes')
      .then((r) => r.json())
      .then((d) => {
        const raw = d.quizzes || [];
        const mapped = raw.map((qz: Quiz) => ({ ...qz, questions: RICH_QUIZZES[qz.level] || RICH_QUIZZES.beginner }));
        setQuizzes(mapped);
      })
      .finally(() => setLoading(false));
  }, []);

  function start(q: Quiz) {
    setActive(q); setIdx(0); setPicked(null); setScore(0); setDone(false);
  }

  function pick(i: number) {
    if (picked !== null || !active) return;
    setPicked(i);
    if (i === active.questions[idx].answer) setScore((s) => s + 1);
  }

  async function next() {
    if (!active) return;
    if (idx + 1 < active.questions.length) {
      setIdx(idx + 1); setPicked(null);
    } else {
      setDone(true);
      if (token) {
        const pct = Math.round((score / active.questions.length) * 100);
        try {
          await fetch('/api/quizzes', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ quizId: active.id, score: pct, total: active.questions.length }) });
        } catch {}
      }
    }
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-8 animate-fade-up">
        {loading ? (
          <div className="text-center py-16"><Loader2 size={26} className="mx-auto animate-spin" style={{ color: ACCENT.ocean }} /></div>
        ) : done && active ? (
          <div className="text-center space-y-6 py-10">
            <h2 className="text-2xl font-bold">{text('نتیجه آزمون', 'Quiz result')}</h2>
            <p className="text-5xl font-bold text-gradient">{Math.round((score / active.questions.length) * 100)}%</p>
            <p className="text-sm" style={{ color: theme.sub }}>{score} {text('پاسخ درست از', 'correct of')} {active.questions.length}</p>
            <div className="flex gap-3 justify-center pt-2">
              <button onClick={() => start(active)} className="px-6 py-3 rounded-full text-sm font-semibold text-white transition-all hover:shadow-lg" style={{ background: ACCENT.ocean }}>{text('دوباره', 'Retry')}</button>
              <button onClick={() => { setActive(null); setDone(false); }} className="px-6 py-3 rounded-full text-sm font-semibold border transition-all" style={{ borderColor: theme.border }}>{text('همه آزمون‌ها', 'All quizzes')}</button>
            </div>
          </div>
        ) : active ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between text-sm" style={{ color: theme.meta }}>
              <span className="font-semibold" style={{ color: theme.text }}>{active.title}</span>
              <span>{idx + 1} / {active.questions.length}</span>
            </div>
            <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: theme.navBg }}>
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${((idx + (picked !== null ? 1 : 0)) / active.questions.length) * 100}%`, background: ACCENT.ocean }} />
            </div>

            <h3 className="text-lg font-semibold leading-relaxed" dir="auto">{active.questions[idx].q}</h3>

            <div className="space-y-2.5">
              {active.questions[idx].options.map((opt, i) => {
                const isAnswer = picked !== null && i === active.questions[idx].answer;
                const isWrong = picked === i && i !== active.questions[idx].answer;
                return (
                  <button key={i} onClick={() => pick(i)} disabled={picked !== null} className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border text-start text-sm transition-all duration-200" dir="auto" style={{ backgroundColor: isAnswer ? 'rgba(16,185,129,0.08)' : isWrong ? 'rgba(255,107,82,0.06)' : theme.rowHover, borderColor: isAnswer ? '#10B981' : isWrong ? '#FF6B52' : theme.border }}>
                    <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0" style={{ backgroundColor: isAnswer ? '#10B981' : isWrong ? '#FF6B52' : theme.navBg, color: isAnswer || isWrong ? '#fff' : theme.sub }}>
                      {isAnswer ? <CheckCircle2 size={15} /> : isWrong ? <XCircle size={15} /> : String.fromCharCode(65 + i)}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>

            {picked !== null && (
              <div className="animate-fade-in space-y-4">
                {active.questions[idx].explanation && (
                  <p className="text-sm leading-relaxed p-4 rounded-xl" style={{ backgroundColor: theme.rowHover, color: theme.sub }}>{active.questions[idx].explanation}</p>
                )}
                <button onClick={next} className="w-full py-3.5 rounded-xl text-sm font-semibold text-white transition-all hover:shadow-lg" style={{ background: ACCENT.ocean }}>
                  {idx + 1 === active.questions.length ? text('نمایش نتیجه', 'Show result') : text('سوال بعدی', 'Next question')}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {quizzes.map((q) => (
              <button key={q.id} onClick={() => start(q)} className="w-full flex items-center justify-between px-6 py-5 rounded-2xl border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md text-start" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
                <div>
                  <h4 className="font-semibold">{q.title}</h4>
                  <p className="text-xs mt-1" style={{ color: theme.meta }}>{TYPE_LABEL[q.type]?.[lang]} · {LEVEL_LABEL[q.level]?.[lang]} · {q.questions.length} {text('سوال', 'questions')}</p>
                </div>
                <span className="text-xs font-semibold" style={{ color: ACCENT.ocean }}>{text('شروع', 'Start')}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
