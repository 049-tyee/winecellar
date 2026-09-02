'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronDown } from 'lucide-react';

export default function FAQ() {
  const t = useTranslations('services.faq');
  const [open, setOpen] = useState<number | null>(0);
  const items = [1, 2, 3, 4, 5, 6];

  return (
    <div className="space-y-3">
      {items.map((i) => (
        <div key={i} className="border border-neutral-800 rounded-lg overflow-hidden">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-neutral-900/50 transition-colors"
          >
            <span className="font-medium text-neutral-200">{t(`q${i}`)}</span>
            <ChevronDown
              className={`w-5 h-5 text-[#B8860B] transition-transform duration-300 ${open === i ? 'rotate-180' : ''}`}
            />
          </button>
          <div
            className={`grid transition-all duration-300 ${open === i ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
          >
            <div className="overflow-hidden">
              <p className="px-5 pb-4 text-neutral-400 text-sm leading-relaxed">{t(`a${i}`)}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
