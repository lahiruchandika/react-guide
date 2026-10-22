/**
 * FirstCustomHookExample
 * ----------------------------------------------------------------------------
 * Demonstrates: writing your FIRST custom hook (useCounter) and using it in
 * several components.
 *
 * Key idea: a custom hook shares LOGIC, not STATE.
 * Each <CartLine> calls useCounter() and gets its own, independent count -
 * exactly like calling useState() twice gives two separate values.
 *
 * In a real project you would move useCounter into src/hooks/useCounter.js
 * so any component can import it. It is kept here so you can read it all at once.
 * ----------------------------------------------------------------------------
 */
import { useState } from 'react';
import { Minus, Plus, RotateCcw } from 'lucide-react';
import { Badge, Button, RenderCounter } from '@/components/ui';

/**
 * useCounter - a custom hook.
 * Rules: the name MUST start with "use", and it may call other hooks.
 * It returns whatever is useful to the caller (here: an object).
 */
function useCounter(initialValue = 0, { min = -Infinity, max = Infinity, step = 1 } = {}) {
  // 1. The hook owns a piece of state...
  const [count, setCount] = useState(initialValue);

  // 2. ...and the functions that change it (with the rules built in).
  const increment = () => setCount((c) => Math.min(max, c + step));
  const decrement = () => setCount((c) => Math.max(min, c - step));
  const reset = () => setCount(initialValue);

  // 3. Return state + actions + handy derived values.
  return { count, increment, decrement, reset, isMin: count <= min, isMax: count >= max };
}

// Fake products for the cart.
const PRODUCTS = [
  { id: 'p1', name: 'Wireless Headphones', price: 129, emoji: '🎧' },
  { id: 'p2', name: 'Mechanical Keyboard', price: 99, emoji: '⌨️' },
  { id: 'p3', name: 'Smart Watch', price: 249, emoji: '⌚' },
];

/** One row of the cart. Every CartLine has its OWN counter. */
function CartLine({ product }) {
  // 4. Use the hook like a built-in one. Quantity: min 1, max 5.
  const { count, increment, decrement, reset, isMin, isMax } = useCounter(1, { min: 1, max: 5 });

  return (
    <div className="ch-cart-line">
      <span className="ch-cart-emoji" aria-hidden="true">{product.emoji}</span>
      <div className="ch-cart-info">
        <strong>{product.name}</strong>
        <span className="muted small">${product.price} each</span>
      </div>

      <div className="ch-stepper">
        <Button size="sm" variant="secondary" onClick={decrement} disabled={isMin} aria-label="Decrease">
          <Minus size={14} />
        </Button>
        <span className="ch-stepper-value">{count}</span>
        <Button size="sm" variant="secondary" onClick={increment} disabled={isMax} aria-label="Increase">
          <Plus size={14} />
        </Button>
        <Button size="sm" variant="ghost" onClick={reset} aria-label="Reset">
          <RotateCcw size={14} />
        </Button>
      </div>

      <div className="ch-cart-total">
        <strong>${product.price * count}</strong>
        {isMax && <Badge tone="warning">max 5</Badge>}
      </div>
      <RenderCounter />
    </div>
  );
}

export default function FirstCustomHookExample() {
  return (
    <div className="stack">
      {/* 5. Three components, three independent counters - same hook. */}
      {PRODUCTS.map((product) => (
        <CartLine key={product.id} product={product} />
      ))}
      <p className="muted small">
        Change one quantity: only that row re-renders. Same logic, separate state.
      </p>
    </div>
  );
}
