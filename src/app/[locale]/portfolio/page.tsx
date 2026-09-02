import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PortfolioContent from '@/components/portfolio/PortfolioContent';
import SectionHeading from '@/components/SectionHeading';
import { getTranslations } from 'next-intl/server';

export default async function PortfolioPage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'portfolio' });

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black text-white pt-28 pb-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <SectionHeading index="Portfolio / 02" title={t('title')} en="TRACK RECORD" desc={t('subtitle')} />
          </div>
          <PortfolioContent />
        </div>
      </main>
      <Footer />
    </>
  );
}
