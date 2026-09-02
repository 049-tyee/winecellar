'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { User, Users, FileSearch, Swords, Gamepad2, Map, ArrowUpRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SectionHeading from '@/components/SectionHeading';
import QuoteBuilder from '@/components/services/QuoteBuilder';
import FAQ from '@/components/services/FAQ';
import Membership from '@/components/services/Membership';
import { SERVICES } from '@/lib/services';

const ICONS = [User, Users, FileSearch, Swords, Gamepad2, Map];

export default function ServicesPage() {
  const t = useTranslations('services');
  const locale = useLocale();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black text-white pt-28">
        {/* 页头 */}
        <header className="max-w-6xl mx-auto px-4 mb-20">
          <SectionHeading
            index="Services / 01"
            title={t('title')}
            en="SERVICES & PRICING"
            desc={t('subtitle')}
          />
        </header>

        {/* 服务清单 */}
        <section className="max-w-6xl mx-auto px-4 mb-28">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map((s, i) => {
              const Icon = ICONS[i];
              return (
                <div
                  key={s.key}
                  className="group relative border border-neutral-800 rounded-lg p-7 bg-neutral-950/50 transition-all duration-300 hover:border-[#B8860B]/60 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#B8860B]/5"
                >
                  <div className="flex items-start justify-between mb-6">
                    <Icon className="w-9 h-9 text-[#8B0000] transition-transform duration-300 group-hover:scale-110" />
                    <span className="eyebrow">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{t(`list.${s.key}.name`)}</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed min-h-[2.5rem]">{t(`list.${s.key}.desc`)}</p>
                  <div className="mt-5 pt-5 border-t border-neutral-800">
                    {s.tiers ? (
                      <div className="space-y-1.5 text-sm">
                        {s.tiers.map((x) => (
                          <div key={x.key} className="flex justify-between">
                            <span className="text-neutral-500">{t(`list.position_tutorial.tier_${x.key}`)}</span>
                            <span className="text-[#B8860B] font-medium tabular-nums">¥{x.price}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[#B8860B] font-bold text-2xl tabular-nums">
                        ¥{s.price}
                        <span className="text-sm text-neutral-500 font-normal">
                          {' '}/ {s.unit === 'hour' ? t('unit_hour') : s.unit === 'map' ? t('unit_map') : t('unit_match')}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 分步报价器 */}
        <section className="max-w-6xl mx-auto px-4 mb-28">
          <div className="mb-14">
            <SectionHeading index="Quote / 02" title={t('builder.title')} en="LIVE QUOTE" desc={t('builder.desc')} />
          </div>
          <QuoteBuilder />
        </section>

        {/* FAQ */}
        <section className="max-w-4xl mx-auto px-4 mb-28">
          <div className="mb-14">
            <SectionHeading index="FAQ / 03" title={t('faq.title')} en="FREQUENTLY ASKED" />
          </div>
          <FAQ />
        </section>

        {/* 会员 */}
        <section className="max-w-5xl mx-auto px-4 mb-28">
          <Membership />
        </section>

        {/* 底部 CTA */}
        <section className="border-t border-neutral-900 py-20 text-center px-4">
          <Link
            href={`/${locale}/booking`}
            className="group inline-flex items-center gap-3 text-2xl md:text-4xl font-bold text-white hover:text-[#B8860B] transition-colors"
          >
            {t('bottom_cta')}
            <ArrowUpRight className="w-8 h-8 md:w-10 md:h-10 text-[#B8860B] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
