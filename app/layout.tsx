import type {Metadata} from 'next';
import { Space_Grotesk, JetBrains_Mono, IBM_Plex_Sans_Arabic } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['100', '200', '300', '400', '500', '600', '700'],
  variable: '--font-arabic',
});

export const metadata: Metadata = {
  title: 'JUBA Editor Pro v11',
  description: 'Advanced pro-grade browser IDE with AI integration',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'JUBA Editor Pro',
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="ar" dir="rtl" className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${ibmPlexArabic.variable}`}>
      <head>
        <meta name="theme-color" content="#0d0f14" />
        <link rel="apple-touch-icon" href="https://picsum.photos/seed/juba/192/192" />
      </head>
      <body suppressHydrationWarning className="bg-[#0d0f14] text-[#cdd6e0] font-arabic antialiased overflow-hidden">
        {children}
      </body>
    </html>
  );
}
