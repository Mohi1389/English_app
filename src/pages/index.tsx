import React from 'react';
import { useRouter } from 'next/router';
import {
  ArrowRight, BookOpen, Bot, ClipboardCheck, Users, Film,
  Sparkles, Target, ShieldCheck,
} from 'lucide-react';
import Layout from '@/components/Layout';
import { useUI } from '@/lib/ui-context';
import { useAuth } from '@/lib/auth-context';
import { t } from '@/lib/i18n';
import { ACCENT } from '@/styles/tokens';

const FEATURES = [
  { href: '/words', icon: BookOpen, color: ACCENT.teal, fa: ['لغات تعاملی', 'هر لغت با معنی فارسی، تلفظ، جمله نمونه و ترجمه.'], en: ['Interactive words', 'Meaning, phonetics, examples and translation.'] },
  { href: '/ai', icon: Bot, color: ACCENT.ocean, fa: ['دستیار هوشمند فارسی', 'فارسی بپرس، فارسی جواب بگیر.'], en: ['Persian AI tutor', 'Ask in Persian, get Persian answers.'] },
  { href: '/quizzes', icon: ClipboardCheck, color: ACCENT.amber, fa: ['آزمون‌های هدفمند', 'لغات، گرامر و تعیین سطح.'], en: ['Focused quizzes', 'Vocabulary, grammar and placement.'] },
  { href: '/community', icon: Users, color: ACCENT.green, fa: ['انجمن امن', 'اتاق‌های موضوعی و کمک گرفتن.'], en: ['Safe community', 'Topic rooms and peer help.'] },
  { href: '/movies', icon: Film, color: ACCENT.coral, fa: ['فیلم و انیمیشن', 'زیرنویس دوزبانه و استخراج لغات.'], en: ['Movies & animation', 'Bilingual subtitles and word extraction.'] },
  { href: '/dictionary', icon: Sparkles, color: ACCENT.lilac, fa: ['دیکشنری هوشمند', 'جستجوی کلمه با تمرین AI.'], en: ['Smart dictionary', 'Search any word with AI practice.'] },
];

const WHY = {
  fa: [
    'کاملاً فارسی‌محور — توضیح فارسی، مثال انگلیسی، ترجمه فارسی',
    'دستیار هوشمند مهربان که تو را مجبور به انگلیسی حرف زدن نمی‌کند',
    'مسیر یادگیری شخصی‌سازی‌شده با پیگیری پیشرفت',
    'محیطی امن و مناسب نوجوانان ۱۳ تا ۱۷ سال',
  ],
  en: [
    'Persian-first — Persian explanation, English example, Persian translation',
    'A kind AI tutor that never forces you to speak English',
    'Personalized learning path with progress tracking',
    'A safe space designed for teens aged 13–17',
  ],
};

export default function HomePage() {
  const router = useRouter();
  const { lang, theme, rtl } = useUI();
  const { user } = useAuth();
  const L = t(lang);

  return (
    <Layout>
      <div className="space-y-7">
        {/* Hero */}
        <section
          className="rounded-2xl border p-7 md:p-10 relative overflow-hidden"
          style={{ backgroundColor: theme.card, borderColor: theme.border }}
        >
          <div
            className="absolute -top-16 w-64 h-64 rounded-full blur-3xl opacity-25 pointer-events-none"
            style={{ backgroundColor: ACCENT.ocean, insetInlineEnd: '-40px' }}
          />
          <div
            className="absolute -bottom-20 w-52 h-52 rounded-full blur-3xl opacity-20 pointer-events-none"
            style={{ backgroundColor: ACCENT.coral, insetInlineStart: '-30px' }}
          />

          <div className="relative max-w-2xl">
            <span
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-full border"
              style={{ backgroundColor: ACCENT.coral + '12', color: '#C73A22', borderColor: ACCENT.coral + '30' }}
            >
              <Sparkles size={11} style={{ color: ACCENT.coral }} />
              {lang === 'fa' ? 'پلتفرم هوشمند یادگیری زبان' : 'AI-powered language platform'}
            </span>

            <h2
              className="text-2xl md:text-4xl font-bold mt-4 leading-tight tracking-tight"
              dir="ltr"
              style={{ textAlign: rtl ? 'right' : 'left' }}
            >
              Learn English<br />with confidence
            </h2>

            <p className="text-sm md:text-[15px] mt-4 leading-relaxed" style={{ color: theme.sub }}>
              {L.hero.sub}
            </p>

            <div className="flex flex-wrap gap-2.5 mt-6">
              <button
                onClick={() => router.push(user ? '/dashboard' : '/words')}
                className="flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                style={{ backgroundColor: ACCENT.ocean, color: '#fff' }}
              >
                {L.hero.cta1}
                <ArrowRight size={15} style={{ transform: rtl ? 'rotate(180deg)' : 'none' }} />
              </button>
              <button
                onClick={() => router.push('/quizzes')}
                className="flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold border transition-all duration-200 hover:shadow-sm"
                style={{ backgroundColor: theme.card, borderColor: ACCENT.coral + '40', color: theme.text }}
              >
                <Target size={15} style={{ color: ACCENT.coral }} />
                {L.hero.cta2}
              </button>
            </div>
          </div>
        </section>

        {/* Features */}
        <section>
          <h3 className="text-sm font-semibold flex items-center gap-2 mb-4">
            <Sparkles size={14} style={{ color: ACCENT.amber }} />
            {lang === 'fa' ? 'همه‌چیز برای یادگیری تو' : 'Everything you need'}
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              const [title, desc] = lang === 'fa' ? f.fa : f.en;
              return (
                <button
                  key={f.href}
                  onClick={() => router.push(f.href)}
                  className="rounded-2xl border p-5 text-start hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
                  style={{ backgroundColor: theme.card, borderColor: theme.border }}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center mb-3.5"
                    style={{ backgroundColor: f.color + '18' }}
                  >
                    <Icon size={15} style={{ color: f.color }} />
                  </div>
                  <h4 className="text-[13px] font-semibold">{title}</h4>
                  <p className="text-[12px] mt-1.5 leading-relaxed" style={{ color: theme.sub }}>{desc}</p>
                </button>
              );
            })}
          </div>
        </section>

        {/* Why */}
        <section className="rounded-2xl border p-5" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
          <h3 className="text-sm font-semibold flex items-center gap-2 mb-4">
            <ShieldCheck size={14} style={{ color: ACCENT.green }} />
            {lang === 'fa' ? 'چرا Learn with Mohanna؟' : 'Why Learn with Mohanna?'}
          </h3>
          <ul className="space-y-3">
            {WHY[lang].map((w, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span
                  className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                  style={{ backgroundColor: [ACCENT.ocean, ACCENT.coral, ACCENT.teal, ACCENT.amber][i % 4] }}
                />
                <span className="text-[12px] leading-relaxed" style={{ color: theme.sub }}>{w}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </Layout>
  );
}
