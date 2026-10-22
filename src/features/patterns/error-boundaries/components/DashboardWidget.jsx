/**
 * DashboardWidget - a small card with a "Break" button that makes it crash.
 *
 * Clicking "Break" sets `broken` to true; on the next render we throw.
 * (Throwing directly inside onClick would NOT be caught by a boundary -
 * only errors during rendering are. See example 3.)
 */
import { useState } from 'react';
import { Bomb } from 'lucide-react';

export default function DashboardWidget({ icon, title, value, detail }) {
  const [broken, setBroken] = useState(false);

  if (broken) {
    throw new Error(`${title} widget failed to render`);
  }

  return (
    <div className="eb-widget">
      <div className="row eb-between">
        <span className="eb-widget-icon" aria-hidden>{icon}</span>
        <button type="button" className="eb-break" onClick={() => setBroken(true)} title="Make this widget crash">
          <Bomb size={13} /> Break
        </button>
      </div>
      <span className="muted small">{title}</span>
      <strong className="eb-widget-value">{value}</strong>
      <span className="muted small">{detail}</span>
    </div>
  );
}
