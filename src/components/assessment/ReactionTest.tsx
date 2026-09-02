'use client';

import { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

const TRIALS = 5;

/**
 * 反应速度测试：等待方块变色后尽快点击，5 次取平均
 */
export default function ReactionTest({ onDone }: { onDone: (score: number, avgMs: number) => void }) {
  const t = useTranslations('assessment');
  const [state, setState] = useState<'idle' | 'waiting' | 'go' | 'result' | 'early'>('idle');
  const [results, setResults] = useState<number[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const goTimeRef = useRef(0);
  const resultsRef = useRef<number[]>([]);

  const begin = () => {
    resultsRef.current = [];
    setResults([]);
    nextRound();
  };

  const nextRound = () => {
    setState('waiting');
    const delay = 1200 + Math.random() * 2500;
    timerRef.current = setTimeout(() => {
      goTimeRef.current = performance.now();
      setState('go');
    }, delay);
  };

  const click = () => {
    if (state === 'waiting') {
      clearTimeout(timerRef.current);
      setState('early');
      setTimeout(() => nextRound(), 900);
      return;
    }
    if (state === 'go') {
      const ms = Math.round(performance.now() - goTimeRef.current);
      const next = [...resultsRef.current, ms];
      resultsRef.current = next;
      setResults(next);
      if (next.length >= TRIALS) {
        const avg = next.reduce((a, b) => a + b, 0) / next.length;
        // 150-400ms 映射 100-40 分
        const score = Math.round(Math.max(40, Math.min(100, 100 - ((avg - 150) / 250) * 60)));
        setState('result');
        onDone(score, Math.round(avg));
      } else {
        setState('idle');
        setTimeout(() => nextRound(), 700);
      }
    }
  };

  const latest = results.length > 0 ? results[results.length - 1] : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-neutral-400">
        <span>{t('tests.reaction.hint')}</span>
        <span className="text-[#B8860B] tabular-nums font-bold">{results.length}/{TRIALS}</span>
      </div>
      <button
        onClick={state === 'idle' && results.length === 0 ? begin : click}
        className={`w-full h-[300px] rounded-lg border text-xl font-medium transition-colors ${
          state === 'go'
            ? 'bg-[#B8860B] text-black border-[#B8860B]'
            : state === 'early'
            ? 'bg-[#8B0000]/30 border-[#8B0000] text-[#8B0000]'
            : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-600'
        }`}
      >
        {state === 'idle' && results.length === 0 && t('tests.reaction.tap_start')}
        {state === 'waiting' && t('tests.reaction.waiting')}
        {state === 'go' && t('tests.reaction.click_now')}
        {state === 'early' && t('tests.reaction.too_early')}
        {state === 'idle' && results.length > 0 && latest !== null && `${latest} ms`}
        {state === 'result' && latest !== null && `${latest} ms`}
      </button>
    </div>
  );
}
