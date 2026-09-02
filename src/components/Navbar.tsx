'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Wine } from 'lucide-react';

export default function Navbar() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { href: `/${locale}/services`, label: t('services') },
    { href: `/${locale}/booking`, label: t('booking') },
    { href: `/${locale}/portfolio`, label: t('portfolio') },
    { href: `/${locale}/assessment`, label: t('assessment') },
    { href: `/${locale}/about`, label: t('about') },
  ];

  const toggleLocale = locale === 'zh' ? 'en' : 'zh';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-[#B8860B]/20">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href={`/${locale}`} className="flex items-center gap-2 text-white hover:text-[#B8860B] transition-colors">
          <Wine className="w-6 h-6 text-[#8B0000]" />
          <span className="font-bold text-lg tracking-wide">酒窖</span>
          <span className="text-xs text-neutral-500 hidden sm:inline">WineCellar</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-neutral-300 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={`/${toggleLocale}${typeof window !== 'undefined' ? window.location.pathname.replace(/^\/(zh|en)/, '') : ''}`}
            className="text-xs text-[#B8860B] border border-[#B8860B]/30 px-2 py-1 rounded hover:bg-[#B8860B]/10 transition-colors"
          >
            {locale === 'zh' ? 'EN' : '中文'}
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-black border-t border-[#B8860B]/20 px-4 py-4 space-y-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-neutral-300 hover:text-white transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={`/${toggleLocale}`}
            className="inline-block text-xs text-[#B8860B] border border-[#B8860B]/30 px-2 py-1 rounded"
          >
            {locale === 'zh' ? 'Switch to English' : '切换到中文'}
          </Link>
        </div>
      )}
    </nav>
  );
}
