'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { User, Users, FileSearch, Swords, Gamepad2, Map } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PriceCalculator from '@/components/services/PriceCalculator';
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
      <main className="min-h-screen bg-black text-white pt-24 pb-0">
        {/* 服务清单 */}
        <section className="max-w-6xl mx-auto px-4">
          <div className="text-center space-y-3 mb-16">
            <h1 className="text-4xl md:text-5xl font-bold">{t('title')}</h1>
            <p className="text-neutral-400">{t('subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((s, i) => {
              const Icon = ICONS[i];
              return (
                <div
                  key={s.key}
                  className="group border border-neutral-800 rounded-lg p-6 hover:border-[#B8860B]/50 transition-colors bg-neutral-950/50 flex flex-col"
                >
                  <Icon className="w-8 h-8 text-[#8B0000] mb-4" />
                  <h3 className="text-lg font-bold mb-2">{t(`list.${s.key}.name`)}</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed flex-1">{t(`list.${s.key}.desc`)}</p>
                  <div className="mt-4 pt-4 border-t border-neutral-800">
                    {s.tiers ? (
                      <div className="space-y-1 text-sm">
                        {s.tiers.map((x) => (
                          <div key={x.key} className="flex justify-between">
                            <span className="text-neutral-500">{t(`list.position_tutorial.tier_${x.key}`)}</span>
                            <span className="text-[#B8860B] font-medium">¥{x.price}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[#B8860B] font-bold text-xl">
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

        {/* 报价计算器 */}
        <section className="max-w-3xl mx-auto px-4 mt-24">
          <PriceCalculator />
          <div className="text-center mt-8">
            <Link
              href={`/${locale}/booking`}
              className="inline-block px-10 py-3 bg-[#8B0000] hover:bg-[#A52A2A] rounded font-medium transition-colors"
            >
              {t('cta_booking')}
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-3xl mx-auto px-4 mt-24">
          <h2 className="text-3xl font-bold text-center mb-10">{t('faq.title')}</h2>
          <FAQ />
        </section>

        {/* 会员 */}
        <section className="max-w-4xl mx-auto px-4 mt-24 mb-24">
          <Membership />
        </section>
      </main>
      <Footer />
    </>
  );
}
