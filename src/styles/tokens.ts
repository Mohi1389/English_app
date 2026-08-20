// Learn with Mohanna — Design tokens
// Ocean Blue (primary) + Coral (accent), Light & Dark (deep ocean, never pure black)

export const ACCENT = {
  ocean: '#0C8EE6',
  oceanDark: '#01599F',
  coral: '#FF6B52',
  teal: '#4ECDC4',
  amber: '#F5A623',
  green: '#4ADE80',
  lilac: '#B8A9E8',
};

export const LIGHT = {
  pageBg: '#F7FAFD',
  card: '#FFFFFF',
  headerBg: 'rgba(255,255,255,0.82)',
  navBg: '#EAF2F9',
  rowHover: '#F5F9FC',
  border: '#E4EDF5',
  text: '#0A2540',
  sub: '#5A7184',
  meta: '#93A5B5',
};

// Dark mode = deep ocean blue, NOT black
export const DARK = {
  pageBg: '#04203C',
  card: '#072849',
  headerBg: 'rgba(4,32,60,0.85)',
  navBg: '#0A406D',
  rowHover: '#0A3760',
  border: '#0E4A7A',
  text: '#F0F7FF',
  sub: '#BAE0FD',
  meta: '#7CC8FB',
};

export function getTheme(dark: boolean) {
  return dark ? DARK : LIGHT;
}

export type Theme = typeof LIGHT;
