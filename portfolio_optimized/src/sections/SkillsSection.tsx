import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Palette, MessageSquare, Video, Code2, Sparkles, BarChart2, Database } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface Category {
  id:         string;
  icon:       React.ElementType;
  title:      string;
  shortTitle: string;
  color:      string;
  skills:     string[];
}

const categories: Category[] = [
  {
    id: 'web', icon: Code2,
    title: 'Web & Development', shortTitle: 'Web',
    color: '#4f46e5',
    skills: [
      'Responsive Website Development', 'Frontend Development', 'HTML5', 'CSS3',
      'JavaScript', 'Website Optimization', 'Landing Page Development',
      'Portfolio Website Development', 'Website Maintenance', 'Technical Support',
      'WordPress Development', 'Website Migration',
    ],
  },
  {
    id: 'ai', icon: Sparkles,
    title: 'AI & Automation', shortTitle: 'AI / Auto',
    color: '#7c3aed',
    skills: [
      'AI Automation', 'Workflow Automation', 'Zapier Automation',
      'Make.com Automation', 'n8n Automation', 'AI Content Generation',
      'AI Tools Integration', 'Prompt Engineering', 'Chatbot Development',
    ],
  },
  {
    id: 'creative', icon: Palette,
    title: 'Creative & Design', shortTitle: 'Design',
    color: '#ec4899',
    skills: [
      'Graphic Design', 'Poster Design', 'Banner Design', 'Social Media Design',
      'Brand Identity Design', 'UI Design', 'UX Design', 'Canva',
      'Adobe Photoshop', 'Adobe Illustrator', 'Creative Direction',
    ],
  },
  {
    id: 'video', icon: Video,
    title: 'Video & Media', shortTitle: 'Video',
    color: '#ef4444',
    skills: [
      'Video Editing', 'Short Form Content Editing', 'Reels Editing',
      'YouTube Video Editing', 'Motion Graphics', 'CGI Advertisement Production',
      'AI Video Generation', 'AI Voice Generation', 'Audio Editing', 'Podcast Editing',
    ],
  },
  {
    id: 'content', icon: MessageSquare,
    title: 'Content & Marketing', shortTitle: 'Content',
    color: '#f97316',
    skills: [
      'Content Creation', 'Social Media Management', 'Social Media Handling',
      'Digital Marketing', 'Copywriting', 'Content Strategy',
      'Community Management', 'Personal Branding',
    ],
  },
  {
    id: 'business', icon: BarChart2,
    title: 'Business & Productivity', shortTitle: 'Business',
    color: '#0ea5e9',
    skills: [
      'Microsoft Word', 'Microsoft Excel', 'Microsoft PowerPoint',
      'Microsoft Office Suite', 'Power BI', 'Data Visualization',
      'Report Creation', 'Virtual Assistance', 'Administrative Support',
    ],
  },
  {
    id: 'data', icon: Database,
    title: 'Data & Language', shortTitle: 'Data',
    color: '#10b981',
    skills: [
      'Data Entry', 'Data Cleaning', 'Web Research', 'Internet Research',
      'Transcription', 'Proofreading', 'Editing', 'Document Formatting',
    ],
  },
];

const TOTAL_SKILLS = categories.reduce((a, c) => a + c.skills.length, 0);

