import { lazy, Suspense } from 'react';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import Navbar from '@/components/layout/Navbar';
import HeroSection from '@/components/sections/HeroSection';
import FeaturesSection from '@/components/sections/FeaturesSection';
import ShowcaseSection from '@/components/sections/ShowcaseSection';
import AboutSection from '@/components/sections/AboutSection';
import FooterSection from '@/components/sections/FooterSection';

const FixedHeroSphere = lazy(() => import('@/components/three/HeroSphere'));

export default function Index() {
  useSmoothScroll();

  return (
    <div className="noise-bg relative">
      {/* Fixed 3D background that follows scroll */}
      <Suspense fallback={null}>
        <FixedHeroSphere />
      </Suspense>

      {/* All content sits above the 3D layer */}
      <div className="relative z-10">
        <Navbar />
        <HeroSection />
        <FeaturesSection />
        <ShowcaseSection />
        <AboutSection />
        <FooterSection />
      </div>
    </div>
  );
}
