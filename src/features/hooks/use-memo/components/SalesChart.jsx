/**
 * SalesChart.jsx
 * ----------------------------------------------------------------------------
 * A child component wrapped in memo().
 *
 *   export default memo(SalesChart);
 *
 * memo() tells React: "skip re-rendering me if my props are the same as last
 * time". React compares each prop with Object.is():
 *   - numbers / strings: compared by VALUE   (5 === 5)
 *   - objects / arrays / functions: compared by REFERENCE ({} !== {})
 *
 * So if the parent creates a NEW `options` object on every render, memo()
 * cannot help - the prop is "different" every time.
 * ----------------------------------------------------------------------------
 */
import { memo } from 'react';
import { RenderCounter } from '@/components/ui';

const SALES = [
  { month: 'Jan', value: 42 },
  { month: 'Feb', value: 58 },
  { month: 'Mar', value: 51 },
  { month: 'Apr', value: 74 },
  { month: 'May', value: 66 },
  { month: 'Jun', value: 89 },
];

function SalesChart({ title, options }) {
  const max = Math.max(...SALES.map((s) => s.value));

  return (
    <div className="um-panel">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <strong className="small">{title}</strong>
        <RenderCounter />
      </div>

      {/* A simple bar chart made of divs. Colour comes from the options prop. */}
      <div className={`um-chart ${options.showGrid ? 'with-grid' : ''}`}>
        {SALES.map((s) => (
          <div key={s.month} className="um-bar-col">
            <div className="um-bar" style={{ height: `${(s.value / max) * 100}%`, background: `var(${options.color})` }}>
              {options.showValues && <span>{s.value}</span>}
            </div>
            <span className="um-bar-label">{s.month}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Wrap the component with memo so it can skip unnecessary re-renders.
export default memo(SalesChart);
