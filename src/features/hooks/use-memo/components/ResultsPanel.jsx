/**
 * ResultsPanel.jsx
 * ----------------------------------------------------------------------------
 * A purely PRESENTATIONAL component: it receives data through props and only
 * displays it. It has no state and knows nothing about useMemo.
 * Splitting "logic" components from "display" components keeps files small.
 *
 * Props:
 *   title      heading text
 *   tone       Badge colour ('danger' | 'success' ...)
 *   items      the filtered products to show (first 6 only)
 *   total      how many products matched
 *   ms         how long the last calculation took
 *   computedAt time stamp of the last calculation
 *   runs       how many times the expensive calculation has run
 *
 * Compare the two numbers at the top of each panel:
 *   "renders"      = how many times the component function ran
 *   "Calculations" = how many times the slow filter ran
 * useMemo keeps "Calculations" low even when "renders" keeps growing.
 * ----------------------------------------------------------------------------
 */
import { Badge, RenderCounter } from '@/components/ui';

export default function ResultsPanel({ title, tone, items, total, ms, computedAt, runs }) {
  return (
    <div className="um-panel">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <Badge tone={tone}>{title}</Badge>
        <RenderCounter />
      </div>

      <div className="um-panel-metrics">
        <div className="um-metric-runs">
          <span className="um-stat-label">Calculations</span>
          <span className="um-stat-value">{runs}</span>
        </div>
        <div>
          <span className="um-stat-label">Calc time</span>
          <span className="um-stat-value">{ms} ms</span>
        </div>
        <div>
          <span className="um-stat-label">Computed at</span>
          <span className="um-stat-value um-mono">{computedAt}</span>
        </div>
      </div>

      <p className="small muted" style={{ margin: 0 }}>
        {total.toLocaleString()} matching products (cheapest first)
      </p>

      {/* Lists need a stable, unique key - the product id */}
      <ul className="um-product-list">
        {items.slice(0, 6).map((product) => (
          <li key={product.id}>
            <span>{product.name}</span>
            <b>${product.price}</b>
          </li>
        ))}
        {items.length === 0 && <li className="muted">No products match.</li>}
      </ul>
    </div>
  );
}
