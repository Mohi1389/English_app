/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Ocean Blue - رنگ اصلی
        ocean: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc8fb',
          400: '#36aaf5',
          500: '#0c8ee6',
          600: '#0070c4',
          700: '#01599f',
          800: '#064c83',
          900: '#0a406d',
          950: '#072849',
        },
        // Coral - رنگ مکمل
        coral: {
          50: '#fff5f2',
          100: '#ffe8e1',
          200: '#ffd0c8',
          300: '#ffada0',
          400: '#ff846e',
          500: '#ff6b52',
          600: '#ed4a2e',
          700: '#c73a22',
          800: '#a43320',
          900: '#882f20',
          950: '#4a150c',
        },
      },
      fontFamily: {
        sans: ['Vazirmatn', 'system-ui', 'sans-serif'],
        en: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
};
