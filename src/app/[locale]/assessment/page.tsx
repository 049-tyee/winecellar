import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AssessmentFlow from '@/components/assessment/AssessmentFlow';
import { getTranslations } from 'next-intl/server';

export default async function AssessmentPage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'assessment' });

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black text-white pt-24 pb-24 px-4">
        <div className="text-center space-y-3 mb-14">
          <h1 className="text-4xl md:text-5xl font-bold">{t('title')}</h1>
          <p className="text-neutral-400">{t('subtitle')}</p>
        </div>
        <AssessmentFlow />
      </main>
      <Footer />
    </>
  );
}
