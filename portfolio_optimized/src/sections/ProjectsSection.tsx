import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ExternalLink, CheckCircle2, Zap, Monitor, Smartphone, Tablet } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// ── Browser window mockup (pure CSS — no external image needed) ──
function BrowserMockup() {
  return (
    <div
      className="w-full rounded-xl overflow-hidden"
      style={{ border: '1px solid rgba(255,255,255,0.07)', background: '#0c0d10' }}
    >
      {/* Chrome toolbar */}
      <div
        className="flex items-center gap-2 px-4"
        style={{
          height: 36, background: 'rgba(255,255,255,0.04)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <div className="flex gap-1.5">
          {['#ff5f57','#febc2e','#28c840'].map((c) => (
            <div key={c} style={{ width: 11, height: 11, borderRadius: '50%', background: c }} />
          ))}
        </div>
        <div
          className="flex-1 mx-3 rounded flex items-center px-3"
          style={{
            height: 22, background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <span style={{ color: 'rgba(255,255,255,0.28)', fontSize: '0.62rem', fontFamily: 'JetBrains Mono, monospace' }}>
            su5p4a2kytuio.ok.kimi.link
          </span>
        </div>
      </div>

      {/* Simulated website content */}
      <div
        style={{
          height: 240,
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #0d0f1e 0%, #171030 50%, #0c0d14 100%)',
        }}
      >
        {/* Nav bar sim */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 30,
          background: 'rgba(255,255,255,0.025)', borderBottom: '1px solid rgba(255,255,255,0.035)',
          display: 'flex', alignItems: 'center', padding: '0 16px', gap: 14,
        }}>
          <div style={{ width: 24, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.55)' }} />
          <div style={{ flex: 1 }} />
          {[44, 44, 54, 44].map((w, i) => (
            <div key={i} style={{ width: w, height: 5, borderRadius: 2.5, background: 'rgba(255,255,255,0.1)' }} />
          ))}
          <div style={{ width: 46, height: 18, borderRadius: 9, background: '#4f46e5' }} />
        </div>

        {/* Hero content sim */}
        <div style={{ padding: '38px 20px 12px', display: 'flex', flexDirection: 'column', gap: 7 }}>
          <div style={{ width: '45%', height: 6,  borderRadius: 3,   background: 'rgba(79,70,229,0.55)' }} />
          <div style={{ width: '78%', height: 18, borderRadius: 4,   background: 'rgba(255,255,255,0.22)' }} />
          <div style={{ width: '55%', height: 18, borderRadius: 4,   background: 'rgba(255,255,255,0.1)'  }} />
          <div style={{ width: '72%', height: 6,  borderRadius: 3,   background: 'rgba(255,255,255,0.06)', marginTop: 2 }} />
          <div style={{ width: '58%', height: 6,  borderRadius: 3,   background: 'rgba(255,255,255,0.06)' }} />
          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            <div style={{ width: 76, height: 26, borderRadius: 6, background: '#4f46e5' }} />
            <div style={{ width: 76, height: 26, borderRadius: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)' }} />
          </div>
        </div>

        {/* Cards strip sim */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          display: 'flex', gap: 7, padding: '0 16px 10px',
        }}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{
              flex: 1, height: 46, borderRadius: 7,
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.055)',
            }} />
          ))}
        </div>

        {/* Ambient glow */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse at 28% 40%, rgba(79,70,229,0.14) 0%, transparent 60%)',
        }} />
      </div>
    </div>
  );
}

// ── Data ─────────────────────────────────────────────────────────
const features = [
  'Fully responsive — mobile, tablet, desktop & ultra-wide',
  'GSAP-powered cinematic scroll animations',
  'Optimized Core Web Vitals & Lighthouse scores',
  'Dark-mode design system with CSS custom properties',
  'Accessible markup with ARIA roles and keyboard navigation',
  'Lazy-loaded images and GPU-composited transitions',
];

const technologies = [
  { name: 'HTML5',            color: '#e34f26' },
  { name: 'CSS3',             color: '#1572b6' },
  { name: 'JavaScript',       color: '#eab308' },
  { name: 'GSAP',             color: '#88ce02' },
  { name: 'Lenis Scroll',     color: '#4f46e5' },
  { name: 'CSS Grid/Flexbox', color: '#7c3aed' },
  { name: 'Responsive Design',color: '#ec4899' },
];

