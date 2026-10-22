/**
 * mockApi.js - a FAKE backend that lives in the browser.
 * ----------------------------------------------------------------------------
 * Real apps talk to a server with fetch(). For learning we don't want to depend
 * on the internet, so this file pretends to be a server:
 *   - every function returns a Promise (just like fetch)
 *   - results arrive after a delay (setTimeout) so you can SEE loading states
 *   - it can fail on purpose so you can practise error handling
 *   - it accepts an AbortSignal so requests can be cancelled (AbortController)
 *
 * Usage:
 *   import { mockApi } from '@/services/mockApi';
 *
 *   const controller = new AbortController();
 *   const users = await mockApi.getUsers({ signal: controller.signal });
 *   controller.abort(); // cancels the request -> promise rejects with AbortError
 *
 * Every function takes an optional options object:
 *   { signal, delay, failRate }
 *     signal   - AbortSignal from an AbortController
 *     delay    - force a response time in ms (otherwise a random-ish delay)
 *     failRate - 0..1 chance this call fails (overrides the global setting)
 * ----------------------------------------------------------------------------
 */

// ------------------------------------------------------------------ Fake data
// In a real app this would live in a database on the server.

export const USERS = [
  { id: 1, name: 'Leanne Graham', username: 'leanne', email: 'leanne@example.com', city: 'Gwenborough', company: 'Romaguera-Crona', role: 'Admin' },
  { id: 2, name: 'Ervin Howell', username: 'ervin', email: 'ervin@example.com', city: 'Wisokyburgh', company: 'Deckow-Crist', role: 'Editor' },
  { id: 3, name: 'Clementine Bauch', username: 'clementine', email: 'clementine@example.com', city: 'McKenziehaven', company: 'Keebler LLC', role: 'Viewer' },
  { id: 4, name: 'Patricia Lebsack', username: 'patricia', email: 'patricia@example.com', city: 'South Elvis', company: 'Robel-Corkery', role: 'Editor' },
  { id: 5, name: 'Chelsey Dietrich', username: 'chelsey', email: 'chelsey@example.com', city: 'Roscoeview', company: 'Keebler LLC', role: 'Viewer' },
  { id: 6, name: 'Dennis Schulist', username: 'dennis', email: 'dennis@example.com', city: 'South Christy', company: 'Considine-Lockman', role: 'Admin' },
];

export const PRODUCTS = [
  { id: 101, name: 'Wireless Headphones', category: 'audio', price: 129, rating: 4.6, emoji: '🎧' },
  { id: 102, name: 'Bluetooth Speaker', category: 'audio', price: 79, rating: 4.3, emoji: '🔊' },
  { id: 103, name: 'Studio Microphone', category: 'audio', price: 149, rating: 4.7, emoji: '🎙️' },
  { id: 104, name: 'Mechanical Keyboard', category: 'computers', price: 99, rating: 4.8, emoji: '⌨️' },
  { id: 105, name: 'Ergonomic Mouse', category: 'computers', price: 49, rating: 4.4, emoji: '🖱️' },
  { id: 106, name: '4K Monitor', category: 'computers', price: 399, rating: 4.5, emoji: '🖥️' },
  { id: 107, name: 'Laptop Stand', category: 'computers', price: 39, rating: 4.2, emoji: '💻' },
  { id: 108, name: 'Smart Watch', category: 'wearables', price: 249, rating: 4.1, emoji: '⌚' },
  { id: 109, name: 'Fitness Band', category: 'wearables', price: 59, rating: 3.9, emoji: '💪' },
  { id: 110, name: 'VR Headset', category: 'wearables', price: 499, rating: 4.4, emoji: '🥽' },
  { id: 111, name: 'Action Camera', category: 'cameras', price: 299, rating: 4.6, emoji: '📷' },
  { id: 112, name: 'Instant Camera', category: 'cameras', price: 89, rating: 4.0, emoji: '📸' },
];

