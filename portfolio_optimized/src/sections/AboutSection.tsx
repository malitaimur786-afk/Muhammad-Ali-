import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GraduationCap, Lightbulb, MapPin } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const block1Ref = useRef<HTMLDivElement>(null);
  const block2Ref = useRef<HTMLDivElement>(null);
  const block3Ref = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const image = imageRef.current;
    const block1 = block1Ref.current;
    const block2 = block2Ref.current;
    const block3 = block3Ref.current;
    const overlay = overlayRef.current;

    if (!section || !image || !block1 || !block2 || !block3 || !overlay) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    if (prefersReducedMotion) {
      gsap.set([block1, block2, block3], { opacity: 1, x: 0, y: 0 });
      gsap.set(image, { scale: 1 });
      return;
    }

    if (isMobile) {
      // Mobile: simple reveals
      [block1, block2, block3].forEach((block, i) => {
        gsap.fromTo(block,
          { opacity: 0, y: 50 },
          {
            opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
            scrollTrigger: { trigger: block, start: 'top 85%' },
            delay: i * 0.1,
          }
        );
      });
      return;
    }

    // Desktop: Pinned cinematic scroll
    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=180%',
        pin: true,
        scrub: 0.6,
        anticipatePin: 1,
        once: false,
      },
    });

    // 0-15%: Image scales from small circle to large
    scrollTl.fromTo(image,
      { scale: 0.25, borderRadius: '50%', opacity: 0.7 },
      { scale: 0.5, borderRadius: '50%', opacity: 0.85, ease: 'power2.out' },
      0
    );

    // Block 1 slides in from left
    scrollTl.fromTo(block1,
      { opacity: 0, x: -120, rotateY: 15 },
      { opacity: 1, x: 0, rotateY: 0, ease: 'power2.out' },
      0.05
    );

    // 15-35%: Image grows larger, overlay darkens, Block 2 enters
    scrollTl.fromTo(image,
      { scale: 0.5 },
      { scale: 0.75, borderRadius: '30%', opacity: 0.9, ease: 'power2.inOut' },
      0.15
    );
    scrollTl.fromTo(overlay,
      { opacity: 0.55 },
      { opacity: 0.7, ease: 'none' },
      0.15
    );
    scrollTl.fromTo(block2,
      { opacity: 0, x: 120, rotateY: -15 },
      { opacity: 1, x: 0, rotateY: 0, ease: 'power2.out' },
      0.2
    );

    // 35-55%: Image fills viewport, Block 1 exits, Block 3 enters
    scrollTl.fromTo(image,
      { scale: 0.75, borderRadius: '30%' },
      { scale: 1.1, borderRadius: '0%', ease: 'power2.inOut' },
      0.35
    );
    scrollTl.fromTo(block1,
      { opacity: 1, x: 0 },
      { opacity: 0, x: -100, ease: 'power2.in' },
      0.35
    );
    scrollTl.fromTo(block3,
      { opacity: 0, y: 60, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, ease: 'power2.out' },
      0.4
    );

    // 55-75%: Block 2 exits
    scrollTl.fromTo(block2,
      { opacity: 1, x: 0 },
      { opacity: 0, x: 100, ease: 'power2.in' },
      0.55
    );
    scrollTl.fromTo(overlay,
      { opacity: 0.7 },
      { opacity: 0.8, ease: 'none' },
      0.55
    );

    // 75-100%: Block 3 fades, section exits
    scrollTl.fromTo(block3,
      { opacity: 1 },
      { opacity: 0, y: -30, ease: 'power2.in' },
      0.75
    );

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === section) st.kill();
      });
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden"
      style={{ zIndex: 2, backgroundColor: 'var(--bg)' }}
    >
      {/* Background Image (starts as circle, scales to full) */}
      <div
        ref={imageRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ willChange: 'transform, opacity, border-radius' }}
      >
        <div className="relative w-full h-full">
          <img
            src="/images/profile-portrait.jpg"
            loading="lazy"
            decoding="async"
            alt=""
            className="w-full h-full object-cover"
            style={{ objectPosition: 'center top' }}
          />
          <div
            ref={overlayRef}
            className="absolute inset-0"
            style={{ backgroundColor: 'var(--bg)', opacity: 0.55 }}
          />
        </div>
      </div>

      {/* Content Grid */}
      <div className="relative z-10 content-max w-full min-h-screen flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 w-full py-20">
          {/* Block 1 - Education */}
          <div
            ref={block1Ref}
            className="card-base opacity-0"
            style={{
              transform: 'translateX(-120px) rotateY(15deg)',
              perspective: '600px',
              backdropFilter: 'blur(8px)',
              backgroundColor: 'rgba(22, 23, 26, 0.85)',
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(79, 70, 229, 0.15)' }}>
                <GraduationCap className="w-5 h-5" style={{ color: 'var(--accent-color)' }} />
              </div>
              <span className="section-label">Education</span>
            </div>
            <h2 className="display-m text-white" style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)' }}>Salim Habib University</h2>
            <p className="body mt-4" style={{ color: 'var(--text-secondary)' }}>
              Currently pursuing BS Computer Science (1st Semester). Formerly Barrett Hodgson
              University — a premier private institution in Pakistan.
            </p>
            <div className="flex flex-wrap gap-2 mt-5">
              <span className="mono-text px-3 py-1.5 rounded-md" style={{ backgroundColor: 'rgba(79, 70, 229, 0.12)', color: 'var(--accent-color)', fontSize: '0.8rem' }}>
                A1 in Matric
              </span>
              <span className="mono-text px-3 py-1.5 rounded-md" style={{ backgroundColor: 'rgba(79, 70, 229, 0.12)', color: 'var(--accent-color)', fontSize: '0.8rem' }}>
                A in Intermediate
              </span>
            </div>
          </div>

          {/* Block 2 - Passion */}
          <div
            ref={block2Ref}
            className="card-base opacity-0 lg:text-right"
            style={{
              transform: 'translateX(120px) rotateY(-15deg)',
              perspective: '600px',
              backdropFilter: 'blur(8px)',
              backgroundColor: 'rgba(22, 23, 26, 0.85)',
            }}
          >
            <div className="flex items-center gap-3 mb-4 lg:justify-end">
              <span className="section-label">Passion</span>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(79, 70, 229, 0.15)' }}>
                <Lightbulb className="w-5 h-5" style={{ color: 'var(--accent-color)' }} />
              </div>
            </div>
            <h2 className="display-m text-white" style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)' }}>Driven by Innovation</h2>
            <p className="body mt-4" style={{ color: 'var(--text-secondary)' }}>
              I believe technology should make life easier for people. Every day I work toward
              bringing innovative ideas to life that can transform systems and help communities.
            </p>
          </div>

          {/* Block 3 - Location */}
          <div
            ref={block3Ref}
            className="opacity-0 lg:col-span-2 text-center mt-4"
            style={{ transform: 'translateY(60px) scale(0.95)' }}
          >
            <div className="inline-flex flex-col items-center">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3" style={{ backgroundColor: 'rgba(79, 70, 229, 0.15)' }}>
                <MapPin className="w-6 h-6" style={{ color: 'var(--accent-color)' }} />
              </div>
              <span className="section-label">Based In</span>
              <h3 className="heading-text text-white mt-2" style={{ fontSize: '2rem' }}>Karachi, Pakistan</h3>
              <p className="body mt-3 max-w-lg mx-auto" style={{ color: 'var(--text-secondary)' }}>
                Serving clients worldwide with modern web solutions, AI automations, and digital
                content.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
