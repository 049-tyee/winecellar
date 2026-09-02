'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Check, Loader2 } from 'lucide-react';
import { subscribeRemote } from '@/lib/db';
import { subscribeMembership } from '@/lib/storage';

export default function Membership() {
  const t = useTranslations('services.membership');
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'saving' | 'done'>('idle');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    setState('saving');
    try {
      await subscribeRemote(email);
    } catch {
      subscribeMembership(email); // 网络失败时本地兜底
    }
    setState('done');
  };

  const perks = ['accelerated', 'discount', 'content', 'review'] as const;

  return (
    <div className="relative border border-[#B8860B]/30 rounded-xl overflow-hidden">
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#B8860B]/10 rounded-full blur-[100px]" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-[#8B0000]/15 rounded-full blur-[100px]" />
      <div className="relative p-8 md:p-14 space-y-8 bg-gradient-to-br from-neutral-950 to-black">
        <div className="space-y-4">
          <p className="eyebrow">{t('eyebrow')}</p>
          <div className="flex flex-wrap items-center gap-4">
            <h3 className="text-4xl md:text-6xl font-bold tracking-tighter">{t('title')}</h3>
            <span className="text-xs px-3 py-1.5 rounded-full border border-[#B8860B]/60 text-[#B8860B] tracking-widest">
              {t('status')}
            </span>
          </div>
          <p className="text-neutral-400 text-lg">{t('subtitle')}</p>
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 max-w-2xl">
          {perks.map((p, i) => (
            <li key={p} className="flex gap-3 text-sm text-neutral-300">
              <span className="text-[#8B0000] font-bold shrink-0">{String(i + 1).padStart(2, '0')}</span>
              {t(`perk_${p}`)}
            </li>
          ))}
        </ul>

        {state === 'done' ? (
          <p className="flex items-center gap-2 text-[#B8860B] animate-fade">
            <Check className="w-5 h-5" /> {t('subscribed')}
          </p>
        ) : (
          <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3 max-w-lg">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('email_placeholder')}
              className="flex-1 bg-black border border-neutral-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#B8860B] transition-colors"
            />
            <button
              type="submit"
              disabled={state === 'saving'}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-[#8B0000] hover:bg-[#A52A2A] disabled:opacity-60 rounded-lg text-sm font-medium transition-all active:scale-[0.97]"
            >
              {state === 'saving' && <Loader2 className="w-4 h-4 animate-spin" />}
              {t('notify')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
