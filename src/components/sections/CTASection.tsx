'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { ArrowRight } from 'lucide-react';

export default function CTASection() {
  const t = useTranslations('hero');
  const th = useTranslations('home.cta');
  const locale = useLocale();

  return (
    <section className="py-24 bg-black relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#8B0000] rounded-full blur-[200px]" />
      </div>

      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          {th('title')}
        </h2>
        <p className="text-lg text-neutral-400 mb-8 max-w-2xl mx-auto">
          {th('desc')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={`/${locale}/assessment`}
            className="inline-flex items-center justify-center px-10 py-4 border border-[#B8860B] text-[#B8860B] hover:bg-[#B8860B]/10 rounded transition-all duration-300"
          >
            {t('cta_assessment')} <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
          <Link
            href={`/${locale}/booking`}
            className="inline-flex items-center justify-center px-10 py-4 bg-[#8B0000] hover:bg-[#A52A2A] text-white rounded transition-all duration-300"
          >
            {t('cta_booking')} <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
}
