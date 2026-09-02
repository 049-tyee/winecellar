'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Loader2, LogOut, ShieldAlert } from 'lucide-react';
import { getMyRole, signOut, onAuthChange, type StaffRole } from '@/lib/auth';

type State = 'checking' | 'denied' | 'allowed';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const t = useTranslations('auth');
  const locale = useLocale();
  const [state, setState] = useState<State>('checking');
  const [role, setRole] = useState<StaffRole | null>(null);

  useEffect(() => {
    let mounted = true;
    const check = () => {
      getMyRole().then((r) => {
        if (!mounted) return;
        setRole(r);
        setState(r ? 'allowed' : 'denied');
      });
    };
    check();
    const { data: sub } = onAuthChange(() => check());
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  if (state === 'checking') {
    return (
      <div className="flex items-center justify-center gap-3 py-32 text-neutral-400">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="tracking-widest text-sm">{t('guard_checking')}</span>
      </div>
    );
  }

  if (state === 'denied') {
    return (
      <div className="flex flex-col items-center gap-6 py-32 text-center">
        <ShieldAlert className="w-12 h-12 text-[#B8860B]" />
        <div>
          <h2 className="text-2xl font-bold mb-2">{t('guard_denied_title')}</h2>
          <p className="text-neutral-400">{t('guard_denied_desc')}</p>
        </div>
        <a
          href={`/${locale}/login`}
          className="px-10 py-4 bg-[#B8860B] text-black font-bold tracking-[0.2em] uppercase hover:bg-[#d4a017] transition-colors"
        >
          {t('guard_login_button')}
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-20">
      <div className="flex items-center justify-between border border-neutral-800 bg-neutral-900/40 px-5 py-3">
        <span className="text-xs tracking-[0.2em] uppercase text-neutral-400">
          {t('staff_badge')} · {role}
        </span>
        <button
          onClick={() => signOut()}
          className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-neutral-400 hover:text-[#B8860B] transition-colors"
        >
          <LogOut className="w-4 h-4" />
          {t('logout')}
        </button>
      </div>
      {children}
    </div>
  );
}
