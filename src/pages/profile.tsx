import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { User, Trophy, Flame, BookOpen, Bot, ClipboardCheck, Award, Target, Sparkles, Loader2 } from 'lucide-react';
import Layout from '@/components/Layout';
import { useUI } from '@/lib/ui-context';
import { useAuth } from '@/lib/auth-context';
import { ACCENT, GRADIENT } from '@/styles/tokens';

interface DashData {
  user: { fullName: string; level?: string | null; learningGoal?: string | null; ageRange?: string | null; xp: number; streakDays: number };
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

const ACHIEVEMENTS = [
  { icon: Trophy, fa: 'اولین قدم', en: 'First step', color: ACCENT.amber, desc: 'ثبت نام کردی', req: {} as any },
  { icon: BookOpen, fa: 'واژه‌آموز', en: 'Word learner', color: ACCENT.teal, desc: '۵ لغت ذخیره کردی', req: { words: 5 } },
  { icon: ClipboardCheck, fa: 'آزمون‌دهنده', en: 'Quiz taker', color: ACCENT.ocean, desc: 'یک آزمون کامل کردی', req: { quizzes: 1 } },
  { icon: Flame, fa: 'پشتکار', en: 'Streak', color: ACCENT.coral, desc: '۳ روز پشت سر هم', req: { streak: 3 } },
  { icon: Bot, fa: 'همراه AI', en: 'AI buddy', color: ACCENT.lilac, desc: 'با AI چت کردی', req: { ai: 1 } },
  { icon: Award, fa: 'ستاره', en: 'Star', color: ACCENT.green, desc: '۱۰۰ امتیاز', req: { xp: 100 } },
];

export default function ProfilePage() {
  const { lang, theme } = useUI();
  const router = useRouter();
  const { user, token } = useAuth();
  const [data, setData] = useState<DashData | null>(null);

  const text = (fa: string, en: string) => (lang === 'fa' ? fa : en);

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
            <User size={28} color="#fff" />
          </div>
          <p className="text-base font-semibold" style={{ color: theme.sub }}>{text('برای مشاهده پروفایل ابتدا وارد شوید.', 'Sign in to view your profile.')}</p>
          <button onClick={() => router.push('/login')} className="mt-6 px-7 py-3 rounded-full text-sm font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all" style={{ background: GRADIENT.ocean, color: '#fff' }}>{text('ورود', 'Log in')}</button>
        </div>
      </Layout>
    );
  }

  const s = data?.stats;
  const unlocked = (req: { words?: number; quizzes?: number; streak?: number; ai?: number; xp?: number }) => {
    if (req.words && (s?.savedWords || 0) < req.words) return false;
    if (req.quizzes && (s?.quizzesDone || 0) < req.quizzes) return false;
    if (req.streak && (data?.user.streakDays || 0) < req.streak) return false;
    if (req.ai && (s?.aiChats || 0) < req.ai) return false;
    if (req.xp && (data?.user.xp || 0) < req.xp) return false;
    return true;
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="rounded-3xl border overflow-hidden animate-fade-up" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
          <div className="h-24" style={{ background: GRADIENT.ocean }} />
          <div className="px-6 md:px-8 pb-6 -mt-10">
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-3xl font-black text-white shrink-0 border-4 animate-float"
              style={{ backgroundColor: ACCENT.ocean, borderColor: theme.card }}>
              {user.fullName.charAt(0).toUpperCase()}
            </div>
            <div className="mt-3">
              <h2 className="text-2xl font-black">{user.fullName}</h2>
              <p className="text-sm mt-0.5" style={{ color: theme.meta }}>{user.email}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {data?.user.level && <Badge theme={theme} color={ACCENT.ocean}>{LEVEL_LABEL[data.user.level]?.[lang] || data.user.level}</Badge>}
                {data?.user.learningGoal && <Badge theme={theme} color={ACCENT.coral}>{GOAL_LABEL[data.user.learningGoal]?.[lang] || data.user.learningGoal}</Badge>}
                {data?.user.ageRange && <Badge theme={theme} color={ACCENT.teal}>{data.user.ageRange}</Badge>}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Stat theme={theme} icon={Trophy} color={ACCENT.green} label={text('امتیاز XP', 'XP')} value={data?.user.xp ?? 0} />
          <Stat theme={theme} icon={Flame} color={ACCENT.coral} label={text('روزهای پیاپی', 'Day streak')} value={data?.user.streakDays ?? 0} />
          <Stat theme={theme} icon={BookOpen} color={ACCENT.teal} label={text('لغات ذخیره‌شده', 'Saved words')} value={s?.savedWords ?? 0} />
          <Stat theme={theme} icon={ClipboardCheck} color={ACCENT.amber} label={text('آزمون‌ها', 'Quizzes')} value={s?.quizzesDone ?? 0} />
        </div>

        <div className="rounded-3xl border p-6 animate-fade-up" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
          <h3 className="text-xl font-bold flex items-center gap-2 mb-5"><Award size={18} style={{ color: ACCENT.amber }} />{text('دستاوردها', 'Achievements')}</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {ACHIEVEMENTS.map((a, i) => {
              const Icon = a.icon;
              const got = unlocked(a.req);
              return (
                <div key={i} className="rounded-2xl border p-4 flex items-center gap-3 transition-all duration-300 hover:-translate-y-0.5"
                  style={{ backgroundColor: got ? a.color + '18' : theme.rowHover, borderColor: got ? a.color + '40' : theme.border, opacity: got ? 1 : 0.6 }}>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: got ? a.color + '28' : theme.navBg }}>
                    <Icon size={18} style={{ color: got ? a.color : theme.meta }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold truncate" style={{ color: got ? theme.text : theme.meta }}>{text(a.fa, a.en)}</p>
                    <p className="text-xs truncate" style={{ color: theme.meta }}>{a.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-3xl border p-6 animate-fade-up" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
          <h3 className="text-xl font-bold flex items-center gap-2 mb-5"><Sparkles size={18} style={{ color: ACCENT.lilac }} />{text('ادامه یادگیری', 'Keep learning')}</h3>
          <div className="grid sm:grid-cols-3 gap-3">
            <QuickBtn onClick={() => router.push('/words')} label={text('لغات', 'Words')} icon={BookOpen} grad={GRADIENT.teal} />
            <QuickBtn onClick={() => router.push('/ai')} label={text('دستیار AI', 'AI tutor')} icon={Bot} grad={GRADIENT.ocean} />
            <QuickBtn onClick={() => router.push('/quizzes')} label={text('آزمون', 'Quiz')} icon={ClipboardCheck} grad={GRADIENT.coral} />
          </div>
        </div>
      </div>
    </Layout>
  );
}

function Badge({ color, children, theme }: { color: string; children: React.ReactNode; theme: any }) {
  return <span className="text-xs px-3 py-1 rounded-full font-bold border" style={{ backgroundColor: color + '18', color: theme.text, borderColor: color + '38' }}>{children}</span>;
}

function Stat({ icon: Icon, color, label, value, theme }: { icon: any; color: string; label: string; value: number; theme: any }) {
  return (
    <div className="rounded-2xl border p-4 flex items-center gap-3 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: color + '18' }}>
        <Icon size={16} style={{ color }} />
      </div>
      <div>
        <div className="text-xl font-black leading-none">{value}</div>
        <p className="text-xs font-semibold mt-1" style={{ color: theme.meta }}>{label}</p>
      </div>
    </div>
  );
}

function QuickBtn({ onClick, label, icon: Icon, grad }: { onClick: () => void; label: string; icon: any; grad: string }) {
  return (
    <button onClick={onClick} className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl text-white font-bold text-sm transition-all hover:shadow-lg hover:-translate-y-0.5" style={{ background: grad }}>
      <Icon size={16} />{label}
    </button>
  );
}
