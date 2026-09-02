import Navbar from '@/components/Navbar';
import Hero from '@/components/sections/Hero';
import StatsHighlight from '@/components/sections/StatsHighlight';
import ServicesPreview from '@/components/sections/ServicesPreview';
import PortfolioHighlight from '@/components/sections/PortfolioHighlight';
import CTASection from '@/components/sections/CTASection';
import Footer from '@/components/Footer';
import { locales } from '@/i18n';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <StatsHighlight />
      <ServicesPreview />
      <PortfolioHighlight />
      <CTASection />
      <Footer />
    </>
  );
}
