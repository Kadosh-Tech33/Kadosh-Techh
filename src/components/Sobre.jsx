import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { prefersReducedMotion } from '../lib/smoothScroll.js';
import DepthText from './DepthText/DepthText.jsx';

gsap.registerPlugin(SplitText);

export default function Sobre() {
  const sectionRef = useRef(null);
  const visualRef = useRef(null);
  const titleRef = useRef(null);
  const badgeRefs = useRef([]);
  const leadRefs = useRef([]);

  useGSAP(() => {
    if (prefersReducedMotion()) return;

    // Only the plain-text leads get the line-by-line SplitText treatment.
    // The title now hosts a DepthText word (its own layered DOM/3D stage),
    // and running SplitText's line-measurement across that would be
    // fighting a second text-effect on the same nodes — so the title gets
    // a plain block-level fade+lift instead (see below), same spirit as
    // every other section's entrance.
    const splits = leadRefs.current.filter(Boolean).map((el) => SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      autoSplit: true,
      onSplit(self) {
        return gsap.from(self.lines, {
          yPercent: 110,
          opacity: 0,
          stagger: 0.08,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 72%', once: true },
        });
      },
    }));

    // Title + floating stat badges fade/lift in together on the same beat.
    const badges = badgeRefs.current.filter(Boolean);
    gsap.set(titleRef.current, { opacity: 0, y: 24 });
    if (badges.length) gsap.set(badges, { opacity: 0, y: 24 });
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 72%',
      once: true,
      onEnter: () => {
        gsap.to(titleRef.current, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
        if (badges.length) {
          gsap.to(badges, { opacity: 1, y: 0, stagger: 0.15, delay: 0.25, duration: 0.7, ease: 'power3.out' });
        }
      },
    });

    // Subtle background parallax: the decorative blob drifts against the
    // section as it scrolls past — there's no separate bg image here.
    gsap.fromTo(visualRef.current, { y: -28 }, {
      y: 28,
      ease: 'none',
      scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: true },
    });

    return () => splits.forEach((s) => s.revert());
  }, { scope: sectionRef });

  return (
    <section id="sobre" className="section-fade-in" ref={sectionRef}>
      <div className="section-inner">
        <div className="sobre-grid">
          <div className="sobre-visual reveal" ref={visualRef}>
            <div className="sobre-blob">
              <div className="sobre-blob-inner">
                <svg viewBox="0 0 80 80">
                  <polyline points="28 24 12 40 28 56" strokeWidth="3" />
                  <polyline points="52 24 68 40 52 56" strokeWidth="3" />
                  <line x1="44" y1="18" x2="36" y2="62" strokeWidth="3" />
                </svg>
              </div>
              <div className="sobre-badge-float b1" ref={(el) => { badgeRefs.current[0] = el; }}>
                <div className="sbf-icon"><svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg></div>
                <div><div className="sbf-label">Performance</div><div className="sbf-value">99% Score</div></div>
              </div>
              <div className="sobre-badge-float b2" ref={(el) => { badgeRefs.current[1] = el; }}>
                <div className="sbf-icon"><svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg></div>
                <div><div className="sbf-label">Clientes</div><div className="sbf-value">50+ Ativos</div></div>
              </div>
            </div>
          </div>

          <div className="sobre-content reveal reveal-delay-2">
            <p className="section-label">Quem somos</p>
            <h2 className="section-title" ref={titleRef}>
              SOBRE A<br />
              <DepthText
                text="KADOSH TECH"
                className="kadosh-depth-word"
                layers={14}
                depth={2.2}
                tilt={6}
                faceColor="#ffffff"
                depthColor="#1d4ed8"
                fontSize="clamp(2.4rem, 5vw, 4.5rem)"
                fontWeight={400}
                orbitSpeed={0.25}
              />
            </h2>
            <p className="sobre-lead" ref={(el) => { leadRefs.current[0] = el; }}>
              Somos uma <strong>software house especializada em web</strong> com foco em criar soluções digitais que realmente funcionam para o negócio dos nossos clientes.
            </p>
            <p className="sobre-lead" ref={(el) => { leadRefs.current[1] = el; }}>
              Combinamos <strong>design moderno</strong>, <strong>código limpo</strong> e <strong>estratégia digital</strong> para entregar projetos que se destacam — do primeiro acesso ao resultado final.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
