/**
 * ProductFilterExample.jsx
 * ----------------------------------------------------------------------------
 * Demonstrates: SEARCH + FILTER + SORT an array before rendering it.
 *
 * The important idea: we keep only the INPUTS in state (search text, category,
 * sort order). The visible list is DERIVED from them on every render:
 *
 *   PRODUCTS  --filter(search)-->  --filter(category)-->  --sort-->  visible
 *
 * We never store "filteredProducts" in state - that would duplicate data and
 * could get out of sync.
 *
 * Also notice:
 *   - .filter() and .sort() run on a COPY ([...arr]) - never mutate the original.
 *   - Each <ProductCard> gets key={product.id}, so React can match cards
 *     correctly even when the order changes.
 *   - An empty result shows a friendly message (conditional rendering).
 * ----------------------------------------------------------------------------
 */
import { useState } from 'react';
import { Search, SearchX } from 'lucide-react';
import { Button } from '@/components/ui';
import ProductCard from '../components/ProductCard';
import { PRODUCTS, CATEGORIES } from '../data/products';

// Sort functions in a lookup object: sortKey -> compare function
const SORTERS = {
  featured: () => 0, // keep original order
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
  rating: (a, b) => b.rating - a.rating,
  name: (a, b) => a.name.localeCompare(b.name),
};

export default function ProductFilterExample() {
  // 1. State holds ONLY what the user chose
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [sortKey, setSortKey] = useState('featured');

  // 2. Derive the visible list during render (cheap for small arrays)
  const filtered = PRODUCTS
    .filter((p) => p.name.toLowerCase().includes(query.trim().toLowerCase())) // search
    .filter((p) => category === 'All' || p.category === category); // category

  // sort() MUTATES the array it is called on, so sort a copy ([...arr]).
  // (Modern browsers also have arr.toSorted(), which returns a new array.)
  const visible = [...filtered].sort(SORTERS[sortKey]);

  return (
    <div className="stack">
      {/* ---------------- Toolbar ---------------- */}
      <div className="lk-toolbar">
        <div className="lk-search">
          <Search size={16} />
          <input
            className="field-input"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search products"
          />
        </div>
        <select className="select lk-sort" value={sortKey} onChange={(e) => setSortKey(e.target.value)} aria-label="Sort by">
          <option value="featured">Featured</option>
          <option value="price-asc">Price: low → high</option>
          <option value="price-desc">Price: high → low</option>
          <option value="rating">Top rated</option>
          <option value="name">Name A–Z</option>
        </select>
      </div>

      {/* Category chips - also rendered from an array with map() */}
      <div className="row" style={{ gap: 'var(--space-2)' }}>
        {CATEGORIES.map((c) => (
          <Button key={c} size="sm" variant={c === category ? 'primary' : 'secondary'} onClick={() => setCategory(c)}>
            {c}
          </Button>
        ))}
        <span className="muted small" style={{ marginLeft: 'auto' }}>
          Showing {visible.length} of {PRODUCTS.length}
        </span>
      </div>

      {/* ---------------- Results ---------------- */}
      {visible.length > 0 ? (
        <div className="lk-product-grid">
          {visible.map((product) => (
            // key on the component, not inside ProductCard
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="lk-empty">
          <SearchX size={28} />
          <span>
            No products match &quot;{query}&quot; in {category}.
          </span>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              setQuery('');
              setCategory('All');
            }}
          >
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
}
