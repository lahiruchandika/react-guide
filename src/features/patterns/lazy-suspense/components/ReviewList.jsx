/**
 * ReviewList - reads data with React 19's use() hook.
 * ----------------------------------------------------------------------------
 *   const reviews = use(reviewsPromise);
 *
 * If the promise is still pending, use() SUSPENDS this component: React shows
 * the nearest <Suspense> fallback and renders us again when it resolves.
 * No useState / useEffect / isLoading flags needed here!
 *
 * Unlike other hooks, use() may be called inside if-statements and loops.
 * ----------------------------------------------------------------------------
 */
import { use } from 'react';
import { Star } from 'lucide-react';

export default function ReviewList({ reviewsPromise }) {
  const reviews = use(reviewsPromise); // waits for the data (suspends meanwhile)

  if (reviews.length === 0) return <p className="muted">No reviews yet.</p>;

  return (
    <ul className="lz-reviews">
      {reviews.map((r) => (
        <li key={r.id} className="lz-loaded">
          <div className="row lz-between">
            <strong>{r.author}</strong>
            <span className="lz-stars" aria-label={`${r.stars} out of 5 stars`}>
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} size={14} className={i < r.stars ? 'on' : ''} />
              ))}
            </span>
          </div>
          <p className="small">{r.text}</p>
        </li>
      ))}
    </ul>
  );
}
