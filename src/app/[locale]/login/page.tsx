import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SectionHeading from '@/components/SectionHeading';
import LoginForm from '@/components/auth/LoginForm';
import { getTranslations } from 'next-intl/server';

export default async function LoginPage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'auth' });

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black text-white pt-28 pb-24 px-4 flex flex-col items-center">
        <div className="w-full max-w-6xl space-y-14">
          <SectionHeading index="Login" title={t('login_title')} en="STAFF ACCESS" desc={t('login_subtitle')} />
          <div className="flex justify-center">
            <LoginForm />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
