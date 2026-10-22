/**
 * TeamStats - a lazily loaded widget (default export for React.lazy).
 */
import { useEffect } from 'react';

const STATS = [
  { label: 'Revenue', value: '$48.2k' },
  { label: 'Orders', value: '1,284' },
  { label: 'Customers', value: '932' },
];

export default function TeamStats({ onReady }) {
  useEffect(() => {
    onReady?.('Stats');
  }, [onReady]);

  return (
    <div className="lz-stats">
      {STATS.map((s) => (
        <div key={s.label} className="lz-stat lz-loaded">
          <span className="muted small">{s.label}</span>
          <span className="lz-stat-value">{s.value}</span>
        </div>
      ))}
    </div>
  );
}
