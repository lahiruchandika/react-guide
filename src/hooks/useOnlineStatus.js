/**
 * useOnlineStatus - true when the browser has a network connection.
 *
 * Usage:
 *   const isOnline = useOnlineStatus();
 *   return <p>{isOnline ? 'Online' : 'Offline - changes will sync later'}</p>;
 *
 * Uses useSyncExternalStore, the built-in hook made for reading data that
 * lives OUTSIDE React (browser APIs, third-party stores). You give it:
 *   subscribe(callback)  - start listening, return an unsubscribe function
 *   getSnapshot()        - read the current value
 * React re-renders the component whenever the snapshot changes.
 *
 * Try it: DevTools -> Network tab -> throttling -> "Offline".
 */
import { useSyncExternalStore } from 'react';

// Defined OUTSIDE the hook so the same function is reused on every render
// (a new function each render would make React re-subscribe every time).
function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

const getSnapshot = () => navigator.onLine; // value in the browser
const getServerSnapshot = () => true; // value during server rendering (SSR)

export function useOnlineStatus() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
