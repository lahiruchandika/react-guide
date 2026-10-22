/**
 * CartBadge - the cart icon in a shop header.
 * It reads ONLY the cart context, so it re-renders when the cart changes,
 * but not when the user changes.
 */
import { ShoppingCart } from 'lucide-react';
import { RenderCounter } from '@/components/ui';
import { useCart } from '../context/CartContext';

export default function CartBadge() {
  const { count, total } = useCart(); // pick just what we need from the context

  return (
    <div className="ctx-cart-badge">
      <span className="ctx-cart-icon">
        <ShoppingCart size={18} />
        {/* Only show the bubble when the cart has something in it */}
        {count > 0 && <span className="ctx-cart-count">{count}</span>}
      </span>
      <span className="small">${total.toFixed(2)}</span>
      <RenderCounter />
    </div>
  );
}
