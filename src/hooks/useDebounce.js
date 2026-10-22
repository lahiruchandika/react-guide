/**
 * useDebounce - returns a value that only updates after it STOPS changing
 * for `delay` milliseconds.
 *
 * Usage (search box):
 *   const [query, setQuery] = useState('');
 *   const debouncedQuery = useDebounce(query, 400);
 *   useEffect(() => { search(debouncedQuery); }, [debouncedQuery]);
 *
 * While the user types "react" quickly, `query` changes 5 times but
 * `debouncedQuery` changes only once -> one API call instead of five.
 */
import { useEffect, useState } from 'react';

export function useDebounce(value, delay = 500) {
  // 1. Start with the current value.
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // 2. Every time `value` changes, schedule an update for later...
    const timer = setTimeout(() => setDebouncedValue(value), delay);

    // 3. ...but if `value` changes again before the timer fires, the cleanup
    //    cancels the old timer. Only the LAST change survives.
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
