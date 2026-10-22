/**
 * CartLine.jsx
 * ----------------------------------------------------------------------------
 * One line in the cart: emoji, name, quantity stepper, line total, remove.
 * Receives `dispatch` directly - passing dispatch down is a common pattern,
 * because its identity is guaranteed to be stable (it never changes).
 * ----------------------------------------------------------------------------
 */
import { Minus, Plus, X } from 'lucide-react';
import { money } from '../data/catalog';
import { decreaseQty, increaseQty, removeItem } from '../reducers/cartReducer';

export default function CartLine({ item, dispatch }) {
  return (
    <li className="rd-line">
      <span className="rd-line-emoji" aria-hidden="true">
        {item.emoji}
      </span>
      <div className="rd-line-name">
        <span>{item.name}</span>
        <span className="small muted">{money(item.price)} each</span>
      </div>

      {/* Quantity stepper: each button dispatches a different action */}
      <div className="rd-stepper">
        <button type="button" aria-label="Decrease quantity" onClick={() => dispatch(decreaseQty(item.id))}>
          <Minus size={14} />
        </button>
        <span>{item.qty}</span>
        <button type="button" aria-label="Increase quantity" onClick={() => dispatch(increaseQty(item.id))}>
          <Plus size={14} />
        </button>
      </div>

      <b className="rd-line-total">{money(item.price * item.qty)}</b>
      <button type="button" className="rd-remove" aria-label={`Remove ${item.name}`} onClick={() => dispatch(removeItem(item.id))}>
        <X size={15} />
      </button>
    </li>
  );
}