export default function SkillsSection() {
  const sectionRef  = useRef<HTMLElement>(null);
  const headerRef   = useRef<HTMLDivElement>(null);
  const contentRef  = useRef<HTMLDivElement>(null);
  const skillsRef   = useRef<HTMLDivElement>(null);
  const animatingRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // ── Section entrance ────────────────────────────────────────
  useEffect(() => {
    const section = sectionRef.current;
    const header  = headerRef.current;
    const content = contentRef.current;
    if (!section || !header || !content) return;

    const pref = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (pref) {
      gsap.set([header, content], { opacity: 1, y: 0 });
      return;
    }

    const tl = gsap.timeline({
      scrollTrigger: { trigger: section, start: 'top 78%', once: true },
    });
    tl.fromTo(header,  { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.9,  ease: 'power3.out' });
    tl.fromTo(content, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1.0,  ease: 'power3.out' }, 0.15);

    return () => {
      ScrollTrigger.getAll().forEach((st) => { if (st.trigger === section) st.kill(); });
    };
  }, []);

  // ── Animate skills in whenever category changes ─────────────
  useEffect(() => {
    const grid = skillsRef.current;
    if (!grid) return;
    const pref = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (pref) { animatingRef.current = false; return; }

    const pills = grid.querySelectorAll<HTMLElement>('.skill-pill');
    gsap.fromTo(pills,
      { opacity: 0, y: 14, scale: 0.9 },
      {
        opacity: 1, y: 0, scale: 1,
        duration: 0.38, stagger: 0.022, ease: 'power2.out',
        delay: 0.04,
        onComplete: () => { animatingRef.current = false; },
      }
    );
  }, [activeIndex]);

  // ── Switch category with out-animation ─────────────────────
  const switchCategory = (index: number) => {
    if (animatingRef.current || index === activeIndex) return;
    animatingRef.current = true;

    const grid = skillsRef.current;
    const pref = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (pref || !grid) { setActiveIndex(index); return; }

    const pills = grid.querySelectorAll<HTMLElement>('.skill-pill');
    gsap.to(pills, {
      opacity: 0, y: -10, scale: 0.93,
      duration: 0.17, stagger: 0.008, ease: 'power2.in',
      onComplete: () => setActiveIndex(index),
    });
  };

  const active = categories[activeIndex];

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="relative w-full py-28 md:py-36"
      style={{ zIndex: 3, backgroundColor: 'var(--bg)' }}
    >
      <div className="content-max">

        {/* Header */}
        <div ref={headerRef} className="text-center mb-14" style={{ opacity: 0 }}>
          <span className="section-label">Expertise</span>
          <h2 className="display-m text-white mt-3">My Skillset</h2>
          <p className="body-l mt-4 max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            {TOTAL_SKILLS}+ skills across {categories.length} disciplines — from design to development to AI automation.
          </p>
        </div>

        <div ref={contentRef} style={{ opacity: 0 }}>

          {/* Category tab bar — horizontally scrollable on mobile */}
          <div
            className="flex gap-2 mb-8 pb-1 overflow-x-auto scrollbar-hide"
            role="tablist"
            aria-label="Skill categories"
          >
            {categories.map((cat, i) => {
              const Icon     = cat.icon;
              const isActive = i === activeIndex;
              return (
                <button
                  key={cat.id}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="skills-panel"
                  onClick={() => switchCategory(i)}
                  className="flex-shrink-0 flex items-center gap-2 rounded-lg"
                  style={{
                    padding: '0.55rem 1rem',
                    backgroundColor: isActive ? `${cat.color}18` : 'var(--surface)',
                    border:          `1px solid ${isActive ? cat.color + '55' : 'var(--border-color)'}`,
                    color:           isActive ? cat.color : 'var(--text-muted)',
                    fontSize:        '0.78rem',
                    fontFamily:      'Inter, system-ui, sans-serif',
                    fontWeight:      500,
                    cursor:          'pointer',
                    transform:       isActive ? 'translateY(-2px)' : 'none',
                    boxShadow:       isActive ? `0 6px 24px ${cat.color}18` : 'none',
                    transition:      'all 0.25s ease',
                    whiteSpace:      'nowrap',
                  }}
                >
                  <Icon style={{ width: '0.875rem', height: '0.875rem', flexShrink: 0 }} />
                  <span className="hidden sm:inline">{cat.title}</span>
                  <span className="sm:hidden">{cat.shortTitle}</span>
                </button>
              );
            })}
          </div>

          {/* Skills panel */}
          <div
            id="skills-panel"
            role="tabpanel"
            className="relative rounded-xl p-6 md:p-8"
            style={{
              backgroundColor: 'var(--surface)',
              border: `1px solid ${active.color}22`,
              minHeight: '220px',
            }}
          >
            {/* Top accent line */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-3/4 rounded-full"
              style={{ background: `linear-gradient(90deg, transparent, ${active.color}70, transparent)` }}
            />

            {/* Active category header */}
            <div className="flex items-center gap-3 mb-6">
              {(() => { const Icon = active.icon; return (
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${active.color}15` }}
                >
                  <Icon style={{ width: '1.1rem', height: '1.1rem', color: active.color }} />
                </div>
              ); })()}
              <div>
                <h3 className="heading-text text-white" style={{ fontSize: '1.15rem' }}>{active.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>{active.skills.length} skills</p>
              </div>
            </div>

            {/* Skill pills — key forces remount on category switch so GSAP target is always fresh */}
            <div
              key={activeIndex}
              ref={skillsRef}
              className="flex flex-wrap gap-2"
            >
              {active.skills.map((skill) => (
                <span
                  key={skill}
                  className="skill-pill mono-text px-3 py-1.5 rounded-lg text-sm select-none"
                  style={{
                    backgroundColor: `${active.color}0d`,
                    border:          `1px solid ${active.color}28`,
                    color:           'var(--text-secondary)',
                    cursor:          'default',
                    opacity:         0, // GSAP animates in
                    transition:      'background-color 0.2s, border-color 0.2s, color 0.2s, transform 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.backgroundColor = `${active.color}1e`;
                    el.style.borderColor     = `${active.color}55`;
                    el.style.color           = active.color;
                    el.style.transform       = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.backgroundColor = `${active.color}0d`;
                    el.style.borderColor     = `${active.color}28`;
                    el.style.color           = 'var(--text-secondary)';
                    el.style.transform       = '';
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Bottom icon strip — quick-jump to any category */}
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 mt-3">
            {categories.map((cat, i) => {
              const Icon     = cat.icon;
              const isActive = i === activeIndex;
              return (
                <button
                  key={cat.id}
                  onClick={() => switchCategory(i)}
                  title={cat.title}
                  className="flex flex-col items-center gap-1 py-2.5 px-1 rounded-lg transition-all duration-200"
                  style={{
                    backgroundColor: isActive ? `${cat.color}12` : 'transparent',
                    border:          `1px solid ${isActive ? cat.color + '30' : 'var(--border-color)'}`,
                    cursor:          'pointer',
                  }}
                >
                  <Icon style={{ width: '1rem', height: '1rem', color: cat.color }} />
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.6rem', textAlign: 'center', lineHeight: 1.3 }}>
                    {cat.shortTitle}
                  </span>
                  <span style={{ color: cat.color, fontSize: '0.6rem', fontFamily: 'JetBrains Mono, monospace' }}>
                    {cat.skills.length}
                  </span>
                </button>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
