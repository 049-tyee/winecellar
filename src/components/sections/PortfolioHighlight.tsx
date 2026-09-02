'use client';

import { Trophy, Users, Star } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function PortfolioHighlight() {
  const t = useTranslations('home.portfolio');
  const highlights = [
    { icon: Trophy, title: t('h1_title'), description: t('h1_desc') },
    { icon: Users, title: t('h2_title'), description: t('h2_desc') },
    { icon: Star, title: t('h3_title'), description: t('h3_desc') },
  ];

  return (
    <section className="py-24 bg-neutral-950 border-y border-[#B8860B]/10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-16">
          <p className="eyebrow mb-4">Portfolio / 02</p>
          <h2 className="display-xl text-white mb-4">{t('title')}</h2>
          <p className="text-neutral-400 max-w-xl">{t('subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="text-center p-6 bg-black border border-[#B8860B]/20 rounded-lg"
              >
                <Icon className="w-10 h-10 text-[#B8860B] mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-neutral-400">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
