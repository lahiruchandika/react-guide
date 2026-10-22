/**
 * Mock data for the routing demos (no server needed).
 */
export const USERS = [
  { id: 1, name: 'Ava Johnson', role: 'Designer', emoji: '🎨', city: 'London', bio: 'Loves clean interfaces and good typography.' },
  { id: 2, name: 'Kenji Sato', role: 'Frontend Dev', emoji: '⚛️', city: 'Osaka', bio: 'Writes React all day, ramen all night.' },
  { id: 3, name: 'Lucía García', role: 'Product Manager', emoji: '📋', city: 'Madrid', bio: 'Turns ideas into shipped features.' },
  { id: 4, name: 'Noah Smith', role: 'Backend Dev', emoji: '🛠️', city: 'Toronto', bio: 'APIs, databases and too much coffee.' },
  { id: 5, name: 'Amara Perera', role: 'QA Engineer', emoji: '🔍', city: 'Colombo', bio: 'Finds the bug before your users do.' },
];

/** URL params are always STRINGS - convert before comparing with numbers. */
export const getUser = (id) => USERS.find((u) => u.id === Number(id));

export const PRODUCTS = [
  { id: 1, name: 'Wireless Mouse', category: 'accessories', price: 25, inStock: true },
  { id: 2, name: 'Mechanical Keyboard', category: 'accessories', price: 89, inStock: true },
  { id: 3, name: '4K Monitor', category: 'displays', price: 349, inStock: false },
  { id: 4, name: 'Portable Monitor', category: 'displays', price: 199, inStock: true },
  { id: 5, name: 'Noise-cancelling Headphones', category: 'audio', price: 199, inStock: true },
  { id: 6, name: 'USB Microphone', category: 'audio', price: 119, inStock: false },
  { id: 7, name: 'Laptop Stand', category: 'accessories', price: 39, inStock: true },
  { id: 8, name: 'Bluetooth Speaker', category: 'audio', price: 59, inStock: true },
];
