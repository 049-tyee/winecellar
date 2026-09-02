'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

const DURATION = 20; // 秒

/**
 * 鼠标掌控度测试：追踪沿利萨茹曲线移动的目标
 * 指标 = 光标在目标内的时间占比 + 移动平滑度
 */
export default function MouseControlTest({ onDone }: { onDone: (score: number) => void }) {
  const t = useTranslations('assessment');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<'ready' | 'running' | 'done'>('ready');
  const [timeLeft, setTimeLeft] = useState(DURATION);

  const start = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const W = (canvas.width = canvas.offsetWidth);
    const H = (canvas.height = 420);

    let mouse = { x: W / 2, y: H / 2 };
    let insideFrames = 0;
    let totalFrames = 0;
    let lastMouse = { x: W / 2, y: H / 2 };
    let jitterSum = 0;
    const startTime = performance.now();    let raf = 0;
    let finished = false;

    setPhase('running');
    setTimeLeft(DURATION);

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      const nx = e.clientX - r.left;
      const ny = e.clientY - r.top;
      jitterSum += Math.hypot(nx - lastMouse.x, ny - lastMouse.y);
      lastMouse = { x: nx, y: ny };
      mouse = { x: nx, y: ny };
    };
    canvas.addEventListener('mousemove', onMove);

    const target = (time: number) => {
      const s = time / 1000;
      return {
        x: W / 2 + Math.sin(s * 1.1) * (W * 0.36),
        y: H / 2 + Math.sin(s * 2.3) * (H * 0.32),
        r: 26,
      };
    };

    const loop = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      const remain = Math.max(0, DURATION - elapsed);
      setTimeLeft(Math.ceil(remain));

      const tg = target(elapsed);
      totalFrames++;
      if (Math.hypot(mouse.x - tg.x, mouse.y - tg.y) <= tg.r) insideFrames++;

      ctx.clearRect(0, 0, W, H);
      // 网格背景
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

      // 目标
      ctx.beginPath();
      ctx.arc(tg.x, tg.y, tg.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(139,0,0,0.35)';
      ctx.fill();
      ctx.strokeStyle = '#8B0000';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(tg.x, tg.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#B8860B';
      ctx.fill();

      // 光标
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 6, 0, Math.PI * 2);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      if (remain > 0) {
        raf = requestAnimationFrame(loop);
      } else if (!finished) {
        finished = true;
        canvas.removeEventListener('mousemove', onMove);
        const tracking = totalFrames ? (insideFrames / totalFrames) * 100 : 0;
        // 平滑度：总位移越大越差，归一化到 0-100（参考阈值：20秒约 12000px 位移为满分下限）
        const smooth = Math.max(0, 100 - Math.max(0, jitterSum - 6000) / 120);
        const score = Math.round(tracking * 0.75 + smooth * 0.25);
        setPhase('done');
        onDone(Math.min(100, score));
      }
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener('mousemove', onMove);
    };
  };

  useEffect(() => () => setPhase('ready'), []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-neutral-400">
        <span>{t('tests.mouse_control.hint')}</span>
        {phase === 'running' && <span className="text-[#B8860B] tabular-nums text-lg font-bold">{timeLeft}s</span>}
      </div>
      <div className="relative border border-neutral-800 rounded-lg overflow-hidden bg-neutral-950">
        <canvas ref={canvasRef} className="w-full h-[420px] cursor-none block" />
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
