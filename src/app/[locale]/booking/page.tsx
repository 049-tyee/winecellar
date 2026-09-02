import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BookingForm from '@/components/booking/BookingForm';
import SectionHeading from '@/components/SectionHeading';
import { getTranslations } from 'next-intl/server';

export default async function BookingPage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'booking' });

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black text-white pt-28 pb-24 px-4">
        <div className="max-w-6xl mx-auto mb-16">
          <SectionHeading index="Booking / 03" title={t('title')} en="BOOK A SESSION" desc={t('subtitle')} />
        </div>
        <BookingForm />
      </main>
      <Footer />
    </>
  );
}
