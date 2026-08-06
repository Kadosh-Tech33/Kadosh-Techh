import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

let lenis = null;
let tickerFn = null;
let refCount = 0;

// Lenis drives the actual scroll physics; GSAP's ticker drives Lenis's
// rAF loop so both stay on the same frame clock, and ScrollTrigger is told
// to recompute on every Lenis scroll tick (not the native scroll event,
// which Lenis intercepts) so pins/scrubs track the smoothed position.
export function startSmoothScroll() {
  refCount += 1;
  if (lenis || prefersReducedMotion()) return lenis;

  lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    syncTouch: false,
  });

  lenis.on('scroll', ScrollTrigger.update);

  tickerFn = (time) => lenis.raf(time * 1000);
  gsap.ticker.add(tickerFn);
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

export function stopSmoothScroll() {
  refCount = Math.max(0, refCount - 1);
  if (refCount > 0 || !lenis) return;

  if (tickerFn) gsap.ticker.remove(tickerFn);
  lenis.destroy();
  lenis = null;
  tickerFn = null;
}

export function getLenis() {
  return lenis;
}
