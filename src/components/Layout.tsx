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
  const { lang, dark, toggleLang, toggleDark, theme } = useUI();
  const { user, logout } = useAuth();
  const L = t(lang);

  return (
    <div className="min-h-screen transition-colors duration-500" style={{ backgroundColor: theme.pageBg, color: theme.text }}>
      <header className="sticky top-0 z-50 backdrop-blur-xl border-b transition-colors duration-500" style={{ backgroundColor: theme.headerBg, borderColor: theme.border }}>
        <div className="max-w-6xl mx-auto px-5 md:px-8 py-3.5">
          <div className="flex items-center justify-between gap-3">
            <button onClick={() => router.push('/')} className="flex items-center gap-2.5">
              <Logo size={34} />
              <span className="text-[15px] font-semibold tracking-tight">Learn with Mohanna</span>
            </button>
            <div className="flex items-center gap-1.5">
              <button onClick={toggleLang} className="px-3 py-2 rounded-full text-xs font-medium border transition-colors duration-300" style={{ backgroundColor: 'transparent', borderColor: theme.border, color: theme.sub }}>
                {lang === 'fa' ? 'EN' : 'فا'}
              </button>
              <button onClick={toggleDark} className="w-9 h-9 rounded-full border flex items-center justify-center transition-colors duration-300" style={{ backgroundColor: 'transparent', borderColor: theme.border }} aria-label="Toggle theme">
                {dark ? <Sun size={15} style={{ color: ACCENT.amber }} /> : <Moon size={15} style={{ color: ACCENT.ocean }} />}
              </button>
              {user && (
                <button onClick={() => { logout(); router.push('/'); }} className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium border transition-colors duration-300" style={{ backgroundColor: 'transparent', borderColor: theme.border, color: theme.sub }}>
                  <LogOut size={13} style={{ color: ACCENT.coral }} /> {L.logout}
                </button>
              )}
            </div>
          </div>

          <nav className="mt-3 overflow-x-auto no-scrollbar">
            <div className="flex gap-1 w-max">
              {NAV.map((item) => {
                const Icon = item.icon;
                const active = router.pathname === item.href;
                return (
                  <button key={item.href} onClick={() => router.push(item.href)} className="flex items-center gap-1.5 px-3.5 py-2 text-[13px] rounded-full whitespace-nowrap transition-colors duration-300" style={active ? { backgroundColor: theme.navBg, color: theme.text } : { color: theme.meta }}>
                    <Icon size={13} style={{ color: active ? item.color : 'currentColor' }} />
                    {(L.nav as Record<string, string>)[item.key]}
                  </button>
                );
              })}
            </div>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-5 md:px-8 py-8 pb-24 animate-fade-in">
        {children}
      </main>

      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 border-t backdrop-blur-xl" style={{ backgroundColor: theme.headerBg, borderColor: theme.border }}>
        <div className="flex items-center justify-around py-2">
          {NAV.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const active = router.pathname === item.href;
            return (
              <button key={item.href} onClick={() => router.push(item.href)} className="flex flex-col items-center gap-1 px-2 py-1">
                <Icon size={18} style={{ color: active ? item.color : theme.meta }} />
                <span className="text-[9px]" style={{ color: active ? theme.text : theme.meta }}>
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
