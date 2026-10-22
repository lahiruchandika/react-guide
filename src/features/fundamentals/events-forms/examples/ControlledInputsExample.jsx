/**
 * ControlledInputsExample.jsx
 * ----------------------------------------------------------------------------
 * DEMONSTRATES: "controlled" inputs - React state is the single source of truth.
 *
 *   <input value={name} onChange={(e) => setName(e.target.value)} />
 *
 *   1. value   comes FROM state           (state -> input)
 *   2. onChange writes the new value back (input -> state)
 *
 * Every input type, and which property to read:
 *   text / textarea / select / range  ->  value      &  e.target.value
 *   checkbox                          ->  checked    &  e.target.checked
 *   radio                             ->  checked={state === 'x'}  &  e.target.value
 *
 * Mini scenario: build-your-own pizza order with a live summary.
 * ----------------------------------------------------------------------------
 */
import { useState } from 'react';
import { Pizza } from 'lucide-react';
import { Badge } from '@/components/ui';

const SIZES = { small: 8, medium: 11, large: 14 }; // size -> base price
const CRUSTS = ['Thin', 'Classic', 'Stuffed'];
const TOPPINGS = ['Mushrooms', 'Olives', 'Peppers', 'Onions', 'Basil'];

export default function ControlledInputsExample() {
  // One piece of state per field keeps things easy to follow for beginners.
  const [name, setName] = useState('');               // text
  const [size, setSize] = useState('medium');         // select
  const [crust, setCrust] = useState('Classic');      // radio group
  const [toppings, setToppings] = useState(['Basil']); // checkbox group (array)
  const [extraCheese, setExtraCheese] = useState(false); // single checkbox (boolean)
  const [spice, setSpice] = useState(1);              // range
  const [notes, setNotes] = useState('');             // textarea

  // Checkbox GROUP: add the topping if checked, remove it if unchecked.
  function handleToppingChange(e) {
    const { value, checked } = e.target;
    setToppings((prev) => (checked ? [...prev, value] : prev.filter((t) => t !== value)));
  }

  // Derived value - calculated from state on each render, never stored.
  const price = SIZES[size] + toppings.length * 1.5 + (extraCheese ? 2 : 0);
  const spiceLabel = ['Mild', 'Medium', 'Hot', 'Fire 🔥'][spice];

  return (
    <div className="ef-pizza">
      <div className="stack">
        {/* TEXT */}
        <label className="field">
          <span className="field-label">Name on order</span>
          <input className="field-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Jordan" />
        </label>

        {/* SELECT - value goes on the <select>, not on <option selected> */}
        <label className="field">
          <span className="field-label">Size</span>
          <select className="select" value={size} onChange={(e) => setSize(e.target.value)}>
            {Object.entries(SIZES).map(([key, base]) => (
              <option key={key} value={key}>
                {key} (${base})
              </option>
            ))}
          </select>
        </label>

        {/* RADIO - all share the same "name"; checked compares with state */}
        <fieldset className="ef-fieldset">
          <legend className="field-label">Crust</legend>
          <div className="row">
            {CRUSTS.map((c) => (
              <label key={c} className={crust === c ? 'ef-chip active' : 'ef-chip'}>
                <input type="radio" name="crust" value={c} checked={crust === c} onChange={(e) => setCrust(e.target.value)} />
                {c}
              </label>
            ))}
          </div>
        </fieldset>

        {/* CHECKBOX GROUP - state is an array */}
        <fieldset className="ef-fieldset">
          <legend className="field-label">Toppings (+$1.50 each)</legend>
          <div className="row">
            {TOPPINGS.map((t) => (
              <label key={t} className={toppings.includes(t) ? 'ef-chip active' : 'ef-chip'}>
                <input type="checkbox" value={t} checked={toppings.includes(t)} onChange={handleToppingChange} />
                {t}
              </label>
            ))}
          </div>
        </fieldset>

        {/* SINGLE CHECKBOX - use checked + e.target.checked (NOT value) */}
        <label className="row small">
          <input type="checkbox" checked={extraCheese} onChange={(e) => setExtraCheese(e.target.checked)} />
          Extra cheese (+$2)
        </label>

        {/* RANGE - e.target.value is always a STRING, convert with Number() */}
        <label className="field">
          <span className="field-label">Spice level: {spiceLabel}</span>
          <input type="range" min={0} max={3} value={spice} onChange={(e) => setSpice(Number(e.target.value))} />
        </label>

        {/* TEXTAREA - in React it uses value, not inner text */}
        <label className="field">
          <span className="field-label">Notes for the kitchen</span>
          <textarea
            className="textarea"
            rows={2}
            maxLength={120}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="No onions on half, please…"
          />
          <span className="field-hint">{notes.length}/120</span>
        </label>
      </div>

      {/* Live summary: proves state and UI are always in sync */}
      <aside className="ef-summary">
        <div className="ef-summary-icon">
          <Pizza size={30} />
        </div>
        <h4>{name ? `${name}'s pizza` : 'Your pizza'}</h4>
        <dl>
          <dt>Size</dt><dd>{size}</dd>
          <dt>Crust</dt><dd>{crust}</dd>
          <dt>Toppings</dt><dd>{toppings.length ? toppings.join(', ') : 'none'}</dd>
          <dt>Cheese</dt><dd>{extraCheese ? 'extra' : 'regular'}</dd>
          <dt>Spice</dt><dd>{spiceLabel}</dd>
          {notes && (<><dt>Notes</dt><dd>“{notes}”</dd></>)}
        </dl>
        <div className="ef-total">
          <span>Total</span>
          <strong>${price.toFixed(2)}</strong>
        </div>
        <Badge tone="info">updates on every keystroke</Badge>
      </aside>
    </div>
  );
}