export const POSTS = [
  { id: 1, userId: 1, title: 'Getting started with React', body: 'Components are just functions that return JSX.' },
  { id: 2, userId: 1, title: 'Why I love hooks', body: 'Hooks let you reuse stateful logic without classes.' },
  { id: 3, userId: 2, title: 'Lifting state up', body: 'Move shared state to the closest common parent.' },
  { id: 4, userId: 2, title: 'Keys in lists', body: 'Use a stable id, not the array index, as a key.' },
  { id: 5, userId: 3, title: 'Effects are for syncing', body: 'useEffect synchronises a component with an external system.' },
  { id: 6, userId: 3, title: 'Cleanup functions', body: 'Return a function from an effect to undo what it did.' },
  { id: 7, userId: 4, title: 'Custom hooks 101', body: 'A custom hook is a function whose name starts with "use".' },
  { id: 8, userId: 4, title: 'Rules of hooks', body: 'Only call hooks at the top level of components and hooks.' },
  { id: 9, userId: 5, title: 'Debouncing input', body: 'Wait until the user stops typing before searching.' },
  { id: 10, userId: 6, title: 'Persisting state', body: 'localStorage keeps data after a page refresh.' },
];

// ------------------------------------------------------------ Global settings

// Chance (0..1) that any request fails. 0 = never, 1 = always.
let globalFailRate = 0;

/** Change how often ALL mock requests fail (when a call doesn't pass failRate). */
export function setFailureRate(rate) {
  globalFailRate = Math.min(1, Math.max(0, rate));
}

export function getFailureRate() {
  return globalFailRate;
}

// -------------------------------------------------------------------- Helpers

/** Builds the same kind of error that fetch() throws when it is aborted. */
function abortError() {
  return new DOMException('The request was aborted.', 'AbortError');
}

/**
 * The heart of the fake server: waits `ms` milliseconds, then resolves with
 * the result of `produce()` - or rejects if aborted / unlucky.
 */
function respond(produce, { signal, delay, failRate } = {}) {
  // Random-ish response time between 400ms and 1200ms unless forced.
  const ms = delay ?? 400 + Math.round(Math.random() * 800);
  const chance = failRate ?? globalFailRate;

  return new Promise((resolve, reject) => {
    // Already cancelled before we even started? Reject immediately.
    if (signal?.aborted) {
      reject(abortError());
      return;
    }

    // If the caller aborts, stop the timer and reject with an AbortError.
    function onAbort() {
      clearTimeout(timer);
      reject(abortError());
    }

    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort);
      try {
        if (Math.random() < chance) throw new Error('500 Internal Server Error (simulated)');
        // structuredClone = a deep copy, so callers can't mutate our "database".
        resolve(structuredClone(produce()));
      } catch (error) {
        reject(error);
      }
    }, ms);

    signal?.addEventListener('abort', onAbort, { once: true });
  });
}

// ------------------------------------------------------------- "Endpoints"

/** GET /users */
function getUsers(options) {
  return respond(() => USERS, options);
}

/** GET /users/:id  - rejects with a "404" error for unknown ids. */
function getUser(id, options) {
  return respond(() => {
    const user = USERS.find((u) => u.id === Number(id));
    if (!user) throw new Error(`404 User ${id} not found`);
    return user;
  }, options);
}

/** GET /products?search=&category=  - filtering happens "on the server". */
function getProducts({ search = '', category = 'all', ...options } = {}) {
  return respond(() => {
    const term = search.trim().toLowerCase();
    return PRODUCTS.filter(
      (p) => (category === 'all' || p.category === category) && p.name.toLowerCase().includes(term),
    );
  }, options);
}

/** GET /posts?userId=  - all posts, or only one user's posts. */
function getPosts({ userId, ...options } = {}) {
  return respond(() => (userId ? POSTS.filter((p) => p.userId === Number(userId)) : POSTS), options);
}

// One object with every endpoint, so usage reads like a real API client:
//   mockApi.getUsers(), mockApi.getUser(2), mockApi.getProducts({ search: 'cam' })
export const mockApi = { getUsers, getUser, getProducts, getPosts };

export default mockApi;
