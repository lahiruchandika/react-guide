/**
 * useToggle - the simplest useful custom hook: a boolean you can flip.
 *
 * Usage:
 *   const [isOpen, toggleOpen, setIsOpen] = useToggle(false);
 *   <button onClick={toggleOpen}>Toggle</button>
 *   <button onClick={() => setIsOpen(false)}>Close</button>
 *
 * Why a hook? "open/close" logic appears everywhere (modals, menus, accordions,
 * password visibility...). Writing it once keeps components short and readable.
 */
import { useCallback, useState } from 'react';

export function useToggle(initialValue = false) {
  // 1. Normal state - every component that calls useToggle gets ITS OWN copy.
  const [value, setValue] = useState(Boolean(initialValue));

  // 2. useCallback keeps the same function between renders, so it is safe to
  //    pass to memoized children or use in effect dependencies.
  //    The updater form (v => !v) always uses the latest value.
  const toggle = useCallback(() => setValue((v) => !v), []);

  // 3. Return an array (like useState) so callers can name things freely.
  return [value, toggle, setValue];
}
