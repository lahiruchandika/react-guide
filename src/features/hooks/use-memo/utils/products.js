/**
 * products.js (use-memo lesson helpers)
 * ----------------------------------------------------------------------------
 * Plain JavaScript helpers - no React here. Keeping "business logic" in a
 * separate utils file is an industry habit: it is easy to test and reuse.
 *
 *   PRODUCTS          -> a big, fake catalogue (20 000 items) created ONCE
 *   filterProducts()  -> a deliberately SLOW filter + sort, so you can feel
 *                        the cost when it runs on every render
 *   countPrimes()     -> a genuinely CPU-heavy calculation
 * ----------------------------------------------------------------------------
 */

export const CATEGORIES = ['All', 'Laptops', 'Phones', 'Audio', 'Cameras', 'Gaming', 'Wearables'];

const ADJECTIVES = ['Pro', 'Max', 'Mini', 'Ultra', 'Air', 'Lite', 'Plus', 'Neo', 'Prime', 'Edge'];
const BRANDS = ['Nova', 'Zenith', 'Orbit', 'Pixel', 'Vertex', 'Lumen', 'Atlas', 'Echo'];

/**
 * A tiny seeded random generator (mulberry32).
 * Same seed -> same "random" numbers -> the list is identical on every reload.
 */
function seededRandom(seed) {
  return function next() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Build `count` fake products like { id, name, category, price, rating }. */
function generateProducts(count) {
  const random = seededRandom(42);
  const pick = (list) => list[Math.floor(random() * list.length)];

  return Array.from({ length: count }, (_, i) => {
    const category = CATEGORIES[1 + Math.floor(random() * (CATEGORIES.length - 1))];
    return {
      id: i + 1,
      name: `${pick(BRANDS)} ${category.slice(0, -1)} ${pick(ADJECTIVES)} ${100 + (i % 900)}`,
      category,
      price: Math.round(20 + random() * 1980),
      rating: Math.round((2.5 + random() * 2.5) * 10) / 10,
    };
  });
}

// Created once when the module loads - NOT on every render.
export const PRODUCTS = generateProducts(20000);

/**
 * Filter by text + category and sort by price.
 * Some artificial extra work is added so the cost is visible even on fast computers.
 */
export function filterProducts(products, query, category) {
  // Artificial slowdown (~10-30 ms depending on your CPU).
  // Real apps get this cost from big data sets or complex calculations.
  let sink = 0;
  for (let i = 0; i < 4_000_000; i++) sink += Math.sqrt(i);
  if (sink < 0) console.log(sink); // never true - just stops the loop being optimised away

  const q = query.trim().toLowerCase();
  return products
    .filter((p) => (category === 'All' || p.category === category) && p.name.toLowerCase().includes(q))
    .sort((a, b) => a.price - b.price);
}

/** Count prime numbers <= limit using slow trial division (real CPU work). */
export function countPrimes(limit) {
  let count = 0;
  let largest = 2;
  for (let n = 2; n <= limit; n++) {
    let isPrime = true;
    for (let d = 2; d * d <= n; d++) {
      if (n % d === 0) {
        isPrime = false;
        break;
      }
    }
    if (isPrime) {
      count++;
      largest = n;
    }
  }
  return { count, largest };
}

/** Format a Date as "12:04:31.207" so you can see when a calculation ran. */
export function timeStamp(date = new Date()) {
  return `${date.toLocaleTimeString([], { hour12: false })}.${String(date.getMilliseconds()).padStart(3, '0')}`;
}
