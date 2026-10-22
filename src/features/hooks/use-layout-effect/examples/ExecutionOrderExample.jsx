/**
 * ExecutionOrderExample
 * ----------------------------------------------------------------------------
 * When does each hook run? Click "Re-render" and read the log:
 *
 *   1. render              React calls your component function
 *   2. (React updates the DOM)
 *   3. useLayoutEffect     DOM is ready, browser has NOT painted yet
 *   4. useEffect           usually after paint (may be earlier for click updates)
 *   5. next frame          requestAnimationFrame: the browser is about to paint
 *
 * Why is the log written straight into the DOM?  If we stored log lines in
 * state, every log would cause another render and another log... forever.
 * A ref to the <ol> lets us append lines without re-rendering.
 * ----------------------------------------------------------------------------
 */
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { RotateCw, Eraser } from 'lucide-react';
import { Button } from '@/components/ui';

function Probe({ tick, log }) {
  // Timestamp taken while rendering (reading the clock is harmless here)
  const renderedAt = performance.now();

  useLayoutEffect(() => {
    log('render', 'component function ran', renderedAt);
    log('layout', 'useLayoutEffect - DOM updated, not painted yet');

    // Ask the browser to call us right before the next paint
    const frame = requestAnimationFrame(() => log('paint', 'next frame - browser paints'));
    return () => cancelAnimationFrame(frame); // cleanup if we re-render first
  }, [tick, log, renderedAt]);

  useEffect(() => {
    log('effect', 'useEffect - side effects (fetch, timers, subscriptions)');
  }, [tick, log]);

  return (
    <div className="ule-probe">
      Render #<strong>{tick}</strong>
    </div>
  );
}

export default function ExecutionOrderExample() {
  const [tick, setTick] = useState(1);
  const listRef = useRef(null); // the <ol> that holds log lines
  const startRef = useRef(performance.now()); // time origin for "+ms" labels

  // A stable logging function: useCallback with [] returns the SAME function
  // every render, so passing it to <Probe> doesn't re-trigger its effects.
  const log = useCallback((kind, text, at = performance.now()) => {
    const li = document.createElement('li');
    li.className = `ule-log-${kind}`;
    li.textContent = `+${(at - startRef.current).toFixed(1)}ms  ${text}`;
    listRef.current?.append(li);
  }, []);

  const clearLog = () => {
    if (listRef.current) listRef.current.textContent = '';
  };

  const rerender = () => {
    clearLog(); // start each run with an empty log
    startRef.current = performance.now();
    setTick((t) => t + 1);
  };

  return (
    <div className="grid-2">
      {/* The log comes FIRST in the JSX so its ref is attached before <Probe>'s
          layout effect runs (refs/effects run in tree order). CSS "order"
          still shows it in the right column. */}
      <ol ref={listRef} className="ule-log" aria-live="polite" />

      <div className="stack ule-order-controls">
        <Probe tick={tick} log={log} />
        <div className="row">
          <Button icon={<RotateCw size={14} />} onClick={rerender}>
            Re-render
          </Button>
          <Button variant="ghost" icon={<Eraser size={14} />} onClick={clearLog}>
            Clear log
          </Button>
        </div>
        <p className="muted small">
          On first load StrictMode runs effects twice (mount, unmount, mount), so you may see duplicated lines.
        </p>
      </div>
    </div>
  );
}
