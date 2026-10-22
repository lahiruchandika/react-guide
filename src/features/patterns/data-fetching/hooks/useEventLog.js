/**
 * useEventLog - a tiny lesson-only hook that collects log lines for <LogPanel />.
 *
 *   const { entries, log, clear } = useEventLog();
 *   log('request user 2', 'start');   // types: start | success | abort | error | stale
 *
 * It lives inside this feature folder (not src/hooks) because only the
 * data-fetching demos need it - "keep things close to where they are used".
 */
import { useCallback, useState } from 'react';

let nextId = 0; // module-level counter for unique keys

export function useEventLog(max = 8) {
  const [entries, setEntries] = useState([]);

  // useCallback = stable function, so it can safely be an effect dependency.
  const log = useCallback(
    (text, type = 'start') => {
      const entry = { id: nextId++, time: new Date().toLocaleTimeString(), text, type };
      setEntries((prev) => [entry, ...prev].slice(0, max)); // newest first, keep `max`
    },
    [max],
  );

  const clear = useCallback(() => setEntries([]), []);

  return { entries, log, clear };
}
