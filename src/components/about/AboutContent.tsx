'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Mail, MessageSquare, Send, Check } from 'lucide-react';
import { addInquiry } from '@/lib/storage';

export default function AboutContent() {
  const t = useTranslations('about');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim() || !message.trim()) return;
    addInquiry({ name: name.trim(), contact: contact.trim(), message: message.trim() });
    setSent(true);
  };

  const inputCls =
    'w-full bg-black border border-neutral-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#B8860B] transition-colors';

  return (
    <div className="max-w-4xl mx-auto space-y-20">
      {/* 教练介绍 */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
        <div className="aspect-[3/4] rounded-lg bg-gradient-to-br from-[#8B0000]/20 to-[#B8860B]/10 border border-neutral-800 flex items-center justify-center">
          <span className="text-6xl font-bold text-[#B8860B]/40">酒</span>
        </div>
        <div className="md:col-span-2 space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-1">{t('coach.name')}</h2>
            <p className="text-[#B8860B] text-sm">{t('coach.title')}</p>
          </div>
          <p className="text-neutral-300 leading-relaxed">{t('coach.bio1')}</p>
          <p className="text-neutral-400 leading-relaxed">{t('coach.bio2')}</p>
          <ul className="space-y-2 text-sm text-neutral-300">
            {[1, 2, 3, 4].map((i) => (
              <li key={i} className="flex gap-3">
                <span className="text-[#8B0000] font-bold shrink-0">—</span>
                {t(`coach.point${i}`)}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 联系方式 */}
      <section>
        <h2 className="text-2xl font-bold mb-8">{t('contact.title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-neutral-800 rounded-lg p-6 flex items-center gap-4">
            <MessageSquare className="w-8 h-8 text-[#8B0000] shrink-0" />
            <div>
              <p className="text-sm text-neutral-500">{t('contact.wechat')}</p>
              <p className="font-bold">WineCellar-CS2</p>
            </div>
          </div>
          <div className="border border-neutral-800 rounded-lg p-6 flex items-center gap-4">
            <Mail className="w-8 h-8 text-[#8B0000] shrink-0" />
            <div>
              <p className="text-sm text-neutral-500">{t('contact.email')}</p>
              <p className="font-bold">coach@winecellar.gg</p>
            </div>
          </div>
        </div>
      </section>

      {/* 合作洽谈 */}
      <section>
        <h2 className="text-2xl font-bold mb-8">{t('inquiry.title')}</h2>
        {sent ? (
          <div className="border border-[#B8860B]/30 rounded-lg p-8 text-center space-y-3">
            <Check className="w-10 h-10 text-[#B8860B] mx-auto" />
            <p className="text-neutral-300">{t('inquiry.success')}</p>
          </div>
        ) : (
          <form onSubmit={submit} className="border border-neutral-800 rounded-lg p-6 space-y-4 bg-neutral-950/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input value={name} onChange={(e) => setName(e.target.value)} required placeholder={t('inquiry.name')} className={inputCls} />
              <input value={contact} onChange={(e) => setContact(e.target.value)} required placeholder={t('inquiry.contact')} className={inputCls} />
            </div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={5}
              placeholder={t('inquiry.message')}
              className={`${inputCls} resize-none`}
            />
            <button type="submit" className="inline-flex items-center gap-2 px-8 py-3 bg-[#8B0000] hover:bg-[#A52A2A] rounded font-medium transition-colors">
              <Send className="w-4 h-4" /> {t('inquiry.submit')}
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
