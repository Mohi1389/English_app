import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import {
  ArrowRight, BookOpen, Bot, ClipboardCheck, Users, Film,
  Sparkles, Target, ShieldCheck, ChevronLeft, ChevronRight,
  Zap, Heart, Globe2, MessageCircle,
} from 'lucide-react';
import Layout from '@/components/Layout';
import { useUI } from '@/lib/ui-context';
import { useAuth } from '@/lib/auth-context';
import { t } from '@/lib/i18n';
import { ACCENT, GRADIENT } from '@/styles/tokens';

const SLIDES = [
  { img: '/images/hero-1.png', emoji: '🚀', fa: ['یادگیری انگلیسی،', 'به سبک خودت'], desc: 'با دستیار هوشمند فارسی‌زبان، لغات تصویری و آزمون‌های جذاب، از صفر تا مکالمه قدم‌به‌قدم جلو برو.' },
  { img: '/images/hero-2.png', emoji: '🌍', fa: ['دنیای زبان،', 'توی جیب تو'], desc: 'هر کلمه‌ای که می‌خوای جستجو کن، تلفظ واقعی بشنو و با تصویر و مثال ماندگارش کن.' },
  { img: '/images/hero-3.png', emoji: '✨', fa: ['با دوستات یاد بگیر،', 'تو «محفل» گپ بزن'], desc: 'یه جامعهٔ امن و پرانرژی که توش با هم‌کلاسی‌ها چت می‌کنی، سوال می‌پرسی و با هم رشد می‌کنی.' },
];

const FEATURES = [
  { href: '/words', icon: BookOpen, grad: GRADIENT.teal, fa: ['لغات تصویری', 'هر لغت با تصویر جذاب، تلفظ و جمله نمونه.'], en: ['Visual words', 'Every word with an image, phonetics and example.'] },
  { href: '/ai', icon: Bot, grad: GRADIENT.ocean, fa: ['دستیار هوشمند', 'فارسی بپرس، فارسی جواب بگیر — بدون استرس.'], en: ['AI tutor', 'Ask in Persian, get Persian answers — stress-free.'] },
  { href: '/quizzes', icon: ClipboardCheck, grad: GRADIENT.coral, fa: ['آزمون‌های چالشی', '۸ سوال هدفمند برای سنجش و رشد.'], en: ['Smart quizzes', '8 focused questions to level up.'] },
  { href: '/community', icon: MessageCircle, grad: GRADIENT.lilac, fa: ['محفل', 'جای جمع دوستان برای گپ، سوال و انگیزه.'], en: ['The Lounge', 'Where friends chat, ask and stay motivated.'] },
  { href: '/movies', icon: Film, grad: 'linear-gradient(135deg, #F472B6, #FF6B52)', fa: ['فیلم و انیمیشن', 'زیرنویس دوزبانه و استخراج لغات.'], en: ['Movies & shows', 'Bilingual subtitles and word mining.'] },
  { href: '/dictionary', icon: Globe2, grad: 'linear-gradient(135deg, #38BDF8, #8B7CF0)', fa: ['دیکشنری هوشمند', 'هر کلمه‌ای که بخوای، فوری معنی و مثال.'], en: ['Smart dictionary', 'Any word, instant meaning and example.'] },
];

const WHY = {
  fa: [
    'کاملاً فارسی‌محور — توضیح فارسی، مثال انگلیسی، ترجمه فارسی',
    'دستیار مهربانی که هیچ‌وقت مجبورت نمی‌کنه انگلیسی حرف بزنی',
    'مسیر یادگیری شخصی با دنبال کردن پیشرفت و امتیاز',
    'محیطی امن و پرانرژی مخصوص نسل جدید',
  ],
  en: [
    'Persian-first — Persian explanation, English example, Persian translation',
    'A kind tutor that never forces you to speak English',
    'A personal path with progress and XP tracking',
    'A safe, energetic space built for the new generation',
  ],
};

