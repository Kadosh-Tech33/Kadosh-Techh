import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    let rx = 0, ry = 0, dx = 0, dy = 0;
    let frame;

    const onMove = (e) => {
      dx = e.clientX; dy = e.clientY;
      dot.style.left = dx + 'px';
      dot.style.top = dy + 'px';
    };
    const lerp = (a, b, t) => a + (b - a) * t;
    const loop = () => {
      rx = lerp(rx, dx, 0.14);
      ry = lerp(ry, dy, 0.14);
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
      frame = requestAnimationFrame(loop);
    };

    const onEnter = () => ring.classList.add('big');
    const onLeave = () => ring.classList.remove('big');
    const attachHoverTargets = () => {
      const targets = document.querySelectorAll(
        'a,button,.skill-tag,.contato-item,.social-btn,.work-item,.bento-card',
      );
      targets.forEach((el) => {
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
      });
      return targets;
    };

    const onDocLeave = () => { dot.style.opacity = '0'; ring.style.opacity = '0'; };
    const onDocEnter = () => { dot.style.opacity = '1'; ring.style.opacity = '1'; };

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onDocLeave);
    document.addEventListener('mouseenter', onDocEnter);
    frame = requestAnimationFrame(loop);

    // Hover targets are rendered by other components after mount; observe DOM for new ones.
    let targets = attachHoverTargets();
    const mo = new MutationObserver(() => {
      targets.forEach((el) => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
      });
      targets = attachHoverTargets();
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onDocLeave);
      document.removeEventListener('mouseenter', onDocEnter);
      targets.forEach((el) => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
      });
      mo.disconnect();
    };
  }, []);

  return (
    <>
      <div id="cursor-dot" ref={dotRef}></div>
      <div id="cursor-ring" ref={ringRef}></div>
    </>
  );
}
