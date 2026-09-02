'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Minus, Plus } from 'lucide-react';
import { SERVICES } from '@/lib/services';

export default function PriceCalculator() {
  const t = useTranslations('services');
  const [serviceKey, setServiceKey] = useState(SERVICES[0].key);
  const [tier, setTier] = useState<'basic' | 'advanced' | 'master'>('basic');
  const [quantity, setQuantity] = useState(1);

  const service = SERVICES.find((s) => s.key === serviceKey)!;
  const unitPrice = service.tiers ? service.tiers.find((x) => x.key === tier)!.price : service.price;
  const total = unitPrice * quantity;

  const unitLabel =
    service.unit === 'hour' ? t('unit_hour') : service.unit === 'map' ? t('unit_map') : service.unit === 'match' ? t('unit_match') : t('unit_tier');

  return (
    <div className="border border-[#B8860B]/30 rounded-lg p-6 md:p-8 bg-neutral-950 space-y-6">
      <h3 className="text-xl font-bold text-[#B8860B]">{t('calculator.title')}</h3>

      <div className="space-y-2">
        <label className="text-sm text-neutral-400">{t('calculator.select_service')}</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {SERVICES.map((s) => (
            <button
              key={s.key}
              onClick={() => { setServiceKey(s.key); setQuantity(1); }}
              className={`px-3 py-2 text-sm rounded border transition-colors text-left ${
                serviceKey === s.key
                  ? 'border-[#8B0000] bg-[#8B0000]/20 text-white'
                  : 'border-neutral-800 text-neutral-400 hover:border-neutral-600'
              }`}
            >
              {t(`list.${s.key}.name`)}
            </button>
          ))}
        </div>
      </div>

      {service.tiers && (
        <div className="space-y-2">
          <label className="text-sm text-neutral-400">{t('calculator.tier')}</label>
          <div className="flex gap-2">
            {service.tiers.map((x) => (
              <button
                key={x.key}
                onClick={() => setTier(x.key)}
                className={`px-4 py-2 text-sm rounded border transition-colors ${
                  tier === x.key
                    ? 'border-[#B8860B] bg-[#B8860B]/10 text-[#B8860B]'
                    : 'border-neutral-800 text-neutral-400 hover:border-neutral-600'
                }`}
              >
                {t(`list.position_tutorial.tier_${x.key}`)} · ¥{x.price}
              </button>
            ))}
          </div>
        </div>
      )}

      {service.unit !== 'tier' && (
        <div className="space-y-2">
          <label className="text-sm text-neutral-400">
            {t('calculator.quantity')}（{unitLabel}）
          </label>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-9 h-9 rounded border border-neutral-700 flex items-center justify-center hover:border-[#B8860B] transition-colors"
              aria-label="decrease"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-2xl font-bold w-12 text-center tabular-nums">{quantity}</span>
            <button
              onClick={() => setQuantity(Math.min(99, quantity + 1))}
              className="w-9 h-9 rounded border border-neutral-700 flex items-center justify-center hover:border-[#B8860B] transition-colors"
              aria-label="increase"
            >
              <Plus className="w-4 h-4" />
            </button>
            <span className="text-neutral-500 text-sm">× ¥{unitPrice} / {unitLabel}</span>
          </div>
        </div>
      )}

      <div className="pt-4 border-t border-neutral-800 flex items-end justify-between">
        <span className="text-neutral-400">{t('calculator.total')}</span>
        <span className="text-4xl font-bold text-white tabular-nums">
          <span className="text-[#B8860B] text-2xl align-top">{t('calculator.currency')}</span>
          {total}
        </span>
      </div>
      <p className="text-xs text-neutral-600">{t('calculator.note')}</p>
    </div>
  );
}
