'use client';

import { useTranslations } from 'next-intl';
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
} from 'recharts';
import { RotateCcw } from 'lucide-react';
import type { AssessmentRecord } from '@/lib/storage';

interface Scores {
  mouseControl: number;
  leftPrecision: number;
  rightPrecision: number;
  ergonomics: number;
  reaction: number;
  reactionMs: number;
}

// 各维度正态化估计的百分位（均值 62，标准差 14 的近似分布）
function percentile(score: number) {
  const z = (score - 62) / 14;
  const p = 0.5 * (1 + Math.tanh(z * 0.9));
  return Math.round(Math.min(99, Math.max(1, p * 100)));
}

export default function Report({
  scores,
  history,
  onRestart,
}: {
  scores: Scores;
  history: AssessmentRecord[];
  onRestart: () => void;
}) {
  const t = useTranslations('assessment');

  const dims = [
    { key: 'mouse_control', value: scores.mouseControl },
    { key: 'left_precision', value: scores.leftPrecision },
    { key: 'right_precision', value: scores.rightPrecision },
    { key: 'ergonomics', value: scores.ergonomics },
    { key: 'reaction', value: scores.reaction },
  ];
  const overall = Math.round(dims.reduce((s, d) => s + d.value, 0) / dims.length);
  const pct = percentile(overall);

  const radarData = dims.map((d) => ({ dim: t(`dimensions.${d.key}`), score: d.value }));
  const sorted = [...dims].sort((a, b) => a.value - b.value);
  const weakest = sorted[0];
  const strongest = sorted[sorted.length - 1];

  const historyData = history.map((h, i) => ({
    name: `#${i + 1}`,
    [t('dimensions.mouse_control')]: h.mouseControl,
    [t('dimensions.left_precision')]: h.leftPrecision,
    [t('dimensions.right_precision')]: h.rightPrecision,
    [t('dimensions.reaction')]: h.reaction,
  }));

  return (
    <div className="space-y-10">
      {/* 总览 */}
      <div className="text-center space-y-2">
        <p className="text-neutral-400 text-sm">{t('report.overall')}</p>
        <p className="text-7xl font-bold text-white tabular-nums">{overall}</p>
        <p className="text-[#B8860B]">{t('report.percentile', { percent: pct })}</p>
        <p className="text-neutral-500 text-sm">{t('report.reaction_ms', { ms: scores.reactionMs })}</p>
      </div>

      {/* 雷达图 */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData}>
            <PolarGrid stroke="#262626" />
            <PolarAngleAxis dataKey="dim" tick={{ fill: '#a3a3a3', fontSize: 12 }} />
            <Radar dataKey="score" stroke="#B8860B" fill="#8B0000" fillOpacity={0.35} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* 维度明细 */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {dims.map((d) => (
          <div key={d.key} className="border border-neutral-800 rounded-lg p-4 text-center">
            <p className="text-xs text-neutral-500 mb-1">{t(`dimensions.${d.key}`)}</p>
            <p className="text-2xl font-bold tabular-nums">{d.value}</p>
            <p className="text-xs text-[#B8860B] mt-1">{t('report.percentile', { percent: percentile(d.value) })}</p>
          </div>
        ))}
      </div>

      {/* 解读与建议 */}
      <div className="border border-[#B8860B]/20 rounded-lg p-6 bg-neutral-950 space-y-3">
        <h3 className="font-bold text-[#B8860B]">{t('report.suggestion')}</h3>
        <p className="text-sm text-neutral-300 leading-relaxed">
          {t('report.analysis', {
            strongest: t(`dimensions.${strongest.key}`),
            weakest: t(`dimensions.${weakest.key}`),
          })}
        </p>
        <p className="text-sm text-neutral-400 leading-relaxed">{t(`report.advice_${weakest.key}`)}</p>
      </div>

      {/* 历史曲线 */}
      {historyData.length > 1 && (
        <div className="space-y-4">
          <h3 className="font-bold">{t('report.history')}</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historyData}>
                <CartesianGrid stroke="#262626" strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fill: '#737373', fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fill: '#737373', fontSize: 12 }} />
                <Tooltip contentStyle={{ background: '#0a0a0a', border: '1px solid #262626' }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey={t('dimensions.mouse_control')} stroke="#B8860B" dot={false} />
                <Line type="monotone" dataKey={t('dimensions.left_precision')} stroke="#8B0000" dot={false} />
                <Line type="monotone" dataKey={t('dimensions.right_precision')} stroke="#A52A2A" dot={false} />
                <Line type="monotone" dataKey={t('dimensions.reaction')} stroke="#e5e5e5" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="text-center">
        <button
          onClick={onRestart}
          className="inline-flex items-center gap-2 px-8 py-3 border border-[#B8860B] text-[#B8860B] hover:bg-[#B8860B]/10 rounded font-medium transition-colors"
        >
          <RotateCcw className="w-4 h-4" /> {t('report.retest')}
        </button>
      </div>
    </div>
  );
}
