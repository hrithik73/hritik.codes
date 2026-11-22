import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";
import { DebugMenu } from "~/components/debug-menu";
import { Footer } from "~/components/footer";
import { Header } from "~/components/header";
import { ThemeProvider } from "~/components/theme-provider";
import { siteUrl } from "~/config/site";
import { darkPaletteScript } from "~/lib/debug";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const title = "Hritik Singh — Product-minded Developer";
const description =
  "I'm Hritik Singh, an output-oriented developer with a product mindset. 5+ years building products used by thousands to millions of people. SDE-2 at Baazi Games, ex-BharatPe and CARS24.";

// "./" resolves against each route, so pages without their own canonical/og:url get the right one
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  alternates: { canonical: "./" },
  openGraph: {
    title,
    description,
    url: "./",
    siteName: "Hritik Singh",
    type: "website",
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", creator: "@hritik73_" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fcfcfc" },
    { media: "(prefers-color-scheme: dark)", color: "#080c10" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Static string from our own config: applies a previewed dark palette before paint */}
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: trusted constant */}
        <script dangerouslySetInnerHTML={{ __html: darkPaletteScript }} />
      </head>
      <body
        className={`${geist.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <ThemeProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-bg"
          >
            Skip to content
          </a>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <DebugMenu />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
