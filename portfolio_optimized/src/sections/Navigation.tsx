import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const navLinks = [
  { label: 'About',     href: '#about' },
  { label: 'Skills',    href: '#skills' },
  { label: 'Projects',  href: '#projects' },
  { label: 'Education', href: '#education' },
  { label: 'Services',  href: '#services' },
  { label: 'Contact',   href: '#contact' },
];

export default function Navigation() {
  const navRef       = useRef<HTMLElement>(null);
  const [scrolled,   setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active,     setActive]     = useState('');

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    // Entrance animation — GPU-only (opacity + translateY)
    gsap.fromTo(nav,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.6, delay: 0.3, ease: 'power3.out' }
    );

    const handleScroll = () => {
      setScrolled(window.scrollY > 80);

      // Active section detection
      const ids = navLinks.map((l) => l.href.slice(1));
      for (let i = ids.length - 1; i >= 0; i--) {
        const el = document.getElementById(ids[i]);
        if (el && el.getBoundingClientRect().top <= 160) {
          setActive(ids[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <nav
        ref={navRef}
        role="navigation"
        aria-label="Main navigation"
        className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center opacity-0"
        style={{
          backgroundColor: scrolled ? 'rgba(12, 13, 14, 0.85)' : 'transparent',
          backdropFilter:  scrolled ? 'blur(14px) saturate(1.4)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(14px) saturate(1.4)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.04)' : 'none',
          transition: 'background-color 0.35s ease, backdrop-filter 0.35s ease, border-color 0.35s ease',
        }}
      >
        <div className="content-max w-full flex items-center justify-between">
          {/* Wordmark */}
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="font-['Space_Grotesk'] text-xl font-medium text-white tracking-tight"
            aria-label="Back to top"
          >
            MA
          </a>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-7" role="menubar">
            {navLinks.map((link) => {
              const isActive = active === link.href.slice(1);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  role="menuitem"
                  onClick={(e) => { e.preventDefault(); scrollTo(link.href); }}
                  className="relative caption-text transition-colors duration-300"
                  style={{ color: isActive ? '#ffffff' : 'var(--text-muted)' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color = isActive ? '#fff' : 'var(--text-muted)';
                  }}
                >
                  {link.label}
                  {/* Active underline indicator */}
                  <span
                    className="absolute left-0 -bottom-1 h-px w-full origin-left transition-transform duration-300"
                    style={{
                      backgroundColor: 'var(--accent-color)',
                      transform: isActive ? 'scaleX(1)' : 'scaleX(0)',
                    }}
                  />
                </a>
              );
            })}
          </div>

          {/* Right: CTA + Hamburger */}
          <div className="flex items-center gap-3">
            <a
              href="#contact"
              onClick={(e) => { e.preventDefault(); scrollTo('#contact'); }}
              className="pill-btn hidden sm:inline-flex"
            >
              Hire Me
            </a>

            {/* Hamburger — visible on < md */}
            <button
              className="md:hidden flex flex-col gap-[5px] p-2"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              style={{ cursor: 'pointer' }}
            >
              <span
                className="block w-6 h-0.5 bg-white transition-transform duration-300 origin-center"
                style={{ transform: mobileOpen ? 'rotate(45deg) translateY(5.5px)' : 'none' }}
              />
              <span
                className="block w-6 h-0.5 bg-white transition-opacity duration-300"
                style={{ opacity: mobileOpen ? 0 : 1 }}
              />
              <span
                className="block w-6 h-0.5 bg-white transition-transform duration-300 origin-center"
                style={{ transform: mobileOpen ? 'rotate(-45deg) translateY(-5.5px)' : 'none' }}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className="fixed inset-0 z-40 flex flex-col items-center justify-center md:hidden"
        style={{
          backgroundColor: 'rgba(12, 13, 14, 0.97)',
          backdropFilter: 'blur(20px)',
          opacity:        mobileOpen ? 1 : 0,
          pointerEvents:  mobileOpen ? 'auto' : 'none',
          transition: 'opacity 0.35s ease',
        }}
      >
        <nav className="flex flex-col items-center gap-6">
          {navLinks.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => { e.preventDefault(); scrollTo(link.href); }}
              className="display-m text-white transition-all duration-300"
              style={{
                opacity:   mobileOpen ? 1 : 0,
                transform: mobileOpen ? 'translateY(0)' : 'translateY(20px)',
                transitionDelay: mobileOpen ? `${i * 60}ms` : '0ms',
              }}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={(e) => { e.preventDefault(); scrollTo('#contact'); }}
            className="btn-primary mt-4"
            style={{
              opacity:   mobileOpen ? 1 : 0,
              transform: mobileOpen ? 'translateY(0)' : 'translateY(20px)',
              transitionDelay: mobileOpen ? `${navLinks.length * 60}ms` : '0ms',
            }}
          >
            Hire Me
          </a>
        </nav>
      </div>
    </>
  );
}
