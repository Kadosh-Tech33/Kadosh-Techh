import { useEffect } from 'react';
import { startSmoothScroll, stopSmoothScroll } from '../lib/smoothScroll.js';

export default function useSmoothScroll() {
  useEffect(() => {
    startSmoothScroll();
    return () => stopSmoothScroll();
  }, []);
}
