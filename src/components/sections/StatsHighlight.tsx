'use client';

import { useEffect, useRef, useState } from 'react';
import { Users, Trophy, Target, Timer } from 'lucide-react';
import { useTranslations } from 'next-intl';

function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || started.current) return;
        started.current = true;
        const duration = 1400;
        const t0 = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - t0) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          setValue(Math.round(target * eased));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target]);

  return (
    <span ref={ref} className="tabular-nums">
      {value}
      {suffix}
    </span>
  );
}

export default function StatsHighlight() {
  const t = useTranslations('home.stats');
  const stats = [
    { icon: Users, value: 50, suffix: '+', label: t('players') },
    { icon: Trophy, value: 10, suffix: '+', label: t('teams') },
    { icon: Target, value: 200, suffix: '+', label: t('assessments') },
    { icon: Timer, value: 1000, suffix: '+', label: t('hours') },
  ];

  return (
    <section className="py-28 bg-black border-y border-[#B8860B]/10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center space-y-3 group">
              <stat.icon className="w-8 h-8 text-[#B8860B] mx-auto transition-transform duration-300 group-hover:scale-110" />
              <p className="text-5xl md:text-6xl font-bold text-white">
                <CountUp target={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-sm text-neutral-500 tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
