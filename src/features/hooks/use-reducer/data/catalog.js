/**
 * catalog.js - static product data for the shopping-cart demos.
 * Keeping data in its own file keeps components focused on UI.
 */
export const CATALOG = [
  { id: 'p1', name: 'Wireless Headphones', price: 59.99, emoji: '🎧' },
  { id: 'p2', name: 'Mechanical Keyboard', price: 89.5, emoji: '⌨️' },
  { id: 'p3', name: 'Coffee Mug', price: 12.0, emoji: '☕' },
  { id: 'p4', name: 'Desk Plant', price: 18.75, emoji: '🪴' },
  { id: 'p5', name: 'USB-C Cable', price: 9.99, emoji: '🔌' },
  { id: 'p6', name: 'Notebook', price: 6.5, emoji: '📓' },
];

/** Format a number as US dollars: 12 -> "$12.00" */
export const money = (value) => `$${value.toFixed(2)}`;
