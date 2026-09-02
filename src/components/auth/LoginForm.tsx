'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Loader2, Lock, Mail } from 'lucide-react';
import { signIn, getMyRole } from '@/lib/auth';

export default function LoginForm() {
  const t = useTranslations('auth');
  const locale = useLocale();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await signIn(email.trim(), password);
      const role = await getMyRole();
      if (!role) {
        setError(t('error_not_staff'));
        setSubmitting(false);
        return;
      }
      router.push(`/${locale}/admin`);
      router.refresh();
    } catch {
      setError(t('error_invalid'));
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="w-full max-w-md space-y-6">
      <div className="space-y-2">
        <label className="text-xs tracking-[0.2em] text-neutral-400 uppercase">{t('email')}</label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-neutral-900/60 border border-neutral-800 focus:border-[#B8860B] rounded-none py-4 pl-11 pr-4 text-white outline-none transition-colors"
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-xs tracking-[0.2em] text-neutral-400 uppercase">{t('password')}</label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-neutral-900/60 border border-neutral-800 focus:border-[#B8860B] rounded-none py-4 pl-11 pr-4 text-white outline-none transition-colors"
          />
        </div>
      </div>
      {error && <p className="text-sm text-[#8B0000] border border-[#8B0000]/40 bg-[#8B0000]/10 px-4 py-3">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="w-full py-4 bg-[#B8860B] text-black font-bold tracking-[0.2em] uppercase hover:bg-[#d4a017] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
        {submitting ? t('submitting') : t('submit')}
      </button>
    </form>
  );
}
