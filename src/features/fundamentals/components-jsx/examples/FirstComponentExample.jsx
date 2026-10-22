/**
 * FirstComponentExample.jsx
 * ----------------------------------------------------------------------------
 * DEMONSTRATES: what a React component is.
 *
 *   - A component is just a JavaScript FUNCTION that returns JSX (UI).
 *   - Its name MUST start with a Capital letter (Welcome, not welcome),
 *     otherwise React thinks it is a normal HTML tag like <div>.
 *   - You "call" it like an HTML tag: <Welcome />  (not Welcome()).
 *   - Write it once, reuse it as many times as you like.
 * ----------------------------------------------------------------------------
 */
import { useState } from 'react';
import { Sparkles, Plus, Trash2 } from 'lucide-react';
import { Button, Badge } from '@/components/ui';

// 1. The SMALLEST possible component: a function that returns JSX.
function Welcome() {
  return <h4 className="cj-welcome">Hello from a component!</h4>;
}

// 2. A component can contain more markup (and other components).
function FeatureTile() {
  return (
    <div className="cj-tile">
      <Sparkles size={18} />
      <div>
        <strong>Reusable tile</strong>
        <p className="muted small">I am the same function, rendered again.</p>
      </div>
    </div>
  );
}

// 3. The demo itself is ALSO a component. It renders the ones above.
export default function FirstComponentExample() {
  // How many <FeatureTile /> copies to show (just so you can play with reuse).
  const [copies, setCopies] = useState(3);

  // Build an array [0, 1, 2, ...] so we can render the tile N times.
  const tiles = Array.from({ length: copies }, (_, i) => i);

  return (
    <div className="stack">
      {/* Using a component = writing it like an HTML tag */}
      <Welcome />

      <div className="row">
        <Button size="sm" icon={<Plus size={14} />} onClick={() => setCopies((c) => Math.min(c + 1, 6))}>
          Add tile
        </Button>
        <Button size="sm" variant="secondary" icon={<Trash2 size={14} />} onClick={() => setCopies((c) => Math.max(c - 1, 0))}>
          Remove tile
        </Button>
        <Badge tone="info">{copies} × &lt;FeatureTile /&gt;</Badge>
      </div>

      <div className="grid-3">
        {/* Same component reused many times. `key` helps React track each copy. */}
        {tiles.map((i) => (
          <FeatureTile key={i} />
        ))}
      </div>

      {tiles.length === 0 && <p className="muted small">No tiles - click “Add tile”.</p>}
    </div>
  );
}
