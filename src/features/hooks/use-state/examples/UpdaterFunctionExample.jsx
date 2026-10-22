/**
 * UpdaterFunctionExample - the "+3 bug"
 * ----------------------------------------------------------------------------
 * State does NOT change immediately when you call the setter. Inside one
 * event handler, `count` is a snapshot: it keeps the value from THIS render.
 *
 *   // count is 0 during this render
 *   setCount(count + 1); // setCount(0 + 1)
 *   setCount(count + 1); // setCount(0 + 1)  <- still 0!
 *   setCount(count + 1); // setCount(0 + 1)
 *   // result: 1, not 3
 *
 * The fix: pass an UPDATER FUNCTION. React queues them and gives each one the
 * latest value:
 *
 *   setCount(prev => prev + 1); // 0 -> 1
 *   setCount(prev => prev + 1); // 1 -> 2
 *   setCount(prev => prev + 1); // 2 -> 3
 *
 * Rule of thumb: when the new state depends on the old state, use prev => ...
 * ----------------------------------------------------------------------------
 */
import { useState } from 'react';
import { Button, Badge } from '@/components/ui';
import '../UseStatePage.css';

export default function UpdaterFunctionExample() {
  const [buggyCount, setBuggyCount] = useState(0);
  const [fixedCount, setFixedCount] = useState(0);

  // BAD: all three calls read the same stale `buggyCount` snapshot.
  function addThreeBuggy() {
    setBuggyCount(buggyCount + 1);
    setBuggyCount(buggyCount + 1);
    setBuggyCount(buggyCount + 1);
  }

  // GOOD: each updater receives the result of the previous one.
  function addThreeFixed() {
    setFixedCount((prev) => prev + 1);
    setFixedCount((prev) => prev + 1);
    setFixedCount((prev) => prev + 1);
  }

  // Another classic: reading state right after setting it.
  const [lastLogged, setLastLogged] = useState(null);
  function addAndRead() {
    setFixedCount((prev) => prev + 1);
    // `fixedCount` here is still the OLD value - the update applies on the next render.
    setLastLogged(fixedCount);
  }

  return (
    <div className="stack">
      <div className="grid-2">
        <div className="us-compare us-compare-bad">
          <div className="row us-spread">
            <strong>setCount(count + 1) ×3</strong>
            <Badge tone="danger">bug</Badge>
          </div>
          <span className="big-number">{buggyCount}</span>
          <div className="row">
            <Button variant="danger" onClick={addThreeBuggy}>+3</Button>
            <Button variant="ghost" size="sm" onClick={() => setBuggyCount(0)}>Reset</Button>
          </div>
          <span className="muted small">Only goes up by 1 each click.</span>
        </div>

        <div className="us-compare us-compare-good">
          <div className="row us-spread">
            <strong>setCount(prev =&gt; prev + 1) ×3</strong>
            <Badge tone="success">correct</Badge>
          </div>
          <span className="big-number">{fixedCount}</span>
          <div className="row">
            <Button onClick={addThreeFixed}>+3</Button>
            <Button variant="secondary" size="sm" onClick={addAndRead}>+1 and read</Button>
            <Button variant="ghost" size="sm" onClick={() => { setFixedCount(0); setLastLogged(null); }}>Reset</Button>
          </div>
          <span className="muted small">
            {lastLogged === null
              ? 'Click "+1 and read" to see the snapshot.'
              : `Right after setting, the handler still saw: ${lastLogged}`}
          </span>
        </div>
      </div>
    </div>
  );
}
