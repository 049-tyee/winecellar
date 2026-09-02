'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { fetchBookings, setBookingStatus, type BookingRow } from '@/lib/db';
import { getBookings, updateBookingStatus } from '@/lib/storage';
import { SERVICES } from '@/lib/services';

type Status = BookingRow['status'];

const STATUS_COLORS: Record<Status, string> = {
  PENDING: 'text-[#B8860B] border-[#B8860B]/40 bg-[#B8860B]/5',
  CONFIRMED: 'text-blue-400 border-blue-400/40 bg-blue-400/5',
  PAID: 'text-green-400 border-green-400/40 bg-green-400/5',
  COMPLETED: 'text-neutral-300 border-neutral-600',
  CANCELLED: 'text-[#8B0000] border-[#8B0000]/40 bg-[#8B0000]/5',
};

export default function BookingManager() {
  const t = useTranslations('admin');
  const ts = useTranslations('services');
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = () => {
    setLoading(true);
    fetchBookings()
      .then(setBookings)
      .catch(() =>
        setBookings(
          getBookings().map((b) => ({
            id: b.id,
            serviceKey: b.serviceKey,
            tier: b.tier,
            quantity: b.quantity,
            totalPrice: b.totalPrice,
            gameId: b.gameId,
            wechat: b.wechat,
            description: b.description,
            preferredTime: b.preferredTime,
            status: b.status,
            createdAt: b.createdAt,
          }))
        )
      )
      .finally(() => setLoading(false));
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(reload, []);

  const setStatus = async (id: string, status: Status) => {
    try {
      await setBookingStatus(id, status);
    } catch {
      updateBookingStatus(id, status);
    }
    reload();
  };

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold">{t('bookings_title')}</h2>
      {loading ? (
        <p className="text-sm text-neutral-500">{t('loading')}</p>
      ) : bookings.length === 0 ? (
        <p className="text-sm text-neutral-500 border border-dashed border-neutral-800 rounded-lg p-10 text-center">
          {t('bookings_empty')}
        </p>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => {
            const svc = SERVICES.find((s) => s.key === b.serviceKey);
            return (
              <div
                key={b.id}
                className="border border-neutral-800 rounded-lg p-6 space-y-4 bg-neutral-950/50 hover:border-neutral-700 transition-colors"
              >
                <div className="flex flex-wrap items-center gap-3 justify-between">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-bold text-lg">{svc ? ts(`list.${svc.key}.name`) : b.serviceKey}</span>
                    {b.tier && (
                      <span className="text-xs text-[#B8860B]">{ts(`list.position_tutorial.tier_${b.tier}`)}</span>
                    )}
                    <span className={`text-xs px-2.5 py-1 rounded-full border ${STATUS_COLORS[b.status]}`}>
                      {t(`status.${b.status}`)}
                    </span>
                  </div>
                  <span className="text-[#B8860B] font-bold text-xl tabular-nums">¥{b.totalPrice}</span>
                </div>
                <div className="text-sm text-neutral-400 grid grid-cols-1 md:grid-cols-3 gap-2">
                  <span>
                    {t('col_player')}: <span className="text-neutral-200">{b.gameId}</span>
                  </span>
                  <span>
                    {t('col_wechat')}: <span className="text-neutral-200">{b.wechat}</span>
                  </span>
                  <span>
                    {t('col_time')}: <span className="text-neutral-200">{b.preferredTime}</span>
                  </span>
                </div>
                {b.description && <p className="text-sm text-neutral-500">{b.description}</p>}
                <div className="flex gap-2 pt-1">
                  {b.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => setStatus(b.id, 'CONFIRMED')}
                        className="px-4 py-2 text-xs rounded-lg bg-[#B8860B]/20 text-[#B8860B] border border-[#B8860B]/40 hover:bg-[#B8860B]/30 active:scale-95 transition-all"
                      >
                        {t('action_confirm')}
                      </button>
                      <button
                        onClick={() => setStatus(b.id, 'CANCELLED')}
                        className="px-4 py-2 text-xs rounded-lg border border-neutral-700 text-neutral-400 hover:border-neutral-500 active:scale-95 transition-all"
                      >
                        {t('action_reject')}
                      </button>
                    </>
                  )}
                  {b.status === 'CONFIRMED' && (
                    <button
                      onClick={() => setStatus(b.id, 'PAID')}
                      className="px-4 py-2 text-xs rounded-lg bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500/20 active:scale-95 transition-all"
                    >
                      {t('action_paid')}
                    </button>
                  )}
                  {b.status === 'PAID' && (
                    <button
                      onClick={() => setStatus(b.id, 'COMPLETED')}
                      className="px-4 py-2 text-xs rounded-lg border border-neutral-700 text-neutral-300 hover:border-neutral-500 active:scale-95 transition-all"
                    >
                      {t('action_complete')}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
