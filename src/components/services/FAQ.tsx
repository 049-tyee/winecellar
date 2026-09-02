'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Plus } from 'lucide-react';

export default function FAQ() {
  const t = useTranslations('services.faq');
  const [open, setOpen] = useState<number | null>(null);
  const items = [1, 2, 3, 4, 5, 6];

  return (
    <div className="divide-y divide-neutral-800 border-y border-neutral-800">
      {items.map((i) => {
        const isOpen = open === i;
        return (
          <div key={i}>
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full flex items-start gap-6 px-2 md:px-4 py-6 text-left group"
            >
              <span className={`eyebrow pt-1 transition-colors ${isOpen ? 'text-[#B8860B]' : ''}`}>
                {String(i).padStart(2, '0')}
              </span>
              <span
                className={`flex-1 text-lg md:text-xl font-bold transition-colors ${
                  isOpen ? 'text-white' : 'text-neutral-300 group-hover:text-white'
                }`}
              >
                {t(`q${i}`)}
              </span>
              <Plus
                className={`w-6 h-6 shrink-0 text-[#B8860B] transition-transform duration-300 ${
                  isOpen ? 'rotate-45' : 'group-hover:rotate-90'
                }`}
              />
            </button>
            <div
              className={`grid transition-all duration-500 ease-out ${
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <p className="pl-14 md:pl-16 pr-10 pb-6 text-neutral-400 leading-relaxed">{t(`a${i}`)}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
