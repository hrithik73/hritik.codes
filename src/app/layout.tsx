import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, Instrument_Serif } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const plusJakarta = Plus_Jakarta_Sans({
  variable: '--font-plus-jakarta',
  subsets: ['latin'],
});

const instrumentSerif = Instrument_Serif({
  variable: '--font-instrument-serif',
  subsets: ['latin'],
  weight: '400',
});

export const metadata: Metadata = {
  title: 'Hritik Singh — Mobile App Developer',
  description:
    'Mobile app developer with 4+ years of experience building flagship React Native apps. Crafting pixel-perfect, smooth mobile experiences.',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fafafa' },
    { media: '(prefers-color-scheme: dark)', color: '#111111' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${plusJakarta.variable} ${instrumentSerif.variable} font-sans antialiased`}>
        <ThemeProvider>
          <a
            href='#main-content'
            className='sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded focus:bg-zinc-900 focus:px-4 focus:py-2 focus:text-sm focus:text-zinc-100 dark:focus:bg-zinc-100 dark:focus:text-zinc-900'
          >
            Skip to content
          </a>
          <div className='flex min-h-screen flex-col'>
            <Header />
            <main id='main-content' className='flex-1'>
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
