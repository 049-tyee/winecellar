import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScheduleManager from '@/components/admin/ScheduleManager';
import BookingManager from '@/components/admin/BookingManager';
import AdminGuard from '@/components/admin/AdminGuard';
import SectionHeading from '@/components/SectionHeading';
import { getTranslations } from 'next-intl/server';

export default async function AdminPage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'admin' });

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black text-white pt-28 pb-24 px-4">
        <div className="max-w-6xl mx-auto space-y-20">
          <SectionHeading index="Admin" title={t('title')} en="COACH DASHBOARD" desc={t('subtitle')} />
          <AdminGuard>
            <ScheduleManager />
            <BookingManager />
          </AdminGuard>
        </div>
      </main>
      <Footer />
    </>
  );
}
