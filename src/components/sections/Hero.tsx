'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  const t = useTranslations('hero');
  const locale = useLocale();

  return (
    <section className="min-h-screen flex items-center justify-center bg-black text-white relative overflow-hidden">
      {/* 背景光晕 */}
      <div className="absolute inset-0 opacity-[0.07]">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#8B0000] rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#B8860B] rounded-full blur-[128px]" />
      </div>
      {/* 背景巨型幽灵字 */}
      <div
        aria-hidden
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
      >
        <span className="text-[26rem] font-bold leading-none text-white/[0.03] tracking-tighter">
          酒
        </span>
      </div>

      <div className="text-center space-y-10 px-4 relative z-10">
        <p className="eyebrow animate-rise">CS2 Coaching / Est. 2026</p>

        <div className="space-y-3">
          <h1 className="text-8xl md:text-[10rem] font-bold tracking-tighter text-white leading-none animate-rise delay-100">
            {t('title')}
          </h1>
          <p className="text-xl md:text-3xl text-[#B8860B] font-light tracking-[0.4em] animate-rise delay-200">
            {t('subtitle')}
          </p>
        </div>

        <p className="text-base md:text-lg text-neutral-400 max-w-lg mx-auto leading-relaxed animate-rise delay-300">
          {t('description')}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2 animate-rise delay-500">
          <Link
            href={`/${locale}/booking`}
            className="group inline-flex items-center justify-center gap-2 px-12 py-4 bg-[#8B0000] hover:bg-[#A52A2A] text-white font-medium rounded transition-all duration-300 hover:shadow-xl hover:shadow-[#8B0000]/25 active:scale-[0.98]"
          >
            {t('cta_booking')}
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <Link
            href={`/${locale}/assessment`}
            className="px-12 py-4 border border-[#B8860B] text-[#B8860B] hover:bg-[#B8860B]/10 font-medium rounded transition-all duration-300 active:scale-[0.98]"
          >
            {t('cta_assessment')}
          </Link>
        </div>
      </div>

      {/* 底部滚动提示线 */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-px h-12 bg-gradient-to-b from-[#B8860B]/60 to-transparent animate-fade delay-500" />
    </section>
  );
}
