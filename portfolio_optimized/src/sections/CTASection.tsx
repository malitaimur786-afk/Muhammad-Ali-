import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, Linkedin, Github } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function CTASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const wordRefs1 = useRef<(HTMLSpanElement | null)[]>([]);
  const wordRefs2 = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const line1 = line1Ref.current;
    const line2 = line2Ref.current;
    const subtext = subtextRef.current;
    const buttons = buttonsRef.current;
    const glow = glowRef.current;
    const words1 = wordRefs1.current.filter(Boolean) as HTMLSpanElement[];
    const words2 = wordRefs2.current.filter(Boolean) as HTMLSpanElement[];

    if (!section || !line1 || !line2 || !subtext || !buttons || !glow || words1.length === 0 || words2.length === 0) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    if (prefersReducedMotion) {
      gsap.set([...words1, ...words2], { opacity: 1, x: 0, y: 0, rotation: 0, scale: 1 });
      gsap.set(subtext, { opacity: 1, y: 0 });
      gsap.set(buttons.children, { opacity: 1, scale: 1 });
      return;
    }

    if (isMobile) {
      gsap.fromTo([...words1, ...words2],
        { opacity: 0, y: 40, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out', stagger: 0.06, scrollTrigger: { trigger: section, start: 'top 60%' } }
      );
      gsap.fromTo(subtext, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', scrollTrigger: { trigger: subtext, once: true, start: 'top 85%' } });
      gsap.fromTo(buttons.children, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.5, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: buttons, once: true, start: 'top 85%' } });
      return;
    }

    // Desktop: Pinned scatter animation
    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=130%',
        pin: true,
        scrub: 0.6,
        anticipatePin: 1,
      },
    });

    // Glow pulse starts
    scrollTl.fromTo(glow, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, ease: 'power2.out' }, 0);

    // Line 1 words scatter in with rotation and scale (10% - 40%)
    words1.forEach((word, i) => {
      const angle = (i / words1.length) * Math.PI * 0.5 + Math.PI * 0.75;
      const distance = 300 + Math.random() * 200;
      const randomX = Math.cos(angle) * distance;
      const randomY = Math.sin(angle) * distance - 100;
      const randomRotate = (Math.random() - 0.5) * 60;
      const randomScale = 0.5 + Math.random() * 0.3;

      scrollTl.fromTo(word,
        { x: randomX, y: randomY, rotation: randomRotate, opacity: 0, scale: randomScale },
        { x: 0, y: 0, rotation: 0, opacity: 1, scale: 1, ease: 'power3.out' },
        0.1 + i * 0.025
      );
    });

    // Line 2 words scatter in (40% - 65%)
    words2.forEach((word, i) => {
      const angle = (i / words2.length) * Math.PI * 0.5 + Math.PI * 0.25;
      const distance = 350 + Math.random() * 200;
      const randomX = Math.cos(angle) * distance;
      const randomY = Math.sin(angle) * distance + 50;
      const randomRotate = (Math.random() - 0.5) * 60;
      const randomScale = 0.5 + Math.random() * 0.3;

      scrollTl.fromTo(word,
        { x: randomX, y: randomY, rotation: randomRotate, opacity: 0, scale: randomScale },
        { x: 0, y: 0, rotation: 0, opacity: 1, scale: 1, ease: 'power3.out' },
        0.38 + i * 0.025
      );
    });

    // Subtext fades up (65% - 78%)
    scrollTl.fromTo(subtext, { opacity: 0, y: 30 }, { opacity: 1, y: 0, ease: 'power2.out' }, 0.65);

    // Buttons scale in with bounce (78% - 92%)
    scrollTl.fromTo(buttons.children, { opacity: 0, scale: 0.8, y: 20 }, { opacity: 1, scale: 1, y: 0, stagger: 0.015, ease: 'back.out(1.4)' }, 0.78);

    // Hold final state (92% - 100%) then fade out
    scrollTl.to([line1, line2, subtext, buttons], { opacity: 0, ease: 'power2.in' }, 0.95);

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === section) st.kill();
      });
    };
  }, []);

  const line1Words = ["Let's", 'Build'];
  const line2Words = ['Something', 'Amazing'];

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden"
      style={{ zIndex: 6 }}
    >
      {/* Radial gradient glow */}
      <div
        ref={glowRef}
        className="absolute inset-0 pointer-events-none opacity-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(79, 70, 229, 0.12) 0%, rgba(124, 58, 237, 0.06) 30%, transparent 65%)',
        }}
      />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Line 1: Let's Build */}
        <div ref={line1Ref} className="display-l text-white flex flex-wrap justify-center gap-x-5 md:gap-x-8" style={{ perspective: '600px' }}>
          {line1Words.map((word, i) => (
            <span
              key={`l1-${word}`}
              ref={(el) => { wordRefs1.current[i] = el; }}
              className="inline-block"
              style={{ opacity: 0, willChange: 'transform, opacity', fontSize: 'clamp(2.5rem, 7vw, 5rem)' }}
            >
              {word}
            </span>
          ))}
        </div>

        {/* Line 2: Something Amazing */}
        <div ref={line2Ref} className="display-l mt-2 md:mt-4 flex flex-wrap justify-center gap-x-5 md:gap-x-8" style={{ color: 'var(--accent-color)', perspective: '600px' }}>
          {line2Words.map((word, i) => (
            <span
              key={`l2-${word}`}
              ref={(el) => { wordRefs2.current[i] = el; }}
              className="inline-block"
              style={{ opacity: 0, willChange: 'transform, opacity', fontSize: 'clamp(2.5rem, 7vw, 5rem)' }}
            >
              {word}
            </span>
          ))}
        </div>

        {/* Supporting text */}
        <p ref={subtextRef} className="body-l mt-10 md:mt-14 max-w-lg mx-auto" style={{ color: 'var(--text-secondary)', opacity: 0 }}>
          Open for internships, freelance projects, and collaborations. Based in Karachi, working worldwide.
        </p>

        {/* Contact buttons */}
        <div ref={buttonsRef} className="flex flex-wrap justify-center gap-4 mt-10">
          <a href="mailto:muhammadali@example.com" className="btn-primary" style={{ opacity: 0 }}>
            <Mail className="w-5 h-5" /> Email Me
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ opacity: 0 }}>
            <Linkedin className="w-5 h-5" /> LinkedIn
          </a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ opacity: 0 }}>
            <Github className="w-5 h-5" /> GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
