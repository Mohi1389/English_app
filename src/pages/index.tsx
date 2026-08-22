import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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

  return (
    <Layout>
      <div className="space-y-12">
        {/* ===== اسلایدر تصویری تمام‌عرض، خالص و بدون متن مزاحم ===== */}
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

          {/* کلید چپ ناوبری (نمایش ملایم هنگام هاور روی اسلایدر) */}
          <button
            onClick={prev}
            aria-label="Previous"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md bg-black/15 text-white md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/30 active:scale-95"
          >
            <ChevronLeft size={22} className={rtl ? 'rotate-180' : ''} />
          </button>
          
          {/* کلید راست ناوبری */}
          <button
            onClick={next}
            aria-label="Next"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md bg-black/15 text-white md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/30 active:scale-95"
          >
            <ChevronRight size={22} className={rtl ? 'rotate-180' : ''} />
          </button>

          {/* ایندیکیتورهای نقطه‌ای ظریف پایین اسلایدر */}
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

        {/* ===== عنوان و دکمه‌های ناوبری فوق‌العاده مینیمال، حرفه‌ای و خلوت ===== */}
        <div className="text-center max-w-2xl mx-auto space-y-6 animate-fade-up d-1">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
            {isFa ? 'زبان انگلیسی را' : 'Learn English'}{' '}
            <span className="text-gradient">{isFa ? 'مینیمال و حرفه‌ای بیاموز' : 'with style'}</span>
          </h1>
          
          <p className="text-[15px] md:text-[17px] leading-relaxed font-medium" style={{ color: theme.sub }}>
            {isFa
              ? 'پلتفرم آموزش زبانی عاری از شلوغی و پیچیدگی. متمرکز بر آنچه برای پیشرفت واقعی شما طراحی شده است.'
              : 'A sleek, undistracted language environment. Crafted entirely to elevate your focus and learning speed.'}
          </p>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => router.push(user ? '/dashboard' : '/words')}
              className="px-8 py-3.5 rounded-full text-xs font-bold text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              style={{
                backgroundColor: ACCENT.ocean,
                boxShadow: `0 4px 14px ${ACCENT.ocean}30`,
              }}
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
      </div>
    </Layout>
  );
}
