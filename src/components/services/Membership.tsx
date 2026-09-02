'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Bell, Check } from 'lucide-react';
import { subscribeMembership } from '@/lib/storage';

export default function Membership() {
  const t = useTranslations('services.membership');
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    subscribeMembership(email);
    setDone(true);
  };

  return (
    <div className="relative border border-[#B8860B]/30 rounded-lg p-8 bg-gradient-to-br from-neutral-950 to-black overflow-hidden">
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#B8860B]/10 rounded-full blur-[80px]" />
      <div className="relative space-y-4">
        <div className="flex items-center gap-3">
          <h3 className="text-2xl font-bold text-white">{t('title')}</h3>
          <span className="text-xs px-2 py-1 rounded-full border border-[#B8860B]/50 text-[#B8860B]">
            {t('status')}
          </span>
        </div>
        <p className="text-neutral-400">{t('subtitle')}</p>
        {done ? (
          <p className="flex items-center gap-2 text-[#B8860B]">
            <Check className="w-4 h-4" /> {t('subscribed')}
          </p>
        ) : (
          <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3 max-w-md">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('email_placeholder')}
              className="flex-1 bg-black border border-neutral-700 rounded px-4 py-2 text-sm focus:outline-none focus:border-[#B8860B] transition-colors"
            />
            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-5 py-2 bg-[#8B0000] hover:bg-[#A52A2A] rounded text-sm font-medium transition-colors"
            >
              <Bell className="w-4 h-4" /> {t('notify')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
