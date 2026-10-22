/**
 * WhyNotRandomExample
 * ----------------------------------------------------------------------------
 * Three ways to make an id - only one is right:
 *
 *   1. Math.random() in render   -> a NEW id on EVERY render. The label/input
 *                                   pair, aria-describedby links and CSS
 *                                   selectors keep changing; with server
 *                                   rendering the server and browser produce
 *                                   different ids (hydration mismatch error).
 *   2. A global counter          -> stable after mount, but depends on render
 *                                   ORDER (server vs client can differ) and
 *                                   skips numbers under StrictMode.
 *   3. useId()                   -> stable for the component's lifetime and
 *                                   identical on server and client.
 *
 * Type in the box or click "Re-render": watch which ids change.
 * ----------------------------------------------------------------------------
 */
import { useId, useState } from 'react';
import { RotateCw } from 'lucide-react';
import { Badge, Button, RenderCounter } from '@/components/ui';

let globalCounter = 0; // module-level variable, shared by every instance

// BAD #1: a random id computed during render
function RandomIdField({ value }) {
  const id = `field-${Math.random().toString(36).slice(2, 7)}`; // changes every render!
  return <IdCard tone="danger" title="Math.random()" id={id} value={value} />;
}

// BAD #2: a global counter (kept in state so it's at least stable on the client)
function CounterIdField({ value }) {
  // The initializer runs once per mount... but twice in StrictMode,
  // and its number depends on how many fields rendered before this one.
  const [id] = useState(() => `field-${++globalCounter}`);
  return <IdCard tone="warning" title="global counter" id={id} value={value} />;
}

// GOOD: useId
function UseIdField({ value }) {
  const id = useId(); // stable, unique, SSR-safe
  return <IdCard tone="success" title="useId()" id={id} value={value} />;
}

// Shared presentational card that shows the id it was given
function IdCard({ tone, title, id, value }) {
  return (
    <div className="box stack uid-idcard">
      <div className="row">
        <Badge tone={tone}>{title}</Badge>
        <RenderCounter />
      </div>
      {/* key={id} makes the <code> remount -> its CSS animation replays when the id changes */}
      <code key={id} className="uid-id-tag uid-id-flash">
        id="{id}"
      </code>
      <div className="field">
        <label htmlFor={id} className="field-label">Nickname</label>
        <input id={id} className="field-input" value={value} readOnly />
      </div>
    </div>
  );
}

export default function WhyNotRandomExample() {
  const [text, setText] = useState('reactfan');
  const [, setTick] = useState(0); // only used to force a re-render

  return (
    <div className="stack">
      <div className="row">
        <input
          className="field-input uid-driver"
          aria-label="Type to re-render"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Button variant="secondary" icon={<RotateCw size={14} />} onClick={() => setTick((t) => t + 1)}>
          Re-render
        </Button>
      </div>

      <div className="grid-3">
        <RandomIdField value={text} />
        <CounterIdField value={text} />
        <UseIdField value={text} />
      </div>
    </div>
  );
}
