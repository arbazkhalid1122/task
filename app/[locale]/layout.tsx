import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import Script from 'next/script';
import { routing } from '@/i18n/routing';
import Providers from '@/app/providers';
import { getServerAuth } from '@/lib/server-api';
import { Geist, Geist_Mono, Inter, Space_Grotesk } from "next/font/google";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  // Load messages directly to avoid relying on next-intl config alias resolution.
  const messages = (await import(`../../messages/${locale}.json`)).default;

  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const initialAuth = await getServerAuth(cookieHeader);

  return (
    <html lang={locale}>
      <head>
        {/* Privacy-friendly analytics by Plausible */}
        <Script
          async
          src="https://plausible.io/js/pa-EAVyHTsweqBrpuInh7zNJ.js"
          strategy="afterInteractive"
        />
        <Script
          id="plausible-init"
          strategy="afterInteractive"
        >{`
          window.plausible = window.plausible || function() {
            (plausible.q = plausible.q || []).push(arguments)
          };
          plausible.init = plausible.init || function(opts) {
            plausible.o = opts || {};
          };
          plausible.init();
        `}</Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${spaceGrotesk.variable} antialiased`}
      >
        <Providers initialAuth={initialAuth}>
          <NextIntlClientProvider messages={messages}>
            {children}
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  );
}
