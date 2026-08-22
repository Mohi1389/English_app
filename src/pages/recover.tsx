import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { KeyRound, Mail, Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';
import Layout from '@/components/Layout';
import Logo from '@/components/Logo';
import { useUI } from '@/lib/ui-context';
import { ACCENT } from '@/styles/tokens';

export default function RecoverPage() {
  const router = useRouter();
  const { lang, theme } = useUI();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState('');

  const text = (fa: string, en: string) => (lang === 'fa' ? fa : en);
  const inputStyle = { backgroundColor: theme.card, borderColor: theme.border, color: theme.text };

  async function submit() {
    if (!email.trim()) return;
    setLoading(true);
    setErr('');
    try {
      const r = await fetch('/api/auth/recover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const d = await r.json();
      if (!r.ok) { setErr(d.error || text('خطا در ارسال', 'Error')); return; }
      setSent(true);
    } catch {
      setErr(text('خطای شبکه', 'Network error'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className="max-w-md mx-auto">
        <div className="rounded-2xl border p-6 md:p-7" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
          <div className="flex flex-col items-center text-center gap-3 mb-6">
            <Logo size={52} />
            <div>
              <h2 className="text-lg font-bold">{text('بازیابی رمز عبور', 'Recover password')}</h2>
              <p className="text-xs mt-1" style={{ color: theme.sub }}>{text('ایمیل خود را وارد کنید تا لینک بازیابی برایتان ارسال شود.', 'Enter your email and we\'ll send a recovery link.')}</p>
            </div>
          </div>

          {sent ? (
            <div className="text-center py-4">
              <CheckCircle2 size={40} className="mx-auto mb-3" style={{ color: ACCENT.green }} />
              <p className="text-sm font-semibold">{text('لینک بازیابی ارسال شد!', 'Recovery link sent!')}</p>
              <p className="text-xs mt-1.5" style={{ color: theme.sub }}>{text('ایمیل خود را بررسی کنید.', 'Check your inbox.')}</p>
              <button onClick={() => router.push('/login')} className="mt-5 px-5 py-2.5 rounded-full text-sm font-semibold hover:shadow-md" style={{ backgroundColor: ACCENT.ocean, color: '#fff' }}>{text('بازگشت به ورود', 'Back to login')}</button>
            </div>
          ) : (
            <div className="space-y-3">
              <label className="text-[11px] font-semibold flex items-center gap-1.5 mb-1.5" style={{ color: theme.sub }}>
                <Mail size={11} style={{ color: ACCENT.ocean }} />{text('ایمیل', 'Email')}
              </label>
              <input type="email" dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
                placeholder="you@example.com"
                className="w-full px-3 py-2.5 text-sm rounded-xl border focus:outline-none" style={inputStyle} />
              {err && <p className="text-[11px]" style={{ color: ACCENT.coral }}>{err}</p>}
              <button onClick={submit} disabled={loading || !email.trim()}
                className="w-full py-3 rounded-full text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-md disabled:opacity-50"
                style={{ backgroundColor: ACCENT.ocean, color: '#fff' }}>
                {loading ? <Loader2 size={14} className="animate-spin" /> : <KeyRound size={14} />}{text('ارسال لینک بازیابی', 'Send recovery link')}
              </button>
              <button onClick={() => router.push('/login')} className="w-full flex items-center justify-center gap-1.5 text-[11px] pt-1" style={{ color: theme.meta }}>
                <ArrowLeft size={12} />{text('بازگشت به ورود', 'Back to login')}
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
