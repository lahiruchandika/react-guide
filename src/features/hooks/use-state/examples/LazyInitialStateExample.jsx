/**
 * LazyInitialStateExample
 * ----------------------------------------------------------------------------
 * The initial value is only USED on the first render, but if you write
 *
 *     useState(buildNotes())        // calls buildNotes() on EVERY render
 *
 * the function still RUNS on every render (and the result is thrown away).
 * Pass the function itself instead and React calls it only once:
 *
 *     useState(buildNotes)          // or: useState(() => buildNotes())
 *
 * This matters for expensive setup work: reading localStorage, parsing big
 * data, building large arrays...
 *
 * Type in the boxes below: each keystroke re-renders. Watch the call counters.
 * (In development StrictMode may call functions twice - that is expected.)
 * ----------------------------------------------------------------------------
 */
import { useState } from 'react';
import { Badge, Button } from '@/components/ui';
import '../UseStatePage.css';

// Pretend this is expensive (e.g. reading & parsing saved data).
// It reports each call to `onCall` so the demo can count them.
function buildNotes(onCall) {
  onCall();
  return Array.from({ length: 3 }, (_, i) => `Saved note #${i + 1}`);
}

// A counter object outside React state, so counting does NOT cause re-renders.
function createCallCounter() {
  return { calls: 0 };
}

function EagerNotes() {
  // useState with a function: the counter object is created only once.
  const [counter] = useState(createCallCounter);

  // BAD: buildNotes(...) is CALLED here on every render.
  const [notes] = useState(buildNotes(() => counter.calls++));
  const [text, setText] = useState('');

  return (
    <div className="us-compare us-compare-bad">
      <div className="row us-spread">
        <code>useState(buildNotes())</code>
        <Badge tone="danger">{counter.calls} calls</Badge>
      </div>
      <input className="us-todo-input" placeholder="Type here..." value={text} onChange={(e) => setText(e.target.value)} />
      <span className="muted small">{notes.length} notes loaded</span>
    </div>
  );
}

function LazyNotes() {
  const [counter] = useState(createCallCounter);

  // GOOD: we pass a function. React calls it only on the first render.
  const [notes] = useState(() => buildNotes(() => counter.calls++));
  const [text, setText] = useState('');

  return (
    <div className="us-compare us-compare-good">
      <div className="row us-spread">
        <code>useState(() =&gt; buildNotes())</code>
        <Badge tone="success">{counter.calls} calls</Badge>
      </div>
      <input className="us-todo-input" placeholder="Type here..." value={text} onChange={(e) => setText(e.target.value)} />
      <span className="muted small">{notes.length} notes loaded</span>
    </div>
  );
}

export default function LazyInitialStateExample() {
  // Changing the `key` prop remounts the children = fresh state (a handy trick!).
  const [resetKey, setResetKey] = useState(0);

  return (
    <div className="stack">
      <div className="grid-2">
        <EagerNotes key={`eager-${resetKey}`} />
        <LazyNotes key={`lazy-${resetKey}`} />
      </div>
      <div>
        <Button variant="secondary" size="sm" onClick={() => setResetKey((k) => k + 1)}>
          Remount both (reset counters)
        </Button>
      </div>
    </div>
  );
}
