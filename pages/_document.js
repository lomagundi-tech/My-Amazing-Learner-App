import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;600;700;800&family=Nunito:wght@400;500;600;700&family=Noto+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <meta name="description" content="My Amazing Learner — AI-powered educational app for children aged 3–11" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
