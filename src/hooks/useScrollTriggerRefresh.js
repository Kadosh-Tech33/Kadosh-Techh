import { useEffect } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Fonts and images can reflow the page after mount (e.g. the work-carousel
// thumbnails, the Bebas Neue webfont swapping in), which shifts the
// absolute position of scroll-triggered elements further down the page
// (like the #footer rocket-exit). Refresh once things settle so every
// ScrollTrigger targets the right scroll range.
export default function useScrollTriggerRefresh() {
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();

    document.fonts?.ready?.then(refresh);
    window.addEventListener('load', refresh);

    const imgs = Array.from(document.images);
    imgs.forEach((img) => {
      if (!img.complete) img.addEventListener('load', refresh, { once: true });
    });

    return () => {
      window.removeEventListener('load', refresh);
      imgs.forEach((img) => img.removeEventListener('load', refresh));
    };
  }, []);
}
