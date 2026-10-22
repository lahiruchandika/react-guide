/**
 * slowDown(ms) - burns CPU time on purpose to simulate an expensive component.
 *
 * ONLY for teaching! Real apps get slow because of big lists, charts, heavy
 * calculations... Here each list item calls this so that rendering a few
 * hundred items takes a noticeable amount of time.
 */
const MAX_SPINS = 50_000; // safety net: never loop forever if the clock is frozen (e.g. some test browsers)

export function slowDown(ms) {
  const end = performance.now() + ms;
  let spins = 0;
  while (performance.now() < end && spins < MAX_SPINS) {
    spins += 1; // busy wait
  }
}
