/**
 * TabsTransitionExample
 * ----------------------------------------------------------------------------
 * Three tabs; "Products" is very slow to render.
 *
 *   BLOCKING  setTab('products')                       -> the page freezes until
 *             the slow tab is done; clicking "Contact" meanwhile does nothing.
 *
 *   TRANSITION startTransition(() => setTab('products')) -> React renders the slow
 *             tab in the background. The old tab stays visible (dimmed, with a
 *             spinner), and clicking "Contact" INTERRUPTS the slow render.
 *
 * Use the switch to compare, then click Products -> Contact quickly.
 * ----------------------------------------------------------------------------
 */
import { useState, useTransition } from 'react';
import { Info, Package, Mail } from 'lucide-react';
import { Badge, Spinner } from '@/components/ui';
import SlowProductList from '../components/SlowProductList';

const TABS = [
  { id: 'about', label: 'About', icon: Info },
  { id: 'products', label: 'Products (slow)', icon: Package },
  { id: 'contact', label: 'Contact', icon: Mail },
];

export default function TabsTransitionExample() {
  const [tab, setTab] = useState('about');
  const [useTransitionMode, setUseTransitionMode] = useState(true);

  // 1. isPending = true while the transition is rendering in the background
  const [isPending, startTransition] = useTransition();

  const selectTab = (nextTab) => {
    if (useTransitionMode) {
      // 2. Mark this update as NON-urgent: it may be interrupted
      startTransition(() => setTab(nextTab));
    } else {
      // Urgent (blocking) update: React must finish it before anything else
      setTab(nextTab);
    }
  };

  return (
    <div className="stack">
      <label className="utr-switch">
        <input type="checkbox" checked={useTransitionMode} onChange={(e) => setUseTransitionMode(e.target.checked)} />
        <span>
          Use <code>startTransition</code>
        </span>
        <Badge tone={useTransitionMode ? 'success' : 'danger'}>{useTransitionMode ? 'non-blocking' : 'blocking'}</Badge>
      </label>

      <div className="row utr-tabs" role="tablist">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            className={`utr-tab ${tab === id ? 'active' : ''}`}
            onClick={() => selectTab(id)}
          >
            <Icon size={15} /> {label}
          </button>
        ))}
        {/* 3. Give feedback while the background render is in progress */}
        {isPending && (
          <span className="row small muted">
            <Spinner size={16} /> loading tab...
          </span>
        )}
      </div>

      {/* 4. The OLD content stays on screen (dimmed) until the new tab is ready */}
      <div className={`utr-tab-panel ${isPending ? 'utr-stale' : ''}`}>
        {tab === 'about' && (
          <p>
            Welcome to the shop! This tab is <strong>fast</strong>. Now click <em>Products</em>: it renders 250 slow
            rows (~150ms+). Then quickly click <em>Contact</em> and compare both modes.
          </p>
        )}
        {tab === 'products' && <SlowProductList query="" />}
        {tab === 'contact' && (
          <p>
            Email us at <strong>hello@example.com</strong>. This tab is fast too. In transition mode you can reach it
            even while Products is still rendering.
          </p>
        )}
      </div>
    </div>
  );
}
