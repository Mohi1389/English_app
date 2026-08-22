import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Lock, Mail, KeyRound, UserPlus, LogIn, Target, GraduationCap, Calendar, Loader2 } from 'lucide-react';
import Layout from '@/components/Layout';
import Logo from '@/components/Logo';
import { useUI } from '@/lib/ui-context';
import { useAuth } from '@/lib/auth-context';
import { t } from '@/lib/i18n';
import { ACCENT } from '@/styles/tokens';
import { AGE_RANGES, LEVELS, GOALS } from '@/lib/validators';

const LEVEL_FA: Record<string, string> = { beginner: 'مبتدی', elementary: 'مقدماتی', intermediate: 'متوسط' };

export default function LoginPage() {
  const router = useRouter();
  const { lang, theme } = useUI();
  const { login, signup, loading, error } = useAuth();
  const L = t(lang);

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    ageRange: AGE_RANGES[0],
    level: LEVELS[0],
    learningGoal: GOALS[0],
  });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const inputStyle = { backgroundColor: theme.card, borderColor: theme.border, color: theme.text };

  async function submit() {
    const ok = mode === 'login'
      ? await login(form.email, form.password)
      : await signup(form);
    if (ok) router.push('/dashboard');
  }

  return (
    <Layout>
      <div className="max-w-md mx-auto">
        <div className="rounded-2xl border p-6 md:p-7" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
          <div className="flex flex-col items-center text-center gap-3 mb-6">
            <Logo size={52} />
            <div>
              <h2 className="text-lg font-bold">{mode === 'login' ? L.auth.loginTitle : L.auth.signupTitle}</h2>
              <p className="text-xs mt-1" style={{ color: theme.sub }}>{L.auth.gated}</p>
            </div>
          </div>

          <div className="flex gap-1 rounded-full p-1 mb-5" style={{ backgroundColor: theme.navBg }}>
            {([
              { id: 'login' as const, label: L.auth.login, icon: LogIn },
              { id: 'signup' as const, label: L.auth.signup, icon: UserPlus },
            ]).map((x) => {
              const Icon = x.icon;
              const on = mode === x.id;
              return (
                <button
                  key={x.id}
                  onClick={() => setMode(x.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-[13px] font-medium rounded-full transition-all duration-200"
                  style={on
                    ? { backgroundColor: theme.card, color: theme.text, boxShadow: '0 1px 2px rgba(0,0,0,.06)' }
                    : { color: theme.sub }}
                >
                  <Icon size={13} style={{ color: on ? ACCENT.ocean : theme.meta }} /> {x.label}
                </button>
              );
            })}
          </div>

          <div className="space-y-3">
            {mode === 'signup' && (
              <Field theme={theme} label={L.auth.fullName} icon={UserPlus} color={ACCENT.lilac}>
                <input
                  className="w-full px-3 py-2.5 text-sm rounded-xl border focus:outline-none"
                  style={inputStyle}
                  value={form.fullName}
                  onChange={(e) => set('fullName', e.target.value)}
                />
              </Field>
            )}

            <Field theme={theme} label={L.auth.email} icon={Mail} color={ACCENT.ocean}>
              <input
                type="email"
                dir="ltr"
                className="w-full px-3 py-2.5 text-sm rounded-xl border focus:outline-none"
                style={inputStyle}
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
              />
            </Field>

            <Field theme={theme} label={L.auth.password} icon={KeyRound} color={ACCENT.coral}>
              <input
                type="password"
                dir="ltr"
                className="w-full px-3 py-2.5 text-sm rounded-xl border focus:outline-none"
                style={inputStyle}
                value={form.password}
                onChange={(e) => set('password', e.target.value)}
              />
            </Field>

            {mode === 'signup' && (
              <>
                <Field theme={theme} label={L.auth.ageRange} icon={Calendar} color={ACCENT.amber}>
                  <select
                    className="w-full px-3 py-2.5 text-sm rounded-xl border focus:outline-none"
                    style={inputStyle}
                    value={form.ageRange}
                    onChange={(e) => set('ageRange', e.target.value)}
                  >
                    {AGE_RANGES.map((x) => <option key={x} value={x}>{x}</option>)}
                  </select>
                </Field>

                <Field theme={theme} label={L.auth.level} icon={GraduationCap} color={ACCENT.teal}>
                  <select
                    className="w-full px-3 py-2.5 text-sm rounded-xl border focus:outline-none"
                    style={inputStyle}
                    value={form.level}
                    onChange={(e) => set('level', e.target.value)}
                  >
                    {LEVELS.map((x) => <option key={x} value={x}>{lang === 'fa' ? LEVEL_FA[x] : x}</option>)}
                  </select>
                </Field>

                <Field theme={theme} label={L.auth.goal} icon={Target} color={ACCENT.green}>
                  <select
                    className="w-full px-3 py-2.5 text-sm rounded-xl border focus:outline-none"
                    style={inputStyle}
                    value={form.learningGoal}
                    onChange={(e) => set('learningGoal', e.target.value)}
                  >
                    {GOALS.map((x, i) => <option key={x} value={x}>{L.goals[i]}</option>)}
                  </select>
                </Field>
              </>
            )}

            {error && <p className="text-[11px]" style={{ color: ACCENT.coral }}>{error}</p>}

            <button
              onClick={submit}
              disabled={loading}
              className="w-full py-3 rounded-full text-sm font-semibold transition-all duration-200 hover:shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              style={{ backgroundColor: ACCENT.ocean, color: '#fff' }}
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : <Lock size={14} />}
              {mode === 'login' ? L.auth.login : L.auth.createAccount}
            </button>

            <button onClick={() => router.push('/recover')} className="w-full text-sm pt-2 font-semibold hover:underline transition-all" style={{ color: ACCENT.ocean }}>{L.auth.forgot}</button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function Field({
  theme, label, icon: Icon, color, children,
}: {
  theme: { sub: string };
  label: string;
  icon: React.ElementType;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-[11px] font-semibold flex items-center gap-1.5 mb-1.5" style={{ color: theme.sub }}>
        <Icon size={11} style={{ color }} /> {label}
      </label>
      {children}
    </div>
  );
}
