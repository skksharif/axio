import { useState, useEffect } from 'react';
import { breakpoints } from '@shared/theme/breakpoints';

/**
 * Returns breakpoint-aware booleans.
 * Subscribes to window resize — safe to use in multiple components (single listener per hook instance).
 */
export function useResponsive() {
  const [width, setWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1280
  );

  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handler, { passive: true });
    return () => window.removeEventListener('resize', handler);
  }, []);

  return {
    width,
    isXs:     width <= breakpoints.xs,
    isSm:     width <= breakpoints.sm,
    isMobile: width <= breakpoints.md,
    isTablet: width <= breakpoints.xl,
    isDesktop: width > breakpoints.xl,
  };
}
