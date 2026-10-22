/**
 * BasicBoundaryExample - catch a render error and show a fallback + reset.
 * ----------------------------------------------------------------------------
 * Click "Add one" until the counter reaches 5: <BuggyCounter> throws.
 *
 *  - WITHOUT a boundary React would unmount the WHOLE app -> blank page.
 *  - WITH a boundary only the part inside it is replaced by the fallback.
 *
 * "Try again" calls reset(): the boundary clears its error and renders the
 * children again. Because the crashed counter was unmounted, it comes back
 * with fresh state (count = 0).
 *
 * Note: in development React also logs caught errors to the console
 * ("The above error occurred in..."). That's expected and helps debugging.
 * ----------------------------------------------------------------------------
 */
import { useState } from 'react';
import { Badge } from '@/components/ui';
import ErrorBoundary from '../components/ErrorBoundary';
import ErrorFallback from '../components/ErrorFallback';
import BuggyCounter from '../components/BuggyCounter';

export default function BasicBoundaryExample() {
  const [crashes, setCrashes] = useState(0);
  const [resets, setResets] = useState(0);

  return (
    <div className="stack">
      <div className="row">
        <Badge tone="danger">crashes caught: {crashes}</Badge>
        <Badge tone="success">resets: {resets}</Badge>
      </div>

      <div className="box">
        <span className="box-label">{'<ErrorBoundary>'}</span>

        <ErrorBoundary
          // Render function: gets the error and a reset() to try again
          fallback={({ error, reset }) => <ErrorFallback error={error} onRetry={reset} title="The counter crashed" />}
          onError={() => setCrashes((c) => c + 1)} // componentDidCatch -> good place to log
          onReset={() => setResets((r) => r + 1)}
        >
          <BuggyCounter />
        </ErrorBoundary>
      </div>

      <p className="muted small">The text and badges outside the boundary keep working even while the counter is broken.</p>
    </div>
  );
}
