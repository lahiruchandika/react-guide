/**
 * useFetch - loads async data and tracks { data, error, loading }.
 * ----------------------------------------------------------------------------
 * Usage A - a URL (uses the real fetch API):
 *   const { data, error, loading, refetch } =
 *     useFetch('https://jsonplaceholder.typicode.com/users');
 *
 * Usage B - any async function that receives an AbortSignal, plus a deps
 * array (like useEffect) that says WHEN to fetch again:
 *   const { data } = useFetch(
 *     (signal) => mockApi.getProducts({ category, signal }),
 *     [category],
 *   );
 *
 * What it handles for you:
 *   - loading / error / data states
 *   - cancelling the old request when deps change or the component unmounts
 *     (AbortController) -> no race conditions, no stale data
 *   - a refetch() function for "Retry" / "Refresh" buttons
 * ----------------------------------------------------------------------------
 */
import { useCallback, useEffect, useRef, useState } from 'react';

/** Turns a URL into data: fetch -> check status -> parse JSON. */
function fetchJson(url, signal) {
  return fetch(url, { signal }).then((res) => {
    // fetch() does NOT reject on 404/500, so we check res.ok ourselves.
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
    return res.json();
  });
}

export function useFetch(source, deps = []) {
  // 1. One state object for the three things every request needs.
  const [state, setState] = useState({ data: null, error: null, loading: true });

  // 2. Bumping this number re-runs the effect -> that's how refetch() works.
  const [reloadKey, setReloadKey] = useState(0);
  const refetch = useCallback(() => setReloadKey((k) => k + 1), []);

  // 3. Keep the latest `source` in a ref. The effect reads it from there, so an
  //    inline arrow function (a new one every render) doesn't cause endless
  //    fetching. Only `deps` decide when to fetch again.
  const sourceRef = useRef(source);
  useEffect(() => {
    sourceRef.current = source;
  });

  // For a URL string, the URL itself is a dependency.
  const urlKey = typeof source === 'string' ? source : null;

  useEffect(() => {
    // 4. A fresh AbortController for THIS request.
    const controller = new AbortController();
    const current = sourceRef.current;

    // Keep the old data visible while reloading (nicer than an empty flash).
    setState((s) => ({ ...s, loading: true, error: null }));

    const request =
      typeof current === 'string' ? fetchJson(current, controller.signal) : current(controller.signal);

    request
      .then((data) => setState({ data, error: null, loading: false }))
      .catch((error) => {
        // 5. An aborted request is not an error - we cancelled it on purpose.
        if (error.name === 'AbortError') return;
        setState((s) => ({ ...s, error, loading: false }));
      });

    // 6. Cleanup: runs when deps change (before the next fetch) or on unmount.
    //    Aborting means a slow, outdated response can never overwrite newer data.
    return () => controller.abort();
    // The caller provides `deps`, so the linter can't check them statically.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlKey, reloadKey, ...deps]);

  return { ...state, refetch };
}
