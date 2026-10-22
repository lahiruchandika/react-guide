/**
 * CounterExample
 * ----------------------------------------------------------------------------
 * The "hello world" of useState: a number that changes when you click.
 *
 * What it demonstrates:
 *   - Declaring state:            const [count, setCount] = useState(0)
 *   - Reading state in JSX:       {count}
 *   - Updating state re-renders:  setCount(...) -> React calls this function again
 *   - Two independent state variables (count and step)
 *   - Deriving values from state (isNegative) instead of storing them
 * ----------------------------------------------------------------------------
 */
import { useState } from 'react';
import { Minus, Plus, RotateCcw } from 'lucide-react';
import { Badge, Button, RenderCounter } from '@/components/ui';
import '../UseStatePage.css';

const STEPS = [1, 5, 10];

export default function CounterExample() {
  // 1. Declare state. useState(0) returns [currentValue, setterFunction].
  //    0 is the INITIAL value - it is only used on the very first render.
  const [count, setCount] = useState(0);

  // 2. A second, independent piece of state: how much each click changes count.
  const [step, setStep] = useState(1);

  // 3. Derived value - computed from state on every render. No extra state needed!
  const isNegative = count < 0;

  return (
    <div className="us-counter">
      <div className="us-counter-display">
        {/* Reading state is just using the variable */}
        <span className={`big-number ${isNegative ? 'us-negative' : ''}`}>{count}</span>
        <div className="row">
          <Badge tone={isNegative ? 'danger' : count === 0 ? 'neutral' : 'success'}>
            {isNegative ? 'negative' : count === 0 ? 'zero' : 'positive'}
          </Badge>
          {/* RenderCounter proves that every setCount() causes a re-render */}
          <RenderCounter />
        </div>
      </div>

      <div className="row">
        {/* 4. Event handlers call the setter with the NEW value */}
        <Button variant="secondary" icon={<Minus />} onClick={() => setCount(count - step)}>
          {step}
        </Button>
        <Button icon={<Plus />} onClick={() => setCount(count + step)}>
          {step}
        </Button>
        <Button variant="ghost" icon={<RotateCcw />} onClick={() => setCount(0)}>
          Reset
        </Button>
      </div>

      <div className="row">
        <span className="muted small">Step:</span>
        {STEPS.map((value) => (
          // Clicking a step only updates `step`; `count` keeps its value.
          <button
            key={value}
            type="button"
            className={`us-chip ${step === value ? 'active' : ''}`}
            onClick={() => setStep(value)}
          >
            {value}
          </button>
        ))}
      </div>
    </div>
  );
}
