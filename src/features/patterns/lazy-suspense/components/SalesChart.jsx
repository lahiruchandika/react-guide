/**
 * SalesChart - pretend this is a HEAVY component (in real life it might import
 * a big charting library like Chart.js or Recharts).
 * ----------------------------------------------------------------------------
 * It is never imported normally - only through lazy(() => import(...)).
 * That makes Vite put it in its OWN JavaScript file (a "chunk") that the
 * browser downloads only when the component is first rendered.
 * Open DevTools → Network and watch for "SalesChart-xxxx.js" in a build.
 *
 * Must be a DEFAULT export: React.lazy expects { default: Component }.
 * ----------------------------------------------------------------------------
 */
import { useEffect } from 'react';
import { TrendingUp } from 'lucide-react';

const DATA = [
  { month: 'Jan', value: 42 },
  { month: 'Feb', value: 58 },
  { month: 'Mar', value: 51 },
  { month: 'Apr', value: 74 },
  { month: 'May', value: 66 },
  { month: 'Jun', value: 92 },
];

export default function SalesChart({ onReady }) {
  // Report when we actually appeared on screen (used by the timeline demo)
  useEffect(() => {
    onReady?.('Sales chart');
  }, [onReady]);

  const max = Math.max(...DATA.map((d) => d.value));

  return (
    <div className="lz-widget lz-loaded">
      <div className="row lz-between">
        <strong>Monthly sales</strong>
        <span className="lz-trend">
          <TrendingUp size={14} /> +38%
        </span>
      </div>
      <div className="lz-chart">
        {DATA.map((d) => (
          <div key={d.month} className="lz-bar-col">
            <span className="lz-bar-value">${d.value}k</span>
            <span className="lz-bar" style={{ height: `${(d.value / max) * 100}%` }} />
            <span className="lz-bar-label">{d.month}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
