import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import '@/styles/globals.css';
import { UIProvider, useUI } from '@/lib/ui-context';
import { AuthProvider } from '@/lib/auth-context';

function Shell({ Component, pageProps }: AppProps) {
  const { lang, dark } = useUI();

  // Keep <html dir> and .dark in sync with UI state — drives RTL/LTR + theme
  useEffect(() => {
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    document.documentElement.classList.toggle('dark', dark);
  }, [lang, dark]);

  return <Component {...pageProps} />;
}

export default function MyApp(props: AppProps) {
  return (
    <UIProvider>
      <AuthProvider>
        <Shell {...props} />
      </AuthProvider>
    </UIProvider>
  );
}
