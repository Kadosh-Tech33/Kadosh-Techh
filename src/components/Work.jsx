import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { prefersReducedMotion } from '../lib/smoothScroll.js';

const PROJECTS = [
  { href: 'https://kadosh-tech33.github.io/GrowUp/', img: '/img/grow up fundo.jpg', title: 'GrowUp' },
  { href: 'https://kadosh-tech33.github.io/Ruah/', img: '/img/chat.img.png', title: 'Ruah Streetwear' },
  { href: 'https://kadosh-tech33.github.io/Sindehot/', img: '/img/sindehot.png', title: 'Sindehot' },
  { href: 'https://best-cookiess.vercel.app/?splash ', img: '/img/best1.jpg', title: 'Best Cookies' },
  { href: 'https://kadosh-tech33.github.io/Restautante_Santa-Paula/', img: '/img/fundo.png', title: 'Restaurante Santa Paula' },
  { href: 'https://kadosh-tech33.github.io/Serraleria-ELLA/', img: '/img/favicon.png', title: 'Serraleria ELLA' },
  { href: 'https://kadosh-tech33.github.io/Cookies_Maromba/', img: '/img/fundo_hero.jpeg', title: 'Cookies Maromba' },
  { href: 'https://kadosh-tech33.github.io/Mais-Docado/', img: '/img/favicon2.png', title: 'Mais Doçado' },
  { href: 'https://kadosh-tech33.github.io/acerola/', img: '/img/logoofc.jpg', title: 'Casa da Acerola' },
  { href: 'https://tres4locadora.com.br/', img: '/img/ChatGPT Image 20 de fev. de 2026, 17_25_01.png', title: 'Tres4 Locadora' },
  // `imgPosition` is CSS `object-position` on the <img> — the card crops
  // to a fixed 240px-tall window (see `.project-img` in index.css), so a
  // portrait photo gets the vertical middle by default and can clip the
  // face. Lower the % to show more of the top of the photo (0% = top edge
  // visible, 50% = default center, 100% = bottom edge visible).
  { href: 'https://kadosh-tech33.github.io/Personal-Victor-Omodei/', img: '/img/ultima.png', title: 'Treinador Victor Omodei', imgPosition: 'center 10%' },
  { href: 'https://kadosh-tech33.github.io/Dr_Giovana/', img: '/img/68d4b9d8-d861-4ebe-bf67-ec3354d50140.jpg', title: 'Dra Giovana', imgPosition: 'center 10%' },
];

function getIsMobile() {
  return typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches;
}

export default function Work() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const cardRefs = useRef([]);
  const [isMobile] = useState(getIsMobile);
  const [reduced] = useState(prefersReducedMotion);
  const pinned = !isMobile && !reduced;
  const sectionClass = isMobile ? 'work-carousel' : (pinned ? 'work-pin' : 'work-stack');

  // Desktop/tablet: pin the section and translate the track horizontally,
  // tied to the page's own vertical scroll — same mechanism as Servicos.
  // UNTOUCHED by the mobile carousel below.
  //
  // Mobile: no GSAP at all — a plain native `overflow-x:auto` + scroll-snap
  // carousel (see `.work-carousel` in index.css), touch-driven and fully
  // decoupled from the page's vertical scroll. Nothing here gates the
  // cards behind a scroll-trigger reveal either, so there's no risk of one
  // firing oddly for elements that are laid out horizontally instead of
  // stacked — they're just visible immediately at their natural opacity.
  //
  // Desktop + reduced motion: falls back to `.work-stack`, a plain vertical
  // list with no scroll-linked hide/reveal — same as before.
  useGSAP(() => {
    const track = trackRef.current;
    if (!track || isMobile) return;

    // Reduced motion: no pin, no scroll-linked hide/reveal at all — cards
    // just sit at their natural, always-visible opacity. Nothing here may
    // ever leave content gated behind a trigger that respects the user's
    // "please don't animate" preference.
    if (reduced) return;

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
      gsap.fromTo(card, { scale: 0.9, opacity: 0.4, y: 20 }, {
        scale: 1,
        opacity: 1,
        y: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: card,
          containerAnimation: horizontalTween,
          // Same fix as Servicos: the last card never travels far past its
          // resting spot, so `end` has to sit at a point every card —
          // including the last — actually reaches.
          start: 'left 98%',
          end: 'left 72%',
          scrub: true,
        },
      });
    });
  }, { scope: sectionRef, dependencies: [pinned, isMobile] });

  return (
    <section id="work" className={sectionClass} ref={sectionRef}>
      <div className="work-heading reveal">
        <p className="section-label">Portfólio</p>
        <h2 className="section-title">TRABALHOS<br /><em>SELECIONADOS</em></h2>
      </div>

      <div className="work-track" ref={trackRef}>
        {PROJECTS.map((p, i) => (
          <a
            key={p.title}
            href={p.href}
            className="work-item"
            target="_blank"
            rel="noopener"
            ref={(el) => { cardRefs.current[i] = el; }}
          >
            <span className="work-item-media">
              <img src={p.img} className="project-img" alt={p.title} draggable="false" style={p.imgPosition ? { objectPosition: p.imgPosition } : undefined} />
              <span className="work-item-overlay">
                <svg viewBox="0 0 24 24"><line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" /></svg>
              </span>
            </span>
            <h3 className="work-title">{p.title}</h3>
          </a>
        ))}
      </div>
    </section>
  );
}
