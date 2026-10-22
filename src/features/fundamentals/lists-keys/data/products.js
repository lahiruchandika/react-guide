/**
 * products.js
 * ----------------------------------------------------------------------------
 * Mock data for the Lists & Keys lesson.
 *
 * Real apps usually get arrays like this from an API. Notice that every
 * object has a unique, stable `id` - that is what we will use as the `key`
 * when rendering the list.
 * ----------------------------------------------------------------------------
 */
export const PRODUCTS = [
  { id: 'p1', name: 'Mechanical Keyboard', category: 'Electronics', price: 89, rating: 4.7, emoji: '⌨️' },
  { id: 'p2', name: 'Running Shoes', category: 'Sports', price: 120, rating: 4.5, emoji: '👟' },
  { id: 'p3', name: 'Coffee Grinder', category: 'Home', price: 45, rating: 4.2, emoji: '☕' },
  { id: 'p4', name: 'Noise-Cancelling Headphones', category: 'Electronics', price: 199, rating: 4.8, emoji: '🎧' },
  { id: 'p5', name: 'Yoga Mat', category: 'Sports', price: 30, rating: 4.4, emoji: '🧘' },
  { id: 'p6', name: 'Desk Lamp', category: 'Home', price: 38, rating: 4.1, emoji: '💡' },
  { id: 'p7', name: 'Smart Watch', category: 'Electronics', price: 249, rating: 4.3, emoji: '⌚' },
  { id: 'p8', name: 'Water Bottle', category: 'Sports', price: 18, rating: 4.6, emoji: '🥤' },
];

/** All category names, derived from the data (no duplicates thanks to Set). */
export const CATEGORIES = ['All', ...new Set(PRODUCTS.map((p) => p.category))];
