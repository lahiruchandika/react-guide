/**
 * lazyWithDelay - React.lazy() plus an artificial delay.
 * ----------------------------------------------------------------------------
 * On localhost every file loads in a few milliseconds, so you would never see
 * a loading state. This helper waits `ms` milliseconds AND downloads the
 * module, then hands the module to React.lazy - simulating a slow network.
 *
 *   const SalesChart = lazyWithDelay(() => import('./SalesChart'), 1500);
 *
 * In a real app you just write:
 *   const SalesChart = lazy(() => import('./SalesChart'));
 * ----------------------------------------------------------------------------
 */
import { lazy } from 'react';

export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function lazyWithDelay(importFn, ms) {
  // lazy() needs a function that returns a Promise of { default: Component }
  return lazy(() => Promise.all([importFn(), delay(ms)]).then(([module]) => module));
}
