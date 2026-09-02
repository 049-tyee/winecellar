import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PortfolioContent from '@/components/portfolio/PortfolioContent';
import { getTranslations } from 'next-intl/server';

export default async function PortfolioPage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'portfolio' });

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black text-white pt-24 pb-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-3 mb-14">
            <h1 className="text-4xl md:text-5xl font-bold">{t('title')}</h1>
            <p className="text-neutral-400">{t('subtitle')}</p>
          </div>
          <PortfolioContent />
        </div>
      </main>
      <Footer />
    </>
  );
}
