import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Flame, BookOpen, ClipboardCheck, Bot, Trophy, Target,
  TrendingUp, CheckCircle2, Route, Sparkles,
} from 'lucide-react';
import Layout from '@/components/Layout';
import { useUI } from '@/lib/ui-context';
import { useAuth } from '@/lib/auth-context';
import { t } from '@/lib/i18n';
import { ACCENT, GRADIENT } from '@/styles/tokens';

interface DashboardData {
  user: { fullName: string; level?: string | null; learningGoal?: string | null; xp: number; streakDays: number };
  stats: { savedWords: number; quizzesDone: number; aiChats: number; totalWords: number; avgScore: number; progressPercent: number };
}

const LEVEL_LABEL: Record<string, { fa: string; en: string }> = {
  beginner: { fa: 'مبتدی', en: 'Beginner' },
  elementary: { fa: 'مقدماتی', en: 'Elementary' },
  intermediate: { fa: 'متوسط', en: 'Intermediate' },
};

const GOAL_LABEL: Record<string, { fa: string; en: string }> = {
  conversation: { fa: 'مکالمه', en: 'Conversation' },
  vocabulary: { fa: 'لغات', en: 'Vocabulary' },
  school: { fa: 'زبان مدرسه', en: 'School English' },
  travel: { fa: 'سفر', en: 'Travel' },
  general: { fa: 'انگلیسی عمومی', en: 'General English' },
};

const PATH = {
  fa: [
    { title: 'الفبا و تلفظ پایه', sub: 'آشنایی با صداها و خواندن' },
    { title: 'لغات روزمره', sub: '۱۰۰ لغت پرکاربرد' },
    { title: 'جمله‌سازی و زمان حال', sub: 'ساختن جمله‌های ساده' },
    { title: 'زمان گذشته و آینده', sub: 'روایت کردن اتفاق‌ها' },
    { title: 'مکالمه متوسط', sub: 'گفتگو در موقعیت‌های واقعی' },
  ],
  en: [
    { title: 'Alphabet & basic sounds', sub: 'Reading and pronunciation' },
    { title: 'Everyday vocabulary', sub: '100 most useful words' },
    { title: 'Sentences & present tense', sub: 'Building simple sentences' },
    { title: 'Past & future tense', sub: 'Telling what happened' },
    { title: 'Intermediate conversation', sub: 'Real-life situations' },
  ],
};

