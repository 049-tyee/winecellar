'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { Minus, Plus, Check, ArrowRight } from 'lucide-react';
import { SERVICES } from '@/lib/services';

type Tier = 'basic' | 'advanced' | 'master';

/**
 * 分步交互报价器（参考高端编辑排版）：
 * Step 01 选服务 → Step 02 选等级/数量 → 右侧实时报价单
 */
export default function QuoteBuilder() {
  const t = useTranslations('services');
  const locale = useLocale();
  const [serviceKey, setServiceKey] = useState<string | null>(null);
  const [tier, setTier] = useState<Tier>('basic');
  const [quantity, setQuantity] = useState(1);

  const service = SERVICES.find((s) => s.key === serviceKey) ?? null;
  const unitPrice = service
    ? service.tiers
      ? service.tiers.find((x) => x.key === tier)!.price
      : service.price
    : 0;
  const total = unitPrice * quantity;
  const deposit = Math.round(total * 0.5);

  const unitLabel = (s: NonNullable<typeof service>) =>
    s.unit === 'hour' ? t('unit_hour') : s.unit === 'map' ? t('unit_map') : s.unit === 'match' ? t('unit_match') : t('unit_tier');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 items-start">
      {/* 左侧：分步选择 */}
      <div className="space-y-14">
        {/* Step 01 服务 */}
        <div className="space-y-6">
          <div className="flex items-baseline gap-4">
            <span className="eyebrow">Step 01</span>
            <h3 className="text-2xl md:text-3xl font-bold">{t('builder.step1')}</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SERVICES.map((s) => {
              const active = serviceKey === s.key;
              return (
                <button
                  key={s.key}
                  onClick={() => setServiceKey(s.key)}
                  className={`group relative text-left p-5 rounded-lg border transition-all duration-300 active:scale-[0.98] ${
                    active
                      ? 'border-[#8B0000] bg-[#8B0000]/15 shadow-lg shadow-[#8B0000]/10'
                      : 'border-neutral-800 bg-neutral-950/50 hover:border-[#B8860B]/50 hover:-translate-y-0.5'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className={`font-bold transition-colors ${active ? 'text-white' : 'text-neutral-200'}`}>
                      {t(`list.${s.key}.name`)}
                    </span>
                    <span
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300 ${
                        active ? 'border-[#B8860B] bg-[#B8860B]' : 'border-neutral-700'
                      }`}
                    >
                      {active && <Check className="w-3 h-3 text-black" />}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-neutral-500">{t(`list.${s.key}.desc`)}</p>
                  <p className="mt-3 text-[#B8860B] font-bold tabular-nums">
                    ¥{s.price}
                    {s.tiers && <span className="text-xs text-neutral-500 font-normal"> {t('from')}</span>}
                    {!s.tiers && <span className="text-xs text-neutral-500 font-normal"> / {unitLabel(s)}</span>}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 02 等级（仅分级服务） */}
        {service?.tiers && (
          <div className="space-y-6 animate-fade">
            <div className="flex items-baseline gap-4">
              <span className="eyebrow">Step 02</span>
              <h3 className="text-2xl md:text-3xl font-bold">{t('builder.step2_tier')}</h3>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {service.tiers.map((x) => {
                const active = tier === x.key;
                return (
                  <button
                    key={x.key}
                    onClick={() => setTier(x.key)}
                    className={`p-4 rounded-lg border text-center transition-all duration-300 active:scale-[0.97] ${
                      active
                        ? 'border-[#B8860B] bg-[#B8860B]/10'
                        : 'border-neutral-800 hover:border-neutral-600 hover:-translate-y-0.5'
                    }`}
                  >
                    <p className={`font-bold ${active ? 'text-[#B8860B]' : 'text-neutral-300'}`}>
                      {t(`list.position_tutorial.tier_${x.key}`)}
                    </p>
                    <p className="mt-1 text-sm text-neutral-500 tabular-nums">¥{x.price}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 02/03 数量 */}
        {service && service.unit !== 'tier' && (
          <div className="space-y-6 animate-fade">
            <div className="flex items-baseline gap-4">
              <span className="eyebrow">Step 02</span>
              <h3 className="text-2xl md:text-3xl font-bold">{t('builder.step2_qty')}</h3>
            </div>
            <div className="flex items-center gap-5">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-12 h-12 rounded-lg border border-neutral-700 flex items-center justify-center hover:border-[#B8860B] active:scale-90 transition-all"
                aria-label="decrease"
              >
                <Minus className="w-5 h-5" />
              </button>
              <span className="text-5xl font-bold w-20 text-center tabular-nums">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(99, quantity + 1))}
                className="w-12 h-12 rounded-lg border border-neutral-700 flex items-center justify-center hover:border-[#B8860B] active:scale-90 transition-all"
                aria-label="increase"
              >
                <Plus className="w-5 h-5" />
              </button>
              <span className="text-neutral-500">
                × ¥{unitPrice} / {unitLabel(service)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 右侧：实时报价单（桌面端吸顶） */}
      <aside className="lg:sticky lg:top-24 border border-[#B8860B]/30 rounded-lg bg-neutral-950 overflow-hidden">
        <div className="px-6 py-4 border-b border-[#B8860B]/20 bg-black">
          <p className="eyebrow">{t('builder.quote')}</p>
        </div>
        <div className="p-6 space-y-5">
          {service ? (
            <>
              <div className="space-y-3 text-sm animate-fade" key={`${serviceKey}-${tier}-${quantity}`}>
                <div className="flex justify-between gap-4">
                  <span className="text-neutral-400">
                    {t(`list.${service.key}.name`)}
                    {service.tiers && ` · ${t(`list.position_tutorial.tier_${tier}`)}`}
                  </span>
                  <span className="tabular-nums">¥{unitPrice}</span>
                </div>
                {service.unit !== 'tier' && (
                  <div className="flex justify-between gap-4 text-neutral-500">
                    <span>
                      {unitLabel(service)} × {quantity}
                    </span>
                    <span className="tabular-nums">+¥{unitPrice * (quantity - 1)}</span>
                  </div>
                )}
              </div>
              <div className="border-t border-neutral-800 pt-4 space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-neutral-400 text-sm">{t('builder.total')}</span>
                  <span className="text-4xl font-bold tabular-nums">
                    <span className="text-[#B8860B] text-xl align-top">¥</span>
                    {total}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-neutral-500">
                  <span>{t('builder.deposit')}</span>
                  <span className="tabular-nums">¥{deposit}</span>
                </div>
                <div className="flex justify-between text-sm text-neutral-500">
                  <span>{t('builder.balance')}</span>
                  <span className="tabular-nums">¥{total - deposit}</span>
                </div>
                <p className="text-xs text-neutral-600 pt-1">{t('builder.deposit_note')}</p>
              </div>
              <Link
                href={`/${locale}/booking`}
                className="group flex items-center justify-center gap-2 w-full py-3.5 bg-[#8B0000] hover:bg-[#A52A2A] rounded font-medium transition-all active:scale-[0.98]"
              >
                {t('cta_booking')}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </>
          ) : (
            <p className="text-neutral-600 text-sm py-6 text-center">{t('builder.empty')}</p>
          )}
        </div>
      </aside>
    </div>
  );
}
