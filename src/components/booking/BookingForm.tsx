'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { CalendarDays, CheckCircle2 } from 'lucide-react';
import { SERVICES } from '@/lib/services';
import { addBooking, getSchedule, occupySlot } from '@/lib/storage';

type Mode = 'A' | 'B';

function toDateStr(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

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
  const [slot, setSlot] = useState<{ date: string; hour: number } | null>(null);
  const [submitted, setSubmitted] = useState<{ total: number; id: string } | null>(null);

  const service = SERVICES.find((s) => s.key === serviceKey)!;
  const unitPrice = service.tiers ? service.tiers.find((x) => x.key === tier)!.price : service.price;
  const total = unitPrice * quantity;

  // 未来 14 天的开放时段（模式 A）
  const openDays = useMemo(() => {
    const schedule = getSchedule();
    const days: { date: string; label: string; hours: number[] }[] = [];
    const now = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);
      const ds = toDateStr(d);
      const hours = schedule
        .filter((s) => s.date === ds && s.available && !s.bookingId)
        .map((s) => s.hour)
        .sort((a, b) => a - b);
      if (hours.length > 0) {
        days.push({
          date: ds,
          label: `${d.getMonth() + 1}/${d.getDate()}`,
          hours,
        });
      }
    }
    return days;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitted]);

  const canSubmit = gameId.trim() && wechat.trim() && (mode === 'B' ? preferredTime.trim() : slot !== null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    const timeText = mode === 'A' && slot ? `${slot.date} ${String(slot.hour).padStart(2, '0')}:00` : preferredTime;
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
  };

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto text-center border border-[#B8860B]/30 rounded-lg p-10 bg-neutral-950 space-y-6">
        <CheckCircle2 className="w-14 h-14 text-[#B8860B] mx-auto" />
        <h2 className="text-2xl font-bold">{t('form.success')}</h2>
        <div className="text-neutral-400 text-sm space-y-1">
          <p>{t('form.order_no')}: <span className="text-neutral-200 font-mono">{submitted.id}</span></p>
          <p>
            {t('form.deposit_hint', {
              deposit: Math.round(submitted.total * 0.5),
              total: submitted.total,
            })}
          </p>
        </div>
        <div className="border border-neutral-800 rounded p-4 text-sm text-neutral-400">
          {t('form.payment_hint')}
        </div>
        <button
          onClick={() => setSubmitted(null)}
          className="text-[#B8860B] text-sm hover:underline"
        >
          {t('form.new_booking')}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* 模式切换 */}
      <div className="flex border border-neutral-800 rounded-lg overflow-hidden mb-8">
        {(['B', 'A'] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              mode === m ? 'bg-[#8B0000] text-white' : 'text-neutral-400 hover:bg-neutral-900'
            }`}
          >
            {m === 'A' ? t('mode_a') : t('mode_b')}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="space-y-6">
        {/* 服务选择 */}
        <div className="space-y-2">
          <label className="text-sm text-neutral-400">{t('form.service')}</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {SERVICES.map((s) => (
              <button
                type="button"
                key={s.key}
                onClick={() => setServiceKey(s.key)}
                className={`px-3 py-2 text-sm rounded border transition-colors text-left ${
                  serviceKey === s.key
                    ? 'border-[#8B0000] bg-[#8B0000]/20 text-white'
                    : 'border-neutral-800 text-neutral-400 hover:border-neutral-600'
                }`}
              >
                {ts(`list.${s.key}.name`)}
              </button>
            ))}
          </div>
          {service.tiers && (
            <div className="flex gap-2 pt-2">
              {service.tiers.map((x) => (
                <button
                  type="button"
                  key={x.key}
                  onClick={() => setTier(x.key)}
                  className={`px-4 py-1.5 text-sm rounded border transition-colors ${
                    tier === x.key
                      ? 'border-[#B8860B] text-[#B8860B]'
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
          <div className="space-y-2">
            <label className="text-sm text-neutral-400">{t('form.quantity')}</label>
            <input
              type="number"
              min={1}
              max={99}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
              className="w-28 bg-black border border-neutral-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#B8860B]"
            />
          </div>
        )}

        {/* 模式 A：时段选择 */}
        {mode === 'A' && (
          <div className="space-y-3">
            <label className="text-sm text-neutral-400 flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-[#B8860B]" /> {t('form.pick_slot')}
            </label>
            {openDays.length === 0 ? (
              <p className="text-sm text-neutral-500 border border-dashed border-neutral-800 rounded p-4">
                {t('form.no_slots')}
              </p>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {openDays.map((d) => (
                  <div key={d.date} className="flex items-center gap-3 flex-wrap">
                    <span className="text-sm text-neutral-300 w-14 shrink-0">{d.label}</span>
                    {d.hours.map((h) => {
                      const active = slot?.date === d.date && slot?.hour === h;
                      return (
                        <button
                          type="button"
                          key={h}
                          onClick={() => setSlot({ date: d.date, hour: h })}
                          className={`px-3 py-1.5 text-xs rounded border transition-colors ${
                            active
                              ? 'border-[#B8860B] bg-[#B8860B]/10 text-[#B8860B]'
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
            <label className="text-sm text-neutral-400">{t('form.game_id')} *</label>
            <input
              value={gameId}
              onChange={(e) => setGameId(e.target.value)}
              required
              className="w-full bg-black border border-neutral-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#B8860B]"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-neutral-400">{t('form.wechat')} *</label>
            <input
              value={wechat}
              onChange={(e) => setWechat(e.target.value)}
              required
              className="w-full bg-black border border-neutral-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#B8860B]"
            />
          </div>
        </div>

        {mode === 'B' && (
          <div className="space-y-2">
            <label className="text-sm text-neutral-400">{t('form.preferred_time')} *</label>
            <input
              value={preferredTime}
              onChange={(e) => setPreferredTime(e.target.value)}
              required
              placeholder={t('form.preferred_time_placeholder')}
              className="w-full bg-black border border-neutral-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#B8860B]"
            />
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm text-neutral-400">{t('form.description')}</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder={t('form.description_placeholder')}
            className="w-full bg-black border border-neutral-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#B8860B] resize-none"
          />
        </div>

        {/* 价格汇总 */}
        <div className="flex items-center justify-between border-t border-neutral-800 pt-4">
          <span className="text-neutral-400 text-sm">{ts('calculator.total')}</span>
          <span className="text-3xl font-bold tabular-nums">
            <span className="text-[#B8860B] text-xl align-top">¥</span>
            {total}
          </span>
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full py-3 bg-[#8B0000] hover:bg-[#A52A2A] disabled:bg-neutral-800 disabled:text-neutral-500 rounded font-medium transition-colors"
        >
          {t('form.submit')}
        </button>
        <p className="text-xs text-neutral-600 text-center">{t('form.deposit_note')}</p>
      </form>
    </div>
  );
}
