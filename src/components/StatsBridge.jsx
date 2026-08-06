import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';

const STATS = [
  { value: 50, suffix: '+', label: 'Projetos Entregues' },
  { value: 5, suffix: '+', label: 'Anos de Experiência' },
  { value: 100, suffix: '%', label: 'Satisfação dos Clientes' },
];

export default function StatsBridge() {
  const sectionRef = useRef(null);
  const numRefs = useRef([]);

  useGSAP(() => {
    STATS.forEach((stat, i) => {
      const el = numRefs.current[i];
      if (!el) return;
      const counter = { val: 0 };
      gsap.to(counter, {
        val: stat.value,
        duration: 1.6,
        ease: 'power2.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
        onUpdate: () => { el.textContent = Math.round(counter.val); },
      });
    });
  }, { scope: sectionRef });

  return (
    <section className="stats-bridge" ref={sectionRef}>
      <div className="stats-bridge-inner">
        {STATS.map((stat, i) => (
          <div className="stat-item" key={stat.label}>
            <div className="stat-num">
              <span ref={(el) => { numRefs.current[i] = el; }} style={{ color: 'var(--white)' }}>0</span>
              <span>{stat.suffix}</span>
            </div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
