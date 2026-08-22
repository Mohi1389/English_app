import React, { useState, useEffect, useCallback } from 'react';
import { Users, Send, ShieldCheck, Flag, Ban, Loader2, MessageCircle } from 'lucide-react';
import Layout from '@/components/Layout';
import { useUI } from '@/lib/ui-context';
import { useAuth } from '@/lib/auth-context';
import { ACCENT } from '@/styles/tokens';

interface Post { id: string; content: string; room: string; createdAt: string; user?: { fullName: string } | null }

const ROOMS = [
  { id: 'english-lounge', fa: 'English Lounge', en: 'English Lounge', icon: '☕', color: ACCENT.coral },
  { id: 'vocab-help', fa: 'کمک لغات', en: 'Vocabulary help', icon: '📚', color: ACCENT.teal },
  { id: 'grammar', fa: 'گرامر', en: 'Grammar', icon: '✏️', color: ACCENT.amber },
  { id: 'speaking', fa: 'تمرین مکالمه', en: 'Speaking practice', icon: '🗣️', color: ACCENT.ocean },
  { id: 'school-help', fa: 'کمک درسی', en: 'School help', icon: '🏫', color: ACCENT.lilac },
  { id: 'movies', fa: 'انگلیسی با فیلم', en: 'English with movies', icon: '🎬', color: ACCENT.green },
];

const BLOCKED_KEY = 'lwm-blocked-users';

export default function CommunityPage() {
  const { lang, theme } = useUI();
  const { user, token } = useAuth();
  const [room, setRoom] = useState('english-lounge');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [blocked, setBlocked] = useState<string[]>([]);

  const text = (fa: string, en: string) => (lang === 'fa' ? fa : en);

  useEffect(() => {
    try { setBlocked(JSON.parse(localStorage.getItem(BLOCKED_KEY) || '[]')); } catch {}
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch(`/api/community?room=${room}`);
      const d = await r.json();
      setPosts(d.posts || []);
    } catch { setPosts([]); }
    setLoading(false);
  }, [room]);

  useEffect(() => { load(); }, [load]);

  async function submit() {
    const c = draft.trim();
    if (!c || !token) return;
    setSending(true);
    try {
      await fetch('/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ room, content: c }),
      });
      setDraft('');
      await load();
    } catch {}
    setSending(false);
  }

  async function report(id: string) {
    if (!token) return;
    await fetch('/api/community/report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ postId: id }),
    });
  }

  function blockUser(name: string) {
    if (!name) return;
    setBlocked((b) => { const n = [...b, name]; localStorage.setItem(BLOCKED_KEY, JSON.stringify(n)); return n; });
  }

  const visible = posts.filter((p) => !blocked.includes(p.user?.fullName || ''));

  return (
    <Layout>
      <div className="space-y-5">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0" style={{ backgroundColor: ACCENT.green + '20' }}>
            <Users size={19} style={{ color: ACCENT.green }} />
          </div>
          <div>
            <h2 className="text-lg font-bold">{text('انجمن امن کاربران', 'Safe Community')}</h2>
            <p className="text-xs mt-1 flex items-center gap-1.5" style={{ color: theme.sub }}>
              <ShieldCheck size={12} style={{ color: ACCENT.green }} />
              {text('محیطی امن برای نوجوانان — گزارش محتوا، مسدود کردن و قوانین انجمن فعال است.', 'A safe space for teens, with reporting, blocking and community rules.')}
            </p>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {ROOMS.map((r) => {
            const on = r.id === room;
            return (
              <button key={r.id} onClick={() => setRoom(r.id)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[12px] font-medium whitespace-nowrap border transition-all duration-200"
                style={on ? { backgroundColor: r.color + '20', color: theme.text, borderColor: r.color + '50' } : { backgroundColor: theme.card, color: theme.sub, borderColor: theme.border }}>
                <span>{r.icon}</span>{text(r.fa, r.en)}
              </button>
            );
          })}
        </div>

        <div className="rounded-2xl border p-4 text-xs flex items-start gap-2.5" style={{ backgroundColor: ACCENT.amber + '0D', borderColor: ACCENT.amber + '35' }}>
          <ShieldCheck size={16} className="shrink-0 mt-0.5" style={{ color: ACCENT.amber }} />
          <div style={{ color: theme.sub }}>
            <span className="font-semibold">{text('قوانین انجمن:', 'Community rules:')} </span>
            {text('با دیگران مهربان باش، اطلاعات شخصی (شماره، آدرس، رمز) را به اشتراک نگذار و محتوای نامناسب را گزارش کن.', 'Be kind, never share personal information (phone, address, passwords), and report inappropriate content.')}
          </div>
        </div>

        {user ? (
          <div className="rounded-2xl border p-4" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
            <textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={2}
              placeholder={text('پیامت را بنویس…', 'Write your message…')}
              className="w-full px-3 py-2.5 text-sm rounded-xl border focus:outline-none resize-none"
              style={{ backgroundColor: theme.rowHover, borderColor: theme.border, color: theme.text }} />
            <div className="flex items-center justify-end mt-2">
              <button onClick={submit} disabled={!draft.trim() || sending}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all hover:shadow-md disabled:opacity-40"
                style={{ backgroundColor: ACCENT.ocean, color: '#fff' }}>
                {sending ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}{text('ارسال', 'Send')}
              </button>
            </div>
          </div>
        ) : (
          <p className="text-xs text-center py-2" style={{ color: theme.meta }}>{text('برای ارسال پیام ابتدا وارد شوید.', 'Sign in to post.')}</p>
        )}

        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-10"><Loader2 size={24} className="mx-auto animate-spin" style={{ color: ACCENT.ocean }} /></div>
          ) : visible.length === 0 ? (
            <div className="rounded-2xl border text-center py-12" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
              <MessageCircle size={26} className="mx-auto mb-3" style={{ color: theme.border }} />
              <p className="text-sm" style={{ color: theme.meta }}>{text('هنوز پیامی در این اتاق نیست. اولین نفر باش!', 'No messages here yet — be the first!')}</p>
            </div>
          ) : visible.map((p) => (
            <div key={p.id} className="rounded-2xl border p-4" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
              <div className="flex items-center justify-between gap-3">
                <span className="text-[12px] font-semibold" style={{ color: theme.text }}>{p.user?.fullName || text('کاربر', 'User')}</span>
                <span className="text-[10px]" style={{ color: theme.meta }}>{new Date(p.createdAt).toLocaleString(lang === 'fa' ? 'fa-IR' : 'en-US')}</span>
              </div>
              <p className="text-sm mt-2 leading-relaxed" style={{ color: theme.sub }}>{p.content}</p>
              <div className="flex items-center gap-3 mt-3">
                <button onClick={() => report(p.id)} className="flex items-center gap-1 text-[11px] font-medium transition-opacity hover:opacity-70" style={{ color: theme.meta }}>
                  <Flag size={11} />{text('گزارش', 'Report')}
                </button>
                <button onClick={() => blockUser(p.user?.fullName || '')} className="flex items-center gap-1 text-[11px] font-medium transition-opacity hover:opacity-70" style={{ color: theme.meta }}>
                  <Ban size={11} />{text('مسدود کردن', 'Block')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
