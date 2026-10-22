/**
 * ProductCard.jsx
 * ----------------------------------------------------------------------------
 * Shows one product with an "Add" button.
 * It does not know about the reducer: it just calls the onAdd prop.
 * (Child -> parent communication through a callback prop.)
 * ----------------------------------------------------------------------------
 */
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui';
import { money } from '../data/catalog';

export default function ProductCard({ product, inCart, onAdd }) {
  return (
    <div className="rd-product">
      <span className="rd-product-emoji" aria-hidden="true">
        {product.emoji}
      </span>
      <div className="rd-product-info">
        <strong>{product.name}</strong>
        <span className="small muted">{money(product.price)}</span>
      </div>
      <Button size="sm" variant={inCart ? 'secondary' : 'primary'} icon={<Plus size={14} />} onClick={() => onAdd(product)}>
        {inCart ? `In cart (${inCart})` : 'Add'}
      </Button>
    </div>
  );
}
