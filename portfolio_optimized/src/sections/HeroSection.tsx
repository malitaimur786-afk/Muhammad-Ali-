import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const sectionRef       = useRef<HTMLElement>(null);
  const portraitRef      = useRef<HTMLDivElement>(null);
  const nameRef          = useRef<HTMLHeadingElement>(null);
  const taglineRef       = useRef<HTMLParagraphElement>(null);
  const subTaglineRef    = useRef<HTMLParagraphElement>(null);
  const ctaRef           = useRef<HTMLDivElement>(null);
  const scrollIndicRef   = useRef<HTMLDivElement>(null);
  const bioRef           = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section      = sectionRef.current;
    const portrait     = portraitRef.current;
    const name         = nameRef.current;
    const tagline      = taglineRef.current;
    const subTagline   = subTaglineRef.current;
    const cta          = ctaRef.current;
    const scrollIndic  = scrollIndicRef.current;
    const bio          = bioRef.current;

    if (!section || !portrait || !name || !tagline || !subTagline || !cta || !scrollIndic || !bio) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      gsap.set([portrait, name, tagline, subTagline, cta, scrollIndic, bio], { opacity: 1, x: 0, y: 0, scale: 1 });
      return;
    }

    const words = name.querySelectorAll<HTMLElement>('.name-word');

    // ── Entrance timeline ───────────────────────────────────────
    // PERF: removed filter:blur() — forces compositor raster layers and is very
    // expensive. GPU-only properties (transform, opacity) used exclusively.
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    // Name words slide up with perspective tilt
    tl.fromTo(words,
      { opacity: 0, y: 70, rotateX: -40 },
      { opacity: 1, y: 0,  rotateX: 0, duration: 1.15, stagger: 0.12 },
      0
    );
    // Portrait scales in — no filter, just transform + opacity
    tl.fromTo(portrait,
      { opacity: 0, scale: 0.68 },
      { opacity: 1, scale: 1,    duration: 1.3, ease: 'power3.out' },
      0.25
    );
    tl.fromTo(tagline,
      { opacity: 0, y: 22 },
      { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out' },
      0.8
    );
    tl.fromTo(subTagline,
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' },
      1.0
    );
    tl.fromTo(Array.from(cta.children),
      { opacity: 0, y: 18, scale: 0.95 },
      { opacity: 1, y: 0,  scale: 1, duration: 0.55, stagger: 0.1, ease: 'power3.out' },
      1.2
    );
    tl.fromTo(scrollIndic,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' },
      1.6
    );

    // ── Scroll-driven pinned animation ─────────────────────────
    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=120%',
        pin: true,
        scrub: 0.7,
        anticipatePin: 1,
      },
    });

    // Phase 1: name words drift apart, portrait scales
    scrollTl.fromTo(words[0], { x: 0 }, { x: '-8vw', ease: 'none' }, 0);
    scrollTl.fromTo(words[1], { x: 0 }, { x:  '8vw', ease: 'none' }, 0);
    scrollTl.fromTo(portrait, { scale: 1 }, { scale: 1.14, ease: 'none' }, 0);

    // Phase 2: tagline/CTA fade, name fades, portrait shifts, bio appears
    scrollTl.fromTo([tagline, subTagline, cta],
      { opacity: 1, y: 0 }, { opacity: 0, y: -20, ease: 'none' }, 0.28
    );
    scrollTl.fromTo(name,    { opacity: 1 }, { opacity: 0.08, ease: 'none' }, 0.25);
    scrollTl.fromTo(portrait, { x: 0 },      { x: '-18vw',   ease: 'none' }, 0.25);
    scrollTl.fromTo(bio,
      { opacity: 0, x: 80 }, { opacity: 1, x: 0, ease: 'power2.out' }, 0.34
    );

    // Phase 3: everything fades out
    scrollTl.fromTo([portrait, bio],
      { opacity: (i: number) => (i === 0 ? 0.9 : 1) },
      { opacity: 0, ease: 'none' },
      0.68
    );

    return () => {
      ScrollTrigger.getAll().forEach((st) => { if (st.trigger === section) st.kill(); });
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden"
      style={{ zIndex: 1 }}
    >
      <div className="relative flex flex-col items-center text-center px-4 max-w-5xl mx-auto w-full">

        {/* Name */}
        <h1
          ref={nameRef}
          className="display-xl text-white flex flex-wrap justify-center items-center gap-x-[0.15em] leading-none"
          style={{ perspective: '800px' }}
        >
          <span className="name-word inline-block" style={{ opacity: 0, willChange: 'transform, opacity' }}>MUHAMMAD</span>
          <span className="name-word inline-block" style={{ opacity: 0, willChange: 'transform, opacity' }}>ALI</span>
        </h1>

        {/* Portrait */}
        <div
          ref={portraitRef}
          className="relative my-6 md:my-8"
          style={{ willChange: 'transform, opacity' }}
        >
          <div
            className="rounded-full overflow-hidden relative"
            style={{
              width:  'clamp(160px, 20vw, 250px)',
              height: 'clamp(160px, 20vw, 250px)',
              boxShadow: '0 0 70px rgba(79,70,229,0.28), 0 0 140px rgba(79,70,229,0.12)',
              animation: 'glow-pulse 3.5s ease-in-out infinite',
            }}
          >
            {/* Spinning ring */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                border: '2px solid rgba(79,70,229,0.35)',
                animation: 'spin-slow 22s linear infinite',
                background: 'conic-gradient(from 0deg, transparent 0%, rgba(79,70,229,0.55) 25%, transparent 50%)',
                mask: 'radial-gradient(circle, transparent 67%, black 69%)',
                WebkitMask: 'radial-gradient(circle, transparent 67%, black 69%)',
              }}
            />
            <img
              src="/images/profile-portrait.jpg"
              alt="Muhammad Ali — Frontend Developer & AI Automation Builder"
              className="w-full h-full object-cover relative z-10"
              style={{ objectPosition: 'center top' }}
              loading="eager"
              decoding="async"
            />
          </div>
        </div>

        {/* Tagline */}
        <p
          ref={taglineRef}
          className="caption-text mt-2 md:mt-4"
          style={{ color: 'var(--text-muted)', letterSpacing: '0.1em', opacity: 0 }}
        >
          BS CS Student &bull; Frontend Developer &bull; AI Automation Builder
        </p>

        {/* Sub-tagline */}
        <p
          ref={subTaglineRef}
          className="body-l mt-3 max-w-lg mx-auto"
          style={{ color: 'var(--text-secondary)', opacity: 0 }}
        >
          Building the future, one line of code at a time
        </p>

        {/* CTA Buttons */}
        <div ref={ctaRef} className="flex flex-wrap gap-4 mt-8 justify-center">
          <a href="#projects" className="btn-primary" style={{ opacity: 0 }}
            onClick={(e) => { e.preventDefault(); document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' }); }}>
            View My Work
          </a>
          <a href="#contact" className="btn-secondary" style={{ opacity: 0 }}
            onClick={(e) => { e.preventDefault(); document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }); }}>
            Contact Me
          </a>
        </div>

        {/* Bio (appears beside portrait on scroll) */}
        <div
          ref={bioRef}
          className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 max-w-xs text-left"
          style={{ opacity: 0, transform: 'translateY(-50%) translateX(80px)' }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-full overflow-hidden" style={{ border: '2px solid var(--accent-color)' }}>
              <img src="/images/profile-portrait.jpg" alt="" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div>
              <p className="font-semibold text-white text-sm">Muhammad Ali</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Karachi, Pakistan</p>
            </div>
          </div>
          <p className="body text-sm" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            A passionate developer pursuing BS Computer Science at Salim Habib University.
            I build responsive websites, AI automations, and digital content that makes a difference.
          </p>
          <div className="flex gap-2 mt-4">
            {['A1 Matric', 'A Intermediate'].map((badge) => (
              <span key={badge} className="mono-text px-3 py-1 rounded-md text-xs"
                style={{ backgroundColor: 'rgba(79,70,229,0.14)', color: 'var(--accent-color)' }}>
                {badge}
              </span>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          ref={scrollIndicRef}
          className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ opacity: 0 }}
        >
          <span className="caption-text" style={{ color: 'var(--text-muted)' }}>Scroll to explore</span>
          <ChevronDown className="w-5 h-5 scroll-indicator" style={{ color: 'var(--text-muted)' }} />
        </div>

      </div>
    </section>
  );
}
