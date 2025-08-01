import React from 'react';
import '../styles/global.css';
import Head from 'next/head';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from "@vercel/speed-insights/next";


const App = ({ Component, pageProps }) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const onClickAnywhere = () => {
    inputRef.current.focus();
  };

  return (
    <>
      <Head>

      <script async src="https://analytics.umami.is/script.js" data-website-id="df9d7e4e-4648-4ccf-8ea4-1548d32bd338"></script>
        <meta
          name="viewport"
          content="initial-scale=1.0, width=device-width"
          key="viewport"
          maximum-scale="1"
        />
      </Head>
      <div className="container">
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-G6K2QL237Q" />
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
  
            gtag('config', 'G-G6K2QL237Q');
          `}
        </Script>
    </div>
      <div
        className="text-light-foreground dark:text-dark-foreground min-w-max text-xs md:min-w-full md:text-base"
        onClick={onClickAnywhere}
      >
        <main className="bg-light-background dark:bg-dark-background w-full h-full p-2">
          <Component {...pageProps} inputRef={inputRef} />
        </main>
        < Analytics />
        < SpeedInsights />
      </div>
    </>
  );
};

export default App;
