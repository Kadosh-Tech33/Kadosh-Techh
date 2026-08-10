import { useEffect, useMemo, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '../lib/smoothScroll.js';
import Hyperspeed from './Hyperspeed/Hyperspeed.jsx';
import ErrorBoundary from './ErrorBoundary.jsx';

function scrollToId(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

// Kept as a module-level constant (not created inline in JSX) so its
// reference identity never changes — Hyperspeed's effect depends on
// `effectOptions`, and a new object on every render would tear down and
// rebuild the whole WebGL scene each time Hero re-renders.
const HYPERSPEED_OPTIONS = {
  distortion: 'turbulentDistortion',
  length: 400,
  roadWidth: 10,
  islandWidth: 2,
  lanesPerRoad: 4,
  fov: 90,
  fovSpeedUp: 140,
  speedUp: 2,
  carLightsFade: 0.4,
  // Kept modest on purpose: this scene has to build its geometry and
  // compile its shaders synchronously before the first frame paints, and
  // that setup cost scales with these two counts — lower keeps the Hero
  // responsive on slower GPUs instead of leaving a blank canvas for a
  // few extra seconds while it compiles.
  totalSideLightSticks: 16,
  lightPairsPerRoadWay: 28,
  colors: {
    roadColor: 0x0b1220,
    islandColor: 0x0f1a2e,
    background: 0x0b1220,
    shoulderLines: 0xffffff,
    brokenLines: 0xffffff,
    leftCars: [0x2563eb, 0x1d4ed8, 0x3b82f6],
    rightCars: [0x1d4ed8, 0x1e40af, 0x1e293b],
    sticks: 0x2563eb,
  },
};

const HYPERSPEED_OPTIONS_MOBILE = {
  ...HYPERSPEED_OPTIONS,
  totalSideLightSticks: 6,
  lightPairsPerRoadWay: 12,
  carLightsFade: 0.6,
};

// Device-capability tier only — NOT an accessibility signal. 'static' here
// means "too weak for WebGL" (low-end mobile), which is an orthogonal
// concern from prefers-reduced-motion: a reduced-motion user on a capable
// desktop still gets the full Hyperspeed scene, just without the
// scroll-driven pin/warp (see the `reduced` check below). Conflating the
// two used to mean every reduced-motion visitor — including iPhones in Low
// Power Mode, which set this automatically — saw a flat gradient instead of
// the road at all.
function getDeviceTier() {
  if (typeof window === 'undefined') return 'desktop';
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  const lowEnd = navigator.hardwareConcurrency ? navigator.hardwareConcurrency <= 4 : false;
  if (isMobile && lowEnd) return 'static';
  return isMobile ? 'mobile' : 'desktop';
}

export default function Hero({ onReady, onPastChange }) {
  const heroRef = useRef(null);
  const canvasWrapRef = useRef(null);
  const contentRef = useRef(null);
  const badgeRef = useRef(null);
  const titleRef = useRef(null);
  const underlineRef = useRef(null);
  const subRef = useRef(null);
  const actionsRef = useRef(null);
  const scrollCueRef = useRef(null);
  const hyperspeedRef = useRef(null);
  const [tier] = useState(getDeviceTier);
  const [reduced] = useState(prefersReducedMotion);
  const [inView, setInView] = useState(true);

  const effectOptions = useMemo(
    () => (tier === 'mobile' ? HYPERSPEED_OPTIONS_MOBILE : HYPERSPEED_OPTIONS),
    [tier],
  );

  const handleHyperspeedReady = () => onReady?.();

  useEffect(() => {
    // No WebGL to wait for on the static/reduced-motion path — unblock
    // the preloader immediately instead of waiting on a callback that
    // will never fire.
    if (tier === 'static') onReady?.();
  }, [tier, onReady]);

  useGSAP(() => {
    // Tells GlobalSnowBackground when the particle layer can safely take
    // over — synced to this exact scroll pixel instead of an
    // IntersectionObserver on `.hero`, which only fires once the section is
    // *entirely* scrolled past. Because the pin reserves a full extra
    // viewport of scroll room, "entirely past" lags a full viewport height
    // behind the moment the pin actually releases — that gap is what
    // rendered as a stretch of flat, dot-less navy at the top of Stats.
    // `onLeave` fires exactly when the pin ends (and, for the branch below,
    // exactly when the plain in-flow Hero scrolls past the viewport), so
    // the canvas gets mounted (still hidden behind Hero's own opaque
    // background) with time to spin up before it's actually visible.
    //
    // Reduced motion shares this branch with the low-end-device tier: no
    // pin, no scroll-driven speed-up/FOV warp, no exit-fade tween on
    // contentRef/canvasWrapRef below — Hero just behaves like any other
    // in-flow section and scrolls away naturally. Hyperspeed itself (when
    // it's mounted — see the render below, gated on `tier` alone, not on
    // `reduced`) keeps running at its shader's own constant idle rate
    // regardless: `speedUpTarget` only ever moves away from 0 via the warp
    // tween created further down, which this branch never reaches, so the
    // scene reads as a steady, non-accelerating road instead of vanishing.
    if (tier === 'static' || reduced) {
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        onLeave: () => {
          setInView(false);
          onPastChange?.(true);
        },
        onEnterBack: () => {
          setInView(true);
          onPastChange?.(false);
        },
      });
      return;
    }

    const hyperState = { speed: 0, fov: HYPERSPEED_OPTIONS.fov };

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: () => `+=${window.innerHeight}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
        onLeave: () => {
          setInView(false);
          onPastChange?.(true);
        },
        onEnterBack: () => {
          setInView(true);
          onPastChange?.(false);
        },
        // Guards the scroll-cue fade below: ScrollTrigger.refresh() (fired
        // on mount, on font/image load, and again once the preloader hands
        // off) has to briefly un-pin and remeasure this trigger, and can
        // render this scrub timeline at a transient, inaccurate progress
        // while doing so — which, without this guard, was enough to run
        // the scroll-cue's opacity:0 tween to completion and leave it
        // stuck invisible with the page still sitting at scrollY 0 and the
        // user never having scrolled at all. Real `window.scrollY` is a
        // native browser value, untouched by ScrollTrigger's internal
        // recalculation, so gating on it directly sidesteps the glitch.
        onUpdate: (self) => {
          if (!scrollCueRef.current) return;
          const opacity = window.scrollY > 0 ? Math.max(0, 1 - self.progress * 5) : 1;
          gsap.set(scrollCueRef.current, { opacity });
        },
      },
    });

    // 0 → 0.6 of the pin: the road accelerates and the FOV widens (the
    // "warp speed" push). 0.6 → 1: title blurs/scales away and the canvas
    // fades, handing off cleanly to the next section.
    tl.to(hyperState, {
      speed: HYPERSPEED_OPTIONS.speedUp,
      fov: HYPERSPEED_OPTIONS.fovSpeedUp,
      duration: 0.6,
      ease: 'power1.in',
      onUpdate: () => {
        hyperspeedRef.current?.setSpeedUpTarget(hyperState.speed);
        hyperspeedRef.current?.setFovTarget(hyperState.fov);
      },
    }, 0)
      .to(contentRef.current, {
        opacity: 0,
        scale: 0.86,
        y: -50,
        filter: 'blur(14px)',
        duration: 0.4,
        ease: 'power2.in',
      }, 0.6)
      .to(canvasWrapRef.current, {
        opacity: 0,
        duration: 0.4,
        ease: 'power2.in',
      }, 0.6);

    // useGSAP's own context-revert (below) already kills every tween and
    // ScrollTrigger created inside this callback when the component
    // unmounts or `dependencies` change — that's the scoped equivalent of
    // ScrollTrigger.getAll().forEach(kill). A literal global kill-all here
    // would be wrong in a multi-section app: it would also tear down
    // every OTHER already-mounted section's ScrollTriggers whenever this
    // one effect re-runs (e.g. React StrictMode's mount→cleanup→mount).
  }, { scope: heroRef, dependencies: [tier, reduced] });

  useGSAP(() => {
    // Entrance reveal, driven by GSAP (inline styles) rather than a CSS
    // `@keyframes ... forwards` animation. ScrollTrigger.refresh() — called
    // on mount, on font/image load, and again once the preloader hands off
    // — reparents the pinned `.hero` into/out of GSAP's pin-spacer wrapper.
    // Reinserting a node into the document restarts any CSS keyframe
    // animation running on it (even though it's the same node), which is
    // what made the title fade in, then snap back to invisible, then fade
    // in again. Inline styles GSAP sets aren't tied to connectedness, so
    // they survive every reparent untouched — set once, stays put.
    const els = [badgeRef.current, titleRef.current, subRef.current, actionsRef.current, scrollCueRef.current].filter(Boolean);

    if (prefersReducedMotion()) {
      gsap.set(els, { opacity: 1, y: 0 });
      if (underlineRef.current) gsap.set(underlineRef.current, { scaleX: 1 });
      return;
    }

    gsap.set(els, { opacity: 0, y: 28 });
    if (underlineRef.current) gsap.set(underlineRef.current, { scaleX: 0, transformOrigin: 'left center' });

    const tl = gsap.timeline();
    if (badgeRef.current) tl.to(badgeRef.current, { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out' }, 0.5);
    if (titleRef.current) tl.to(titleRef.current, { opacity: 1, y: 0, duration: 0.85, ease: 'expo.out' }, 0.65);
    if (subRef.current) tl.to(subRef.current, { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' }, 0.85);
    if (actionsRef.current) tl.to(actionsRef.current, { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' }, 1.0);
    if (underlineRef.current) tl.to(underlineRef.current, { scaleX: 1, duration: 0.6, ease: 'expo.out' }, 1.4);
    if (scrollCueRef.current) tl.to(scrollCueRef.current, { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' }, 1.5);
  }, { scope: heroRef });

  return (
    <section className="hero hero--dark" ref={heroRef}>
      <div className="hero-canvas-wrap" ref={canvasWrapRef}>
        {tier !== 'static' && inView && (
          <ErrorBoundary
            fallback={<div className="hero-static-bg" aria-hidden="true"></div>}
            onError={handleHyperspeedReady}
          >
            <Hyperspeed ref={hyperspeedRef} effectOptions={effectOptions} onReady={handleHyperspeedReady} />
          </ErrorBoundary>
        )}
        {tier === 'static' && <div className="hero-static-bg" aria-hidden="true"></div>}
      </div>

      <div className="hero-content" ref={contentRef}>
        <div className="hero-badge" ref={badgeRef}><span className="hero-badge-dot"></span>SOFTWARE DEVELOPER &amp; Web Solutions</div>
        <h1 className="hero-title" ref={titleRef}>SOFTWARE<br /><span className="blue-word">DEVELOPER<span className="blue-word-underline" ref={underlineRef}></span></span> &amp;<br />WEB SOLUTIONS</h1>
        <p className="hero-sub" ref={subRef}>Criando sites inovadores, funcionais e amigáveis<br />para soluções digitais.</p>
        <div className="hero-actions" ref={actionsRef}>
          <button className="btn-primary" onClick={() => scrollToId('work')}>Ver Projetos</button>
          <button className="btn-ghost" onClick={() => scrollToId('contato')}>Solicitar Orçamento →</button>
        </div>
      </div>

      <div className="scroll-cue" ref={scrollCueRef}><div className="scroll-track"><div className="scroll-thumb"></div></div>Rolar</div>
    </section>
  );
}
