'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';

export default function Hero() {
  const t = useTranslations('hero');
  const locale = useLocale();

  return (
    <section className="min-h-screen flex items-center justify-center bg-black text-white relative overflow-hidden">
      {/* Background subtle pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#8B0000] rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#B8860B] rounded-full blur-[128px]" />
      </div>

      <div className="text-center space-y-8 px-4 relative z-10">
        <div className="space-y-2">
          <h1 className="text-7xl md:text-9xl font-bold tracking-tighter text-white">
            {t('title')}
          </h1>
          <p className="text-2xl md:text-3xl text-[#B8860B] font-light tracking-[0.3em]">
            {t('subtitle')}
          </p>
        </div>

        <p className="text-lg md:text-xl text-neutral-400 max-w-lg mx-auto leading-relaxed">
          {t('description')}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link
            href={`/${locale}/booking`}
            className="px-10 py-4 bg-[#8B0000] hover:bg-[#A52A2A] text-white font-medium rounded transition-all duration-300 hover:shadow-lg hover:shadow-[#8B0000]/20"
          >
            {t('cta_booking')}
          </Link>
          <Link
            href={`/${locale}/assessment`}
            className="px-10 py-4 border border-[#B8860B] text-[#B8860B] hover:bg-[#B8860B]/10 font-medium rounded transition-all duration-300"
          >
            {t('cta_assessment')}
          </Link>
        </div>
      </div>
    </section>
  );
}
