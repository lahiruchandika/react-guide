/**
 * reviewsApi - a fake "server" for the use() + Suspense demo.
 * Returns a Promise that resolves after a delay, like a real fetch() would.
 */
import { delay } from '../utils/lazyWithDelay';

const REVIEWS = {
  1: [
    { id: 'a', author: 'Nina', stars: 5, text: 'Battery lasts forever. Super comfy!' },
    { id: 'b', author: 'Omar', stars: 4, text: 'Great sound, case is a bit bulky.' },
  ],
  2: [
    { id: 'c', author: 'Priya', stars: 5, text: 'Best keyboard I have ever typed on.' },
    { id: 'd', author: 'Jack', stars: 3, text: 'Loud switches - my roommate hates it.' },
    { id: 'e', author: 'Lena', stars: 4, text: 'Solid build, RGB is fun.' },
  ],
  3: [{ id: 'f', author: 'Chen', stars: 5, text: 'Crisp picture, perfect for coding.' }],
};

export async function fetchReviews(productId) {
  await delay(900 + Math.random() * 600); // 0.9 - 1.5 seconds
  return REVIEWS[productId] ?? [];
}
