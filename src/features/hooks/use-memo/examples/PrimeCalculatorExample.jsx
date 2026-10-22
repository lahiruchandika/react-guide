/**
 * PrimeCalculatorExample.jsx
 * ----------------------------------------------------------------------------
 * The basic useMemo idea:
 *
 *   const result = useMemo(() => expensiveCalc(limit), [limit]);
 *
 * - React runs the function on the first render and REMEMBERS the result.
 * - On later renders it returns the cached result, unless `limit` changed.
 *
 * Try it: move the slider (recalculates, see the new time stamp) and then click
 * "Toggle card theme" or "+1 like" (component re-renders, but the time stamp and
 * duration stay the same - the expensive work was skipped).
 * ----------------------------------------------------------------------------
 */
import { useMemo, useState } from 'react';
import { Heart, Moon, Sun } from 'lucide-react';
import { Badge, Button, RenderCounter } from '@/components/ui';
import { countPrimes, timeStamp } from '../utils/products';

export default function PrimeCalculatorExample() {
  // State that the calculation DEPENDS on
  const [limit, setLimit] = useState(200000);

  // State that has NOTHING to do with the calculation
  const [darkCard, setDarkCard] = useState(false);
  const [likes, setLikes] = useState(0);

  // 1. useMemo caches the return value of the function.
  // 2. The dependency array [limit] says: "only recompute when limit changes".
  const result = useMemo(() => {
    const start = performance.now();
    const primes = countPrimes(limit); // the expensive part
    return {
      ...primes,
      ms: (performance.now() - start).toFixed(1), // how long it took
      computedAt: timeStamp(), // when it ran
    };
  }, [limit]);

  return (
    <div className={`um-prime-card ${darkCard ? 'is-dark' : ''}`}>
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <strong>Prime number calculator</strong>
        <RenderCounter />
      </div>

      {/* Changing the slider changes a dependency -> recalculation */}
      <label className="stack" style={{ gap: 4 }}>
        <span className="small">
          Count primes up to <b>{limit.toLocaleString()}</b>
        </span>
        <input
          type="range"
          min={50000}
          max={600000}
          step={50000}
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
        />
      </label>

      <div className="grid-3">
        <div className="um-stat">
          <span className="um-stat-label">Primes found</span>
          <span className="um-stat-value">{result.count.toLocaleString()}</span>
        </div>
        <div className="um-stat">
          <span className="um-stat-label">Calculation took</span>
          <span className="um-stat-value">{result.ms} ms</span>
        </div>
        <div className="um-stat">
          <span className="um-stat-label">Last computed at</span>
          <span className="um-stat-value um-mono">{result.computedAt}</span>
        </div>
      </div>

      {/* These buttons cause re-renders, but `limit` is unchanged -> cached value is used */}
      <div className="row">
        <Button variant="secondary" icon={darkCard ? <Sun size={16} /> : <Moon size={16} />} onClick={() => setDarkCard((d) => !d)}>
          Toggle card theme
        </Button>
        <Button variant="secondary" icon={<Heart size={16} />} onClick={() => setLikes((n) => n + 1)}>
          +1 like ({likes})
        </Button>
        <Badge tone="info">Unrelated clicks re-render, but reuse the cached result</Badge>
      </div>
    </div>
  );
}
