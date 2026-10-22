/**
 * LazyTabsExample - lazy tabs + startTransition = no flashing skeletons.
 * ----------------------------------------------------------------------------
 * Each tab's content is a lazy component, downloaded the first time it opens.
 *
 * WITHOUT a transition: clicking a new tab immediately hides the current tab
 *   and shows the Suspense fallback (skeleton) until the code arrives.
 *
 * WITH startTransition: React keeps showing the OLD tab (slightly faded,
 *   thanks to isPending) and swaps to the new one only when it is ready.
 *   This is what React Router and most frameworks do for page navigation.
 *
 * Click "Reset" to forget the downloaded tabs and try the other mode.
 * ----------------------------------------------------------------------------
 */
import { Suspense, useState, useTransition } from 'react';
import { RotateCcw } from 'lucide-react';
import { Badge, Button, Spinner } from '@/components/ui';
import { lazyWithDelay } from '../utils/lazyWithDelay';
import { ChartSkeleton } from '../components/Skeletons';

// Fresh lazy components per "reset" (demo only - normally lazy() runs once at the top level)
function createTabs() {
  return {
    stats: { label: 'Overview', Component: lazyWithDelay(() => import('../components/TeamStats'), 1000) },
    sales: { label: 'Sales', Component: lazyWithDelay(() => import('../components/SalesChart'), 1000) },
    activity: { label: 'Activity', Component: lazyWithDelay(() => import('../components/ActivityFeed'), 1000) },
  };
}

export default function LazyTabsExample() {
  const [tabs, setTabs] = useState(createTabs); // lazy initializer: runs once
  const [activeTab, setActiveTab] = useState('stats');
  const [withTransition, setWithTransition] = useState(true);

  // isPending is true while the transition (the new tab) is still loading
  const [isPending, startTransition] = useTransition();

  const selectTab = (id) => {
    if (withTransition) {
      // Mark the update as "not urgent": keep the old UI until the new one is ready
      startTransition(() => setActiveTab(id));
    } else {
      setActiveTab(id); // urgent update: the fallback shows immediately
    }
  };

  const reset = () => {
    setTabs(createTabs());
    setActiveTab('stats');
  };

  const ActiveComponent = tabs[activeTab].Component;

  return (
    <div className="stack">
      <div className="row lz-between">
        <label className="row small">
          <input type="checkbox" checked={withTransition} onChange={(e) => setWithTransition(e.target.checked)} />
          Use <code>startTransition</code>
        </label>
        <Button size="sm" variant="secondary" icon={<RotateCcw />} onClick={reset}>Reset</Button>
      </div>

      <div className="row">
        <div className="lz-segmented" role="tablist">
          {Object.entries(tabs).map(([id, tab]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={activeTab === id}
              className={activeTab === id ? 'active' : ''}
              onClick={() => selectTab(id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {isPending && (
          <Badge tone="info">
            <span className="row" style={{ gap: 6 }}><Spinner size={12} /> loading next tab...</span>
          </Badge>
        )}
      </div>

      {/* While pending, fade the old content instead of replacing it */}
      <div className={`lz-tab-panel ${isPending ? 'lz-pending' : ''}`}>
        <Suspense fallback={<ChartSkeleton label="Suspense fallback: downloading tab..." />}>
          <ActiveComponent />
        </Suspense>
      </div>
    </div>
  );
}
