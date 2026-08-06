import { prefersReducedMotion } from '../lib/smoothScroll.js';
import PixelSnow from './PixelSnow/PixelSnow.jsx';
import './GlobalSnowBackground.css';

// One shared fixed layer sits behind every post-Hero section (Work,
// Contato — Sobre's own opaque light background naturally covers it during
// its own scroll range, no extra logic needed for that). Work/Contato set
// their own section background to `transparent` so this shows through.
//
// The navy gradient div is always mounted (cheap, plain CSS) so those
// sections never show through to nothing. The WebGL snow canvas inside it
// is the expensive part, so it's gated separately via the `active` prop —
// flipped by Hero itself the instant its scroll-pin releases (see
// Hero.jsx's onLeave/onEnterBack), not by an IntersectionObserver here.
// Hero stays pinned covering the full viewport for a whole extra scroll
// range after it's visually "done", so gating on "no longer intersecting
// `.hero` at all" mounted the canvas a full viewport-height too late,
// leaving a stretch of flat, dot-less navy at the top of Stats.
export default function GlobalSnowBackground({ active }) {
  const showSnow = active && !prefersReducedMotion();

  return (
    <div className="global-snow" aria-hidden="true">
      {showSnow && (
        <PixelSnow
          color="#93c5fd"
          density={0.2}
          speed={0.7}
          brightness={0.85}
          flakeSize={0.012}
          minFlakeSize={1.1}
          pixelResolution={220}
          variant="round"
        />
      )}
    </div>
  );
}
