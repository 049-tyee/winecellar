'use client';

import { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

const TRIALS = 8;
const ANGLES = [90, 135, 180];
const DIST = 260; // px

interface Trial {
  angleErr: number; // 像素误差
  timeMs: number;
}

/**
 * 定位精准度测试（左/右方向）：从中心起点快速甩向目标并点击
 * 指标 = 命中误差 + 命中时间
 */
export default function FlickTest({
  direction,
  onDone,
}: {
  direction: 'left' | 'right';
  onDone: (score: number) => void;
}) {
  const t = useTranslations('assessment');
  const areaRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<'ready' | 'running' | 'done'>('ready');
  const [target, setTarget] = useState<{ x: number; y: number } | null>(null);
  const [trials, setTrials] = useState<Trial[]>([]);
  const startTimeRef = useRef(0);
  const trialsRef = useRef<Trial[]>([]);

  const nextTrial = () => {
    const area = areaRef.current;
    if (!area) return;
    const W = area.offsetWidth;
    const H = 420;
    const angle = ANGLES[Math.floor(Math.random() * ANGLES.length)];
    const rad = (angle * Math.PI) / 180;
    const sign = direction === 'left' ? -1 : 1;
    const cx = W / 2;
    const cy = H / 2;
    const x = cx + sign * Math.sin(rad) * DIST;
    const y = cy - Math.cos(rad) * DIST;
    setTarget({ x: Math.min(W - 30, Math.max(30, x)), y });
    startTimeRef.current = performance.now();
  };

  const start = () => {
    trialsRef.current = [];
    setTrials([]);
    setPhase('running');
    nextTrial();
  };

  const clickTarget = (e: React.MouseEvent) => {
    if (phase !== 'running' || !target) return;
    const rect = areaRef.current!.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    const err = Math.hypot(cx - target.x, cy - target.y);
    const timeMs = performance.now() - startTimeRef.current;
    const next = [...trialsRef.current, { angleErr: err, timeMs }];
    trialsRef.current = next;
    setTrials(next);

    if (next.length >= TRIALS) {
      setPhase('done');
      setTarget(null);
      const avgErr = next.reduce((s, x) => s + x.angleErr, 0) / next.length;
      const avgTime = next.reduce((s, x) => s + x.timeMs, 0) / next.length;
      // 误差 0-80px 映射 100-40 分；时间 250-900ms 映射 100-40 分
      const errScore = Math.max(40, 100 - (avgErr / 80) * 60);
      const timeScore = Math.max(40, 100 - ((avgTime - 250) / 650) * 60);
      onDone(Math.round(Math.min(100, errScore * 0.6 + timeScore * 0.4)));
    } else {
      nextTrial();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-neutral-400">
        <span>{t(`tests.${direction === 'left' ? 'left_precision' : 'right_precision'}.hint`)}</span>
        {phase === 'running' && (
          <span className="text-[#B8860B] tabular-nums font-bold">
            {trials.length}/{TRIALS}
          </span>
        )}
      </div>
      <div
        ref={areaRef}
        className="relative h-[420px] border border-neutral-800 rounded-lg overflow-hidden bg-neutral-950"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      >
        {phase === 'running' && (
          <>
            {/* 起点标记 */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full border border-neutral-600" />
            {target && (
              <button
                onClick={clickTarget}
                className="absolute w-11 h-11 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#8B0000]/40 border-2 border-[#8B0000] hover:bg-[#8B0000]/60"
                style={{ left: target.x, top: target.y }}
                aria-label="target"
              >
                <span className="block w-1.5 h-1.5 mx-auto rounded-full bg-[#B8860B]" />
              </button>
            )}
          </>
        )}
        {phase !== 'running' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70">
            <button
              onClick={start}
              className="px-8 py-3 bg-[#8B0000] hover:bg-[#A52A2A] rounded font-medium transition-colors"
            >
              {phase === 'ready' ? t('tests.start') : t('tests.retry')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
