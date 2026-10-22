/**
 * GranularBoundariesExample - WHERE you place boundaries matters.
 * ----------------------------------------------------------------------------
 * The same three widgets, protected in two different ways:
 *
 *   LEFT  - ONE boundary around the whole section:
 *           one broken widget takes down all three.
 *
 *   RIGHT - one boundary PER widget (granular):
 *           only the broken widget shows a fallback; the others keep working.
 *
 * Real apps usually combine both: an app-level boundary as a last safety net
 * (a "something went wrong" page) plus granular boundaries around independent
 * widgets, sidebars, comments, third-party embeds...
 * ----------------------------------------------------------------------------
 */
import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { Badge, Button } from '@/components/ui';
import ErrorBoundary from '../components/ErrorBoundary';
import ErrorFallback from '../components/ErrorFallback';
import DashboardWidget from '../components/DashboardWidget';

const WIDGETS = [
  { id: 'weather', icon: '🌤️', title: 'Weather', value: '24°C', detail: 'Sunny in Colombo' },
  { id: 'stocks', icon: '📈', title: 'Stocks', value: '+2.4%', detail: 'Portfolio today' },
  { id: 'tasks', icon: '✅', title: 'Tasks', value: '7 / 12', detail: 'Done this week' },
];

export default function GranularBoundariesExample() {
  // Changing this key remounts both dashboards = a full reset of the demo
  const [demoKey, setDemoKey] = useState(0);

  return (
    <div className="stack">
      <div className="row eb-between">
        <span className="muted small">Click &quot;Break&quot; on any widget in each dashboard.</span>
        <Button size="sm" variant="secondary" icon={<RotateCcw />} onClick={() => setDemoKey((k) => k + 1)}>
          Reset demo
        </Button>
      </div>

      <div className="grid-2" key={demoKey}>
        {/* -------- One boundary for everything -------- */}
        <div className="eb-column eb-column-bad">
          <Badge tone="danger">One boundary around the section</Badge>
          <ErrorBoundary fallback={({ error, reset }) => <ErrorFallback error={error} onRetry={reset} title="Dashboard crashed" />}>
            <div className="eb-widgets">
              {WIDGETS.map((w) => (
                <DashboardWidget key={w.id} {...w} />
              ))}
            </div>
          </ErrorBoundary>
        </div>

        {/* -------- One boundary per widget -------- */}
        <div className="eb-column eb-column-good">
          <Badge tone="success">One boundary per widget</Badge>
          <div className="eb-widgets">
            {WIDGETS.map((w) => (
              // The key goes on the outermost element returned by map()
              <ErrorBoundary
                key={w.id}
                fallback={({ error, reset }) => <ErrorFallback error={error} onRetry={reset} title={`${w.title} unavailable`} compact />}
              >
                <DashboardWidget {...w} />
              </ErrorBoundary>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
