'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { Wine, Mail, MessageSquare } from 'lucide-react';

export default function Footer() {
  const t = useTranslations('footer');
  const locale = useLocale();

  return (
    <footer className="bg-black border-t border-[#B8860B]/10 text-neutral-500 text-sm">
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-white">
            <Wine className="w-5 h-5 text-[#8B0000]" />
            <span className="font-bold">酒窖 WineCellar</span>
          </div>
          <p className="text-neutral-600 leading-relaxed">{t('tagline')}</p>
        </div>
        <div className="space-y-3">
          <h4 className="text-white font-medium">{t('nav_title')}</h4>
          <div className="flex flex-col gap-2">
            <Link href={`/${locale}/services`} className="hover:text-[#B8860B] transition-colors">{t('services')}</Link>
            <Link href={`/${locale}/booking`} className="hover:text-[#B8860B] transition-colors">{t('booking')}</Link>
            <Link href={`/${locale}/assessment`} className="hover:text-[#B8860B] transition-colors">{t('assessment')}</Link>
            <Link href={`/${locale}/about`} className="hover:text-[#B8860B] transition-colors">{t('about')}</Link>
          </div>
        </div>
        <div className="space-y-3">
          <h4 className="text-white font-medium">{t('contact_title')}</h4>
          <p className="flex items-center gap-2"><MessageSquare className="w-4 h-4 text-[#B8860B]" /> {t('wechat')}: WineCellar-CS2</p>
          <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-[#B8860B]" /> coach@winecellar.gg</p>
        </div>
      </div>
      <div className="border-t border-[#B8860B]/10 py-6 text-center text-neutral-600">
        <p>© 2026 酒窖 WineCellar. All rights reserved.</p>
        <Link href={`/${locale}/login`} className="inline-block mt-2 text-neutral-700 hover:text-[#B8860B] transition-colors">
          {t('staff_login')}
        </Link>
      </div>
    </footer>
  );
}
