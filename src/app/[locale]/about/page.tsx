import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AboutContent from '@/components/about/AboutContent';
import SectionHeading from '@/components/SectionHeading';
import { getTranslations } from 'next-intl/server';

export default async function AboutPage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'about' });

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black text-white pt-28 pb-24 px-4">
        <div className="mb-16 max-w-4xl mx-auto">
          <SectionHeading index="About / 05" title={t('title')} en="THE COACH" desc={t('subtitle')} />
        </div>
        <AboutContent />
      </main>
      <Footer />
    </>
  );
}
