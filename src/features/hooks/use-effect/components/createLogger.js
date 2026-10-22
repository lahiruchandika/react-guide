/**
 * createLogger - a tiny helper store that the useEffect demos log into.
 * ----------------------------------------------------------------------------
 * (This is a helper for the lesson, not the main topic.)
 *
 * Why not just keep the log in React state?
 *   If an effect called setLogs(...) on EVERY render, that setState would cause
 *   another render, which runs the effect again, which calls setLogs again...
 *   an infinite loop! So the log lives OUTSIDE React, and only the <LogPanel>
 *   subscribes to it (with useSyncExternalStore). Writing a log entry
 *   re-renders the panel only - never the component being observed.
 *
 *   const logger = createLogger();
 *   logger.log('effect ran', 'effect');   // types: 'effect' | 'cleanup' | 'render' | 'info'
 *   logger.clear();
 * ----------------------------------------------------------------------------
 */
export function createLogger(maxEntries = 40) {
  let entries = []; // replaced (never mutated) on each change, so React sees a new snapshot
  let nextId = 1;
  const listeners = new Set();

  const emit = () => listeners.forEach((listener) => listener());

  return {
    log(message, type = 'info') {
      const time = new Date().toLocaleTimeString([], { hour12: false });
      entries = [{ id: nextId++, message, type, time }, ...entries].slice(0, maxEntries);
      emit();
    },
    clear() {
      entries = [];
      emit();
    },
    // The two functions useSyncExternalStore needs:
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener); // unsubscribe
    },
    getSnapshot() {
      return entries;
    },
  };
}
