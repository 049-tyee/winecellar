import Navbar from '@/components/Navbar';
import Hero from '@/components/sections/Hero';
import StatsHighlight from '@/components/sections/StatsHighlight';
import ServicesPreview from '@/components/sections/ServicesPreview';
import PortfolioHighlight from '@/components/sections/PortfolioHighlight';
import CTASection from '@/components/sections/CTASection';
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
      <footer className="py-8 bg-black border-t border-[#B8860B]/10 text-center text-neutral-600 text-sm">
        <p>© 2026 酒窖 WineCellar. All rights reserved.</p>
      </footer>
    </>
  );
}
