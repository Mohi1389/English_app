import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Layout from '@/components/Layout';
import { useUI } from '@/lib/ui-context';
import { useAuth } from '@/lib/auth-context';
import { ACCENT } from '@/styles/tokens';

const SLIDES = [
  '/images/slide-1.png',
  '/images/slide-2.png',
  '/images/slide-3.png',
];

export default function HomePage() {
  const router = useRouter();
  const { lang, theme } = useUI();
  const { user } = useAuth();

  const [slide, setSlide] = useState(0);
  const next = useCallback(() => setSlide((s) => (s + 1) % SLIDES.length), []);
  const prev = useCallback(() => setSlide((s) => (s - 1 + SLIDES.length) % SLIDES.length), []);

  useEffect(() => {
    const id = setInterval(next, 6000);
    return () => clearInterval(id);
  }, [next]);

  const isFa = lang === 'fa';

  return (
    <Layout>
      <div className="space-y-12">
        <section className="relative w-full h-[50vh] md:h-[68vh] rounded-3xl overflow-hidden animate-fade-up" style={{ backgroundColor: theme.card }}>
          {SLIDES.map((src, i) => (
            <div key={src} className={`absolute inset-0 transition-opacity duration-[1200ms] ease-in-out ${i === slide ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              <img src={src} alt="" className={`w-full h-full object-cover ${i === slide ? 'kenburns' : ''}`} draggable={false} />
            </div>
          ))}

          <button onClick={prev} aria-label="Previous" className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md bg-white/15 text-white opacity-0 hover:opacity-100 transition-opacity duration-300 hover:bg-white/25">
            <ChevronLeft size={20} />
          </button>
          <button onClick={next} aria-label="Next" className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md bg-white/15 text-white opacity-0 hover:opacity-100 transition-opacity duration-300 hover:bg-white/25">
            <ChevronRight size={20} />
          </button>

          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2.5">
            {SLIDES.map((_, i) => (
              <button key={i} onClick={() => setSlide(i)} aria-label={`Slide ${i + 1}`} className="h-1.5 rounded-full transition-all duration-500" style={{ width: i === slide ? 28 : 6, backgroundColor: i === slide ? '#fff' : 'rgba(255,255,255,0.4)' }} />
            ))}
          </div>
        </section>

        <div className="text-center max-w-2xl mx-auto space-y-6 animate-fade-up d-1">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
            {isFa ? 'زبان انگلیسی را' : 'Learn English'}{' '}
            <span className="text-gradient">{isFa ? 'زیبا و حرفه‌ای بیاموز' : 'beautifully'}</span>
          </h1>
          <p className="text-base md:text-lg leading-relaxed" style={{ color: theme.sub }}>
            {isFa ? 'یادگیری زبان انگلیسی با روشی ساده، مدرن و مینیمال — بدون شلوغی، فقط تمرکز بر پیشرفت تو.' : 'A simple, modern and minimal way to learn English — no clutter, just your progress.'}
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button onClick={() => router.push(user ? '/dashboard' : '/words')} className="px-8 py-3.5 rounded-full text-sm font-semibold text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5" style={{ background: ACCENT.ocean }}>
              {isFa ? 'شروع یادگیری' : 'Start learning'}
            </button>
            <button onClick={() => router.push('/quizzes')} className="px-8 py-3.5 rounded-full text-sm font-semibold border transition-all duration-300 hover:shadow-md hover:-translate-y-0.5" style={{ borderColor: theme.border, color: theme.text }}>
              {isFa ? 'تعیین سطح' : 'Placement test'}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