export default function DashboardPage() {
  const router = useRouter();
  const { lang, theme } = useUI();
  const { user, token } = useAuth();
  const L = t(lang);
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    if (!token) return;
    fetch('/api/dashboard', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : null))
      .then(setData)
      .catch(() => setData(null));
  }, [token]);

  if (!user) {
    return (
      <Layout>
        <div className="rounded-3xl border p-12 text-center" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: GRADIENT.ocean }}>
            <Bot size={28} color="#fff" />
          </div>
          <p className="text-base font-semibold" style={{ color: theme.sub }}>{L.auth.gated}</p>
          <button onClick={() => router.push('/login')} className="mt-6 px-7 py-3 rounded-full text-sm font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all" style={{ background: GRADIENT.ocean, color: '#fff' }}>{L.auth.login}</button>
        </div>
      </Layout>
    );
  }

  const s = data?.stats;
  const pct = s?.progressPercent ?? 0;

  const stats = [
    { label: L.dash.level, value: data?.user.level ? (LEVEL_LABEL[data.user.level]?.[lang] || data.user.level) : '—', icon: TrendingUp, color: ACCENT.ocean },
    { label: L.dash.words, value: s?.savedWords ?? 0, icon: BookOpen, color: ACCENT.teal },
    { label: L.dash.quizzes, value: s?.quizzesDone ?? 0, icon: ClipboardCheck, color: ACCENT.amber },
    { label: L.dash.aiChats, value: s?.aiChats ?? 0, icon: Bot, color: ACCENT.lilac },
    { label: L.dash.streak, value: data?.user.streakDays ?? 0, icon: Flame, color: ACCENT.coral },
    { label: L.dash.xp, value: data?.user.xp ?? 0, icon: Trophy, color: ACCENT.green },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <section className="rounded-3xl border overflow-hidden animate-fade-up" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
          <div className="h-20" style={{ background: GRADIENT.ocean }} />
          <div className="px-6 md:px-8 pb-6">
            <div className="flex items-end justify-between gap-5 flex-wrap -mt-8">
              <div>
                <h2 className="text-2xl font-black">{L.dash.welcome}, {data?.user.fullName ?? user.fullName} 👋</h2>
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  <span className="text-xs px-3 py-1 rounded-full font-bold border" style={{ backgroundColor: ACCENT.ocean + '18', color: ACCENT.ocean, borderColor: ACCENT.ocean + '40' }}>
                    {data?.user.level ? (LEVEL_LABEL[data.user.level]?.[lang] || data.user.level) : '—'}
                  </span>
                  <span className="text-xs px-3 py-1 rounded-full font-bold border" style={{ backgroundColor: ACCENT.coral + '18', color: ACCENT.coral, borderColor: ACCENT.coral + '40' }}>
                    {data?.user.learningGoal ? (GOAL_LABEL[data.user.learningGoal]?.[lang] || data.user.learningGoal) : '—'}
                  </span>
                </div>
              </div>

              <div className="relative w-28 h-28 shrink-0 animate-float">
                <div className="absolute inset-0 rounded-full" style={{ background: `conic-gradient(${ACCENT.ocean} ${pct * 3.6}deg, ${theme.navBg} 0deg)` }} />
                <div className="absolute inset-[10px] rounded-full flex flex-col items-center justify-center" style={{ backgroundColor: theme.card }}>
                  <span className="text-2xl font-black">{pct}%</span>
                  <span className="text-[10px] font-bold" style={{ color: theme.meta }}>{L.dash.progress}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="rounded-2xl border p-4 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 animate-fade-up"
                style={{ backgroundColor: theme.card, borderColor: theme.border }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: stat.color + '18' }}>
                  <Icon size={15} style={{ color: stat.color }} />
                </div>
                <div className="text-xl font-black truncate">{stat.value}</div>
                <p className="text-xs font-semibold mt-0.5" style={{ color: theme.meta }}>{stat.label}</p>
              </div>
            );
          })}
        </section>

        <section className="rounded-3xl border p-6 animate-fade-up" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
          <h3 className="text-xl font-bold flex items-center gap-2 mb-5"><Route size={18} style={{ color: ACCENT.lilac }} /> {L.dash.myPath}</h3>
          {PATH[lang].map((step, i) => {
            const state = i < 2 ? 'done' : i === 2 ? 'active' : 'todo';
            const color = state === 'done' ? ACCENT.green : state === 'active' ? ACCENT.ocean : theme.border;
            return (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-all"
                    style={{ borderColor: color, backgroundColor: state === 'todo' ? 'transparent' : color + '20' }}>
                    {state === 'done' ? <CheckCircle2 size={14} style={{ color: ACCENT.green }} /> : <span className="text-xs font-black" style={{ color: state === 'active' ? ACCENT.ocean : theme.meta }}>{i + 1}</span>}
                  </div>
                  {i < PATH[lang].length - 1 && <div className="w-0.5 flex-1 min-h-[28px]" style={{ backgroundColor: theme.border }} />}
                </div>
                <div className="pb-5 flex-1">
                  <p className="text-sm font-bold" style={{ color: state === 'todo' ? theme.meta : theme.text }}>{step.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: theme.meta }}>{step.sub}</p>
                </div>
              </div>
            );
          })}
        </section>

        <section className="rounded-3xl border p-6 flex items-start gap-4 relative overflow-hidden animate-fade-up"
          style={{ backgroundColor: ACCENT.lilac + '0D', borderColor: ACCENT.lilac + '40' }}>
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0" style={{ background: GRADIENT.lilac }}>
            <Sparkles size={18} color="#fff" />
          </div>
          <div>
            <p className="text-base font-bold">{lang === 'fa' ? 'پیشنهاد شخصی برای تو' : 'Personal suggestion'}</p>
            <p className="text-sm mt-1.5 leading-relaxed" style={{ color: theme.sub }}>
              {lang === 'fa' ? `الان ${s?.totalWords ?? 0} لغت آماده تمرین داری. یک گفتگوی کوتاه با دستیار هوشمند شروع کن — سریع‌ترین راه ماندگاری لغت.` : `You have ${s?.totalWords ?? 0} words ready to practice. Start a short AI chat — the fastest way to make words stick.`}
            </p>
            <button onClick={() => router.push('/ai')} className="mt-3 text-sm font-bold px-5 py-2.5 rounded-full transition-all hover:shadow-lg hover:-translate-y-0.5" style={{ background: GRADIENT.lilac, color: '#fff' }}>
              {lang === 'fa' ? 'تمرین با دستیار هوشمند' : 'Practice with AI tutor'}
            </button>
          </div>
        </section>
      </div>
    </Layout>
  );
}
