/**
 * StarRating.jsx  (CHILD component)
 * ----------------------------------------------------------------------------
 * Talks BACK to its parent by calling a function the parent passed in.
 *
 *   <StarRating value={rating} onChange={(stars) => setRating(stars)} />
 *
 * The child does not own the rating. It only:
 *   1. reads `value` to know how many stars to fill   (data DOWN)
 *   2. calls `onChange(newValue)` when a star is clicked (event UP)
 *
 * Naming convention: callback props start with "on" (onChange, onSelect,
 * onDelete...), and the parent's handler functions often start with
 * "handle" (handleRatingChange).
 *
 * The `hover` state is purely visual and private to this component - the
 * parent does not need to know about it, so it stays here.
 * ----------------------------------------------------------------------------
 */
import { useState } from 'react';
import { Star } from 'lucide-react';

export default function StarRating({ value, onChange, max = 5 }) {
  const [hover, setHover] = useState(0); // local, visual-only state

  // Build [1, 2, 3, 4, 5] so we can map over it
  const stars = Array.from({ length: max }, (_, i) => i + 1);

  return (
    <div className="cc-stars" onMouseLeave={() => setHover(0)}>
      {stars.map((star) => {
        const filled = star <= (hover || value);
        return (
          <button
            key={star}
            type="button"
            className={filled ? 'cc-star is-filled' : 'cc-star'}
            onMouseEnter={() => setHover(star)}
            // ⬆ Send the new value UP to the parent
            onClick={() => onChange(star)}
            aria-label={`${star} star${star > 1 ? 's' : ''}`}
          >
            <Star size={26} fill={filled ? 'currentColor' : 'none'} />
          </button>
        );
      })}
    </div>
  );
}
