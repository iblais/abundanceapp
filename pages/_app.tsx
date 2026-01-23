/**
 * Abundance Recode - Next.js App Entry
 * Premium Design System with Plus Jakarta Sans
 */

import type { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Abundance Recode - Daily Guided Practices for Calm, Focus, and Confidence</title>
        <meta name="description" content="Daily guided practices to help you embody abundance, calm, and confidence. 7-minute Morning Visioneering, scene-based visualization, and identity-based transformation." />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#0B0E14" />

        {/* Open Graph */}
        <meta property="og:title" content="Abundance Recode - Shift Your State. Reshape Your Reality." />
        <meta property="og:description" content="Daily guided practices to help you embody abundance, calm, and confidence. Identity-based visioneering combined with guided state shifting." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://abundanceapp.vercel.app/" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Abundance Recode" />
        <meta name="twitter:description" content="Daily guided practices to help you embody abundance, calm, and confidence." />

        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <main>
        <Component {...pageProps} />
      </main>
    </>
  );
}
