/**
 * useLocalStorage - a custom hook that works like useState, but also saves the
 * value in the browser's localStorage so it survives a page refresh.
 *
 * Usage:
 *   const [name, setName] = useLocalStorage('user-name', 'Guest');
 *
 * How it works:
 *   1. On first render, read the saved value (or fall back to initialValue).
 *   2. Whenever the value changes, write it back to localStorage (useEffect).
 *
 * localStorage only stores strings, so we convert with JSON.stringify / JSON.parse.
 */
import { useEffect, useState } from 'react';

export function useLocalStorage(key, initialValue) {
  // Lazy initializer: this function runs only on the FIRST render,
  // so we don't read localStorage again on every re-render.
  const [value, setValue] = useState(() => {
    try {
      const saved = window.localStorage.getItem(key);
      return saved !== null ? JSON.parse(saved) : initialValue;
    } catch {
      // Storage can be blocked (private mode) or contain invalid JSON.
      return initialValue;
    }
  });

  // Save every time `key` or `value` changes.
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore write errors (e.g. storage full or disabled).
    }
  }, [key, value]);

  // Same shape as useState: [currentValue, setterFunction]
  return [value, setValue];
}
