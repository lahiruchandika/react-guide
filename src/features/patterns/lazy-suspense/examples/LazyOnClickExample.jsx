/**
 * LazyOnClickExample - load a heavy component only when it is needed.
 * ----------------------------------------------------------------------------
 * Steps:
 *   1. Declare the lazy component at the TOP LEVEL of the module (not inside
 *      a component - otherwise it would be re-created on every render).
 *   2. Render it inside <Suspense fallback={...}>.
 *   3. The first time it renders, React starts the download and shows the
 *      fallback. When the code arrives, the real component replaces it.
 *
 * lazy() remembers the result: after the first load, showing the chart again
 * is instant (no fallback). Refresh the page to see the skeleton again.
 * ----------------------------------------------------------------------------
 */
import { Suspense, useState } from 'react';
import { BarChart3, EyeOff } from 'lucide-react';
import { Badge, Button } from '@/components/ui';
import { lazyWithDelay } from '../utils/lazyWithDelay';
import { ChartSkeleton } from '../components/Skeletons';

// 1. Top level! In a real app:  const SalesChart = lazy(() => import('../components/SalesChart'));
//    (lazyWithDelay just adds 1.5s of fake network time so you can see the fallback)
const SalesChart = lazyWithDelay(() => import('../components/SalesChart'), 1500);

export default function LazyOnClickExample() {
  const [showChart, setShowChart] = useState(false);
  const [timesShown, setTimesShown] = useState(0);

  const toggle = () => {
    if (!showChart) setTimesShown((n) => n + 1);
    setShowChart((s) => !s);
  };

  return (
    <div className="stack">
      <div className="row">
        <Button icon={showChart ? <EyeOff /> : <BarChart3 />} onClick={toggle}>
          {showChart ? 'Hide sales report' : 'Show sales report'}
        </Button>
        {timesShown === 0 && <Badge tone="neutral">SalesChart code not downloaded yet</Badge>}
        {timesShown === 1 && <Badge tone="info">1st time: downloading chunk (1.5s)</Badge>}
        {timesShown > 1 && <Badge tone="success">Cached - lazy() loads only once</Badge>}
      </div>

      {showChart ? (
        // 2. Suspense shows the fallback while SalesChart's code is loading
        <Suspense fallback={<ChartSkeleton label="Downloading SalesChart.jsx..." />}>
          <SalesChart />
        </Suspense>
      ) : (
        <div className="lz-placeholder muted small">
          The chart component is not part of this page&apos;s JavaScript yet. Click the button to load it on demand.
        </div>
      )}
    </div>
  );
}
