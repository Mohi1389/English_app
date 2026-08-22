// Learn with Mohanna — Design tokens
// الهام از لوگوی ۳بعدی: آبی تیره → مشکی + فیروزه‌ای/سایان + سفید

export const ACCENT = {
  ocean: '#0C8EE6',
  oceanDark: '#01599F',
  coral: '#FF6B52',
  teal: '#22D3EE',
  amber: '#F5A623',
  green: '#34D399',
  lilac: '#8B7CF0',
  sky: '#38BDF8',
  pink: '#F472B6',
};

export const GRADIENT = {
  ocean: 'linear-gradient(135deg, #0C8EE6 0%, #22D3EE 100%)',
  teal: 'linear-gradient(135deg, #22D3EE 0%, #34D399 100%)',
  coral: 'linear-gradient(135deg, #FF6B52 0%, #F472B6 100%)',
  lilac: 'linear-gradient(135deg, #8B7CF0 0%, #22D3EE 100%)',
};

export const LIGHT = {
  pageBg: '#F7FBFF',
  card: '#FFFFFF',
  headerBg: 'rgba(255,255,255,0.85)',
  navBg: '#ECF4FC',
  rowHover: '#F1F7FD',
  border: '#E3EDF7',
  text: '#0A2540',
  sub: '#5A7184',
  meta: '#8CA3B8',
};

// Dark mode = تیره عمیق (آبی تیره → مشکی)، نه آبی تخت
export const DARK = {
  pageBg: '#051729',
  card: '#0A2140',
  headerBg: 'rgba(5,23,41,0.85)',
  navBg: '#0E2C50',
  rowHover: '#0D2A4D',
  border: '#15365F',
  text: '#F2F8FF',
  sub: '#B4D5F0',
  meta: '#7FA9CF',
};

export function getTheme(dark: boolean) {
  return dark ? DARK : LIGHT;
}

export type Theme = typeof LIGHT;
