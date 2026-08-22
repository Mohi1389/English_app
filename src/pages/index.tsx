import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import {
  ChevronLeft, ChevronRight, BookOpen, Bot, ClipboardCheck,
  Users, Film, Sparkles,
} from 'lucide-react';
import Layout from '@/components/Layout';
import { useUI } from '@/lib/ui-context';
import { useAuth } from '@/lib/auth-context';
import { ACCENT } from '@/styles/tokens';

const SLIDES = [
  '/images/hero-1.jpg',
  '/images/hero-2.jpg',
  '/images/hero-3.jpg',
];

export default function HomePage() {
  const router = useRouter();
  const { lang, theme, rtl } = useUI();
  const { user } = useAuth();

  const [slide, setSlide] = useState(0);

  const next = useCallback(() => setSlide((s) => (s + 1) % SLIDES.length), []);
  const prev = useCallback(() => setSlide((s) => (s - 1 + SLIDES.length) % SLIDES.length), []);

  useEffect(() => {
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [next]);

  const isFa = lang === 'fa';

  const FEATURES = [
    {
      icon: BookOpen,
      color: ACCENT.ocean,
      fa: 'بانک لغات هوشمند',
      en: 'Smart Vocabulary Bank',
      faDesc: 'هزاران واژه با تصویر، تلفظ و مثال در چهارچوب سطوح استاندارد.',
      enDesc: 'Thousands of words with images, audio and examples across standard levels.',
    },
    {
      icon: Bot,
      color: ACCENT.lilac,
      fa: 'دستیار هوشمند AI',
      en: 'AI Tutor',
      faDesc: 'تمرین مکالمه و رفع اشکال به فارسی، بدون ترس و استرس از اشتباه.',
      enDesc: 'Practice conversation and fix mistakes, stress-free, never forced into English.',
    },
    {
      icon: ClipboardCheck,
      color: ACCENT.amber,
      fa: 'آزمون‌های تعیین سطح',
      en: 'Placement Quizzes',
      faDesc: 'سنجش دقیق سطح شما و طراحی مسیر یادگیری اختصاصی از همان ابتدا.',
      enDesc: 'Accurate level check and a personalised learning path from day one.',
    },
    {
      icon: Film,
      color: ACCENT.coral,
      fa: 'یادگیری با فیلم',
      en: 'Learn with Movies',
      faDesc: 'تماشای صحنه‌های واقعی برای تقویت شنیداری و درک زبان روزمره.',
      enDesc: 'Watch real scenes to sharpen listening and everyday comprehension.',
    },
    {
      icon: Users,
      color: ACCENT.green,
      fa: 'محفل (انجمن)',
      en: 'Community Lounge',
      faDesc: 'فضایی صمیمی برای تمرین با هم‌تیمی‌ها و اشتراک تجربه یادگیری.',
      enDesc: 'A warm space to practise with peers and share the journey.',
    },
    {
      icon: Sparkles,
      color: ACCENT.sky,
      fa: 'مسیر یادگیری شخصی',
      en: 'Personalised Path',
      faDesc: 'پیشرفت گام‌به‌گام با اهداف روزانه، امتیاز و یادآوری‌های هوشمند.',
      enDesc: 'Step-by-step progress with daily goals, XP and smart reminders.',
    },
  ];

  const STATS = [
    { value: '+۵۰۰۰', fa: 'واژه آموزشی', en: 'Learning words' },
    { value: '+۲۰۰', fa: 'درس و تمرین', en: 'Lessons & drills' },
    { value: '۲۴/۷', fa: 'دستیار در دسترس', en: 'Tutor available' },
    { value: '+۹۸٪', fa: 'رضایت زبان‌آموزان', en: 'Learner satisfaction' },
  ];

  const LEVELS = [
    { label: 'A1', fa: 'مبتدی', en: 'Beginner', color: ACCENT.green, desc: { fa: 'شروع از پایه‌ای‌ترین واژه‌ها و جمله‌ها', en: 'Start from the most basic words and sentences' } },
    { label: 'A2', fa: 'پایه', en: 'Elementary', color: ACCENT.teal, desc: { fa: 'مکالمه‌های ساده و روزمره را روان کن', en: 'Get fluent in simple everyday conversations' } },
    { label: 'B1', fa: 'متوسط', en: 'Intermediate', color: ACCENT.ocean, desc: { fa: 'تسلط بر موضوعات عمومی و ابراز نظر', en: 'Master general topics and express opinions' } },
    { label: 'B2', fa: 'متوسط رو به بالا', en: 'Upper-intermediate', color: ACCENT.lilac, desc: { fa: 'بحث و گفتگو در موضوعات تخصصی‌تر', en: 'Discuss and debate more specialised topics' } },
  ];

  return (
    <Layout>
      <div className="space-y-16 md:space-y-20">
        <section
          className="relative w-full h-[45vh] md:h-[62vh] rounded-3xl overflow-hidden animate-fade-up shadow-sm group"
          style={{ backgroundColor: theme.card }}
        >
          {SLIDES.map((imgSrc, i) => (
            <div
              key={imgSrc}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                i === slide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img
                src={imgSrc}
                alt=""
                className={`w-full h-full object-cover ${i === slide ? 'kenburns' : ''}`}
                draggable={false}
              />
            </div>
          ))}

          <button
            onClick={prev}
            aria-label="Previous"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md bg-black/15 text-white md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/30 active:scale-95"
          >
            <ChevronLeft size={22} className={rtl ? 'rotate-180' : ''} />
          </button>
          <button
            onClick={next}
            aria-label="Next"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md bg-black/15 text-white md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/30 active:scale-95"
          >
            <ChevronRight size={22} className={rtl ? 'rotate-180' : ''} />
          </button>

          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlide(i)}
                aria-label={`Slide ${i + 1}`}
                className="h-1.5 rounded-full transition-all duration-500"
                style={{
                  width: i === slide ? 28 : 6,
                  backgroundColor: i === slide ? '#fff' : 'rgba(255,255,255,0.4)',
                }}
              />
            ))}
          </div>
        </section>

        <div className="text-center max-w-2xl mx-auto space-y-6 animate-fade-up d-1">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
            {isFa ? 'زبان انگلیسی را' : 'Learn English'}{' '}
            <span className="text-gradient">{isFa ? 'مینیمال و حرفه‌ای بیاموز' : 'with style'}</span>
          </h1>
          <p className="text-[15px] md:text-[17px] leading-relaxed font-medium max-w-xl mx-auto" style={{ color: theme.sub }}>
            {isFa
              ? 'پلتفرم آموزش زبانی عاری از شلوغی و پیچیدگی. متمرکز بر آنچه برای پیشرفت واقعی شما طراحی شده است.'
              : 'A sleek, undistracted language environment. Crafted entirely to elevate your focus and learning speed.'}
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => router.push(user ? '/dashboard' : '/words')}
              className="px-8 py-3.5 rounded-full text-xs font-bold text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              style={{ backgroundColor: ACCENT.ocean, boxShadow: `0 4px 14px ${ACCENT.ocean}30` }}
            >
              {isFa ? 'شروع یادگیری' : 'Start learning'}
            </button>
            <button
              onClick={() => router.push('/quizzes')}
              className="px-8 py-3.5 rounded-full text-xs font-bold border transition-all duration-300 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] hover:-translate-y-0.5"
              style={{ borderColor: theme.border, color: theme.text }}
            >
              {isFa ? 'سنجش و تعیین سطح' : 'Placement test'}
            </button>
          </div>
        </div>

        <section className="animate-fade-up d-2">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map((s) => (
              <div
                key={s.en}
                className="rounded-2xl border p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                style={{ backgroundColor: theme.card, borderColor: theme.border }}
              >
                <div className="text-2xl md:text-3xl font-extrabold" style={{ color: ACCENT.ocean }}>
                  {s.value}
                </div>
                <div className="mt-1 text-[13px] font-medium" style={{ color: theme.sub }}>
                  {isFa ? s.fa : s.en}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="animate-fade-up d-2">
          <div className="text-center max-w-xl mx-auto mb-10 space-y-3">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              {isFa ? 'همه‌چیز برای یادگیری کامل' : 'Everything to learn completely'}
            </h2>
            <p className="text-[14px] md:text-[15px] font-medium" style={{ color: theme.sub }}>
              {isFa
                ? 'از یادگیری واژه تا مکالمه، همه‌ی ابزارها در یک مکان جمع شده‌اند.'
                : 'From vocabulary to conversation, every tool in one place.'}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.en}
                  className="rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  style={{ backgroundColor: theme.card, borderColor: theme.border }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${f.color}18`, color: f.color }}
                  >
                    <Icon size={22} />
                  </div>
                  <h3 className="text-[16px] font-bold mb-1.5">{isFa ? f.fa : f.en}</h3>
                  <p className="text-[13px] leading-relaxed" style={{ color: theme.sub }}>
                    {isFa ? f.faDesc : f.enDesc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="animate-fade-up d-3">
          <div className="text-center max-w-xl mx-auto mb-10 space-y-3">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              {isFa ? 'از هر سطحی شروع کن' : 'Start from any level'}
            </h2>
            <p className="text-[14px] md:text-[15px] font-medium" style={{ color: theme.sub }}>
              {isFa
                ? 'مسیر شما بر اساس سطح فعلی‌تان طراحی می‌شود — از مبتدی تا پیشرفته.'
                : 'Your path adapts to your current level — from beginner to advanced.'}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {LEVELS.map((lvl) => (
              <div
                key={lvl.label}
                className="rounded-2xl border p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                style={{ backgroundColor: theme.card, borderColor: theme.border }}
              >
                <div
                  className="inline-flex items-center justify-center w-12 h-12 rounded-full text-[15px] font-extrabold mb-3"
                  style={{ backgroundColor: `${lvl.color}18`, color: lvl.color }}
                >
                  {lvl.label}
                </div>
                <div className="text-[15px] font-bold mb-1">{isFa ? lvl.fa : lvl.en}</div>
                <p className="text-[12px] leading-relaxed" style={{ color: theme.sub }}>
                  {isFa ? lvl.desc.fa : lvl.desc.en}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="animate-fade-up d-4">
          <div
            className="relative overflow-hidden rounded-3xl p-8 md:p-14 text-center text-white"
            style={{ background: 'linear-gradient(135deg, #0C8EE6 0%, #22D3EE 100%)' }}
          >
            <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(circle at 20% 20%, #fff, transparent 50%)' }} />
            <div className="relative space-y-5 max-w-xl mx-auto">
              <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight">
                {isFa ? 'همین امروز شروع کن' : 'Start today'}
              </h2>
              <p className="text-[14px] md:text-base font-medium text-white/90">
                {isFa
                  ? 'به جمع هزاران زبان‌آموزی بپیوند که با لرن‌ویت‌محنا هر روز بهتر انگلیسی صحبت می‌کنند.'
                  : 'Join thousands of learners speaking better English every day with Learn with Mohanna.'}
              </p>
              <div className="flex items-center justify-center gap-3 pt-1">
                <button
                  onClick={() => router.push(user ? '/dashboard' : '/signup')}
                  className="px-8 py-3.5 rounded-full text-xs font-bold text-[#0C8EE6] bg-white transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
                >
                  {isFa ? 'ساخت حساب رایگان' : 'Create free account'}
                </button>
                <button
                  onClick={() => router.push('/ai')}
                  className="px-8 py-3.5 rounded-full text-xs font-bold text-white border border-white/40 transition-all duration-300 hover:bg-white/10 hover:-translate-y-0.5"
                >
                  {isFa ? 'امتحان دستیار هوشمند' : 'Try the AI tutor'}
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
