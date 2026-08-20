import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  render() {
    return (
      <Html dir="rtl" lang="fa">
        <Head>
          <link rel="icon" href="/logo.svg" type="image/svg+xml" />
          <meta name="description" content="Learn with Mohanna — پلتفرم هوشمند یادگیری زبان انگلیسی برای فارسی‌زبان‌ها" />
          <meta name="theme-color" content="#0C8EE6" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
