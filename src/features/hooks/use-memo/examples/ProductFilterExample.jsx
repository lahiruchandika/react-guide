/**
 * ProductFilterExample.jsx
 * ----------------------------------------------------------------------------
 * "Without useMemo" vs "With useMemo", side by side.
 *
 * Both panels filter + sort the SAME 20 000 products with the SAME inputs.
 * The only difference:
 *   - WithoutMemoResults recalculates on EVERY render.
 *   - WithMemoResults    recalculates only when query/category change.
 *
 * Try it: click "Unrelated re-render" a few times. Both render counters go up,
 * but only the left panel's "Computed at" time changes (and the click feels
 * slower, because ~25 ms of work runs on each render).
 * ----------------------------------------------------------------------------
 */
import { useMemo, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import ResultsPanel from '../components/ResultsPanel';
import { CATEGORIES, PRODUCTS, filterProducts, timeStamp } from '../utils/products';

/** Helper: run the slow filter and measure it. */
function runFilter(query, category) {
  const start = performance.now();
  const items = filterProducts(PRODUCTS, query, category);
  return { items, ms: (performance.now() - start).toFixed(1), computedAt: timeStamp() };
}

// ❌ BAD: the expensive work runs every time this component renders.
function WithoutMemoResults({ query, category }) {
  const result = runFilter(query, category); // no caching at all
  return <ResultsPanel title="Without useMemo" tone="danger" total={result.items.length} {...result} />;
}

// ✅ GOOD: the result is cached and reused until a dependency changes.
function WithMemoResults({ query, category }) {
  const result = useMemo(() => runFilter(query, category), [query, category]);
  return <ResultsPanel title="With useMemo" tone="success" total={result.items.length} {...result} />;
}

export default function ProductFilterExample() {
  // Inputs that the filter depends on
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');

  // Unrelated state: changing it re-renders both panels (they are children)
  const [ticks, setTicks] = useState(0);

  return (
    <div className="stack">
      <div className="um-toolbar">
        <Input label="Search products" placeholder="e.g. Nova, Pro, 120..." value={query} onChange={(e) => setQuery(e.target.value)} />

        <label className="field">
          <span className="field-label">Category</span>
          <select className="select" value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>

        <Button variant="secondary" icon={<RefreshCw size={16} />} onClick={() => setTicks((t) => t + 1)}>
          Unrelated re-render ({ticks})
        </Button>
      </div>

      <div className="grid-2">
        <WithoutMemoResults query={query} category={category} />
        <WithMemoResults query={query} category={category} />
      </div>
    </div>
  );
}
