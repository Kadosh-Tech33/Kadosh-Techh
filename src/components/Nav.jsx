import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { prefersReducedMotion } from '../lib/smoothScroll.js';

function scrollToId(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

// Adapted from React Bits' FlowingMenu: on hover, a solid fill slides in
// from whichever edge (top/bottom) is closest to the cursor and reveals a
// contrasting label — the original is a full-screen vertical menu item,
// this reproduces the same "closest edge" wipe at header-link scale.
function FlowingNavLink({ href, children }) {
  const wrapRef = useRef(null);
  const fillRef = useRef(null);

  // The resting position has to be established by GSAP itself, not CSS.
  // getComputedStyle resolves a CSS `transform: translateY(101%)` to a
  // plain pixel matrix, and if that's the first transform GSAP ever reads
  // on this element, it caches that resolved pixel offset as its own
  // internal `y`, separate from `yPercent`. Every later `gsap.set/to`
  // touching `yPercent` then composes on top of that leftover pixel `y`
  // instead of replacing it, so the fill stays permanently offset out of
  // view no matter what `yPercent` animates to. Setting it here instead
  // means GSAP's cache starts clean.
  useLayoutEffect(() => {
    gsap.set(fillRef.current, { yPercent: 101 });
  }, []);

  const closestEdge = (e) => {
    const rect = wrapRef.current.getBoundingClientRect();
    const relY = e.clientY - rect.top;
    return relY < rect.height / 2 ? 'top' : 'bottom';
  };

  const onEnter = (e) => {
    if (prefersReducedMotion()) return;
    const edge = closestEdge(e);
    gsap.killTweensOf(fillRef.current);
    gsap.set(fillRef.current, { yPercent: edge === 'top' ? -101 : 101 });
    gsap.to(fillRef.current, { yPercent: 0, duration: 0.5, ease: 'expo.out' });
  };

  const onLeave = (e) => {
    if (prefersReducedMotion()) return;
    const edge = closestEdge(e);
    gsap.killTweensOf(fillRef.current);
    gsap.to(fillRef.current, { yPercent: edge === 'top' ? -101 : 101, duration: 0.5, ease: 'expo.out' });
  };

  return (
    <a href={href} className="nav-flow-link" ref={wrapRef} onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <span className="nav-flow-label">{children}</span>
      <span className="nav-flow-fill" ref={fillRef} aria-hidden="true">
        <span className="nav-flow-fill-label">{children}</span>
      </span>
    </a>
  );
}

export default function Nav() {
  return (
    <nav>
      <a className="nav-logo" href="#">
        <div className="nav-logo-icon">
          <svg viewBox="0 0 24 24">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
        </div>
        <span className="nav-logo-text">KADOSH<span>TECH</span></span>
      </a>
      <ul className="nav-links">
        <li><FlowingNavLink href="#servicos">Serviços</FlowingNavLink></li>
        <li><FlowingNavLink href="#work">Projetos</FlowingNavLink></li>
        <li><FlowingNavLink href="#sobre">Sobre</FlowingNavLink></li>
        <li><FlowingNavLink href="#contato">Contato</FlowingNavLink></li>
      </ul>
      <button className="nav-cta" onClick={() => scrollToId('contato')}>Fale Comigo</button>
    </nav>
  );
}
