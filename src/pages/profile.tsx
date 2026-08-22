import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { User, Trophy, Flame, BookOpen, Bot, ClipboardCheck, Award, Target, Sparkles, Loader2 } from 'lucide-react';
import Layout from '@/components/Layout';
import { useUI } from '@/lib/ui-context';
import { useAuth } from '@/lib/auth-context';
import { ACCENT } from '@/styles/tokens';

interface DashData {
  user: { fullName: string; level?: string | null; learningGoal?: string | null; ageRange?: string | null; xp: number; streakDays: number };
  stats: { savedWords: number; quizzesDone: number; aiChats: number; totalWords: number; avgScore: number; progressPercent: number };
}

const ACHIEVEMENTS = [
  { icon: Trophy, fa: 'اولین قدم', en: 'First step', color: ACCENT.amber, desc: 'ثبت نام کردی' },
  { icon: BookOpen, fa: 'واژه‌آموز', en: 'Word learner', color: ACCENT.teal, desc: '۵ لغت ذخیره کردی' },
  { icon: ClipboardCheck, fa: 'آزمون‌دهنده', en: 'Quiz taker', color: ACCENT.ocean, desc: 'یک آزمون کامل کردی' },
  { icon: Flame, fa: 'پشتکار', en: 'Streak', color: ACCENT.coral, desc: '۳ روز پشت سر هم' },
  { icon: Bot, fa: 'همراه AI', en: 'AI buddy', color: ACCENT.lilac, desc: 'با AI چت کردی' },
  { icon: Award, fa: 'ستاره', en: 'Star', color: ACCENT.green, desc: '۱۰۰ امتیاز' },
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
        <div className="rounded-2xl border p-10 text-center" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
          <User size={30} className="mx-auto mb-4" style={{ color: theme.border }} />
          <p className="text-sm" style={{ color: theme.sub }}>{text('برای مشاهده پروفایل ابتدا وارد شوید.', 'Sign in to view your profile.')}</p>
          <button onClick={() => router.push('/login')} className="mt-5 px-5 py-2.5 rounded-full text-sm font-semibold hover:shadow-md" style={{ backgroundColor: ACCENT.ocean, color: '#fff' }}>{text('ورود', 'Log in')}</button>
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

  const achReqs = [
    {}, { words: 5 }, { quizzes: 1 }, { streak: 3 }, { ai: 1 }, { xp: 100 },
  ];

  return (
    <Layout>
      <div className="space-y-5">
        {/* Header card */}
        <div className="rounded-2xl border p-6 relative overflow-hidden" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
          <div className="absolute -top-10 inline -end-10 w-40 h-40 rounded-full blur-3xl opacity-20 pointer-events-none" style={{ backgroundColor: ACCENT.ocean }} />
          <div className="relative flex items-center gap-4 flex-wrap">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold shrink-0" style={{ backgroundColor: ACCENT.ocean, color: '#fff' }}>
              {user.fullName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold truncate">{user.fullName}</h2>
              <p className="text-xs mt-0.5" style={{ color: theme.meta }}>{user.email}</p>
              <div className="flex flex-wrap gap-2 mt-2.5">
                {user.level && <Badge color={ACCENT.ocean}>{user.level}</Badge>}
                {user.learningGoal && <Badge color={ACCENT.coral}>{user.learningGoal}</Badge>}
                {user.ageRange && <Badge color={ACCENT.teal}>{user.ageRange}</Badge>}
              </div>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Stat icon={Trophy} color={ACCENT.green} label={text('امتیاز XP', 'XP')} value={data?.user.xp ?? 0} />
          <Stat icon={Flame} color={ACCENT.coral} label={text('روزهای پیاپی', 'Day streak')} value={data?.user.streakDays ?? 0} />
          <Stat icon={BookOpen} color={ACCENT.teal} label={text('لغات ذخیره‌شده', 'Saved words')} value={s?.savedWords ?? 0} />
          <Stat icon={ClipboardCheck} color={ACCENT.amber} label={text('آزمون‌ها', 'Quizzes')} value={s?.quizzesDone ?? 0} />
        </div>

        {/* Achievements */}
        <div className="rounded-2xl border p-5" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
          <h3 className="text-sm font-semibold flex items-center gap-2 mb-4"><Award size={14} style={{ color: ACCENT.amber }} />{text('دستاوردها', 'Achievements')}</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {ACHIEVEMENTS.map((a, i) => {
              const Icon = a.icon;
              const got = unlocked(achReqs[i]);
              return (
                <div key={i} className="rounded-xl border p-3 flex items-center gap-2.5 transition-all" style={{ backgroundColor: got ? a.color + '15' : theme.rowHover, borderColor: got ? a.color + '40' : theme.border, opacity: got ? 1 : 0.55 }}>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: got ? a.color + '25' : theme.navBg }}>
                    <Icon size={16} style={{ color: got ? a.color : theme.meta }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[12px] font-semibold truncate">{text(a.fa, a.en)}</p>
                    <p className="text-[10px] truncate" style={{ color: theme.meta }}>{a.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick links */}
        <div className="rounded-2xl border p-5" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
          <h3 className="text-sm font-semibold flex items-center gap-2 mb-4"><Sparkles size={14} style={{ color: ACCENT.lilac }} />{text('ادامه یادگیری', 'Keep learning')}</h3>
          <div className="grid sm:grid-cols-3 gap-2.5">
            <QuickBtn onClick={() => router.push('/words')} label={text('لغات', 'Words')} icon={BookOpen} color={ACCENT.teal} />
            <QuickBtn onClick={() => router.push('/ai')} label={text('دستیار AI', 'AI tutor')} icon={Bot} color={ACCENT.ocean} />
            <QuickBtn onClick={() => router.push('/quizzes')} label={text('آزمون', 'Quiz')} icon={ClipboardCheck} color={ACCENT.amber} />
          </div>
        </div>
      </div>
    </Layout>
  );
}

function Badge({ color, children }: { color: string; children: React.ReactNode }) {
  return <span className="text-[10px] px-2.5 py-1 rounded-full font-semibold border" style={{ backgroundColor: color + '15', color: '#1A1A1A', borderColor: color + '30' }}>{children}</span>;
}

function Stat({ icon: Icon, color, label, value }: { icon: any; color: string; label: string; value: number }) {
  return (
    <div className="rounded-xl border p-4" style={{ backgroundColor: 'transparent', borderColor: 'transparent' }}>
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: color + '18' }}>
          <Icon size={15} style={{ color }} />
        </div>
        <div>
          <div className="text-lg font-bold leading-none">{value}</div>
          <p className="text-[10px] font-medium mt-1" style={{ color: 'inherit' }}>{label}</p>
        </div>
      </div>
    </div>
  );
}

function QuickBtn({ onClick, label, icon: Icon, color }: { onClick: () => void; label: string; icon: any; color: string }) {
  return (
    <button onClick={onClick} className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all hover:shadow-md" style={{ backgroundColor: color + '18', color: '#1A1A1A' }}>
      <Icon size={15} style={{ color }} />{label}
    </button>
  );
}
