import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { UserPlus, Mail, KeyRound, Calendar, GraduationCap, Target, Loader2, ArrowLeft } from 'lucide-react';
import Layout from '@/components/Layout';
import Logo from '@/components/Logo';
import { useUI } from '@/lib/ui-context';
import { useAuth } from '@/lib/auth-context';
import { t } from '@/lib/i18n';
import { ACCENT } from '@/styles/tokens';
import { AGE_RANGES, LEVELS, GOALS } from '@/lib/validators';

export default function SignupPage() {
  const router = useRouter();
  const { lang, theme } = useUI();
  const { signup, loading, error } = useAuth();
  const L = t(lang);

  const [form, setForm] = useState({ fullName: '', email: '', password: '', ageRange: AGE_RANGES[0], level: LEVELS[0], learningGoal: GOALS[0] });
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const inputStyle = { backgroundColor: theme.card, borderColor: theme.border, color: theme.text };

  async function submit() {
    const ok = await signup(form);
    if (ok) router.push('/dashboard');
  }

  return (
    <Layout>
      <div className="max-w-md mx-auto">
        <div className="rounded-2xl border p-6 md:p-7" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
          <div className="flex flex-col items-center text-center gap-3 mb-6">
            <Logo size={52} />
            <div>
              <h2 className="text-lg font-bold">{L.auth.signupTitle}</h2>
              <p className="text-xs mt-1" style={{ color: theme.sub }}>{L.auth.gated}</p>
            </div>
          </div>

          <div className="space-y-3">
            <Field theme={theme} label={L.auth.fullName} icon={UserPlus} color={ACCENT.lilac}>
              <input className="w-full px-3 py-2.5 text-sm rounded-xl border focus:outline-none" style={inputStyle} value={form.fullName} onChange={(e) => set('fullName', e.target.value)} />
            </Field>
            <Field theme={theme} label={L.auth.email} icon={Mail} color={ACCENT.ocean}>
              <input type="email" dir="ltr" className="w-full px-3 py-2.5 text-sm rounded-xl border focus:outline-none" style={inputStyle} value={form.email} onChange={(e) => set('email', e.target.value)} />
            </Field>
            <Field theme={theme} label={L.auth.password} icon={KeyRound} color={ACCENT.coral}>
              <input type="password" dir="ltr" className="w-full px-3 py-2.5 text-sm rounded-xl border focus:outline-none" style={inputStyle} value={form.password} onChange={(e) => set('password', e.target.value)} />
            </Field>
            <Field theme={theme} label={L.auth.ageRange} icon={Calendar} color={ACCENT.amber}>
              <select className="w-full px-3 py-2.5 text-sm rounded-xl border focus:outline-none" style={inputStyle} value={form.ageRange} onChange={(e) => set('ageRange', e.target.value)}>
                {AGE_RANGES.map((x) => <option key={x} value={x}>{x}</option>)}
              </select>
            </Field>
            <Field theme={theme} label={L.auth.level} icon={GraduationCap} color={ACCENT.teal}>
              <select className="w-full px-3 py-2.5 text-sm rounded-xl border focus:outline-none" style={inputStyle} value={form.level} onChange={(e) => set('level', e.target.value)}>
                {LEVELS.map((x) => <option key={x} value={x}>{x}</option>)}
              </select>
            </Field>
            <Field theme={theme} label={L.auth.goal} icon={Target} color={ACCENT.green}>
              <select className="w-full px-3 py-2.5 text-sm rounded-xl border focus:outline-none" style={inputStyle} value={form.learningGoal} onChange={(e) => set('learningGoal', e.target.value)}>
                {GOALS.map((x, i) => <option key={x} value={x}>{L.goals[i]}</option>)}
              </select>
            </Field>

            {error && <p className="text-[11px]" style={{ color: ACCENT.coral }}>{error}</p>}

            <button onClick={submit} disabled={loading}
              className="w-full py-3 rounded-full text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-md disabled:opacity-50"
              style={{ backgroundColor: ACCENT.ocean, color: '#fff' }}>
              {loading ? <Loader2 size={14} className="animate-spin" /> : <UserPlus size={14} />}{L.auth.createAccount}
            </button>

            <button onClick={() => router.push('/login')} className="w-full flex items-center justify-center gap-1.5 text-[11px] pt-1" style={{ color: theme.meta }}>
              <ArrowLeft size={12} />{L.auth.login}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function Field({ theme, label, icon: Icon, color, children }: any) {
  return (
    <div>
      <label className="text-[11px] font-semibold flex items-center gap-1.5 mb-1.5" style={{ color: theme.sub }}>
        <Icon size={11} style={{ color }} /> {label}
      </label>
      {children}
    </div>
  );
}
