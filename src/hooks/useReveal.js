import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Orchestrates section entrances: elements sharing a scroll trigger batch
// reveal together with a stagger (instead of firing independently), so
// each section feels like one coordinated beat instead of scattered pops.
export default function useReveal(scope) {
  useEffect(() => {
    const root = scope?.current ?? document;
    const els = Array.from(root.querySelectorAll('.reveal'));
    if (!els.length) return undefined;

    const timers = [];
    const batches = ScrollTrigger.batch(els, {
      start: 'top 88%',
      once: true,
      onEnter: (batchEls) => {
        batchEls.forEach((el, i) => {
          timers.push(setTimeout(() => el.classList.add('visible'), i * 90));
        });
      },
    });

    return () => {
      timers.forEach(clearTimeout);
      batches.forEach((b) => b.kill());
    };
  }, [scope]);
}
