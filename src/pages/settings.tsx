import React, { useState } from 'react';
import { Settings, Moon, Sun, Languages, Save, Bell, Shield, LogOut, Loader2 } from 'lucide-react';
import Layout from '@/components/Layout';
import { useUI } from '@/lib/ui-context';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/router';
import { ACCENT } from '@/styles/tokens';
import { AGE_RANGES } from '@/lib/validators';

export default function SettingsPage() {
  const { lang, dark, theme, toggleLang, toggleDark } = useUI();
  const { user, token, logout } = useAuth();
  const router = useRouter();

  const [notif, setNotif] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [dailyGoal, setDailyGoal] = useState(5);
  const [ageRange, setAgeRange] = useState(user?.ageRange || AGE_RANGES[0]);

  const text = (fa: string, en: string) => (lang === 'fa' ? fa : en);

  async function save() {
    if (!token) return;
    setSaving(true);
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ageRange, settings: { dailyGoal, notifications: notif } }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {}
    setSaving(false);
  }

  return (
    <Layout>
      <div className="max-w-xl mx-auto space-y-5">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0" style={{ backgroundColor: ACCENT.teal + '20' }}>
            <Settings size={19} style={{ color: ACCENT.teal }} />
          </div>
          <div>
            <h2 className="text-lg font-bold">{text('تنظیمات', 'Settings')}</h2>
            <p className="text-xs mt-1" style={{ color: theme.sub }}>{text('ظاهر، زبان و ترجیحات یادگیری خود را تنظیم کنید.', 'Customize appearance, language and learning preferences.')}</p>
          </div>
        </div>

        <Section title={text('ظاهر', 'Appearance')} icon={Moon} color={ACCENT.ocean} theme={theme}>
          <Row label={text('حالت تاریک', 'Dark mode')} desc={text('حالت تاریکِ اقیانوسی عمیق', 'Deep ocean dark mode')} theme={theme}>
            <button onClick={toggleDark} className="w-11 h-6 rounded-full relative transition-colors" style={{ backgroundColor: dark ? ACCENT.ocean : theme.border }}>
              <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all" style={{ insetInlineStart: dark ? '22px' : '2px' }} />
            </button>
          </Row>
          <Row label={text('زبان', 'Language')} desc={text('فارسی / English', 'Persian / English')} theme={theme}>
            <button onClick={toggleLang} className="flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all hover:shadow-sm" style={{ backgroundColor: theme.card, borderColor: theme.border, color: theme.sub }}>
              <Languages size={13} style={{ color: ACCENT.ocean }} />
              {lang === 'fa' ? 'EN' : 'فا'}
            </button>
          </Row>
        </Section>

        <Section title={text('یادگیری', 'Learning')} icon={Bell} color={ACCENT.coral} theme={theme}>
          <Row label={text('هدف روزانه لغات', 'Daily word goal')} desc={text('تعداد لغات جدید در هر روز', 'New words per day')} theme={theme}>
            <div className="flex gap-2">
              {[3, 5, 10, 15].map((n) => (
                <button key={n} onClick={() => setDailyGoal(n)}
                  className="w-8 h-8 rounded-full text-xs font-semibold transition-all"
                  style={dailyGoal === n ? { backgroundColor: ACCENT.ocean, color: '#fff' } : { backgroundColor: theme.navBg, color: theme.sub }}>
                  {n}
                </button>
              ))}
            </div>
          </Row>
          <Row label={text('بازه سنی', 'Age range')} desc={text('برای شخصی‌سازی محتوا', 'For content personalization')} theme={theme}>
            <select value={ageRange} onChange={(e) => setAgeRange(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-full border focus:outline-none" style={{ backgroundColor: theme.card, borderColor: theme.border, color: theme.text }}>
              {AGE_RANGES.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </Row>
          <Row label={text('اعلان‌ها', 'Notifications')} desc={text('یادآوری یادگیری روزانه', 'Daily learning reminders')} theme={theme}>
            <button onClick={() => setNotif(!notif)} className="w-11 h-6 rounded-full relative transition-colors" style={{ backgroundColor: notif ? ACCENT.green : theme.border }}>
              <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all" style={{ insetInlineStart: notif ? '22px' : '2px' }} />
            </button>
          </Row>
          {user && (
            <div className="pt-3">
              <button onClick={save} disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:shadow-md disabled:opacity-50"
                style={{ backgroundColor: ACCENT.ocean, color: '#fff' }}>
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}{saved ? text('ذخیره شد!', 'Saved!') : text('ذخیره تغییرات', 'Save changes')}
              </button>
            </div>
          )}
        </Section>

        <Section title={text('امنیت', 'Security')} icon={Shield} color={ACCENT.green} theme={theme}>
          <button onClick={() => router.push('/recover')} className="w-full flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-medium transition-all hover:shadow-sm" style={{ backgroundColor: theme.rowHover, borderColor: theme.border, color: theme.sub }}>
            <Shield size={15} style={{ color: ACCENT.green }} />{text('بازیابی رمز عبور', 'Recover password')}
          </button>
        </Section>

        {user && (
          <button onClick={() => { logout(); router.push('/'); }} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-semibold transition-all hover:shadow-sm" style={{ backgroundColor: ACCENT.coral + '10', borderColor: ACCENT.coral + '35', color: ACCENT.coral }}>
            <LogOut size={15} />{text('خروج از حساب', 'Log out')}
          </button>
        )}
      </div>
    </Layout>
  );
}

function Section({ title, icon: Icon, color, theme, children }: any) {
  return (
    <div className="rounded-2xl border p-5" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
      <h3 className="text-sm font-semibold flex items-center gap-2 mb-4" style={{ color: theme.text }}>
        <Icon size={14} style={{ color }} />{title}
      </h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Row({ label, desc, theme, children }: any) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="text-[13px] font-medium" style={{ color: theme.text }}>{label}</p>
        <p className="text-[11px]" style={{ color: theme.meta }}>{desc}</p>
      </div>
      {children}
    </div>
  );
}
