/**
 * UseFetchHookExample - the same pattern, packed into a reusable custom hook.
 * ----------------------------------------------------------------------------
 * Compare with example 1: no useEffect, no AbortController, no 3 useStates.
 * src/hooks/useFetch.js does all of that for us:
 *
 *   const { data, error, loading, refetch } = useFetch(
 *     (signal) => mockApi.getProducts({ category, signal }),  // what to load
 *     [category],                                              // when to reload
 *   );
 *
 * Switch categories quickly: the previous request is aborted automatically.
 * Old data stays on screen (dimmed) while the new data loads.
 * ----------------------------------------------------------------------------
 */
import { useState } from 'react';
import { RefreshCw, Star } from 'lucide-react';
import { Badge, Button, Callout, Spinner } from '@/components/ui';
import { useFetch } from '@/hooks';
import { mockApi } from '@/services/mockApi';

const CATEGORIES = ['all', 'audio', 'computers', 'wearables', 'cameras'];

export default function UseFetchHookExample() {
  const [category, setCategory] = useState('all');
  const [flaky, setFlaky] = useState(false);

  // 1. ONE line replaces the whole effect from example 1.
  const { data: products, error, loading, refetch } = useFetch(
    (signal) => mockApi.getProducts({ category, signal, failRate: flaky ? 0.5 : 0 }),
    [category, flaky],
  );

  return (
    <div className="stack">
      {/* Category tabs */}
      <div className="df-tabs" role="tablist">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            role="tab"
            aria-selected={cat === category}
            className={cat === category ? 'active' : ''}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="row df-between">
        <label className="row small">
          <input type="checkbox" checked={flaky} onChange={(e) => setFlaky(e.target.checked)} />
          Flaky server (50% failures)
        </label>
        <div className="row">
          {loading && <Spinner size={16} />}
          <Button size="sm" variant="ghost" icon={<RefreshCw size={14} />} onClick={refetch}>Refetch</Button>
        </div>
      </div>

      {/* 2. Error state with Retry -> calls refetch() from the hook */}
      {error && (
        <Callout type="warning" title="Request failed">
          <div className="row">
            <span>{error.message}</span>
            <Button size="sm" onClick={refetch}>Retry</Button>
          </div>
        </Callout>
      )}

      {/* 3. Data state (dimmed while a new request is in flight) */}
      {products && !error && (
        <div className={`df-products ${loading ? 'is-loading' : ''}`}>
          {products.map((p) => (
            <div key={p.id} className="df-product">
              <span className="df-product-emoji" aria-hidden="true">{p.emoji}</span>
              <strong>{p.name}</strong>
              <div className="row df-between">
                <span className="df-price">${p.price}</span>
                <Badge tone="warning"><Star size={11} /> {p.rating}</Badge>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. First load (no data yet) */}
      {!products && loading && <div className="row muted"><Spinner /> Loading products...</div>}
    </div>
  );
}
