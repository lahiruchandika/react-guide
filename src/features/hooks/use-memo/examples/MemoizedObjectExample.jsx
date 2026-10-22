/**
 * MemoizedObjectExample.jsx
 * ----------------------------------------------------------------------------
 * useMemo is not only for slow math. It also keeps the SAME object reference
 * between renders, which lets memo() children skip re-rendering.
 *
 *   // ❌ new object every render -> memo child always re-renders
 *   const options = { color, showGrid };
 *
 *   // ✅ same object until color/showGrid change -> memo child can skip
 *   const options = useMemo(() => ({ color, showGrid }), [color, showGrid]);
 *
 * Try it: type in "Meeting notes" (unrelated state). Only the LEFT chart's
 * render counter goes up. Then change the colour: both charts re-render,
 * because the options really changed.
 * ----------------------------------------------------------------------------
 */
import { useMemo, useState } from 'react';
import { Input } from '@/components/ui';
import SalesChart from '../components/SalesChart';

const COLORS = [
  { label: 'Indigo', value: '--color-primary' },
  { label: 'Green', value: '--color-success' },
  { label: 'Amber', value: '--color-warning' },
  { label: 'Cyan', value: '--color-accent' },
];

export default function MemoizedObjectExample() {
  // Chart settings (the chart DOES care about these)
  const [color, setColor] = useState('--color-primary');
  const [showGrid, setShowGrid] = useState(true);
  const showValues = true;

  // Unrelated state (the chart does NOT care about this)
  const [notes, setNotes] = useState('');

  // ❌ A brand-new object is created on every render of this component.
  const inlineOptions = { color, showGrid, showValues };

  // ✅ The same object is returned until one of the dependencies changes.
  const memoOptions = useMemo(() => ({ color, showGrid, showValues }), [color, showGrid, showValues]);

  return (
    <div className="stack">
      <div className="um-toolbar">
        <label className="field">
          <span className="field-label">Bar colour</span>
          <select className="select" value={color} onChange={(e) => setColor(e.target.value)}>
            {COLORS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </label>

        <label className="row small" style={{ gap: 6, alignSelf: 'end', paddingBottom: 8 }}>
          <input type="checkbox" checked={showGrid} onChange={(e) => setShowGrid(e.target.checked)} />
          Show grid
        </label>

        <Input label="Meeting notes (unrelated state)" placeholder="Type here..." value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>

      <div className="grid-2">
        {/* Same memo() component, different kind of prop */}
        <SalesChart title="options = { ... }  (new object each render)" options={inlineOptions} />
        <SalesChart title="options = useMemo(...)  (stable object)" options={memoOptions} />
      </div>
    </div>
  );
}
