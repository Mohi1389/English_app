// Learn with Mohanna — مینیمال، خالص و مدرن

export const ACCENT = {
  ocean: '#0C8EE6',
  oceanDark: '#0A7BC4',
  teal: '#22D3EE',
  coral: '#FF6B52',
  amber: '#F5A623',
  green: '#10B981',
  lilac: '#8B5CF6',
  sky: '#38BDF8',
};

export const GRADIENT = {
  ocean: 'linear-gradient(135deg, #0C8EE6 0%, #22D3EE 100%)',
  teal: 'linear-gradient(135deg, #22D3EE 0%, #10B981 100%)',
  coral: 'linear-gradient(135deg, #FF6B52 0%, #F472B6 100%)',
  lilac: 'linear-gradient(135deg, #8B5CF6 0%, #38BDF8 100%)',
};

export const LIGHT = {
  pageBg: '#FFFFFF',
  card: '#FFFFFF',
  headerBg: 'rgba(255,255,255,0.8)',
  navBg: '#F4F6F8',
  rowHover: '#F8FAFC',
  border: '#EEF2F6',
  text: '#0F172A',
  sub: '#64748B',
  meta: '#94A3B8',
};

export const DARK = {
  pageBg: '#0A0F1C',
  card: '#111827',
  headerBg: 'rgba(10,15,28,0.8)',
  navBg: '#151B2B',
  rowHover: '#161E2E',
  border: '#1E293B',
  text: '#F1F5F9',
  sub: '#94A3B8',
  meta: '#64748B',
};

export function getTheme(dark: boolean) {
  return dark ? DARK : LIGHT;
}

export type Theme = typeof LIGHT;
