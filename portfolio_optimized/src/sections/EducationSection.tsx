import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GraduationCap, Award, BookOpen } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const educationItems = [
  {
    icon: GraduationCap,
    level: 'Bachelors',
    title: 'BS Computer Science',
    institution: 'Salim Habib University',
    note: 'Formerly Barrett Hodgson University',
    status: 'Currently Enrolled — 1st Semester',
    year: '2025 - Present',
    highlight: true,
  },
  {
    icon: Award,
    level: 'Intermediate',
    title: 'HSSC (Pre-Engineering)',
    institution: 'Private College',
    note: 'Karachi, Pakistan',
    status: 'Grade A',
    year: '2023 - 2024',
    highlight: false,
  },
  {
    icon: BookOpen,
    level: 'Matriculation',
    title: 'SSC (Science)',
    institution: 'Private School',
    note: 'Karachi, Pakistan',
    status: 'Grade A1',
    year: '2021 - 2022',
    highlight: false,
  },
];

const tools = [
  'C/C++', 'JavaScript', 'HTML5', 'CSS3', 'React',
  'Python', 'WordPress', 'AI Tools', 'Git', 'Responsive Design',
];

export default function EducationSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const toolsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
    const tools = toolsRef.current;
    if (!section || !header || cards.length === 0 || !tools) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      gsap.set([header, ...cards, tools], { opacity: 1, y: 0 });
      return;
    }

    gsap.fromTo(header,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: section, once: true, start: 'top 80%' } }
    );

    cards.forEach((card, i) => {
      gsap.fromTo(card,
        { opacity: 0, y: 50, rotateX: 8 },
        {
          opacity: 1, y: 0, rotateX: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: card, once: true, start: 'top 88%' },
          delay: i * 0.12,
        }
      );
    });

    gsap.fromTo(tools,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: tools, once: true, start: 'top 88%' } }
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
      id="education"
      className="relative w-full py-28 md:py-36"
      style={{ zIndex: 4, backgroundColor: 'var(--bg)' }}
    >
      <div className="content-max">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-16">
          <span className="section-label">My Journey</span>
          <h2 className="display-m text-white mt-3">Education</h2>
          <p className="body-l mt-4 max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            A strong academic foundation combined with hands-on learning in the ever-evolving world of technology.
          </p>
        </div>

        {/* Education Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20" style={{ perspective: '800px' }}>
          {educationItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                ref={(el) => { cardsRef.current[index] = el; }}
                className="relative card-base flex flex-col group overflow-hidden"
                style={{
                  opacity: 0,
                  transformStyle: 'preserve-3d',
                  backgroundColor: item.highlight ? 'rgba(79, 70, 229, 0.06)' : 'var(--surface)',
                  borderColor: item.highlight ? 'rgba(79, 70, 229, 0.25)' : 'var(--border-color)',
                }}
              >
                {/* Highlight glow */}
                {item.highlight && (
                  <div className="absolute top-0 left-0 right-0 h-px opacity-60" style={{ background: 'linear-gradient(90deg, transparent, var(--accent-color), transparent)' }} />
                )}

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3" style={{ backgroundColor: 'rgba(79, 70, 229, 0.12)' }}>
                    <Icon className="w-6 h-6" style={{ color: 'var(--accent-color)' }} />
                  </div>
                  <div>
                    <span className="caption-text" style={{ color: 'var(--accent-color)' }}>{item.level}</span>
                    <h3 className="heading-text text-white mt-1 text-xl">{item.title}</h3>
                  </div>
                </div>

                <div className="mt-4 space-y-1.5">
                  <p className="body" style={{ color: 'var(--text-secondary)' }}>{item.institution}</p>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{item.note}</p>
                </div>

                <div className="mt-auto pt-6 flex items-center justify-between">
                  <span className="mono-text px-3 py-1 rounded-md text-xs font-medium" style={{ backgroundColor: item.highlight ? 'rgba(79, 70, 229, 0.18)' : 'rgba(79, 70, 229, 0.1)', color: 'var(--accent-color)' }}>
                    {item.status}
                  </span>
                  <span className="mono-text" style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{item.year}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tools */}
        <div ref={toolsRef}>
          <h3 className="heading-text text-white text-center mb-8" style={{ fontSize: '1.25rem' }}>Technologies & Tools</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {tools.map((tool, i) => (
              <div
                key={tool}
                className="px-5 py-2.5 rounded-lg mono-text text-sm transition-all duration-300 hover:scale-110 hover:-translate-y-1"
                style={{
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-secondary)',
                  animationDelay: `${i * 50}ms`,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent-color)';
                  (e.currentTarget as HTMLElement).style.color = 'white';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 0 20px rgba(79, 70, 229, 0.2)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-color)';
                  (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                }}
              >
                {tool}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
