import React, { ReactNode } from 'react';
import { useRouter } from 'next/router';
import {
  Home, LayoutDashboard, BookOpen, Search, Bot, ClipboardCheck,
  Users, Film, User, Settings, Moon, Sun, Languages, LogOut,
} from 'lucide-react';
import Logo from './Logo';
import { useUI } from '@/lib/ui-context';
import { useAuth } from '@/lib/auth-context';
import { t } from '@/lib/i18n';
import { ACCENT } from '@/styles/tokens';

const NAV = [
  { href: '/', key: 'home', icon: Home, color: ACCENT.ocean },
  { href: '/dashboard', key: 'dashboard', icon: LayoutDashboard, color: ACCENT.coral },
  { href: '/words', key: 'words', icon: BookOpen, color: ACCENT.teal },
  { href: '/dictionary', key: 'dictionary', icon: Search, color: ACCENT.lilac },
  { href: '/ai', key: 'ai', icon: Bot, color: ACCENT.ocean },
  { href: '/quizzes', key: 'quizzes', icon: ClipboardCheck, color: ACCENT.amber },
  { href: '/community', key: 'community', icon: Users, color: ACCENT.green },
  { href: '/movies', key: 'movies', icon: Film, color: ACCENT.coral },
  { href: '/profile', key: 'profile', icon: User, color: ACCENT.lilac },
  { href: '/settings', key: 'settings', icon: Settings, color: ACCENT.teal },
] as const;

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { lang, dark, toggleLang, toggleDark, theme, rtl } = useUI();
  const { user, logout } = useAuth();
  const L = t(lang);

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: theme.pageBg, color: theme.text }}
    >
      {/* Frosted sticky header */}
      <header
        className="sticky top-0 z-50 backdrop-blur-xl border-b transition-colors duration-300"
        style={{ backgroundColor: theme.headerBg, borderColor: theme.border }}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-4">
          <div className="flex items-center justify-between gap-3">
            <button onClick={() => router.push('/')} className="flex items-center gap-3 text-start">
              <Logo size={40} />
              <div>
                <h1 className="text-base md:text-lg font-bold tracking-tight">Learn with Mohanna</h1>
                <p className="text-[11px] mt-0.5" style={{ color: theme.meta }}>{L.tagline}</p>
              </div>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleLang}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold border transition-all duration-200 hover:shadow-sm"
                style={{ backgroundColor: theme.card, borderColor: theme.border, color: theme.sub }}
              >
                <Languages size={13} style={{ color: ACCENT.ocean }} />
                {lang === 'fa' ? 'EN' : 'فا'}
              </button>

              <button
                onClick={toggleDark}
                className="w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-200 hover:shadow-sm"
                style={{ backgroundColor: theme.card, borderColor: theme.border }}
                aria-label="Toggle theme"
              >
                {dark
                  ? <Sun size={14} style={{ color: ACCENT.amber }} />
                  : <Moon size={14} style={{ color: ACCENT.ocean }} />}
              </button>

              {user && (
                <button
                  onClick={() => { logout(); router.push('/'); }}
                  className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold border transition-all duration-200 hover:shadow-sm"
                  style={{ backgroundColor: theme.card, borderColor: theme.border, color: theme.sub }}
                >
                  <LogOut size={13} style={{ color: ACCENT.coral }} /> {L.logout}
                </button>
              )}
            </div>
          </div>

          {/* Segmented pill nav */}
          <nav className="mt-4 overflow-x-auto no-scrollbar">
            <div className="flex gap-1 rounded-full p-1 w-max" style={{ backgroundColor: theme.navBg }}>
              {NAV.map((item) => {
                const Icon = item.icon;
                const active = router.pathname === item.href;
                return (
                  <button
                    key={item.href}
                    onClick={() => router.push(item.href)}
                    className="flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-medium rounded-full whitespace-nowrap transition-all duration-200"
                    style={active
                      ? { backgroundColor: theme.card, color: theme.text, boxShadow: '0 1px 2px rgba(0,0,0,.06)' }
                      : { color: theme.sub }}
                  >
                    <Icon size={13} style={{ color: active ? item.color : theme.meta }} />
                    {(L.nav as Record<string, string>)[item.key]}
                  </button>
                );
              })}
            </div>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-5 md:px-8 py-7 pb-24 animate-fade-in">
        {children}
      </main>

      {/* Mobile bottom nav — native app feel */}
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-50 border-t backdrop-blur-xl"
        style={{ backgroundColor: theme.headerBg, borderColor: theme.border }}
      >
        <div className="flex items-center justify-around py-2">
          {NAV.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const active = router.pathname === item.href;
            return (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                className="flex flex-col items-center gap-1 px-2 py-1"
              >
                <Icon size={18} style={{ color: active ? item.color : theme.meta }} />
                <span className="text-[9px] font-medium" style={{ color: active ? theme.text : theme.meta }}>
                  {(L.nav as Record<string, string>)[item.key]}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
