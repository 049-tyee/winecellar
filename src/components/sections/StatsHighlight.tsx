'use client';

import { Users, Trophy, Target, Timer } from 'lucide-react';

export default function StatsHighlight() {
  const stats = [
    { icon: Users, value: '50+', label: '指导选手' },
    { icon: Trophy, value: '10+', label: '合作战队' },
    { icon: Target, value: '200+', label: '测评完成' },
    { icon: Timer, value: '1000+', label: '教学小时' },
  ];

  return (
    <section className="py-24 bg-black border-y border-[#B8860B]/10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center space-y-2">
              <stat.icon className="w-8 h-8 text-[#B8860B] mx-auto" />
              <p className="text-4xl md:text-5xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-neutral-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
