import { useEffect } from 'react';

export function useSmoothScroll() {
  useEffect(() => {
    const root = document.documentElement;
    const previousBehavior = root.style.scrollBehavior;

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      root.style.scrollBehavior = 'smooth';
    }

    return () => {
      root.style.scrollBehavior = previousBehavior;
    };
  }, []);
}
