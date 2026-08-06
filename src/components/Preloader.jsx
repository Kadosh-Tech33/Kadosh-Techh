import { useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { prefersReducedMotion } from '../lib/smoothScroll.js';
import './Preloader.css';

// Counts up to ~92% on its own for immediate feedback, then holds there
// until `ready` (the Hero's WebGL) actually is — never a fake 100% while
// the scene is still loading, but never stuck forever if it fails either
// (the safety timeout that flips `ready` lives in App.jsx).
export default function Preloader({ ready, onDone }) {
  const rootRef = useRef(null);
  const numRef = useRef(null);
  const barRef = useRef(null);
  const counter = useRef({ val: 0 });
  const holdTweenRef = useRef(null);
  const [exiting, setExiting] = useState(false);

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    holdTweenRef.current = gsap.to(counter.current, {
      val: 92,
      duration: 1,
      ease: 'power2.out',
      onUpdate: () => {
        if (numRef.current) numRef.current.textContent = Math.round(counter.current.val);
        if (barRef.current) barRef.current.style.width = counter.current.val + '%';
      },
    });
  }, { scope: rootRef });

  useEffect(() => {
    if (!ready) return;

    const finish = () => {
      gsap.to(counter.current, {
        val: 100,
        duration: 0.35,
        ease: 'power1.out',
        onUpdate: () => {
          if (numRef.current) numRef.current.textContent = Math.round(counter.current.val);
          if (barRef.current) barRef.current.style.width = counter.current.val + '%';
        },
        onComplete: () => setExiting(true),
      });
    };

    if (prefersReducedMotion()) {
      setExiting(true);
    } else {
      finish();
    }
  }, [ready]);

  useEffect(() => {
    if (!exiting) return;
    const t = setTimeout(() => onDone?.(), 500);
    return () => clearTimeout(t);
  }, [exiting, onDone]);

  return (
    <div ref={rootRef} className={`preloader${exiting ? ' preloader--exit' : ''}`} aria-hidden="true">
      <div className="preloader-inner">
        <div className="preloader-count">
          <span ref={numRef}>0</span>%
        </div>
        <div className="preloader-bar"><div className="preloader-bar-fill" ref={barRef}></div></div>
        <div className="preloader-label">KADOSH TECH</div>
      </div>
    </div>
  );
}
