import React, { useState, useEffect, useCallback } from 'react';
import { Users, Send, ShieldCheck, Flag, Ban, Loader2, MessageCircle, Sparkles, Heart, Flame } from 'lucide-react';
import Layout from '@/components/Layout';
import { useUI } from '@/lib/ui-context';
import { useAuth } from '@/lib/auth-context';
import { ACCENT, GRADIENT } from '@/styles/tokens';

interface Post { id: string; content: string; room: string; createdAt: string; user?: { fullName: string } | null }

const ROOMS = [
  { id: 'english-lounge', fa: 'لَنج اصلی', en: 'Main lounge', icon: '☕', color: ACCENT.coral },
  { id: 'vocab-help', fa: 'کمک لغات', en: 'Vocabulary help', icon: '📚', color: ACCENT.teal },
  { id: 'grammar', fa: 'گرامر', en: 'Grammar', icon: '✏️', color: ACCENT.amber },
  { id: 'speaking', fa: 'تمرین مکالمه', en: 'Speaking practice', icon: '🗣️', color: ACCENT.ocean },
  { id: 'school-help', fa: 'کمک درسی', en: 'School help', icon: '🏫', color: ACCENT.lilac },
  { id: 'movies', fa: 'انگلیسی با فیلم', en: 'English with movies', icon: '🎬', color: ACCENT.green },
];

const BLOCKED_KEY = 'lwm-blocked-users';
const AVATAR_COLORS = [ACCENT.ocean, ACCENT.coral, ACCENT.teal, ACCENT.lilac, ACCENT.amber, ACCENT.green];
function avatarColor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 997;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}

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
      <div className="space-y-6">
        <div className="rounded-3xl relative overflow-hidden p-6 md:p-8 animate-fade-up" style={{ background: GRADIENT.lilac }}>
          <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, #fff 1px, transparent 1px)', backgroundSize: '26px 26px' }} />
          <div className="relative flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shrink-0 animate-float" style={{ backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }}>
              <MessageCircle size={26} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white flex items-center gap-2">محفل <Sparkles size={18} /></h2>
              <p className="text-white/85 text-sm mt-1.5 leading-relaxed max-w-xl">
                {text('جای جمع دوستانت! اینجا سوال بپرس، تجربه‌ات را بگو و با هم انگیزه بگیرید.', 'Where your friends gather! Ask, share and stay motivated together.')}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border p-4 text-sm flex items-start gap-3 animate-fade-up" style={{ backgroundColor: ACCENT.amber + '0D', borderColor: ACCENT.amber + '35' }}>
          <ShieldCheck size={18} className="shrink-0 mt-0.5" style={{ color: ACCENT.amber }} />
          <div style={{ color: theme.sub }}>
            <span className="font-bold" style={{ color: theme.text }}>{text('قوانین محفل:', 'Lounge rules:')} </span>
            {text('با هم مهربان باش، اطلاعات شخصی (شماره، آدرس، رمز) را نده و محتوای نامناسب را گزارش کن.', 'Be kind, never share personal info, and report anything inappropriate.')}
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
          {ROOMS.map((r) => {
            const on = r.id === room;
            return (
              <button key={r.id} onClick={() => setRoom(r.id)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-bold whitespace-nowrap border transition-all duration-200"
                style={on
                  ? { background: GRADIENT.ocean, color: '#fff', borderColor: 'transparent', boxShadow: '0 4px 14px rgba(12,142,230,0.3)' }
                  : { backgroundColor: theme.card, color: theme.sub, borderColor: theme.border }}>
                <span className="text-base">{r.icon}</span>{text(r.fa, r.en)}
              </button>
            );
          })}
        </div>

        {user ? (
          <div className="rounded-2xl border p-4 animate-fade-up" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
            <textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={2}
              placeholder={text('چیزی برای گفتن داری؟ بنویس…', 'Got something to say? Type here…')}
              className="w-full px-4 py-3 text-base rounded-xl border focus:outline-none resize-none"
              style={{ backgroundColor: theme.rowHover, borderColor: theme.border, color: theme.text }} />
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs flex items-center gap-1" style={{ color: theme.meta }}><Heart size={11} style={{ color: ACCENT.coral }} />{text('مهربان باش 🙂', 'Be kind 🙂')}</span>
              <button onClick={submit} disabled={!draft.trim() || sending}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-40"
                style={{ background: GRADIENT.ocean, color: '#fff' }}>
                {sending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}{text('ارسال', 'Send')}
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border text-center py-6 animate-fade-up" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
            <p className="text-sm" style={{ color: theme.sub }}>{text('برای گپ زدن در محفل، وارد شو و عضو جمع شو!', 'Sign in to join the lounge and chat!')}</p>
          </div>
        )}

        <div className="space-y-3.5">
          {loading ? (
            <div className="text-center py-12"><Loader2 size={26} className="mx-auto animate-spin" style={{ color: ACCENT.ocean }} /></div>
          ) : visible.length === 0 ? (
            <div className="rounded-2xl border text-center py-14 animate-fade-up" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
              <span className="text-5xl">💬</span>
              <p className="text-sm mt-3" style={{ color: theme.meta }}>{text('هنوز کسی اینجا چیزی نگفته. اولین نفر باش! 🔥', 'No messages yet — be the first! 🔥')}</p>
            </div>
          ) : visible.map((p) => {
            const name = p.user?.fullName || text('کاربر', 'User');
            const col = avatarColor(name);
            return (
              <div key={p.id} className="rounded-2xl border p-4 hover:shadow-md transition-all duration-200 animate-fade-up"
                style={{ backgroundColor: theme.card, borderColor: theme.border }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black shrink-0 text-sm"
                    style={{ background: `linear-gradient(135deg, ${col}, ${col}cc)` }}>
                    {name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold truncate" style={{ color: theme.text }}>{name}</span>
                      <span className="text-[11px] shrink-0" style={{ color: theme.meta }}>
                        {new Date(p.createdAt).toLocaleString(lang === 'fa' ? 'fa-IR' : 'en-US')}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-[15px] mt-3 leading-relaxed" style={{ color: theme.sub }}>{p.content}</p>
                <div className="flex items-center gap-4 mt-3 pt-3 border-t" style={{ borderColor: theme.border }}>
                  <button onClick={() => report(p.id)} className="flex items-center gap-1.5 text-xs font-medium transition-opacity hover:opacity-70" style={{ color: theme.meta }}>
                    <Flag size={12} />{text('گزارش', 'Report')}
                  </button>
                  <button onClick={() => blockUser(name)} className="flex items-center gap-1.5 text-xs font-medium transition-opacity hover:opacity-70" style={{ color: theme.meta }}>
                    <Ban size={12} />{text('مسدود کردن', 'Block')}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
