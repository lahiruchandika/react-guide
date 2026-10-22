/**
 * products.js - a big fake product catalog (2,000 items) for the demos.
 *
 * Generated with simple math instead of Math.random(), so the list is the
 * same every time the page loads (predictable = easier to learn with).
 */
const ADJECTIVES = ['Smart', 'Classic', 'Ultra', 'Mini', 'Eco', 'Pro', 'Vintage', 'Wireless', 'Compact', 'Deluxe'];
const COLORS = ['Red', 'Blue', 'Green', 'Black', 'White', 'Silver', 'Gold', 'Pink', 'Orange', 'Purple'];
const NOUNS = ['Lamp', 'Chair', 'Watch', 'Backpack', 'Speaker', 'Mug', 'Keyboard', 'Camera', 'Bottle', 'Sneakers'];
const CATEGORIES = ['Home', 'Tech', 'Outdoor', 'Fashion', 'Kitchen'];

export const PRODUCTS = Array.from({ length: 2000 }, (_, i) => ({
  id: i + 1,
  name: `${ADJECTIVES[i % 10]} ${COLORS[Math.floor(i / 10) % 10]} ${NOUNS[Math.floor(i / 100) % 10]} #${i + 1}`,
  category: CATEGORIES[i % CATEGORIES.length],
  price: Number((((i * 37) % 200) + 9.99).toFixed(2)),
}));
