import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Loader2, User as UserIcon, Sparkles } from 'lucide-react';
import Layout from '@/components/Layout';
import { useUI } from '@/lib/ui-context';
import { useAuth } from '@/lib/auth-context';
import { t } from '@/lib/i18n';
import { ACCENT } from '@/styles/tokens';

interface Msg {
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTIONS = [
  'چطور می‌توانم بهتر زبان یاد بگیرم؟',
  'کمک کردن به مامانم به انگلیسی چی میشه؟',
  'I goed to school yesterday',
  'فرق between و among چیه؟',
];

export default function AiPage() {
  const { lang, theme } = useUI();
  const { token, user } = useAuth();
  const L = t(lang);

  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [convId, setConvId] = useState<string | undefined>();
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs, busy]);

  async function send(text?: string) {
    const q = (text ?? input).trim();
    if (!q || busy || !token) return;

    setInput('');
    setError('');
    setMsgs((m) => [...m, { role: 'user', content: q }]);
    setBusy(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ message: q, conversationId: convId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'خطایی رخ داد');
        return;
      }
      setConvId(data.conversationId);
      setMsgs((m) => [...m, { role: 'assistant', content: data.reply }]);
    } catch {
      setError('اتصال برقرار نشد');
    } finally {
      setBusy(false);
    }
  }

  if (!user) {
    return (
      <Layout>
        <div className="rounded-2xl border p-10 text-center" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
          <Bot size={30} className="mx-auto mb-4" style={{ color: theme.border }} />
          <p className="text-sm" style={{ color: theme.sub }}>{L.auth.gated}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-5">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0" style={{ backgroundColor: ACCENT.ocean + '20' }}>
            <Bot size={19} style={{ color: ACCENT.ocean }} />
          </div>
          <div>
            <h2 className="text-lg font-bold">{L.ai.title}</h2>
            <p className="text-xs mt-1 leading-relaxed max-w-xl" style={{ color: theme.sub }}>{L.ai.desc}</p>
          </div>
        </div>

        <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
          <div className="p-4 md:p-5 space-y-4 max-h-[460px] overflow-y-auto">
            {msgs.length === 0 && (
              <div className="text-center py-12">
                <Sparkles size={26} className="mx-auto mb-3" style={{ color: theme.border }} />
                <p className="text-sm" style={{ color: theme.meta }}>
                  {lang === 'fa' ? 'اولین سوالت را بپرس — من فارسی جواب می‌دهم' : 'Ask your first question'}
                </p>
              </div>
            )}

            {msgs.map((m, i) => (
              <div key={i} className={`flex gap-2.5 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: (m.role === 'user' ? ACCENT.coral : ACCENT.ocean) + '18' }}
                >
                  {m.role === 'user'
                    ? <UserIcon size={13} style={{ color: ACCENT.coral }} />
                    : <Bot size={13} style={{ color: ACCENT.ocean }} />}
                </div>
                <div
                  className="rounded-2xl px-4 py-3 text-[13px] leading-relaxed max-w-[82%] whitespace-pre-wrap border"
                  style={m.role === 'user'
                    ? { backgroundColor: ACCENT.coral + '12', borderColor: ACCENT.coral + '25' }
                    : { backgroundColor: theme.rowHover, borderColor: theme.border }}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {busy && (
              <div className="flex gap-2.5">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: ACCENT.ocean + '18' }}>
                  <Bot size={13} style={{ color: ACCENT.ocean }} />
                </div>
                <div
                  className="rounded-2xl px-4 py-3 text-[13px] border flex items-center gap-2"
                  style={{ backgroundColor: theme.rowHover, borderColor: theme.border, color: theme.sub }}
                >
                  <Loader2 size={13} className="animate-spin" style={{ color: ACCENT.ocean }} /> {L.ai.thinking}
                </div>
              </div>
            )}

            {error && <p className="text-[11px]" style={{ color: ACCENT.coral }}>{error}</p>}
            <div ref={endRef} />
          </div>

          {/* Suggestions */}
          <div className="px-4 md:px-5 pb-3 flex flex-wrap gap-2">
            {SUGGESTIONS.map((s, i) => (
              <button
                key={i}
                onClick={() => send(s)}
                disabled={busy}
                className="text-[11px] px-3 py-1.5 rounded-full border transition-all duration-200 hover:shadow-sm disabled:opacity-40"
                style={{ backgroundColor: theme.rowHover, borderColor: theme.border, color: theme.sub }}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="p-4 border-t flex items-center gap-2" style={{ borderColor: theme.border, backgroundColor: theme.rowHover }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
              placeholder={L.ai.placeholder}
              className="flex-1 px-4 py-2.5 text-sm rounded-full border focus:outline-none"
              style={{ backgroundColor: theme.card, borderColor: theme.border, color: theme.text }}
            />
            <button
              onClick={() => send()}
              disabled={busy || !input.trim()}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:shadow-md disabled:opacity-40"
              style={{ backgroundColor: ACCENT.ocean, color: '#fff' }}
            >
              {busy ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
            </button>
          </div>
        </div>

        <p className="text-[10px] text-center" style={{ color: theme.meta }}>{L.ai.note}</p>
      </div>
    </Layout>
  );
}
