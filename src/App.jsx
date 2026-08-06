import { useEffect, useRef, useState } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useReveal from './hooks/useReveal.js';
import useScrollTriggerRefresh from './hooks/useScrollTriggerRefresh.js';
import useSmoothScroll from './hooks/useSmoothScroll.js';
import CustomCursor from './components/CustomCursor.jsx';
import GlobalSnowBackground from './components/GlobalSnowBackground.jsx';
import Preloader from './components/Preloader.jsx';
import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import StatsBridge from './components/StatsBridge.jsx';
import Servicos from './components/Servicos.jsx';
import Work from './components/Work.jsx';
import Sobre from './components/Sobre.jsx';
import Contato from './components/Contato.jsx';
import Footer from './components/Footer.jsx';

// Safety net: if the Hero's WebGL scene never calls back (e.g. WebGL
// unavailable, a dropped context, a slow/failed asset load), the preloader
// must not hold the app hostage forever.
const HERO_READY_TIMEOUT_MS = 4000;

export default function App() {
  const appRef = useRef(null);
  const [heroReady, setHeroReady] = useState(false);
  const [preloaderDone, setPreloaderDone] = useState(false);
  const [heroPast, setHeroPast] = useState(false);

  useReveal(appRef);
  useScrollTriggerRefresh();
  useSmoothScroll();

  useEffect(() => {
    const t = setTimeout(() => setHeroReady(true), HERO_READY_TIMEOUT_MS);
    return () => clearTimeout(t);
  }, []);

  const handlePreloaderDone = () => {
    setPreloaderDone(true);
    // Double rAF: wait for React to actually commit the preloader's removal
    // and the browser to paint that frame before measuring — refreshing
    // synchronously here would still see the pre-removal DOM.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => ScrollTrigger.refresh());
    });
  };

  return (
    <div ref={appRef}>
      {!preloaderDone && <Preloader ready={heroReady} onDone={handlePreloaderDone} />}

      <CustomCursor />
      <GlobalSnowBackground active={heroPast} />

      <Nav />
      <Hero onReady={() => setHeroReady(true)} onPastChange={setHeroPast} />
      <div className="hero-bleed"></div>
      <StatsBridge />
      <Servicos />
      <Work />
      <Sobre />
      <Contato />
      <Footer />
    </div>
  );
}
