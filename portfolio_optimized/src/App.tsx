import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import StarfieldBackground from './sections/StarfieldBackground';
import MagicalCursor from './sections/MagicalCursor';
import Navigation from './sections/Navigation';
import HeroSection from './sections/HeroSection';
import AboutSection from './sections/AboutSection';
import SkillsSection from './sections/SkillsSection';
import ProjectsSection from './sections/ProjectsSection';
import EducationSection from './sections/EducationSection';
import ServicesSection from './sections/ServicesSection';
import CTASection from './sections/CTASection';
import Footer from './sections/Footer';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const rafCallbackRef = useRef<((time: number) => void) | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Lenis smooth scroll — lerp 0.08 for responsive feel, 1 for reduced-motion
    const lenis = new Lenis({
      lerp: prefersReducedMotion ? 1 : 0.08,
      smoothWheel: !prefersReducedMotion,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });

    // Sync Lenis with GSAP ticker so ScrollTrigger gets accurate positions
    lenis.on('scroll', ScrollTrigger.update);

    const rafCallback = (time: number) => {
      lenis.raf(time * 1000); // GSAP ticker passes seconds; Lenis wants ms
    };
    rafCallbackRef.current = rafCallback;
    gsap.ticker.add(rafCallback);

    return () => {
      if (rafCallbackRef.current) gsap.ticker.remove(rafCallbackRef.current);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <div className="relative min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
      <StarfieldBackground />
      <MagicalCursor />
      <Navigation />
      <main className="relative" style={{ zIndex: 1 }}>
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <EducationSection />
        <ServicesSection />
        <CTASection />
        <Footer />
      </main>
    </div>
  );
}

export default App;
