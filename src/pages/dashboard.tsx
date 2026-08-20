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
import { ACCENT } from '@/styles/tokens';

interface DashboardData {
  user: { fullName: string; level?: string | null; learningGoal?: string | null; xp: number; streakDays: number };
  stats: { savedWords: number; quizzesDone: number; aiChats: number; totalWords: number; avgScore: number; progressPercent: number };
}

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
        <div className="rounded-2xl border p-10 text-center" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
          <Bot size={30} className="mx-auto mb-4" style={{ color: theme.border }} />
          <p className="text-sm" style={{ color: theme.sub }}>{L.auth.gated}</p>
          <button
            onClick={() => router.push('/login')}
            className="mt-5 px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:shadow-md"
            style={{ backgroundColor: ACCENT.ocean, color: '#fff' }}
          >
            {L.auth.login}
          </button>
        </div>
      </Layout>
    );
  }

  const s = data?.stats;
  const pct = s?.progressPercent ?? 0;

  const stats = [
    { label: L.dash.level, value: data?.user.level ?? '—', icon: TrendingUp, color: ACCENT.ocean },
    { label: L.dash.words, value: s?.savedWords ?? 0, icon: BookOpen, color: ACCENT.teal },
    { label: L.dash.quizzes, value: s?.quizzesDone ?? 0, icon: ClipboardCheck, color: ACCENT.amber },
    { label: L.dash.aiChats, value: s?.aiChats ?? 0, icon: Bot, color: ACCENT.lilac },
    { label: L.dash.streak, value: data?.user.streakDays ?? 0, icon: Flame, color: ACCENT.coral },
    { label: L.dash.xp, value: data?.user.xp ?? 0, icon: Trophy, color: ACCENT.green },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome + progress ring */}
        <section className="rounded-2xl border p-6" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
          <div className="flex items-center justify-between gap-5 flex-wrap">
            <div>
              <h2 className="text-xl font-bold">
                {L.dash.welcome}, {data?.user.fullName ?? user.fullName} 👋
              </h2>
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <Badge color={ACCENT.ocean} text="#01599F">{data?.user.level ?? '—'}</Badge>
                <Badge color={ACCENT.coral} text="#C73A22">{data?.user.learningGoal ?? '—'}</Badge>
              </div>
            </div>

            <div className="relative w-28 h-28 shrink-0">
              <div
                className="absolute inset-0 rounded-full"
                style={{ background: `conic-gradient(${ACCENT.ocean} ${pct * 3.6}deg, ${theme.navBg} 0deg)` }}
              />
              <div
                className="absolute inset-[10px] rounded-full flex flex-col items-center justify-center"
                style={{ backgroundColor: theme.card }}
              >
                <span className="text-2xl font-bold">{pct}%</span>
                <span className="text-[9px] font-medium" style={{ color: theme.meta }}>{L.dash.progress}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className="rounded-2xl border p-4 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
                style={{ backgroundColor: theme.card, borderColor: theme.border }}
              >
                <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: stat.color + '18' }}>
                  <Icon size={14} style={{ color: stat.color }} />
                </div>
                <div className="text-xl font-bold truncate">{stat.value}</div>
                <p className="text-[10px] font-medium mt-0.5" style={{ color: theme.meta }}>{stat.label}</p>
              </div>
            );
          })}
        </section>

        {/* Learning path */}
        <section className="rounded-2xl border p-5" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
          <h3 className="text-sm font-semibold flex items-center gap-2 mb-4">
            <Route size={14} style={{ color: ACCENT.lilac }} /> {L.dash.myPath}
          </h3>
          {PATH[lang].map((step, i) => {
            const state = i < 2 ? 'done' : i === 2 ? 'active' : 'todo';
            const color = state === 'done' ? ACCENT.green : state === 'active' ? ACCENT.ocean : theme.border;
            return (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 border-2"
                    style={{ borderColor: color, backgroundColor: state === 'todo' ? 'transparent' : color + '20' }}
                  >
                    {state === 'done'
                      ? <CheckCircle2 size={13} style={{ color: ACCENT.green }} />
                      : <span className="text-[10px] font-bold" style={{ color: state === 'active' ? ACCENT.ocean : theme.meta }}>{i + 1}</span>}
                  </div>
                  {i < PATH[lang].length - 1 && <div className="w-0.5 flex-1 min-h-[26px]" style={{ backgroundColor: theme.border }} />}
                </div>
                <div className="pb-4 flex-1">
                  <p className="text-[13px] font-medium" style={{ color: state === 'todo' ? theme.meta : theme.text }}>{step.title}</p>
                  <p className="text-[11px] mt-0.5" style={{ color: theme.meta }}>{step.sub}</p>
                </div>
              </div>
            );
          })}
        </section>

        {/* AI suggestion */}
        <section
          className="rounded-2xl border p-5 flex items-start gap-3"
          style={{ backgroundColor: ACCENT.lilac + '0D', borderColor: ACCENT.lilac + '35' }}
        >
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: ACCENT.lilac + '20' }}>
            <Sparkles size={15} style={{ color: ACCENT.lilac }} />
          </div>
          <div>
            <p className="text-[13px] font-semibold">
              {lang === 'fa' ? 'پیشنهاد شخصی برای تو' : 'Personal suggestion'}
            </p>
            <p className="text-[12px] mt-1 leading-relaxed" style={{ color: theme.sub }}>
              {lang === 'fa'
                ? `الان ${s?.totalWords ?? 0} لغت آماده تمرین داری. یک گفتگوی کوتاه با دستیار هوشمند شروع کن — سریع‌ترین راه ماندگاری لغت.`
                : `You have ${s?.totalWords ?? 0} words ready to practice. Start a short AI chat — the fastest way to make words stick.`}
            </p>
            <button
              onClick={() => router.push('/ai')}
              className="mt-2.5 text-[11px] font-semibold px-3.5 py-1.5 rounded-full transition-all hover:shadow-sm"
              style={{ backgroundColor: ACCENT.lilac, color: '#1A1A1A' }}
            >
              {lang === 'fa' ? 'تمرین با دستیار هوشمند' : 'Practice with AI tutor'}
            </button>
          </div>
        </section>
      </div>
    </Layout>
  );
}

function Badge({ color, text, children }: { color: string; text: string; children: React.ReactNode }) {
  return (
    <span
      className="text-[10px] px-2.5 py-1 rounded-full font-semibold border"
      style={{ backgroundColor: color + '15', color: text, borderColor: color + '30' }}
    >
      {children}
    </span>
  );
}
