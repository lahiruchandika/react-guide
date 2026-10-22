/**
 * CartSummary.jsx  (SIBLING #2)
 * ----------------------------------------------------------------------------
 * Displays the cart that the PARENT passes down, and asks the parent to
 * remove items through `onRemove(id)`.
 *
 * It never talks to <ProductPicker> directly - siblings cannot see each
 * other. They stay in sync because they both read the SAME state from their
 * common parent ("lifting state up").
 * ----------------------------------------------------------------------------
 */
import { ShoppingBag, X } from 'lucide-react';

export default function CartSummary({ cart, onRemove }) {
  // Derived values: computed from props on every render, not stored in state
  const itemCount = cart.reduce((sum, line) => sum + line.qty, 0);
  const total = cart.reduce((sum, line) => sum + line.qty * line.price, 0);

  if (cart.length === 0) {
    return (
      <div className="cc-cart-empty">
        <ShoppingBag size={26} />
        <span>Your cart is empty</span>
        <span className="small">Add something from the list.</span>
      </div>
    );
  }

  return (
    <div className="cc-cart">
      <ul className="cc-cart-list">
        {cart.map((line) => (
          <li key={line.id}>
            <span>
              {line.emoji} {line.name} <span className="muted">× {line.qty}</span>
            </span>
            <span className="row" style={{ gap: 'var(--space-2)' }}>
              <strong>${line.qty * line.price}</strong>
              {/* ⬆ ask the parent to remove this line */}
              <button type="button" className="cc-remove" onClick={() => onRemove(line.id)} aria-label={`Remove ${line.name}`}>
                <X size={14} />
              </button>
            </span>
          </li>
        ))}
      </ul>
      <div className="cc-cart-total">
        <span>
          {itemCount} item{itemCount !== 1 && 's'}
        </span>
        <strong>Total: ${total}</strong>
      </div>
    </div>
  );
}
