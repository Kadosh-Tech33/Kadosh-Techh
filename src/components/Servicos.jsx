import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { prefersReducedMotion } from '../lib/smoothScroll.js';

const SERVICES = [
  {
    tag: 'DESENVOLVIMENTO SÊNIOR',
    title: 'ENGENHARIA DE SOFTWARE & SISTEMAS',
    desc: 'Desenvolvimento de plataformas personalizadas, sistemas automáticos, automação de processos internos e softwares sob medida. Arquiteturas escaláveis projetadas para otimizar a operação da sua empresa.',
    icon: <><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></>,
  },
  {
    tag: 'HIGH PERFORMANCE',
    title: 'PÁGINAS WEB CORPORATIVAS',
    desc: 'Landing Pages e ecossistemas web institucionais de alta performance para grandes empresas, focados em velocidade e conversão mobile.',
    icon: <><rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></>,
  },
  {
    tag: 'VELOCIDADE MÁXIMA',
    title: 'OTIMIZAÇÃO DE PERFORMANCE & CLOUD',
    desc: 'Auditoria de código para máxima velocidade (Web Vitals), deploy otimizado em nuvem e arquiteturas focadas na melhor experiência.',
    icon: <><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></>,
  },
  {
    tag: 'ESCALABILIDADE',
    title: 'E-COMMERCE DE ALTA PERFORMANCE',
    desc: 'Lojas online complexas com checkout otimizado, integrações seguras de pagamento e painéis de gestão robustos e escaláveis.',
    icon: <><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></>,
  },
  {
    tag: 'INFRAESTRUTURA',
    title: 'GOVERNANÇA, MANUTENÇÃO & SUPORTE',
    desc: 'Monitoramento de servidores, deploys contínuos, backups automáticos e suporte especializado para garantir máxima estabilidade.',
    icon: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></>,
  },
  {
    tag: 'RESULTADO',
    title: '99% PAGESPEED SCORE MÉDIO',
    desc: 'Cada entrega passa por auditoria de performance antes de ir ao ar — é assim que mantemos essa média em todos os projetos.',
    icon: <><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" /></>,
  },
];

function ServiceCard({ tag, title, desc, icon, cardRef }) {
  const mouseRef = useRef(null);

  useGSAP(() => {
    const card = mouseRef.current;
    if (!card || prefersReducedMotion()) return;
    const onMouseMove = (e) => {
      const r = card.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width / 2) / (r.width / 2);
      const dy = (e.clientY - r.top - r.height / 2) / (r.height / 2);
      gsap.to(card, { rotateY: dx * 6, rotateX: -dy * 6, duration: 0.4, ease: 'power2.out', transformPerspective: 900 });
      card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
      card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
    };
    const onMouseLeave = () => gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.6, ease: 'power3.out' });
    card.addEventListener('mousemove', onMouseMove);
    card.addEventListener('mouseleave', onMouseLeave);
    return () => {
      card.removeEventListener('mousemove', onMouseMove);
      card.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return (
    <article
      className="service-card"
      ref={(el) => { mouseRef.current = el; cardRef(el); }}
    >
      <div className="corner-glow"></div>
      <div className="card-icon"><svg viewBox="0 0 24 24">{icon}</svg></div>
      <span className="card-tag">{tag}</span>
      <h3 className="card-name">{title}</h3>
      <p className="card-desc">{desc}</p>
    </article>
  );
}

export default function Servicos() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const cardRefs = useRef([]);

  useGSAP(() => {
    const track = trackRef.current;
    if (!track) return;

    if (prefersReducedMotion()) return;

    const getScrollDistance = () => Math.max(track.scrollWidth - window.innerWidth + 96, 0);

    const horizontalTween = gsap.to(track, {
      x: () => -getScrollDistance(),
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: () => `+=${getScrollDistance()}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });

    cardRefs.current.forEach((card) => {
      if (!card) return;
      gsap.fromTo(card, { scale: 0.88, opacity: 0.45, y: 24 }, {
        scale: 1,
        opacity: 1,
        y: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: card,
          containerAnimation: horizontalTween,
          // The last card in the track never travels far past its resting
          // position (it's at the tail end, so the horizontal tween has
          // nowhere further left to carry it) — `end` has to be a point
          // every card, including that one, can actually reach.
          start: 'left 98%',
          end: 'left 72%',
          scrub: true,
        },
      });
    });
  }, { scope: sectionRef });

  return (
    <section id="servicos" className="servicos-pin" ref={sectionRef}>
      <div className="servicos-heading reveal">
        <p className="section-label">O que fazemos</p>
        <h2 className="section-title">NOSSOS<br /><em>SERVIÇOS</em></h2>
      </div>
      <div className="servicos-track" ref={trackRef}>
        {SERVICES.map((s, i) => (
          <ServiceCard key={s.title} {...s} cardRef={(el) => { cardRefs.current[i] = el; }} />
        ))}
      </div>
    </section>
  );
}
