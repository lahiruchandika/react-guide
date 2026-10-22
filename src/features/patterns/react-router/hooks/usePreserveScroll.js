/**
 * usePreserveScroll - keep the scroll position when THIS lesson changes the URL.
 * ----------------------------------------------------------------------------
 * The app layout (src/components/layout/AppLayout.jsx) scrolls to the top on
 * every pathname change - perfect when you open a new lesson. But in this
 * lesson the demos navigate between nested URLs of the SAME page, and jumping
 * to the top every click would be annoying.
 *
 * Trick: child effects run BEFORE parent effects. So when the pathname
 * changes, our effect reads window.scrollY before AppLayout resets it, then
 * restores it on the next animation frame (after AppLayout's scrollTo(0)).
 * ----------------------------------------------------------------------------
 */
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export function usePreserveScroll() {
  const { pathname } = useLocation();
  const previousPath = useRef(pathname);

  useEffect(() => {
    if (previousPath.current === pathname) return; // first render: nothing to restore
    previousPath.current = pathname;

    const y = window.scrollY; // AppLayout has not scrolled to the top yet
    const frame = requestAnimationFrame(() => window.scrollTo({ top: y, behavior: 'instant' }));
    return () => cancelAnimationFrame(frame);
  }, [pathname]);
}
