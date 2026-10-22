/**
 * RefVsStateExample - a ref changes WITHOUT re-rendering
 * ----------------------------------------------------------------------------
 *                      useState                  useRef
 *   read               count                     countRef.current
 *   write              setCount(count + 1)       countRef.current += 1
 *   re-renders?        YES                       NO
 *   value kept?        yes, between renders      yes, between renders
 *
 * Click the ref button several times: the number on screen does NOT change,
 * because nothing re-rendered. The value IS being stored though - click
 * "Re-render" (or the state button) and the latest ref value appears.
 *
 * Use refs for values the UI does not display: timer ids, DOM nodes,
 * previous values, "has this already happened?" flags.
 * ----------------------------------------------------------------------------
 */
import { useRef, useState } from 'react';
import { Heart, RefreshCw, Box } from 'lucide-react';
import { Button, RenderCounter } from '@/components/ui';
import '../UseRefPage.css';

export default function RefVsStateExample() {
  // State: changing it re-renders the component.
  const [stateLikes, setStateLikes] = useState(0);

  // Ref: a plain box { current: 0 } that React keeps between renders.
  const refLikes = useRef(0);

  // A dummy state used only to force a re-render for the demo.
  const [, setTick] = useState(0);

  // Show the "real" ref value immediately in a message, without re-rendering.
  const [message, setMessage] = useState('');

  function handleRefClick() {
    refLikes.current += 1; // mutate the ref directly - no setter, no re-render
    // Event handlers CAN read the latest ref value - see "Read ref value" below.
  }

  return (
    <div className="stack">
      <div className="grid-2">
        <div className="ur-tile ur-tile-state">
          <div className="row ur-spread">
            <strong>useState</strong>
            <RenderCounter />
          </div>
          <span className="big-number">{stateLikes}</span>
          <Button icon={<Heart />} onClick={() => setStateLikes((n) => n + 1)}>
            Like (state)
          </Button>
          <span className="muted small">Updates the screen instantly - every click re-renders.</span>
        </div>

        <div className="ur-tile ur-tile-ref">
          <div className="row ur-spread">
            <strong>useRef</strong>
            <span className="muted small">no re-render on click</span>
          </div>
          {/* Reading ref.current in JSX shows the value from the LAST render only. */}
          <span className="big-number">{refLikes.current}</span>
          <Button variant="secondary" icon={<Box />} onClick={handleRefClick}>
            Like (ref)
          </Button>
          <span className="muted small">The value changes, but the screen stays stale.</span>
        </div>
      </div>

      <div className="row">
        <Button variant="ghost" size="sm" icon={<RefreshCw />} onClick={() => setTick((t) => t + 1)}>
          Re-render now
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setMessage(`refLikes.current is actually ${refLikes.current}`)}
        >
          Read ref value
        </Button>
        {message && <span className="ur-note">{message}</span>}
      </div>
    </div>
  );
}
