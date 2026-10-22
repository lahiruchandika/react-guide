/**
 * SearchParamsExample - keep filter state in the URL query string.
 * ----------------------------------------------------------------------------
 *   const [searchParams, setSearchParams] = useSearchParams();
 *   searchParams.get('q')            -> read   ?q=mouse   (string or null)
 *   setSearchParams({ q: 'mouse' })  -> write  (navigates to the new URL)
 *
 * Why put filters in the URL instead of useState?
 *   - Refresh the page -> filters are still there
 *   - Copy the link and send it -> your friend sees the same results
 *   - Back/Forward buttons step through filter changes
 *
 * The URL becomes the "single source of truth": we never copy the params
 * into useState - we derive everything from them on each render.
 * ----------------------------------------------------------------------------
 */
import { useSearchParams } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { Badge, Button } from '@/components/ui';
import { PRODUCTS } from '../data/users';
import AddressBar from '../components/AddressBar';

const CATEGORIES = ['all', 'accessories', 'displays', 'audio'];

export default function SearchParamsExample() {
  const [searchParams, setSearchParams] = useSearchParams();

  // 1. READ: every value comes from the URL (with a default when missing)
  const query = searchParams.get('q') ?? '';
  const category = searchParams.get('category') ?? 'all';
  const sort = searchParams.get('sort') ?? 'name';
  const inStockOnly = searchParams.get('inStock') === 'true'; // params are strings!

  // 2. WRITE: update one key, keep the others. Empty/default values are removed
  //    so the URL stays clean. `replace` avoids one history entry per keystroke.
  const updateParam = (key, value, { replace = false } = {}) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev); // copy - never mutate prev
        if (value === '' || value === 'all' || value === false || (key === 'sort' && value === 'name')) {
          next.delete(key);
        } else {
          next.set(key, String(value));
        }
        return next;
      },
      { replace },
    );
  };

  const clearAll = () => setSearchParams({});

  // 3. DERIVE the visible list from the params (no extra state needed)
  const results = PRODUCTS.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
    .filter((p) => category === 'all' || p.category === category)
    .filter((p) => !inStockOnly || p.inStock)
    .sort((a, b) => (sort === 'price' ? a.price - b.price : a.name.localeCompare(b.name)));

  return (
    <div className="stack">
      <AddressBar />

      <div className="rr-filters">
        <label className="rr-search">
          <Search size={15} className="muted" />
          <input
            value={query}
            onChange={(e) => updateParam('q', e.target.value, { replace: true })}
            placeholder="Search products..."
            aria-label="Search products"
          />
        </label>

        <select value={category} onChange={(e) => updateParam('category', e.target.value)} className="rr-select" aria-label="Category">
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c === 'all' ? 'All categories' : c}</option>
          ))}
        </select>

        <select value={sort} onChange={(e) => updateParam('sort', e.target.value)} className="rr-select" aria-label="Sort by">
          <option value="name">Sort: name</option>
          <option value="price">Sort: price</option>
        </select>

        <label className="row small">
          <input type="checkbox" checked={inStockOnly} onChange={(e) => updateParam('inStock', e.target.checked)} />
          In stock only
        </label>

        <Button size="sm" variant="ghost" icon={<X />} onClick={clearAll} disabled={searchParams.toString() === ''}>
          Clear
        </Button>
      </div>

      <div className="rr-products">
        {results.map((p) => (
          <div key={p.id} className="rr-product">
            <span className="small muted">{p.category}</span>
            <strong>{p.name}</strong>
            <div className="row rr-between">
              <span className="rr-price">${p.price}</span>
              <Badge tone={p.inStock ? 'success' : 'neutral'}>{p.inStock ? 'In stock' : 'Sold out'}</Badge>
            </div>
          </div>
        ))}
        {results.length === 0 && <p className="muted">No products match these filters.</p>}
      </div>

      <p className="muted small">
        Set some filters, then press the browser&apos;s Back button or refresh the page - the filters come back from the URL.
      </p>
    </div>
  );
}
