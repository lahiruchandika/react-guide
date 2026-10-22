/**
 * blockFor(ms) - freezes the main thread for `ms` milliseconds.
 *
 * ONLY for teaching! It simulates "slow work" (a heavy measurement or
 * calculation) so that the difference between useEffect and useLayoutEffect
 * becomes visible to the human eye. Never do this in a real app.
 */
export function blockFor(ms) {
  const end = performance.now() + ms;
  while (performance.now() < end) {
    // busy wait: do nothing, just burn time
  }
}
