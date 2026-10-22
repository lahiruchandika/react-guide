/**
 * SuspenseDataExample - Suspense is not only for code: use() + a Promise.
 * ----------------------------------------------------------------------------
 * React 19 lets a component wait for DATA with the use() hook, and the same
 * <Suspense> boundary shows the loading UI.
 *
 * The golden rule: create the promise OUTSIDE of render (in an event handler
 * or a lazy useState initializer) and keep it in state. If you wrote
 *     <ReviewList reviewsPromise={fetchReviews(id)} />
 * a NEW promise would be created on every render -> it would suspend forever.
 *
 * (Frameworks and libraries like Next.js, React Router loaders or TanStack
 * Query create and cache these promises for you.)
 * ----------------------------------------------------------------------------
 */
import { Suspense, useState } from 'react';
import { ListSkeleton } from '../components/Skeletons';
import ReviewList from '../components/ReviewList';
import { fetchReviews } from '../data/reviewsApi';

const PRODUCTS = [
  { id: 1, name: 'Headphones', emoji: '🎧' },
  { id: 2, name: 'Keyboard', emoji: '⌨️' },
  { id: 3, name: 'Monitor', emoji: '🖥️' },
];

export default function SuspenseDataExample() {
  const [productId, setProductId] = useState(1);

  // 1. Start the first request ONCE (lazy initializer), store the promise in state
  const [reviewsPromise, setReviewsPromise] = useState(() => fetchReviews(1));

  // 2. Start a new request in the EVENT HANDLER, not during render
  const selectProduct = (id) => {
    setProductId(id);
    setReviewsPromise(fetchReviews(id));
  };

  return (
    <div className="lz-shop">
      <div className="lz-product-list">
        {PRODUCTS.map((p) => (
          <button
            key={p.id}
            type="button"
            className={`lz-product ${p.id === productId ? 'active' : ''}`}
            onClick={() => selectProduct(p.id)}
          >
            <span className="lz-product-emoji" aria-hidden>{p.emoji}</span>
            {p.name}
          </button>
        ))}
      </div>

      <div className="lz-widget">
        <strong>Customer reviews</strong>
        {/* 3. ReviewList suspends while the promise is pending */}
        <Suspense fallback={<ListSkeleton rows={2} label="Fetching reviews..." />}>
          <ReviewList reviewsPromise={reviewsPromise} />
        </Suspense>
      </div>
    </div>
  );
}
