'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { Trophy, Users, BarChart3, Quote, Star, TrendingUp, Clock } from 'lucide-react';

const TEAMS = [
  { key: 'team1', period: '2023 - 2024' },
  { key: 'team2', period: '2024 - 2025' },
  { key: 'team3', period: '2025 - 2026' },
];

const PLAYERS = [
  { key: 'p1', rating: '1.31', improvement: '+0.24' },
  { key: 'p2', rating: '1.22', improvement: '+0.18' },
  { key: 'p3', rating: '1.18', improvement: '+0.21' },
  { key: 'p4', rating: '1.14', improvement: '+0.15' },
];

const STATS = [
  { icon: Users, value: '40+', key: 'players' },
  { icon: Trophy, value: '12', key: 'trophies' },
  { icon: Clock, value: '2000+', key: 'hours' },
  { icon: TrendingUp, value: '92%', key: 'satisfaction' },
];

export default function PortfolioContent() {
  const t = useTranslations('portfolio');
  const locale = useLocale();

  return (
    <>
      {/* 数据总览 */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
        {STATS.map((s) => (
          <div key={s.key} className="border border-neutral-800 rounded-lg p-6 text-center bg-neutral-950/50">
            <s.icon className="w-6 h-6 text-[#8B0000] mx-auto mb-3" />
            <p className="text-3xl font-bold tabular-nums">{s.value}</p>
            <p className="text-sm text-neutral-500 mt-1">{t(`stats.${s.key}`)}</p>
          </div>
        ))}
      </section>

      {/* 战队履历 */}
      <section className="mb-20">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
          <Trophy className="w-6 h-6 text-[#B8860B]" /> {t('teams_title')}
        </h2>
        <div className="space-y-4">
          {TEAMS.map((team) => (
            <div
              key={team.key}
              className="border border-neutral-800 rounded-lg p-6 hover:border-[#B8860B]/40 transition-colors flex flex-col md:flex-row md:items-center gap-4"
            >
              <div className="md:w-32 text-sm text-neutral-500 shrink-0">{team.period}</div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">{t(`teams.${team.key}.name`)}</h3>
                <p className="text-sm text-neutral-400 mt-1">{t(`teams.${team.key}.role`)}</p>
              </div>
              <div className="text-sm text-[#B8860B] md:text-right">{t(`teams.${team.key}.achievement`)}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 选手星榜 */}
      <section className="mb-20">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
          <Star className="w-6 h-6 text-[#B8860B]" /> {t('players_title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PLAYERS.map((p) => (
            <div key={p.key} className="border border-neutral-800 rounded-lg p-6 bg-neutral-950/50 flex items-center gap-5">
              <div className="w-12 h-12 rounded-full bg-[#8B0000]/20 border border-[#8B0000]/40 flex items-center justify-center text-[#B8860B] font-bold shrink-0">
                {t(`players.${p.key}.name`).charAt(0)}
              </div>
              <div className="flex-1">
                <h3 className="font-bold">{t(`players.${p.key}.name`)}</h3>
                <p className="text-xs text-neutral-500">{t(`players.${p.key}.note`)}</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold tabular-nums">{p.rating}</p>
                <p className="text-xs text-[#B8860B]">{p.improvement} Rating</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 合作背书 */}
      <section className="mb-20">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
          <Quote className="w-6 h-6 text-[#B8860B]" /> {t('endorsements_title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <blockquote key={i} className="border border-neutral-800 rounded-lg p-6 bg-neutral-950/50">
              <p className="text-sm text-neutral-300 leading-relaxed">“{t(`endorsements.e${i}.quote`)}”</p>
              <footer className="mt-4 text-xs text-neutral-500">
                <span className="text-neutral-300">{t(`endorsements.e${i}.author`)}</span> · {t(`endorsements.e${i}.title`)}
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center border border-[#B8860B]/20 rounded-lg p-10 bg-gradient-to-b from-neutral-950 to-black">
        <BarChart3 className="w-8 h-8 text-[#B8860B] mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-3">{t('cta_title')}</h2>
        <p className="text-neutral-400 mb-6 max-w-md mx-auto">{t('cta_desc')}</p>
        <Link
          href={`/${locale}/booking`}
          className="inline-block px-10 py-3 bg-[#8B0000] hover:bg-[#A52A2A] rounded font-medium transition-colors"
        >
          {t('cta_button')}
        </Link>
      </section>
    </>
  );
}
