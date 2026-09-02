'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { User, Users, FileSearch, MonitorPlay, Swords, MapPin, ArrowRight } from 'lucide-react';

export default function ServicesPreview() {
  const t = useTranslations('services.list');
  const ts = useTranslations('services');
  const locale = useLocale();

  const services = [
    { key: 'coaching_1on1', icon: User, price: 150, unitKey: 'unit_hour' },
    { key: 'team_boost', icon: Users, price: 300, unitKey: 'unit_hour' },
    { key: 'demo_review_personal', icon: FileSearch, price: 50, unitKey: 'unit_map' },
    { key: 'demo_review_team', icon: MonitorPlay, price: 200, unitKey: 'unit_match' },
    { key: 'team_sparring', icon: Swords, price: 100, unitKey: 'unit_hour' },
    { key: 'position_tutorial', icon: MapPin, price: 100, unitKey: 'unit_hour', hasTiers: true },
  ];

  return (
    <section className="py-24 bg-neutral-950">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-16">
          <p className="eyebrow mb-4">Services / 01</p>
          <h2 className="display-xl text-white mb-4">{ts('title')}</h2>
          <p className="text-neutral-400 max-w-xl">{ts('subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.key}
                className="group p-6 bg-black border border-[#B8860B]/20 rounded-lg hover:border-[#B8860B]/50 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <Icon className="w-8 h-8 text-[#8B0000]" />
                  <span className="text-2xl font-bold text-white">
                    ¥{service.price}
                    <span className="text-sm font-normal text-neutral-500 ml-1">
                      /{service.hasTiers ? ts('from') : ts(service.unitKey)}
                    </span>
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {t(`${service.key}.name`)}
                </h3>
                <p className="text-sm text-neutral-400 mb-4">
                  {t(`${service.key}.desc`)}
                </p>
                <Link
                  href={`/${locale}/services`}
                  className="inline-flex items-center text-sm text-[#B8860B] hover:text-[#DAA520] transition-colors"
                >
                  {ts('view_detail')} <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link
            href={`/${locale}/services`}
            className="inline-flex items-center px-8 py-3 bg-[#8B0000] hover:bg-[#A52A2A] text-white rounded transition-colors"
          >
            {ts('view_all')} <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
}
