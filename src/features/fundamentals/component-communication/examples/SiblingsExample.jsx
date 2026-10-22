/**
 * SiblingsExample.jsx  (COMMON PARENT)
 * ----------------------------------------------------------------------------
 * Demonstrates: SIBLING communication by LIFTING STATE UP.
 *
 * <ProductPicker> and <CartSummary> are siblings - neither can read the
 * other's state. Solution: move ("lift") the shared state - the cart - up
 * into their closest common parent (this component). Then:
 *
 *              SiblingsExample  (owns: cart)
 *               /                      \
 *   cart + onAdd                      cart + onRemove
 *       /                                    \
 *   <ProductPicker>                     <CartSummary>
 *
 * Data flows DOWN as props, events flow UP as callbacks, and both siblings
 * always show the same, single source of truth.
 *
 * File relationship:
 *   examples/SiblingsExample.jsx --imports--> components/ProductPicker.jsx
 *                                --imports--> components/CartSummary.jsx
 * ----------------------------------------------------------------------------
 */
import { useState } from 'react';
import { Badge } from '@/components/ui';
import ProductPicker from '../components/ProductPicker';
import CartSummary from '../components/CartSummary';

const PRODUCTS = [
  { id: 'kb', name: 'Keyboard', price: 89, emoji: '⌨️' },
  { id: 'ms', name: 'Mouse', price: 35, emoji: '🖱️' },
  { id: 'hp', name: 'Headphones', price: 120, emoji: '🎧' },
  { id: 'mn', name: 'Monitor', price: 240, emoji: '🖥️' },
];

export default function SiblingsExample() {
  // 1. The shared state lives in the COMMON PARENT.
  //    Each cart line: { id, name, price, emoji, qty }
  const [cart, setCart] = useState([]);

  // 2. Handlers that change the state - passed down to the children.
  function handleAdd(product) {
    setCart((prev) => {
      const existing = prev.find((line) => line.id === product.id);
      if (existing) {
        // Already in cart -> increase qty (create a NEW object, never mutate)
        return prev.map((line) => (line.id === product.id ? { ...line, qty: line.qty + 1 } : line));
      }
      // Not in cart yet -> add a new line
      return [...prev, { ...product, qty: 1 }];
    });
  }

  function handleRemove(id) {
    setCart((prev) => prev.filter((line) => line.id !== id));
  }

  const count = cart.reduce((sum, line) => sum + line.qty, 0);

  return (
    <div className="box cc-parent-box">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <span className="box-label" style={{ margin: 0 }}>
          Parent: SiblingsExample &middot; state: cart
        </span>
        <Badge tone="primary">cart has {count} item{count !== 1 && 's'}</Badge>
      </div>

      <div className="grid-2" style={{ marginTop: 'var(--space-3)' }}>
        <div className="cc-child-box">
          <span className="box-label">Sibling 1: &lt;ProductPicker cart onAdd /&gt;</span>
          {/* 3. Pass state + callback down to sibling #1 */}
          <ProductPicker products={PRODUCTS} cart={cart} onAdd={handleAdd} />
        </div>

        <div className="cc-child-box">
          <span className="box-label">Sibling 2: &lt;CartSummary cart onRemove /&gt;</span>
          {/* 4. Pass the SAME state down to sibling #2 */}
          <CartSummary cart={cart} onRemove={handleRemove} />
        </div>
      </div>
    </div>
  );
}
