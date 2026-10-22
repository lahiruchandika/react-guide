/**
 * NestedSuspenseExample - WHERE you put <Suspense> decides what the user sees.
 * ----------------------------------------------------------------------------
 * A dashboard with three lazy widgets that load at different speeds:
 *   Stats 0.6s   ·   Activity feed 1.2s   ·   Sales chart 2.5s
 *
 * ONE boundary around everything:
 *     <Suspense fallback={<PageSkeleton />}>  stats + chart + feed  </Suspense>
 *   -> nothing shows until the SLOWEST piece is ready (2.5s)
 *
 * NESTED boundaries:
 *     <Suspense fallback={<PageSkeleton />}>        outer: for the stats
 *       <TeamStats />
 *       <Suspense fallback={<ChartSkeleton />}> <SalesChart /> </Suspense>
 *       <Suspense fallback={<ListSkeleton />}>  <ActivityFeed /> </Suspense>
 *     </Suspense>
 *   -> each widget appears as soon as IT is ready
 *
 * A component suspends up to the NEAREST <Suspense> above it.
 * ----------------------------------------------------------------------------
 */
import { Suspense, useCallback, useRef, useState } from 'react';
import { Play } from 'lucide-react';
import { Button } from '@/components/ui';
import { lazyWithDelay } from '../utils/lazyWithDelay';
import { ChartSkeleton, ListSkeleton, PageSkeleton } from '../components/Skeletons';

// Normally you call lazy() ONCE at the top of the file (see example 1).
// Here we create fresh lazy components on every click ONLY so you can replay
// the loading sequence - lazy() caches its result after the first load.
function createWidgets() {
  return {
    TeamStats: lazyWithDelay(() => import('../components/TeamStats'), 600),
    ActivityFeed: lazyWithDelay(() => import('../components/ActivityFeed'), 1200),
    SalesChart: lazyWithDelay(() => import('../components/SalesChart'), 2500),
  };
}

export default function NestedSuspenseExample() {
  const [mode, setMode] = useState('nested'); // 'single' | 'nested'
  const [run, setRun] = useState(null); // { id, widgets } for the current load
  const [timeline, setTimeline] = useState([]);
  const startedAt = useRef(0);

  const load = () => {
    startedAt.current = performance.now();
    setTimeline([]);
    setRun((prev) => ({ id: (prev?.id ?? 0) + 1, widgets: createWidgets() }));
  };

  // Switching layout clears the dashboard so the next load starts fresh
  const changeMode = (next) => {
    setMode(next);
    setRun(null);
    setTimeline([]);
  };

  // Each widget calls onReady when it mounts -> we record WHEN it appeared.
  // (StrictMode runs effects twice in development, so ignore duplicates.)
  const handleReady = useCallback((name) => {
    const seconds = ((performance.now() - startedAt.current) / 1000).toFixed(1);
    setTimeline((prev) => (prev.some((e) => e.name === name) ? prev : [...prev, { name, seconds }]));
  }, []);

  const { TeamStats, ActivityFeed, SalesChart } = run?.widgets ?? {};

  return (
    <div className="stack">
      <div className="row lz-between">
        <div className="lz-segmented" role="radiogroup" aria-label="Boundary layout">
          <button type="button" className={mode === 'single' ? 'active' : ''} onClick={() => changeMode('single')}>
            One boundary
          </button>
          <button type="button" className={mode === 'nested' ? 'active' : ''} onClick={() => changeMode('nested')}>
            Nested boundaries
          </button>
        </div>
        <Button icon={<Play />} onClick={load}>Load dashboard</Button>
      </div>

      <div className="lz-timeline">
        <span className="muted small">Appeared at:</span>
        {timeline.length === 0 && <span className="muted small">-</span>}
        {timeline.map((e) => (
          <span key={e.name} className="lz-chip">
            {e.name} · {e.seconds}s
          </span>
        ))}
      </div>

      {!run && <div className="lz-placeholder muted small">Choose a layout and click &quot;Load dashboard&quot;.</div>}

      {/* key={run.id + mode} remounts the boundaries for every new run */}
      {run && mode === 'single' && (
        <Suspense key={`${run.id}-single`} fallback={<PageSkeleton label="Waiting for EVERY widget..." />}>
          <div className="stack">
            <TeamStats onReady={handleReady} />
            <div className="grid-2">
              <SalesChart onReady={handleReady} />
              <ActivityFeed onReady={handleReady} />
            </div>
          </div>
        </Suspense>
      )}

      {run && mode === 'nested' && (
        <Suspense key={`${run.id}-nested`} fallback={<PageSkeleton label="Loading stats..." />}>
          <div className="stack">
            <TeamStats onReady={handleReady} />
            <div className="grid-2">
              {/* Inner boundaries: each widget shows its own skeleton */}
              <Suspense fallback={<ChartSkeleton label="Loading chart (2.5s)..." />}>
                <SalesChart onReady={handleReady} />
              </Suspense>
              <Suspense fallback={<ListSkeleton label="Loading feed (1.2s)..." />}>
                <ActivityFeed onReady={handleReady} />
              </Suspense>
            </div>
          </div>
        </Suspense>
      )}
    </div>
  );
}
