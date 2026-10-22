/**
 * BuggyCounter - a counter with a bug: it CRASHES when it reaches 5.
 * ----------------------------------------------------------------------------
 * The error is thrown DURING RENDER - exactly the kind of error an error
 * boundary can catch. Real-life examples: reading a property of undefined
 * (user.address.city when address is missing), calling .map on null...
 * ----------------------------------------------------------------------------
 */
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui';

export default function BuggyCounter({ label = 'Counter', crashAt = 5 }) {
  const [count, setCount] = useState(0);

  // The bug: throwing while rendering
  if (count === crashAt) {
    throw new Error(`${label} crashed: I can't count to ${crashAt}!`);
  }

  return (
    <div className="eb-counter">
      <span className="muted small">{label}</span>
      <span className="big-number">{count}</span>
      <Button size="sm" icon={<Plus />} onClick={() => setCount((c) => c + 1)}>
        Add one
      </Button>
      <span className="muted small">crashes at {crashAt}</span>
    </div>
  );
}
