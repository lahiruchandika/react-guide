/**
 * UseDebounceExample - a product search that waits until you stop typing.
 * ----------------------------------------------------------------------------
 * Hooks used:
 *   useDebounce(value, delay)  src/hooks/useDebounce.js
 *   useFetch(fetcher, deps)    src/hooks/useFetch.js
 *
 * Type "camera" quickly and compare the two counters:
 *   - keystrokes  = how many requests you'd send WITHOUT debouncing
 *   - searches    = how many requests are actually sent
 * Custom hooks compose: useFetch re-runs only when the DEBOUNCED value changes.
 * ----------------------------------------------------------------------------
 */
import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { Badge, Input, Spinner } from '@/components/ui';
import { useDebounce, useFetch } from '@/hooks';
import { mockApi } from '@/services/mockApi';

export default function UseDebounceExample() {
  // 1. The raw input value - changes on EVERY keystroke.
  const [query, setQuery] = useState('');
  const [delay, setDelay] = useState(500);
  const [keystrokes, setKeystrokes] = useState(0);
  const [searches, setSearches] = useState([]); // log of searches really sent

  // 2. The debounced value - changes only after `delay` ms of no typing.
  const debouncedQuery = useDebounce(query, delay);

  // 3. Fetch products whenever the DEBOUNCED query changes (not on each key).
  const { data: products, loading } = useFetch(
    (signal) => mockApi.getProducts({ search: debouncedQuery, signal, delay: 350 }),
    [debouncedQuery],
  );

  // 4. Record each search in a log (skip duplicates, e.g. StrictMode's double run).
  useEffect(() => {
    setSearches((log) =>
      log.length > 0 && log[log.length - 1] === debouncedQuery ? log : [...log, debouncedQuery],
    );
  }, [debouncedQuery]);

  const handleChange = (e) => {
    setQuery(e.target.value);
    setKeystrokes((k) => k + 1);
  };

  return (
    <div className="stack">
      <div className="ch-search-bar">
        <Search size={16} className="muted" />
        <Input placeholder="Search products, e.g. camera" value={query} onChange={handleChange} aria-label="Search products" />
        {loading && <Spinner size={18} />}
      </div>

      <label className="row small">
        Debounce delay: <strong>{delay}ms</strong>
        <input type="range" min="100" max="1500" step="100" value={delay} onChange={(e) => setDelay(Number(e.target.value))} />
      </label>

      <div className="grid-3">
        <div className="box">
          <span className="box-label">query (instant)</span>
          <div className="ch-mono">&quot;{query}&quot;</div>
        </div>
        <div className="box">
          <span className="box-label">debouncedQuery</span>
          <div className="ch-mono">&quot;{debouncedQuery}&quot;</div>
        </div>
        <div className="box">
          <span className="box-label">requests</span>
          <div className="row">
            <Badge tone="danger">{keystrokes} keystrokes</Badge>
            <Badge tone="success">{searches.length} searches</Badge>
          </div>
        </div>
      </div>

      {/* Results - dimmed while a new search is loading */}
      <div className={`ch-products ${loading ? 'is-loading' : ''}`}>
        {products?.length === 0 && <p className="muted">No products match &quot;{debouncedQuery}&quot;.</p>}
        {products?.map((p) => (
          <div key={p.id} className="ch-product">
            <span className="ch-product-emoji" aria-hidden="true">{p.emoji}</span>
            <span className="ch-product-name">{p.name}</span>
            <span className="muted small">${p.price}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
