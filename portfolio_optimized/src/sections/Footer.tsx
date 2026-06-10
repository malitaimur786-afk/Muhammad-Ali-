import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Linkedin, Github, Mail, Heart } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const quickLinks = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Services', href: '#services' },
  { label: 'Contact', href: '#contact' },
];

const socialLinks = [
  { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: Github, href: 'https://github.com', label: 'GitHub' },
  { icon: Mail, href: 'mailto:muhammadali@example.com', label: 'Email' },
];

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      gsap.set(footer, { opacity: 1, y: 0 });
      return;
    }
    gsap.fromTo(footer,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: footer, start: 'top 92%' } }
    );
  }, []);

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer ref={footerRef} className="relative w-full py-16" style={{ zIndex: 7, backgroundColor: 'var(--bg)', borderTop: '1px solid var(--border-color)' }}>
      <div className="content-max">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <span className="font-['Space_Grotesk'] text-2xl font-medium text-white tracking-tight">MA</span>
            <span className="heading-text text-white text-lg">Muhammad Ali</span>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {quickLinks.map((link) => (
              <a key={link.href} href={link.href} onClick={(e) => { e.preventDefault(); scrollTo(link.href); }} className="body text-sm transition-colors duration-300 hover:text-white relative group" style={{ color: 'var(--text-secondary)' }}>
                {link.label}
                <span className="absolute left-0 -bottom-0.5 w-0 h-px bg-white transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110" style={{ color: 'var(--text-muted)', border: '1px solid var(--border-color)' }} onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'white'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent-color)'; }} onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-color)'; }} aria-label={social.label}>
                  <Icon className="w-4 h-4" />
                </a>
              );
            })}
          </div>
        </div>
        <div className="my-8" style={{ borderTop: '1px solid var(--border-color)' }} />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="caption-text" style={{ color: 'var(--text-muted)' }}>&copy; 2025 Muhammad Ali. All rights reserved.</span>
          <span className="caption-text flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
            Built with <Heart className="w-3 h-3" style={{ color: 'var(--accent-color)' }} /> and passion
          </span>
        </div>
      </div>
    </footer>
  );
}
