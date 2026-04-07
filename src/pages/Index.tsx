import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import Navbar from '@/components/layout/Navbar';
import HeroSection from '@/components/sections/HeroSection';
import FeaturesSection from '@/components/sections/FeaturesSection';
import ShowcaseSection from '@/components/sections/ShowcaseSection';
import AboutSection from '@/components/sections/AboutSection';
import FooterSection from '@/components/sections/FooterSection';

export default function Index() {
  useSmoothScroll();

  return (
    <div className="noise-bg">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <ShowcaseSection />
      <AboutSection />
      <FooterSection />
    </div>
  );
}
