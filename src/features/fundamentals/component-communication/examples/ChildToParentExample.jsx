/**
 * ChildToParentExample.jsx  (PARENT component)
 * ----------------------------------------------------------------------------
 * Demonstrates: CHILD -> PARENT communication with CALLBACK PROPS.
 *
 * Children cannot change the parent's state directly. Instead:
 *   1. The parent defines a function (handleRatingChange).
 *   2. It passes that function down as a prop (onChange={handleRatingChange}).
 *   3. The child CALLS it with some data: onChange(4).
 *   4. The parent's function runs, updates the parent's state, and React
 *      re-renders both of them with the new value.
 *
 * The log on the right shows every time the child "called home".
 *
 * File relationship:
 *   examples/ChildToParentExample.jsx   --imports-->   components/StarRating.jsx
 * ----------------------------------------------------------------------------
 */
import { useRef, useState } from 'react';
import { Button, Badge } from '@/components/ui';
import StarRating from '../components/StarRating';

const LABELS = ['Not rated yet', 'Terrible 😞', 'Not great 😕', 'Okay 🙂', 'Good 😀', 'Amazing 🤩'];

export default function ChildToParentExample() {
  // The PARENT owns the rating...
  const [rating, setRating] = useState(0);
  const [log, setLog] = useState([]);
  const nextLogId = useRef(1); // unique ids for log entries (used as keys)

  // ...and gives the child a function to change it.
  function handleRatingChange(newRating) {
    setRating(newRating);
    // Keep a small history (newest first, max 6 entries).
    // Read/advance the ref in the event handler, not inside the updater function
    // (updater functions should be pure - StrictMode calls them twice).
    const entry = { id: nextLogId.current++, text: `onChange(${newRating}) called by <StarRating>` };
    setLog((prev) => [entry, ...prev].slice(0, 6));
  }

  return (
    <div className="grid-2">
      <div className="box stack">
        <span className="box-label">Child: &lt;StarRating value onChange /&gt;</span>
        <strong>How was the React course?</strong>

        {/* Pass the CURRENT value down and the CALLBACK down */}
        <StarRating value={rating} onChange={handleRatingChange} />

        <div className="row">
          <span>Parent sees:</span>
          <Badge tone={rating >= 4 ? 'success' : rating > 0 ? 'warning' : 'neutral'}>{LABELS[rating]}</Badge>
        </div>
        <Button size="sm" variant="ghost" onClick={() => handleRatingChange(0)} disabled={rating === 0}>
          Reset (the parent can change it too)
        </Button>
      </div>

      <div className="box">
        <span className="box-label">Parent state: rating = {rating}</span>
        <ul className="cc-log">
          {log.length === 0 && <li className="muted">Click a star - calls will appear here.</li>}
          {log.map((entry) => (
            <li key={entry.id}>
              <code>{entry.text}</code>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
