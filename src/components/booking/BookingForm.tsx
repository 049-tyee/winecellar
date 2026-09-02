'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { CalendarDays, CheckCircle2, Loader2 } from 'lucide-react';
import { SERVICES } from '@/lib/services';
import { createBooking, fetchSchedule, type SlotInfo } from '@/lib/db';
import { addBooking, occupySlot } from '@/lib/storage';

type Mode = 'A' | 'B';

/**
 * 预约表单：云端优先（Supabase），网络失败时回退 localStorage
 */
export default function BookingForm() {
  const t = useTranslations('booking');
  const ts = useTranslations('services');

  const [mode, setMode] = useState<Mode>('B');
  const [serviceKey, setServiceKey] = useState(SERVICES[0].key);
  const [tier, setTier] = useState<'basic' | 'advanced' | 'master'>('basic');
  const [quantity, setQuantity] = useState(1);
  const [gameId, setGameId] = useState('');
  const [wechat, setWechat] = useState('');
  const [description, setDescription] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [slot, setSlot] = useState<SlotInfo | null>(null);
  const [slots, setSlots] = useState<SlotInfo[]>([]);
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState<{ total: number; id: string } | null>(null);

  const service = SERVICES.find((s) => s.key === serviceKey)!;
  const unitPrice = service.tiers ? service.tiers.find((x) => x.key === tier)!.price : service.price;
  const total = unitPrice * quantity;

  const loadSlots = () => {
    fetchSchedule()
      .then(setSlots)
      .catch(() => setSlots([]));
  };
  useEffect(loadSlots, [submitted]);

  // 未来 14 天有开放时段的日期
  const openDays = (() => {
    const map = new Map<string, number[]>();
    const now = new Date();
    const max = new Date(now.getTime() + 14 * 864e5);
    slots.forEach((s) => {
      const d = new Date(`${s.date}T00:00:00`);
      if (d >= new Date(now.toDateString()) && d <= max && !s.bookingId) {
        map.set(s.date, [...(map.get(s.date) ?? []), s.hour].sort((a, b) => a - b));
      }
    });
    return Array.from(map.entries()).map(([date, hours]) => {
      const d = new Date(`${date}T00:00:00`);
      return { date, label: `${d.getMonth() + 1}/${d.getDate()}`, hours };
    });
  })();

  const canSubmit =
    !saving && gameId.trim() && wechat.trim() && (mode === 'B' ? preferredTime.trim() : slot !== null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSaving(true);
    const timeText = mode === 'A' && slot ? `${slot.date} ${String(slot.hour).padStart(2, '0')}:00` : preferredTime.trim();
    try {
      const id = await createBooking({
        serviceKey,
        tier: service.tiers ? tier : undefined,
        quantity,
        totalPrice: total,
        gameId: gameId.trim(),
        wechat: wechat.trim(),
        description: description.trim(),
        preferredTime: timeText,
        slot: mode === 'A' ? slot : null,
      });
      setSubmitted({ total, id });
    } catch {
      // 云端不可用 → 本地兜底
      const record = addBooking({
        serviceKey,
        tier: service.tiers ? tier : undefined,
        quantity,
        totalPrice: total,
        gameId: gameId.trim(),
        wechat: wechat.trim(),
        description: description.trim(),
        preferredTime: timeText,
      });
      if (mode === 'A' && slot) occupySlot(slot.date, slot.hour, record.id);
      setSubmitted({ total, id: record.id });
    }
    setSaving(false);
  };

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto text-center border border-[#B8860B]/30 rounded-xl p-12 bg-neutral-950 space-y-6 animate-rise">
        <CheckCircle2 className="w-16 h-16 text-[#B8860B] mx-auto" />
        <h2 className="text-3xl font-bold">{t('form.success')}</h2>
        <div className="text-neutral-400 text-sm space-y-1">
          <p>
            {t('form.order_no')}: <span className="text-neutral-200 font-mono text-xs">{submitted.id}</span>
          </p>
          <p>{t('form.deposit_hint', { deposit: Math.round(submitted.total * 0.5), total: submitted.total })}</p>
        </div>
        <div className="border border-neutral-800 rounded-lg p-4 text-sm text-neutral-400">{t('form.payment_hint')}</div>
        <button onClick={() => setSubmitted(null)} className="text-[#B8860B] text-sm hover:underline">
          {t('form.new_booking')}
        </button>
      </div>
    );
  }

  const inputCls =
    'w-full bg-black border border-neutral-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#B8860B] transition-colors';

  return (
    <div className="max-w-2xl mx-auto">
      {/* 模式切换 */}
      <div className="relative flex border border-neutral-800 rounded-lg overflow-hidden mb-10 bg-neutral-950">
        <span
          className="absolute top-0 bottom-0 w-1/2 bg-[#8B0000] transition-transform duration-300 ease-out"
          style={{ transform: mode === 'B' ? 'translateX(0)' : 'translateX(100%)' }}
        />
        {(['B', 'A'] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`relative z-10 flex-1 py-4 text-sm font-medium transition-colors ${
              mode === m ? 'text-white' : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            {m === 'A' ? t('mode_a') : t('mode_b')}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="space-y-8">
        {/* 服务选择 */}
        <div className="space-y-3">
          <label className="eyebrow">{t('form.service')}</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {SERVICES.map((s) => (
              <button
                type="button"
                key={s.key}
                onClick={() => setServiceKey(s.key)}
                className={`px-3 py-3 text-sm rounded-lg border transition-all duration-300 text-left active:scale-[0.97] ${
                  serviceKey === s.key
                    ? 'border-[#8B0000] bg-[#8B0000]/20 text-white'
                    : 'border-neutral-800 text-neutral-400 hover:border-neutral-600 hover:-translate-y-0.5'
                }`}
              >
                {ts(`list.${s.key}.name`)}
              </button>
            ))}
          </div>
          {service.tiers && (
            <div className="flex gap-2 pt-2 animate-fade">
              {service.tiers.map((x) => (
                <button
                  type="button"
                  key={x.key}
                  onClick={() => setTier(x.key)}
                  className={`px-4 py-2 text-sm rounded-lg border transition-all active:scale-[0.97] ${
                    tier === x.key
                      ? 'border-[#B8860B] text-[#B8860B] bg-[#B8860B]/10'
                      : 'border-neutral-800 text-neutral-400 hover:border-neutral-600'
                  }`}
                >
                  {ts(`list.position_tutorial.tier_${x.key}`)}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 数量 */}
        {service.unit !== 'tier' && (
          <div className="space-y-3">
            <label className="eyebrow">{t('form.quantity')}</label>
            <input
              type="number"
              min={1}
              max={99}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
              className={`${inputCls} w-32`}
            />
          </div>
        )}

        {/* 模式 A：时段选择 */}
        {mode === 'A' && (
          <div className="space-y-3 animate-fade">
            <label className="eyebrow flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-[#B8860B]" /> {t('form.pick_slot')}
            </label>
            {openDays.length === 0 ? (
              <p className="text-sm text-neutral-500 border border-dashed border-neutral-800 rounded-lg p-5">
                {t('form.no_slots')}
              </p>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {openDays.map((d) => (
                  <div key={d.date} className="flex items-center gap-3 flex-wrap">
                    <span className="text-sm text-neutral-300 w-14 shrink-0 tabular-nums">{d.label}</span>
                    {d.hours.map((h) => {
                      const active = slot?.date === d.date && slot?.hour === h;
                      return (
                        <button
                          type="button"
                          key={h}
                          onClick={() => setSlot({ date: d.date, hour: h })}
                          className={`px-3 py-2 text-xs rounded-lg border transition-all active:scale-95 ${
                            active
                              ? 'border-[#B8860B] bg-[#B8860B]/15 text-[#B8860B]'
                              : 'border-neutral-800 text-neutral-400 hover:border-neutral-600'
                          }`}
                        >
                          {String(h).padStart(2, '0')}:00
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 联系信息 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="eyebrow">{t('form.game_id')} *</label>
            <input value={gameId} onChange={(e) => setGameId(e.target.value)} required className={inputCls} />
          </div>
          <div className="space-y-2">
            <label className="eyebrow">{t('form.wechat')} *</label>
            <input value={wechat} onChange={(e) => setWechat(e.target.value)} required className={inputCls} />
          </div>
        </div>

        {mode === 'B' && (
          <div className="space-y-2 animate-fade">
            <label className="eyebrow">{t('form.preferred_time')} *</label>
            <input
              value={preferredTime}
              onChange={(e) => setPreferredTime(e.target.value)}
              required
              placeholder={t('form.preferred_time_placeholder')}
              className={inputCls}
            />
          </div>
        )}

        <div className="space-y-2">
          <label className="eyebrow">{t('form.description')}</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder={t('form.description_placeholder')}
            className={`${inputCls} resize-none`}
          />
        </div>

        {/* 价格汇总 */}
        <div className="flex items-center justify-between border-t border-neutral-800 pt-6">
          <span className="text-neutral-400 text-sm">{ts('calculator.total')}</span>
          <span className="text-4xl font-bold tabular-nums" key={total}>
            <span className="text-[#B8860B] text-2xl align-top">¥</span>
            {total}
          </span>
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full py-4 bg-[#8B0000] hover:bg-[#A52A2A] disabled:bg-neutral-800 disabled:text-neutral-500 rounded-lg font-medium transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          {t('form.submit')}
        </button>
        <p className="text-xs text-neutral-600 text-center">{t('form.deposit_note')}</p>
      </form>
    </div>
  );
}
