import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const services = [
  { number: '01', title: 'Responsive Portfolio Websites', description: 'Stunning, mobile-first portfolio sites that showcase your work beautifully. Built with modern frameworks and deployed to your domain.' },
  { number: '02', title: 'WordPress Development & Hosting', description: 'Full WordPress setup — custom themes, plugin configuration, speed optimisation, and reliable hosting with SSL security.' },
  { number: '03', title: 'AI Automation Systems', description: 'Streamline your business with intelligent automations. From lead nurturing to content distribution, I build systems that work 24/7.' },
  { number: '04', title: 'CGI & Marketing Videos', description: 'Eye-catching CGI advertisements and marketing videos that tell your brand story. Professional quality content for social media and campaigns.' },
  { number: '05', title: 'Frontend UI/UX Development', description: 'Interactive interfaces with smooth animations, thoughtful micro-interactions, and accessibility-first design principles.' },
  { number: '06', title: 'Technical Consultation', description: 'Need guidance on your tech stack, project architecture, or digital strategy? Clear, actionable advice for your next steps.' },
];

export default function ServicesSection() {
  const sectionRef  = useRef<HTMLElement>(null);
  const headerRef   = useRef<HTMLDivElement>(null);
  const cardsRef    = useRef<(HTMLDivElement | null)[]>([]);
  const showcaseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section  = sectionRef.current;
    const header   = headerRef.current;
    const cards    = cardsRef.current.filter(Boolean) as HTMLDivElement[];
    const showcase = showcaseRef.current;
    if (!section || !header || !cards.length || !showcase) return;

    const pref = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (pref) {
      gsap.set([header, ...cards, showcase], { opacity: 1, y: 0 });
      return;
    }

    gsap.fromTo(header,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 80%', once: true } }
    );

    cards.forEach((card, i) => {
      gsap.fromTo(card,
        { opacity: 0, y: 50, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 88%', once: true },
          delay: i * 0.07 }
      );
    });

    gsap.fromTo(showcase,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: showcase, start: 'top 85%', once: true } }
    );

    return () => {
      ScrollTrigger.getAll().forEach((st) => { if (st.trigger === section) st.kill(); });
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative w-full py-28 md:py-36"
      style={{ zIndex: 5, backgroundColor: 'var(--bg)' }}
    >
      <div className="content-max">
        <div ref={headerRef} className="mb-16">
          <span className="section-label">Services</span>
          <h2 className="display-m text-white mt-3" style={{ fontSize: 'clamp(2rem, 5.5vw, 3.5rem)' }}>
            What I Can Build For You
          </h2>
          <p className="body-l mt-4 max-w-xl" style={{ color: 'var(--text-secondary)' }}>
            From websites to AI automations, I deliver modern digital solutions tailored to your needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={service.number}
              ref={(el) => { cardsRef.current[index] = el; }}
              className="card-base group cursor-pointer flex flex-col relative overflow-hidden"
              style={{ opacity: 0 }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: 'radial-gradient(500px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(79,70,229,0.07), transparent 40%)' }} />

              <span className="mono-text mb-3 relative" style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                {service.number}
              </span>
              <h3 className="heading-text text-white relative" style={{ fontSize: '1.1rem' }}>
                {service.title}
              </h3>
              <p className="body mt-3 flex-grow relative leading-relaxed text-sm" style={{ color: 'var(--text-secondary)' }}>
                {service.description}
              </p>
              <div className="mt-5 flex items-center gap-2 text-sm font-medium relative transition-all duration-300 group-hover:gap-3"
                style={{ color: 'var(--accent-color)' }}>
                <span>Learn more</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </div>
          ))}
        </div>

        {/* Showcase */}
        <div ref={showcaseRef} className="mt-28">
          <div className="text-center mb-12">
            <span className="section-label">Showcase</span>
            <h3 className="display-m text-white mt-3" style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)' }}>
              Recent Work
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { img: '/images/project-portfolio-1.jpg', title: 'Portfolio Websites',  desc: 'Modern, responsive portfolio sites built with React and Tailwind' },
              { img: '/images/project-wordpress-1.jpg', title: 'WordPress Solutions', desc: 'Full WordPress development with hosting and customisation' },
            ].map((proj) => (
              <div key={proj.title} className="group relative overflow-hidden rounded-xl"
                style={{ border: '1px solid var(--border-color)' }}>
                <img
                  src={proj.img}
                  alt={proj.title}
                  className="w-full h-72 object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 flex flex-col justify-end p-6"
                  style={{ background: 'linear-gradient(to top, rgba(12,13,14,0.95) 0%, rgba(12,13,14,0.45) 55%, transparent 100%)' }}>
                  <h4 className="heading-text text-white" style={{ fontSize: '1.1rem' }}>{proj.title}</h4>
                  <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{proj.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
