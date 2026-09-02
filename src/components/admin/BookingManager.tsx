'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { getBookings, updateBookingStatus, type BookingRecord } from '@/lib/storage';
import { SERVICES } from '@/lib/services';

const STATUS_COLORS: Record<BookingRecord['status'], string> = {
  PENDING: 'text-[#B8860B] border-[#B8860B]/40',
  CONFIRMED: 'text-blue-400 border-blue-400/40',
  PAID: 'text-green-400 border-green-400/40',
  COMPLETED: 'text-neutral-300 border-neutral-600',
  CANCELLED: 'text-[#8B0000] border-[#8B0000]/40',
};

export default function BookingManager() {
  const t = useTranslations('admin');
  const ts = useTranslations('services');
  const [bookings, setBookings] = useState<BookingRecord[]>(getBookings);

  const setStatus = (id: string, status: BookingRecord['status']) => {
    updateBookingStatus(id, status);
    setBookings(getBookings());
  };

  if (bookings.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold">{t('bookings_title')}</h2>
        <p className="text-sm text-neutral-500 border border-dashed border-neutral-800 rounded-lg p-8 text-center">
          {t('bookings_empty')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">{t('bookings_title')}</h2>
      <div className="space-y-3">
        {bookings.map((b) => {
          const svc = SERVICES.find((s) => s.key === b.serviceKey);
          return (
            <div key={b.id} className="border border-neutral-800 rounded-lg p-5 space-y-3 bg-neutral-950/50">
              <div className="flex flex-wrap items-center gap-3 justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-bold">{svc ? ts(`list.${svc.key}.name`) : b.serviceKey}</span>
                  {b.tier && (
                    <span className="text-xs text-[#B8860B]">{ts(`list.position_tutorial.tier_${b.tier}`)}</span>
                  )}
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${STATUS_COLORS[b.status]}`}>
                    {t(`status.${b.status}`)}
                  </span>
                </div>
                <span className="text-[#B8860B] font-bold tabular-nums">¥{b.totalPrice}</span>
              </div>
              <div className="text-sm text-neutral-400 grid grid-cols-1 md:grid-cols-3 gap-2">
                <span>{t('col_player')}: <span className="text-neutral-200">{b.gameId}</span></span>
                <span>{t('col_wechat')}: <span className="text-neutral-200">{b.wechat}</span></span>
                <span>{t('col_time')}: <span className="text-neutral-200">{b.preferredTime}</span></span>
              </div>
              {b.description && <p className="text-sm text-neutral-500">{b.description}</p>}
              <div className="flex gap-2 pt-1">
                {b.status === 'PENDING' && (
                  <>
                    <button
                      onClick={() => setStatus(b.id, 'CONFIRMED')}
                      className="px-4 py-1.5 text-xs rounded bg-[#B8860B]/20 text-[#B8860B] border border-[#B8860B]/40 hover:bg-[#B8860B]/30"
                    >
                      {t('action_confirm')}
                    </button>
                    <button
                      onClick={() => setStatus(b.id, 'CANCELLED')}
                      className="px-4 py-1.5 text-xs rounded border border-neutral-700 text-neutral-400 hover:border-neutral-500"
                    >
                      {t('action_reject')}
                    </button>
                  </>
                )}
                {b.status === 'CONFIRMED' && (
                  <button
                    onClick={() => setStatus(b.id, 'PAID')}
                    className="px-4 py-1.5 text-xs rounded bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500/20"
                  >
                    {t('action_paid')}
                  </button>
                )}
                {b.status === 'PAID' && (
                  <button
                    onClick={() => setStatus(b.id, 'COMPLETED')}
                    className="px-4 py-1.5 text-xs rounded border border-neutral-700 text-neutral-300 hover:border-neutral-500"
                  >
                    {t('action_complete')}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
