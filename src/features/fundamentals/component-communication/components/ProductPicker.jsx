/**
 * ProductPicker.jsx  (SIBLING #1)
 * ----------------------------------------------------------------------------
 * Shows the products and lets the user add them to the cart.
 *
 * It does NOT own the cart and cannot see <CartSummary>. When "Add" is
 * clicked it calls `onAdd(product)` - the common PARENT updates the cart,
 * and the parent passes the new cart down to <CartSummary>.
 *
 *   ProductPicker --onAdd(product)--> Parent (cart state) --cart--> CartSummary
 *
 * It also receives `cart` (read-only) just to show "in cart: 2" badges.
 * ----------------------------------------------------------------------------
 */
import { Plus } from 'lucide-react';
import { Button, Badge } from '@/components/ui';

export default function ProductPicker({ products, cart, onAdd }) {
  return (
    <ul className="cc-picker">
      {products.map((product) => {
        // Look up how many of this product are already in the cart
        const qty = cart.find((line) => line.id === product.id)?.qty ?? 0;

        return (
          <li key={product.id} className="cc-picker-row">
            <span className="cc-picker-emoji">{product.emoji}</span>
            <div className="cc-picker-info">
              <strong>{product.name}</strong>
              <span className="muted small">${product.price}</span>
            </div>
            {qty > 0 && <Badge tone="primary">in cart: {qty}</Badge>}
            {/* ⬆ event goes UP to the parent */}
            <Button size="sm" variant="secondary" icon={<Plus />} onClick={() => onAdd(product)}>
              Add
            </Button>
          </li>
        );
      })}
    </ul>
  );
}
