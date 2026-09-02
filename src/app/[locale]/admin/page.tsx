import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScheduleManager from '@/components/admin/ScheduleManager';
import BookingManager from '@/components/admin/BookingManager';
import { getTranslations } from 'next-intl/server';

export default async function AdminPage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'admin' });

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black text-white pt-24 pb-24 px-4">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="space-y-3">
            <h1 className="text-4xl font-bold">{t('title')}</h1>
            <p className="text-neutral-400 text-sm">{t('subtitle')}</p>
          </div>
          <ScheduleManager />
          <BookingManager />
        </div>
      </main>
      <Footer />
    </>
  );
}
