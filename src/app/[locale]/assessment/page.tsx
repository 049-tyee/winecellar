import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AssessmentFlow from '@/components/assessment/AssessmentFlow';
import SectionHeading from '@/components/SectionHeading';
import { getTranslations } from 'next-intl/server';

export default async function AssessmentPage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'assessment' });

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black text-white pt-28 pb-24 px-4">
        <div className="max-w-6xl mx-auto mb-16">
          <SectionHeading index="Assessment / 04" title={t('title')} en="TALENT ASSESSMENT" desc={t('subtitle')} />
        </div>
        <AssessmentFlow />
      </main>
      <Footer />
    </>
  );
}