const STATS = [
  { fa: 'لغت تصویری', en: 'visual words', val: '+۵۰۰' },
  { fa: 'آزمون تعاملی', en: 'interactive quizzes', val: '۸ سوال' },
  { fa: 'دوست همیار', en: 'study buddies', val: 'محفل' },
  { fa: 'تجربه یادگیری', en: 'learning experience', val: '۱۰۰٪' },
];

export default function HomePage() {
  const router = useRouter();
  const { lang, theme, rtl } = useUI();
  const { user } = useAuth();
  const L = t(lang);
  const isFa = lang === 'fa';

  const [slide, setSlide] = useState(0);

  const next = useCallback(() => setSlide((s) => (s + 1) % SLIDES.length), []);
  const prev = useCallback(() => setSlide((s) => (s - 1 + SLIDES.length) % SLIDES.length), []);

  useEffect(() => {
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [next]);

  return (
    <Layout>
      <div className="space-y-8">
        <section className="relative overflow-hidden rounded-3xl border animate-fade-up"
          style={{ backgroundColor: theme.card, borderColor: theme.border }}>
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div className="p-7 md:p-10 relative z-10">
              <span className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full border animate-float"
                style={{ background: GRADIENT.ocean, color: '#fff', borderColor: 'transparent', boxShadow: '0 6px 20px rgba(12,142,230,0.35)' }}>
                <Sparkles size={13} /> {isFa ? 'پلتفرم هوشمند یادگیری زبان' : 'AI-powered language platform'}
              </span>

              <h2 className="text-3xl md:text-5xl font-black mt-5 leading-tight tracking-tight">
                <span dir="ltr" className="block">Learn English</span>
                <span className="block text-gradient mt-1">{SLIDES[slide].fa[1]}</span>
              </h2>

              <p className="text-base md:text-lg mt-4 leading-relaxed" style={{ color: theme.sub }}>
                {SLIDES[slide].desc}
              </p>

              <div className="flex flex-wrap gap-3 mt-7">
                <button onClick={() => router.push(user ? '/dashboard' : '/words')}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-bold text-white transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 animate-pulse-glow"
                  style={{ background: GRADIENT.ocean }}>
                  {L.hero.cta1}
                  <ArrowRight size={16} style={{ transform: rtl ? 'rotate(180deg)' : 'none' }} />
                </button>
                <button onClick={() => router.push('/quizzes')}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-bold border transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                  style={{ backgroundColor: theme.card, borderColor: ACCENT.coral + '50', color: theme.text }}>
                  <Target size={15} style={{ color: ACCENT.coral }} /> {L.hero.cta2}
                </button>
              </div>

              <div className="flex items-center gap-2 mt-7">
                {SLIDES.map((_, i) => (
                  <button key={i} onClick={() => setSlide(i)} aria-label={`slide ${i + 1}`}
                    className="rounded-full transition-all duration-300"
                    style={{ width: i === slide ? 26 : 8, height: 8, backgroundColor: i === slide ? ACCENT.ocean : theme.border }} />
                ))}
              </div>
            </div>

            <div className="relative h-60 md:h-full min-h-[260px] overflow-hidden">
              <img key={slide} src={SLIDES[slide].img} alt="Learn English"
                className="absolute inset-0 w-full h-full object-cover animate-fade-in"
                style={{ opacity: 0.9 }} />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, transparent 60%, rgba(5,23,41,0.15))' }} />
              <button onClick={prev} aria-label="prev slide"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center glass"
                style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff' }}>
                <ChevronLeft size={18} className={rtl ? 'rotate-180' : ''} />
              </button>
              <button onClick={next} aria-label="next slide"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center glass"
                style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff' }}>
                <ChevronRight size={18} className={rtl ? 'rotate-180' : ''} />
              </button>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 animate-fade-up">
          {STATS.map((s, i) => (
            <div key={i} className="rounded-2xl border p-4 text-center hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
              style={{ backgroundColor: theme.card, borderColor: theme.border }}>
              <div className="text-2xl font-black text-gradient">{s.val}</div>
              <div className="text-xs font-semibold mt-1" style={{ color: theme.sub }}>{isFa ? s.fa : s.en}</div>
            </div>
          ))}
        </section>

        <section className="animate-fade-up">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Sparkles size={18} style={{ color: ACCENT.amber }} />
              {isFa ? 'همه‌چیز برای یادگیری تو' : 'Everything you need'}
            </h3>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              const [title, desc] = isFa ? f.fa : f.en;
              return (
                <button key={f.href} onClick={() => router.push(f.href)}
                  className="group rounded-2xl border p-6 text-start transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
                  style={{ backgroundColor: theme.card, borderColor: theme.border }}>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
                    style={{ background: f.grad }}>
                    <Icon size={20} style={{ color: '#fff' }} />
                  </div>
                  <h4 className="text-base font-bold">{title}</h4>
                  <p className="text-sm mt-1.5 leading-relaxed" style={{ color: theme.sub }}>{desc}</p>
                </button>
              );
            })}
          </div>
        </section>

        <section className="rounded-3xl border p-6 md:p-8 relative overflow-hidden animate-fade-up"
          style={{ backgroundColor: theme.card, borderColor: theme.border }}>
          <div className="absolute -top-16 -end-16 w-56 h-56 rounded-full blur-3xl opacity-15 pointer-events-none" style={{ backgroundColor: ACCENT.teal }} />
          <h3 className="text-xl font-bold flex items-center gap-2 mb-6 relative">
            <ShieldCheck size={18} style={{ color: ACCENT.green }} />
            {isFa ? 'چرا Learn with Mohanna؟' : 'Why Learn with Mohanna?'}
          </h3>
          <div className="grid sm:grid-cols-2 gap-4 relative">
            {WHY[lang].map((w, i) => {
              const colors = [ACCENT.ocean, ACCENT.coral, ACCENT.teal, ACCENT.green];
              return (
                <div key={i} className="flex items-start gap-3 p-4 rounded-2xl transition-all duration-300 hover:shadow-md"
                  style={{ backgroundColor: theme.rowHover }}>
                  <span className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: colors[i % 4] + '22' }}>
                    {i === 0 ? <Heart size={15} style={{ color: colors[i] }} /> : i === 1 ? <Bot size={15} style={{ color: colors[i] }} /> : i === 2 ? <Zap size={15} style={{ color: colors[i] }} /> : <ShieldCheck size={15} style={{ color: colors[i] }} />}
                  </span>
                  <span className="text-sm leading-relaxed font-medium" style={{ color: theme.sub }}>{w}</span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-3xl p-8 md:p-10 text-center relative overflow-hidden animate-fade-up"
          style={{ background: GRADIENT.ocean }}>
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
          <h3 className="text-2xl md:text-3xl font-black text-white relative">
            {isFa ? 'آماده‌ای سفر زبان‌تو شروع کنی؟' : 'Ready to start your language journey?'}
          </h3>
          <p className="text-white/85 mt-3 max-w-lg mx-auto relative">
            {isFa ? 'همین الان رایگان شروع کن — بدون استرس، با کلی انرژی و دوستای جدید.' : 'Start free now — stress-free, full of energy and new friends.'}
          </p>
          <button onClick={() => router.push(user ? '/dashboard' : '/signup')}
            className="mt-6 px-8 py-3.5 rounded-full text-sm font-black transition-all duration-300 hover:scale-105 hover:shadow-2xl relative"
            style={{ backgroundColor: '#fff', color: ACCENT.ocean }}>
            {isFa ? 'شروع رایگان' : 'Start free'} →
          </button>
        </section>
      </div>
    </Layout>
  );
}
