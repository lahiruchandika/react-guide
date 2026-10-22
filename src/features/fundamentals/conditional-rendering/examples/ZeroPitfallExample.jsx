/**
 * ZeroPitfallExample.jsx
 * ----------------------------------------------------------------------------
 * Demonstrates the famous "0 &&" bug.
 *
 *   {items.length && <CartBadge />}
 *
 * How && works in JavaScript: `a && b` returns `a` if `a` is falsy,
 * otherwise it returns `b`.
 *   - When items.length is 3  -> returns <CartBadge />       (good)
 *   - When items.length is 0  -> returns 0  ...and React RENDERS the number 0!
 *
 * React skips false, null, undefined and true - but NOT the number 0 (or NaN).
 *
 * Fix: make the left side a real boolean:
 *   {items.length > 0 && <CartBadge />}
 *   {!!items.length && <CartBadge />}
 *   {items.length ? <CartBadge /> : null}
 * ----------------------------------------------------------------------------
 */
import { useState } from 'react';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui';

export default function ZeroPitfallExample() {
  const [count, setCount] = useState(2);

  return (
    <div className="stack">
      {/* Controls shared by both versions */}
      <div className="row">
        <Button variant="secondary" size="sm" icon={<Minus />} onClick={() => setCount((c) => Math.max(0, c - 1))}>
          Remove item
        </Button>
        <Button variant="secondary" size="sm" icon={<Plus />} onClick={() => setCount((c) => c + 1)}>
          Add item
        </Button>
        <span className="muted small">
          cartCount = <code>{count}</code> &nbsp;(go down to 0 and watch the left side)
        </span>
      </div>

      <div className="grid-2">
        {/* ---------------- BAD ---------------- */}
        <div className="cr-compare cr-compare-bad">
          <span className="cr-compare-tag">BAD</span>
          <code className="cr-compare-code">{'{count && <Badge />}'}</code>

          <div className="cr-cart-row">
            <ShoppingCart size={20} />
            <span>Cart</span>
            {/* ❌ When count is 0 this renders a stray "0" on the page */}
            {count && <span className="cr-cart-badge">{count}</span>}
          </div>
        </div>

        {/* ---------------- GOOD ---------------- */}
        <div className="cr-compare cr-compare-good">
          <span className="cr-compare-tag">GOOD</span>
          <code className="cr-compare-code">{'{count > 0 && <Badge />}'}</code>

          <div className="cr-cart-row">
            <ShoppingCart size={20} />
            <span>Cart</span>
            {/* ✅ The left side is a real boolean, so 0 renders nothing */}
            {count > 0 && <span className="cr-cart-badge">{count}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
