/**
 * ImperativeHandleExample - the parent calls custom methods on a child.
 * ----------------------------------------------------------------------------
 * Scenario: a checkout "coupon code" box.
 *   - Apply with a WRONG code  -> couponRef.current.shake() + focus()
 *   - Apply with a valid code  -> show the discount
 *   - Clear                    -> couponRef.current.clear()
 *
 * <SmartInput> uses useImperativeHandle to expose only these methods.
 * The "Inspect" button shows that ref.current is NOT a DOM node - it's the
 * small object created inside SmartInput.
 * ----------------------------------------------------------------------------
 */
import { useRef, useState } from 'react';
import { BadgePercent, Eraser, Crosshair, Search } from 'lucide-react';
import { Badge, Button } from '@/components/ui';
import SmartInput from '../components/SmartInput';

const VALID_CODES = { SAVE10: 10, REACT19: 19, HALFOFF: 50 };
let nextLogId = 0; // module-level counter -> unique, stable keys for log lines

export default function ImperativeHandleExample() {
  // 1. The ref will hold { focus, clear, shake, getValue } - not an <input>
  const couponRef = useRef(null);

  const [discount, setDiscount] = useState(null);
  const [log, setLog] = useState([]);

  // Small helper to show which methods were called
  const addLog = (text) =>
    setLog((prev) => [{ id: nextLogId++, text: `${new Date().toLocaleTimeString()}  ${text}` }, ...prev].slice(0, 5));

  const applyCoupon = () => {
    const code = couponRef.current.getValue(); // 2. call a custom method
    addLog(`getValue() → "${code}"`);

    if (VALID_CODES[code]) {
      setDiscount(VALID_CODES[code]);
    } else {
      setDiscount(null);
      couponRef.current.shake(); // 3. trigger the child's animation
      couponRef.current.focus();
      addLog('shake() + focus() - invalid code');
    }
  };

  const clearCoupon = () => {
    couponRef.current.clear();
    setDiscount(null);
    addLog('clear()');
  };

  const inspect = () => addLog(`Object.keys(ref.current) → [${Object.keys(couponRef.current).join(', ')}]`);

  return (
    <div className="grid-2">
      <div className="stack">
        <SmartInput ref={couponRef} label="Coupon code" placeholder="Try SAVE10, REACT19 or a wrong one" />

        <div className="row">
          <Button size="sm" icon={<BadgePercent />} onClick={applyCoupon}>Apply</Button>
          <Button size="sm" variant="secondary" icon={<Eraser />} onClick={clearCoupon}>Clear</Button>
          <Button size="sm" variant="ghost" icon={<Crosshair />} onClick={() => couponRef.current.focus()}>Focus</Button>
          <Button size="sm" variant="ghost" icon={<Search />} onClick={inspect}>Inspect</Button>
        </div>

        <div className="rf-receipt">
          <div className="row rf-between"><span>Subtotal</span><span>$120.00</span></div>
          <div className="row rf-between">
            <span>Discount {discount && <Badge tone="success">-{discount}%</Badge>}</span>
            <span>-${((120 * (discount ?? 0)) / 100).toFixed(2)}</span>
          </div>
          <div className="row rf-between rf-total"><span>Total</span><span>${(120 - (120 * (discount ?? 0)) / 100).toFixed(2)}</span></div>
        </div>
      </div>

      <div className="rf-log">
        <div className="rf-log-title">Method calls on couponRef.current</div>
        {log.length === 0 && <div className="muted small">Click a button to call a method...</div>}
        {log.map((line) => (
          <div key={line.id} className="rf-log-line">{line.text}</div>
        ))}
      </div>
    </div>
  );
}
