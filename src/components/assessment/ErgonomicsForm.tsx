'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

/**
 * 鼠标受力与舒适度问卷：DPI / 灵敏度 / 握姿 / 疲劳感 → 舒适度评分
 */
export default function ErgonomicsForm({ onDone }: { onDone: (score: number) => void }) {
  const t = useTranslations('assessment.ergonomics');
  const [dpi, setDpi] = useState('');
  const [sens, setSens] = useState('');
  const [grip, setGrip] = useState<'palm' | 'claw' | 'fingertip' | ''>('');
  const [fatigue, setFatigue] = useState(3); // 1-5，越高越疲劳
  const [comfort, setComfort] = useState(3); // 1-5，越高越舒适

  const edpi = Number(dpi) > 0 && Number(sens) > 0 ? Math.round(Number(dpi) * Number(sens)) : null;
  // 主流 CS2 选手 eDPI 区间约 600-1200，落在区间内得分高
  const edpiScore = edpi === null ? null : edpi >= 400 && edpi <= 1600 ? 100 : edpi >= 200 && edpi <= 2400 ? 70 : 45;
  const comfortScore = comfort * 20;
  const fatigueScore = (6 - fatigue) * 20;
  const gripScore = grip ? 100 : null;
  const score =
    edpiScore !== null && grip
      ? Math.round(edpiScore * 0.35 + comfortScore * 0.3 + fatigueScore * 0.25 + gripScore! * 0.1)
      : null;

  const inputCls =
    'w-full bg-black border border-neutral-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#B8860B]';

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm text-neutral-400">{t('dpi')}</label>
          <input type="number" min={100} max={20000} value={dpi} onChange={(e) => setDpi(e.target.value)} className={inputCls} placeholder="800" />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-neutral-400">{t('sens')}</label>
          <input type="number" step="0.01" min={0.01} max={20} value={sens} onChange={(e) => setSens(e.target.value)} className={inputCls} placeholder="1.00" />
        </div>
      </div>
      {edpi !== null && (
        <p className="text-sm text-neutral-500">
          eDPI: <span className="text-[#B8860B] font-bold">{edpi}</span>
          <span className="ml-2 text-xs">({t('edpi_hint')})</span>
        </p>
      )}

      <div className="space-y-2">
        <label className="text-sm text-neutral-400">{t('grip')}</label>
        <div className="flex gap-2">
          {(['palm', 'claw', 'fingertip'] as const).map((g) => (
            <button
              type="button"
              key={g}
              onClick={() => setGrip(g)}
              className={`px-4 py-2 text-sm rounded border transition-colors ${
                grip === g ? 'border-[#B8860B] text-[#B8860B]' : 'border-neutral-800 text-neutral-400 hover:border-neutral-600'
              }`}
            >
              {t(`grip_${g}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm text-neutral-400 flex justify-between">
            <span>{t('fatigue')}</span>
            <span className="text-[#B8860B]">{fatigue}/5</span>
          </label>
          <input type="range" min={1} max={5} value={fatigue} onChange={(e) => setFatigue(Number(e.target.value))} className="w-full accent-[#8B0000]" />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-neutral-400 flex justify-between">
            <span>{t('comfort')}</span>
            <span className="text-[#B8860B]">{comfort}/5</span>
          </label>
          <input type="range" min={1} max={5} value={comfort} onChange={(e) => setComfort(Number(e.target.value))} className="w-full accent-[#8B0000]" />
        </div>
      </div>

      <button
        onClick={() => score !== null && onDone(score)}
        disabled={score === null}
        className="px-8 py-3 bg-[#8B0000] hover:bg-[#A52A2A] disabled:bg-neutral-800 disabled:text-neutral-500 rounded font-medium transition-colors"
      >
        {t('submit')}
      </button>
    </div>
  );
}
