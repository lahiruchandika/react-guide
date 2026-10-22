/**
 * ProductCard.jsx
 * ----------------------------------------------------------------------------
 * A presentational ("dumb") component: it only receives a product through
 * props and displays it. It has no state and does not know about filtering.
 *
 * Notice: ProductCard does NOT set its own `key`. The key belongs to the
 * place where the list is created (the .map() call in the parent):
 *
 *   {products.map((p) => <ProductCard key={p.id} product={p} />)}
 * ----------------------------------------------------------------------------
 */
import { Star } from 'lucide-react';
import { Badge } from '@/components/ui';

export default function ProductCard({ product }) {
  // Destructure the fields we need from the product object.
  const { name, category, price, rating, emoji } = product;

  return (
    <article className="lk-product">
      <div className="lk-product-emoji">{emoji}</div>
      <div className="lk-product-body">
        <strong className="lk-product-name">{name}</strong>
        <div className="row" style={{ gap: 'var(--space-2)' }}>
          <Badge>{category}</Badge>
          <span className="lk-rating">
            <Star size={13} fill="currentColor" /> {rating}
          </span>
        </div>
      </div>
      <span className="lk-product-price">${price}</span>
    </article>
  );
}
