'use client';

import { Trophy, Users, Star } from 'lucide-react';

export default function PortfolioHighlight() {
  const highlights = [
    {
      icon: Trophy,
      title: 'Major 资格赛',
      description: '带领战队闯入 Regional Major Rankings 前 8',
    },
    {
      icon: Users,
      title: '选手输送',
      description: '3 名学员进入职业战队青训体系',
    },
    {
      icon: Star,
      title: '数据提升',
      description: '学员平均 Rating 提升 0.15+',
    },
  ];

  return (
    <section className="py-24 bg-neutral-950 border-y border-[#B8860B]/10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">合作履历</h2>
          <p className="text-neutral-400">与优秀选手和战队共同成长</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="text-center p-6 bg-black border border-[#B8860B]/20 rounded-lg"
              >
                <Icon className="w-10 h-10 text-[#B8860B] mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-neutral-400">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
