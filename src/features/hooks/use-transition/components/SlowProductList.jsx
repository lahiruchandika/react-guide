/**
 * SlowProductList - an intentionally SLOW list used by the demos.
 * ----------------------------------------------------------------------------
 * Every <SlowRow> wastes ~0.6ms while rendering, so showing 250 rows costs
 * ~150ms. That's enough to make typing feel laggy when the list re-renders
 * on every keystroke (a "blocking" update).
 *
 * Two details make useTransition / useDeferredValue work well here:
 *   1. The list is wrapped in memo(): when only the input text changes, the
 *      list (whose `query` prop is unchanged) is skipped completely.
 *   2. The work is split across MANY small components, so React can pause
 *      between rows, handle a keystroke, and resume (interruptible rendering).
 * ----------------------------------------------------------------------------
 */
import { memo } from 'react';
import { PRODUCTS } from '../data/products';
import { slowDown } from '../utils/slow';

const MAX_ROWS = 250; // render at most this many rows

// One row - deliberately slow
const SlowRow = memo(function SlowRow({ product, query }) {
  slowDown(0.6); // simulate an expensive row

  // Highlight the matching part of the name
  const start = query ? product.name.toLowerCase().indexOf(query.toLowerCase()) : -1;
  const name =
    start === -1 ? (
      product.name
    ) : (
      <>
        {product.name.slice(0, start)}
        <mark>{product.name.slice(start, start + query.length)}</mark>
        {product.name.slice(start + query.length)}
      </>
    );

  return (
    <li className="utr-row">
      <span className="utr-row-name">{name}</span>
      <span className="utr-row-cat">{product.category}</span>
      <span className="utr-row-price">${product.price.toFixed(2)}</span>
    </li>
  );
});

function SlowProductList({ query }) {
  // Filtering 2,000 items is fast - RENDERING hundreds of slow rows is the slow part
  const q = query.trim().toLowerCase();
  const matches = q ? PRODUCTS.filter((p) => p.name.toLowerCase().includes(q)) : PRODUCTS;
  const visible = matches.slice(0, MAX_ROWS);

  return (
    <div>
      <p className="small muted utr-list-meta">
        {matches.length.toLocaleString()} matches{matches.length > MAX_ROWS && ` · showing first ${MAX_ROWS}`}
      </p>
      {visible.length === 0 ? (
        <p className="muted">No products match "{query}".</p>
      ) : (
        <ul className="utr-list">
          {visible.map((product) => (
            <SlowRow key={product.id} product={product} query={q} />
          ))}
        </ul>
      )}
    </div>
  );
}

// memo: re-render only when `query` actually changes
export default memo(SlowProductList);
