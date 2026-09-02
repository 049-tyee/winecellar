import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, unstable_setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, Locale } from '@/i18n';
import { cn } from "@/lib/utils";
import "../globals.css";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const messages = (await import(`@/messages/${locale}.json`)).default;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: messages.metadata.title,
      template: `%s | ${locale === 'zh' ? '酒窖 WineCellar' : 'WineCellar'}`,
    },
    description: messages.metadata.description,
    keywords:
      locale === 'zh'
        ? ['CS2', '电竞教练', 'CS2 教练', 'Demo 复盘', '天赋测评', '酒窖', 'WineCellar']
        : ['CS2', 'esports coach', 'CS2 coaching', 'demo review', 'talent assessment', 'WineCellar'],
    alternates: {
      canonical: `/${locale}`,
      languages: { zh: '/zh', en: '/en' },
    },
    openGraph: {
      title: messages.metadata.title,
      description: messages.metadata.description,
      siteName: locale === 'zh' ? '酒窖 WineCellar' : 'WineCellar',
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      type: 'website',
    },
    robots: { index: true, follow: true },
  };
}

export default async function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: Locale };
}>) {
  if (!locales.includes(locale)) notFound();

  unstable_setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className="dark">
      <body className={cn("min-h-screen bg-black text-white antialiased font-sans")}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
