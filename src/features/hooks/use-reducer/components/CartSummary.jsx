/**
 * CartSummary.jsx
 * ----------------------------------------------------------------------------
 * Displays the totals and a coupon form.
 * - `totals` are DERIVED (calculated by selectCartTotals) and passed in as props.
 * - The coupon input text is LOCAL UI state (useState) - it does not belong in
 *   the cart reducer until the user presses "Apply".
 * ----------------------------------------------------------------------------
 */
import { useState } from 'react';
import { Tag } from 'lucide-react';
import { Badge, Button } from '@/components/ui';
import { money } from '../data/catalog';
import { applyCoupon } from '../reducers/cartReducer';

export default function CartSummary({ totals, coupon, dispatch }) {
  const [code, setCode] = useState(''); // local, temporary input state

  const handleApply = (e) => {
    e.preventDefault();
    dispatch(applyCoupon(code)); // send the action; the reducer validates the code
  };

  return (
    <div className="rd-summary">
      <form className="rd-coupon" onSubmit={handleApply}>
        <input className="field-input" placeholder="Coupon (SAVE10 / REACT20)" value={code} onChange={(e) => setCode(e.target.value)} />
        <Button type="submit" size="sm" variant="secondary" icon={<Tag size={14} />}>
          Apply
        </Button>
      </form>
      {coupon && (coupon.invalid ? <Badge tone="danger">"{coupon.code}" is not a valid coupon</Badge> : <Badge tone="success">{coupon.code}: {coupon.percent}% off</Badge>)}

      <dl className="rd-totals">
        <dt>Subtotal ({totals.itemCount} items)</dt>
        <dd>{money(totals.subtotal)}</dd>
        <dt>Discount</dt>
        <dd>-{money(totals.discount)}</dd>
        <dt>Shipping</dt>
        <dd>{totals.shipping === 0 ? 'Free' : money(totals.shipping)}</dd>
        <dt className="rd-grand">Total</dt>
        <dd className="rd-grand">{money(totals.total)}</dd>
      </dl>
    </div>
  );
}