const metrics = [
  { label: 'Performance',    value: '98', color: '#10b981' },
  { label: 'Accessibility',  value: '95', color: '#4f46e5' },
  { label: 'Best Practices', value: '100', color: '#f97316' },
];

const additionalProjects = [
  {
    title:       'AI Automation Workflows',
    description: 'Instagram auto-poster with AI caption generation — built with n8n, OpenRouter/Llama, and Google Sheets as a data store. Runs 24/7 without manual input.',
    tags:        ['n8n', 'Make.com', 'AI', 'OpenRouter'],
    color:       '#7c3aed',
  },
  {
    title:       'WordPress Business Site',
    description: 'Full WordPress deployment — custom theme, plugin configuration, speed optimisation, SSL, and cPanel hosting for a live business client.',
    tags:        ['WordPress', 'cPanel', 'SSL', 'SEO'],
    color:       '#0ea5e9',
  },
  {
    title:       'CGI Advertisement Production',
    description: 'AI-generated CGI product advertisement for social media campaigns using AI video and motion graphics tools.',
    tags:        ['AI Video', 'Motion Graphics', 'Canva', 'Adobe'],
    color:       '#ef4444',
  },
];

// ── Component ─────────────────────────────────────────────────────
export default function ProjectsSection() {
  const sectionRef  = useRef<HTMLElement>(null);
  const headerRef   = useRef<HTMLDivElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);
  const gridRef     = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section  = sectionRef.current;
    const header   = headerRef.current;
    const featured = featuredRef.current;
    const grid     = gridRef.current;
    if (!section || !header || !featured || !grid) return;

    const pref = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (pref) {
      gsap.set([header, featured, grid], { opacity: 1, y: 0 });
      return;
    }

    gsap.fromTo(header,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 78%', once: true } }
    );
    gsap.fromTo(featured,
      { opacity: 0, y: 60 },
      { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out',
        scrollTrigger: { trigger: featured, start: 'top 85%', once: true } }
    );

    const cards = grid.querySelectorAll<HTMLElement>('.project-card');
    gsap.fromTo(cards,
      { opacity: 0, y: 50, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: grid, start: 'top 86%', once: true } }
    );

    return () => {
      ScrollTrigger.getAll().forEach((st) => { if (st.trigger === section) st.kill(); });
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative w-full py-28 md:py-36"
      style={{ zIndex: 4, backgroundColor: 'var(--bg)' }}
    >
      <div className="content-max">

        {/* Header */}
        <div ref={headerRef} className="mb-14" style={{ opacity: 0 }}>
          <span className="section-label">Portfolio</span>
          <h2 className="display-m text-white mt-3" style={{ fontSize: 'clamp(2rem, 5.5vw, 3.5rem)' }}>
            Selected Work
          </h2>
          <p className="body-l mt-4 max-w-xl" style={{ color: 'var(--text-secondary)' }}>
            Real projects, real results — from responsive websites to AI-powered automations.
          </p>
        </div>

        {/* ── Featured project case study ── */}
        <div
          ref={featuredRef}
          className="relative rounded-2xl overflow-hidden mb-10"
          style={{
            opacity: 0,
            border: '1px solid rgba(79,70,229,0.22)',
            background: 'linear-gradient(135deg, rgba(79,70,229,0.055) 0%, rgba(22,23,26,0.9) 60%)',
          }}
        >
          {/* Top accent */}
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, #4f46e5, transparent)' }} />

          <div className="grid grid-cols-1 lg:grid-cols-2">

            {/* Left — visual + metrics */}
            <div className="p-6 md:p-8 lg:p-10">
              <BrowserMockup />

              {/* Lighthouse-style score pills */}
              <div className="flex gap-3 mt-5">
                {metrics.map((m) => (
                  <div key={m.label} className="flex-1 text-center py-3 rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)' }}>
                    <div className="text-xl font-bold"
                      style={{ color: m.color, fontFamily: 'JetBrains Mono, monospace' }}>
                      {m.value}
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Device badges */}
              <div className="flex items-center gap-5 mt-5 px-4 py-3 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid var(--border-color)' }}>
                {[
                  { icon: Monitor,    label: 'Desktop' },
                  { icon: Tablet,     label: 'Tablet'  },
                  { icon: Smartphone, label: 'Mobile'  },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <Icon style={{ width: '0.9rem', height: '0.9rem', color: 'var(--accent-color)' }} />
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</span>
                  </div>
                ))}
                <div className="flex-1" />
                <div className="flex items-center gap-1.5">
                  <Zap style={{ width: '0.85rem', height: '0.85rem', color: '#10b981' }} />
                  <span className="text-xs" style={{ color: '#10b981' }}>Optimised</span>
                </div>
              </div>
            </div>

            {/* Right — project details */}
            <div className="p-6 md:p-8 lg:p-10 lg:border-l"
              style={{ borderColor: 'rgba(255,255,255,0.045)' }}>

              {/* Status badges */}
              <div className="flex flex-wrap items-center gap-2 mb-5">
                <span className="px-2.5 py-1 rounded-md text-xs mono-text"
                  style={{ backgroundColor: 'rgba(79,70,229,0.14)', color: '#4f46e5', border: '1px solid rgba(79,70,229,0.25)' }}>
                  Featured Project
                </span>
                <span className="px-2.5 py-1 rounded-md text-xs mono-text flex items-center gap-1.5"
                  style={{ backgroundColor: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.25)' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                  Live
                </span>
              </div>

              <h3 className="text-white font-semibold leading-tight"
                style={{ fontFamily: 'Space Grotesk, system-ui, sans-serif', fontSize: 'clamp(1.5rem, 2.5vw, 2rem)' }}>
                Responsive Portfolio Website
              </h3>
              <p className="body mt-4 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                A fully responsive, performance-optimised portfolio website built with vanilla
                web technologies and GSAP-powered animations. Features cinematic hero reveals,
                smooth Lenis scrolling, and polished micro-interactions across all devices.
              </p>

              {/* Technologies */}
              <div className="mt-6">
                <p className="caption-text mb-3" style={{ color: 'var(--text-muted)' }}>Technologies Used</p>
                <div className="flex flex-wrap gap-2">
                  {technologies.map((t) => (
                    <span key={t.name} className="px-2.5 py-1 rounded-md text-xs mono-text"
                      style={{ backgroundColor: `${t.color}14`, color: t.color, border: `1px solid ${t.color}2a` }}>
                      {t.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Key features */}
              <div className="mt-6">
                <p className="caption-text mb-3" style={{ color: 'var(--text-muted)' }}>Key Features</p>
                <div className="space-y-2">
                  {features.map((f) => (
                    <div key={f} className="flex items-start gap-2.5">
                      <CheckCircle2 className="flex-shrink-0 mt-0.5"
                        style={{ width: '0.875rem', height: '0.875rem', color: '#4f46e5' }} />
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Live demo CTA */}
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="https://su5p4a2kytuio.ok.kimi.link?sharetype=link"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  <ExternalLink style={{ width: '0.9rem', height: '0.9rem' }} />
                  View Live Demo
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ── Additional projects grid ── */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {additionalProjects.map((proj) => (
            <div
              key={proj.title}
              className="project-card card-base group relative overflow-hidden flex flex-col"
              style={{ opacity: 0 }}
            >
              {/* Top border glow on hover */}
              <div className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `linear-gradient(90deg, transparent, ${proj.color}, transparent)` }} />

              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
                style={{ backgroundColor: `${proj.color}15` }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: proj.color }} />
              </div>

              <h3 className="heading-text text-white" style={{ fontSize: '1.1rem' }}>{proj.title}</h3>
              <p className="body mt-2.5 flex-grow text-sm leading-relaxed"
                style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                {proj.description}
              </p>

              <div className="flex flex-wrap gap-1.5 mt-5">
                {proj.tags.map((tag) => (
                  <span key={tag} className="mono-text text-xs px-2.5 py-1 rounded-md"
                    style={{
                      backgroundColor: `${proj.color}10`,
                      color: proj.color,
                      border: `1px solid ${proj.color}22`,
                    }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
