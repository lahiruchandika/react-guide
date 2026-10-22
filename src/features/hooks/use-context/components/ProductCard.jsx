/**
 * ProductCard - one product in the shop grid.
 * The `product` comes in as a normal prop (data specific to THIS card),
 * while the `addItem` action comes from the cart context (shared app data).
 * Mixing props + context like this is very common.
 */
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addItem } = useCart(); // action from context: no callback prop needed
  const Icon = product.icon; // a component stored in data must start with a capital letter to render

  return (
    <div className="ctx-product">
      <div className="ctx-product-icon" aria-hidden="true">
        <Icon size={22} />
      </div>
      <strong>{product.name}</strong>
      <span className="muted small">${product.price.toFixed(2)}</span>
      <Button size="sm" icon={<Plus size={14} />} onClick={() => addItem(product)}>
        Add
      </Button>
    </div>
  );
}
