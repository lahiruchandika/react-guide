/**
 * ExpressionsExample.jsx
 * ----------------------------------------------------------------------------
 * DEMONSTRATES: curly braces { } = "switch to JavaScript" inside JSX.
 *
 * Anything that produces a VALUE (an expression) can go inside { }:
 *   variables, math, function calls, ternaries, template strings,
 *   object properties, and arrays of JSX (from .map()).
 *
 * Statements like if / for / const can NOT go inside { } - put them
 * above the return instead.
 *
 * Mini scenario: an order summary that updates as you type.
 * ----------------------------------------------------------------------------
 */
import { useState } from 'react';
import { Input, Badge } from '@/components/ui';

// A plain helper function - we can call it from JSX: {formatPrice(total)}
function formatPrice(amount) {
  return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

// Plain data (an object) - we read its properties in JSX: {product.name}
const product = { name: 'Mechanical Keyboard', price: 79.5, tags: ['RGB', 'Wireless', 'Hot-swap'] };

export default function ExpressionsExample() {
  // State so you can see expressions re-evaluate on every render.
  const [customer, setCustomer] = useState('Sam');
  const [qty, setQty] = useState(2);

  // ✅ Statements (const, if...) live ABOVE the return.
  const total = product.price * qty;
  const freeShipping = total >= 100;

  return (
    <div className="grid-2">
      {/* Controls */}
      <div className="stack">
        <Input label="Customer name" value={customer} onChange={(e) => setCustomer(e.target.value)} />
        <Input
          label="Quantity"
          type="number"
          min={0}
          max={20}
          value={qty}
          onChange={(e) => setQty(Number(e.target.value))}
        />
      </div>

      {/* Output: each row shows the expression and its result */}
      <div className="cj-receipt">
        {/* 1. variable + template string */}
        <h4>{`Thanks, ${customer || 'friend'}!`}</h4>

        {/* 2. object property */}
        <p className="muted small">Product: {product.name}</p>

        <ul className="cj-expr-list">
          {/* 3. math */}
          <li><code>{'{qty * price}'}</code><span>{qty * product.price}</span></li>
          {/* 4. function call */}
          <li><code>{'{formatPrice(total)}'}</code><span>{formatPrice(total)}</span></li>
          {/* 5. method call on a string */}
          <li><code>{'{customer.toUpperCase()}'}</code><span>{customer.toUpperCase() || '—'}</span></li>
          {/* 6. ternary (inline if/else) */}
          <li>
            <code>{'{free ? ... : ...}'}</code>
            <span>
              {freeShipping ? <Badge tone="success">Free shipping</Badge> : <Badge tone="warning">+ $5 shipping</Badge>}
            </span>
          </li>
        </ul>

        {/* 7. an ARRAY of JSX from .map() - each item needs a unique key */}
        <div className="row">
          {product.tags.map((tag) => (
            <Badge key={tag} tone="primary">{tag}</Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
