/**
 * FunctionPropsExample.jsx
 * ----------------------------------------------------------------------------
 * DEMONSTRATES: passing FUNCTIONS as props so a child can "talk back" to
 * its parent.
 *
 *   Parent:  <MenuItem item={item} onAdd={handleAdd} />
 *   Child:   <button onClick={() => onAdd(item)}>Add</button>
 *
 * Data still flows down (item), but the child can CALL a function the parent
 * gave it. The parent then updates its own state.
 *
 * Naming convention: props that are callbacks start with "on"
 * (onAdd, onRemove, onChange), and the parent's handlers start with "handle".
 * ----------------------------------------------------------------------------
 */
import { useState } from 'react';
import { Plus, Minus, ShoppingCart } from 'lucide-react';
import { Button, Badge } from '@/components/ui';

const MENU = [
  { id: 'latte', name: 'Caffè Latte', emoji: '☕', price: 4.2 },
  { id: 'croissant', name: 'Butter Croissant', emoji: '🥐', price: 3.1 },
  { id: 'cake', name: 'Carrot Cake', emoji: '🍰', price: 5.5 },
];

// --- CHILD: knows nothing about the cart. It just calls the functions. ------
function MenuItem({ item, quantity, onAdd, onRemove }) {
  return (
    <div className="pr-menu-item">
      <span className="pr-emoji">{item.emoji}</span>
      <div className="pr-menu-info">
        <strong>{item.name}</strong>
        <span className="small muted">${item.price.toFixed(2)}</span>
      </div>
      <div className="row pr-qty">
        {/* Call the parent's function, passing data back up as an argument */}
        <Button size="sm" variant="secondary" onClick={() => onRemove(item.id)} disabled={quantity === 0} aria-label="Remove one">
          <Minus size={14} />
        </Button>
        <span className="pr-qty-value">{quantity}</span>
        <Button size="sm" onClick={() => onAdd(item.id)} aria-label="Add one">
          <Plus size={14} />
        </Button>
      </div>
    </div>
  );
}

// --- PARENT: owns the cart state and the functions that change it ----------
export default function FunctionPropsExample() {
  // cart looks like { latte: 2, cake: 1 }
  const [cart, setCart] = useState({});
  const [log, setLog] = useState([]);

  // Helper to add a message to the top of the log (keep the last 5).
  const addLog = (text) => setLog((prev) => [{ id: Date.now() + Math.random(), text }, ...prev].slice(0, 5));

  // 1. Define the handler in the parent...
  function handleAdd(id) {
    setCart((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
    addLog(`onAdd("${id}") was called by <MenuItem>`);
  }

  function handleRemove(id) {
    setCart((prev) => ({ ...prev, [id]: Math.max((prev[id] ?? 0) - 1, 0) }));
    addLog(`onRemove("${id}") was called by <MenuItem>`);
  }

  // Derived values: calculated from state during render (no extra state needed)
  const itemCount = Object.values(cart).reduce((sum, n) => sum + n, 0);
  const total = MENU.reduce((sum, item) => sum + item.price * (cart[item.id] ?? 0), 0);

  return (
    <div className="grid-2">
      <div className="stack">
        {MENU.map((item) => (
          // 2. ...and pass it DOWN as a prop (no parentheses! we pass the function, not call it)
          <MenuItem key={item.id} item={item} quantity={cart[item.id] ?? 0} onAdd={handleAdd} onRemove={handleRemove} />
        ))}
      </div>

      <div className="stack">
        <div className="pr-cart-summary">
          <ShoppingCart size={22} />
          <div>
            <div className="small muted">Parent state</div>
            <strong>
              {itemCount} item{itemCount === 1 ? '' : 's'} · ${total.toFixed(2)}
            </strong>
          </div>
          <Badge tone="primary">cart</Badge>
        </div>

        <div className="pr-log">
          <span className="box-label">calls from child → parent</span>
          {log.length === 0 ? (
            <p className="muted small">Click + or − to see the child calling the parent.</p>
          ) : (
            <ul>
              {log.map((entry) => (
                <li key={entry.id}>{entry.text}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
