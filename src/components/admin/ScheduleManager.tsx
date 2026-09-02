'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getSchedule, toggleSlot, type ScheduleSlot } from '@/lib/storage';

const HOURS = Array.from({ length: 12 }, (_, i) => i + 12); // 12:00 - 23:00

function toDateStr(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function ScheduleManager() {
  const t = useTranslations('admin');
  const [weekOffset, setWeekOffset] = useState(0);
  const [slots, setSlots] = useState<ScheduleSlot[]>(getSchedule);

  const days = useMemo(() => {
    const now = new Date();
    const dow = (now.getDay() + 6) % 7; // 周一为 0
    const monday = new Date(now);
    monday.setDate(now.getDate() - dow + weekOffset * 7);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d;
    });
  }, [weekOffset]);

  const slotMap = useMemo(() => {
    const m = new Map<string, ScheduleSlot>();
    slots.forEach((s) => m.set(`${s.date}-${s.hour}`, s));
    return m;
  }, [slots]);

  const click = (date: string, hour: number) => {
    setSlots(toggleSlot(date, hour));
  };

  const weekdayKeys = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">{t('schedule_title')}</h2>
        <div className="flex items-center gap-2">
          <button onClick={() => setWeekOffset(weekOffset - 1)} className="p-2 border border-neutral-800 rounded hover:border-neutral-600">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setWeekOffset(0)}
            className="px-3 py-2 text-xs border border-neutral-800 rounded hover:border-neutral-600"
          >
            {t('this_week')}
          </button>
          <button onClick={() => setWeekOffset(weekOffset + 1)} className="p-2 border border-neutral-800 rounded hover:border-neutral-600">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      <p className="text-xs text-neutral-500">{t('schedule_hint')}</p>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-[720px]">
          <thead>
            <tr>
              <th className="w-16" />
              {days.map((d, i) => (
                <th key={i} className="text-xs text-neutral-400 font-normal pb-2">
                  <div>{t(`weekdays.${weekdayKeys[i]}`)}</div>
                  <div className="text-neutral-200 font-medium">{d.getMonth() + 1}/{d.getDate()}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {HOURS.map((h) => (
              <tr key={h}>
                <td className="text-xs text-neutral-500 text-right pr-2 tabular-nums align-top pt-1">
                  {String(h).padStart(2, '0')}:00
                </td>
                {days.map((d) => {
                  const ds = toDateStr(d);
                  const s = slotMap.get(`${ds}-${h}`);
                  const open = s?.available;
                  const booked = !!s?.bookingId;
                  return (
                    <td key={ds} className="p-0.5">
                      <button
                        onClick={() => !booked && click(ds, h)}
                        disabled={booked}
                        className={`w-full h-8 rounded text-xs transition-colors ${
                          booked
                            ? 'bg-[#8B0000]/40 text-neutral-300 cursor-not-allowed'
                            : open
                            ? 'bg-[#B8860B]/20 text-[#B8860B] border border-[#B8860B]/40 hover:bg-[#B8860B]/30'
                            : 'bg-neutral-900 text-neutral-600 hover:bg-neutral-800'
                        }`}
                      >
                        {booked ? t('slot_booked') : open ? t('slot_open') : ''}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
