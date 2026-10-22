/**
 * DeferredSearchExample
 * ----------------------------------------------------------------------------
 * useDeferredValue: the same goal as useTransition, but you defer a VALUE
 * instead of wrapping a state UPDATE. Handy when you don't own the setter
 * (e.g. the value comes from props) or just want less code.
 *
 *   const [query, setQuery] = useState('');        // updates instantly
 *   const deferredQuery = useDeferredValue(query); // "lags behind" during typing
 *   const isStale = query !== deferredQuery;       // true while catching up
 *
 * React first re-renders with the OLD deferredQuery (cheap: the memoized list
 * is skipped), then renders the new value in the background.
 * ----------------------------------------------------------------------------
 */
import { useDeferredValue, useState } from 'react';
import { Search } from 'lucide-react';
import { Badge } from '@/components/ui';
import SlowProductList from '../components/SlowProductList';

export default function DeferredSearchExample() {
  const [query, setQuery] = useState('');

  // 1. A copy of `query` that is allowed to be "behind" while the UI is busy
  const deferredQuery = useDeferredValue(query);

  // 2. When they differ, the list on screen is showing old (stale) results
  const isStale = query !== deferredQuery;

  return (
    <div className="stack">
      <div className="utr-search">
        <Search size={16} className="utr-search-icon" />
        <input
          className="field-input"
          placeholder='Try "smart", "gold mug", "#15"...'
          value={query}
          onChange={(e) => setQuery(e.target.value)} // plain, normal state update
          aria-label="Search products"
        />
      </div>

      <div className="row small">
        <span>
          query: <Badge tone="primary">{query || '""'}</Badge>
        </span>
        <span>
          deferredQuery: <Badge tone={isStale ? 'warning' : 'success'}>{deferredQuery || '""'}</Badge>
        </span>
        {isStale && <span className="muted">updating...</span>}
      </div>

      {/* 3. The list uses the DEFERRED value; stale results are dimmed */}
      <div className={`utr-fade ${isStale ? 'utr-stale' : ''}`}>
        <SlowProductList query={deferredQuery} />
      </div>
    </div>
  );
}
