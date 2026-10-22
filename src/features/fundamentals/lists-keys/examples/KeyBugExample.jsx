/**
 * KeyBugExample.jsx
 * ----------------------------------------------------------------------------
 * Demonstrates: WHY index keys break when a list is reordered.
 *
 * React uses `key` to match each element with the one from the previous
 * render. Any internal state (an input's typed text, a checkbox, a
 * component's useState) is attached to that key.
 *
 *   key={index}  -> "row 0" is always row 0, even if a different item moved
 *                   there. The label updates (it comes from props), but the
 *                   input's typed text stays behind at position 0.  BUG!
 *   key={item.id} -> the state travels WITH the item, wherever it moves.
 *
 * Each row has an UNCONTROLLED input (defaultValue) and checkbox, i.e. the
 * DOM keeps their state, not React. That makes the bug easy to see.
 * Try: tick a box or type in a row, then click "Add to top" or "Reverse".
 * ----------------------------------------------------------------------------
 */
import { useState } from 'react';
import { ArrowDownUp, ListPlus, RotateCcw, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui';

const INITIAL = [
  { id: 1, name: 'Apples' },
  { id: 2, name: 'Bread' },
  { id: 3, name: 'Cheese' },
];
const EXTRA = ['Dates', 'Eggs', 'Figs', 'Grapes', 'Honey', 'Ice cream'];

/* One row: label from props + input/checkbox whose state lives in the DOM */
function Row({ item, keyLabel }) {
  return (
    <li className="lk-bug-row">
      <span className="lk-key-chip">key={keyLabel}</span>
      <input type="checkbox" aria-label={`Bought ${item.name}`} />
      <span className="lk-bug-name">{item.name}</span>
      {/* defaultValue is used only when this input is FIRST created */}
      <input className="field-input lk-bug-input" defaultValue={`note for ${item.name}`} aria-label={`Note for ${item.name}`} />
    </li>
  );
}

export default function KeyBugExample() {
  const [items, setItems] = useState(INITIAL);
  const [nextId, setNextId] = useState(4);
  // Changing this number remounts both lists (see "Reset" below).
  const [resetCount, setResetCount] = useState(0);

  function addToTop() {
    const name = EXTRA[(nextId - 4) % EXTRA.length];
    setItems([{ id: nextId, name }, ...items]); // new item at the START
    setNextId(nextId + 1);
  }

  const reverse = () => setItems([...items].reverse()); // copy, then reverse
  const removeFirst = () => setItems(items.slice(1));

  function reset() {
    setItems(INITIAL);
    setNextId(4);
    // Bonus trick: changing a component's key throws away its state.
    setResetCount((c) => c + 1);
  }

  return (
    <div className="stack">
      <div className="row">
        <Button size="sm" icon={<ListPlus />} onClick={addToTop}>
          Add to top
        </Button>
        <Button size="sm" variant="secondary" icon={<ArrowDownUp />} onClick={reverse}>
          Reverse
        </Button>
        <Button size="sm" variant="secondary" icon={<Trash2 />} onClick={removeFirst} disabled={items.length === 0}>
          Remove first
        </Button>
        <Button size="sm" variant="ghost" icon={<RotateCcw />} onClick={reset}>
          Reset
        </Button>
      </div>

      <div className="grid-2" key={resetCount}>
        {/* ---------------- BAD: index as key ---------------- */}
        <div className="lk-bug-col lk-bug-bad">
          <div className="lk-bug-head">
            <strong>❌ key = index</strong>
            <span className="muted small">notes &amp; ticks get mixed up</span>
          </div>
          <ul className="lk-bug-list">
            {items.map((item, index) => (
              <Row key={index} item={item} keyLabel={index} />
            ))}
          </ul>
        </div>

        {/* ---------------- GOOD: stable id as key ---------------- */}
        <div className="lk-bug-col lk-bug-good">
          <div className="lk-bug-head">
            <strong>✅ key = item.id</strong>
            <span className="muted small">state moves with the item</span>
          </div>
          <ul className="lk-bug-list">
            {items.map((item) => (
              <Row key={item.id} item={item} keyLabel={item.id} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
