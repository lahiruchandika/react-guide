/**
 * mockUserApi - a fake "server" so the fetching demo works offline.
 * ----------------------------------------------------------------------------
 * fetchUser(id, { signal }) returns a Promise that resolves after a delay,
 * just like fetch() would. It also supports an AbortController `signal`:
 * if the request is aborted, the Promise rejects with an 'AbortError'
 * (exactly what the real fetch() does).
 *
 * The delays are DIFFERENT per user on purpose: user 1 is slow, the others
 * are fast. Clicking user 1 and then quickly user 2 creates a "race
 * condition": the slow, outdated answer arrives LAST.
 * ----------------------------------------------------------------------------
 */
const USERS = {
  1: { id: 1, name: 'Leanne Graham', role: 'Product designer', city: 'Gwenborough', delay: 2200 },
  2: { id: 2, name: 'Ervin Howell', role: 'Backend engineer', city: 'Wisokyburgh', delay: 600 },
  3: { id: 3, name: 'Clementine Bauch', role: 'Data scientist', city: 'McKenziehaven', delay: 1000 },
  4: { id: 4, name: 'Patricia Lebsack', role: 'Engineering manager', city: 'South Elvis', delay: 400 },
};

export const USER_IDS = Object.keys(USERS).map(Number);

export function getUserDelay(id) {
  return USERS[id]?.delay ?? 500;
}

export function fetchUser(id, { signal } = {}) {
  return new Promise((resolve, reject) => {
    const user = USERS[id];

    // Simulate network latency.
    const timer = setTimeout(() => {
      if (user) {
        const { delay: _delay, ...data } = user; // don't return the internal delay field
        resolve(data);
      } else {
        reject(new Error(`User ${id} not found`));
      }
    }, getUserDelay(id));

    // If the caller aborts, stop the timer and reject like fetch() does.
    signal?.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(new DOMException('The request was aborted.', 'AbortError'));
    });
  });
}
